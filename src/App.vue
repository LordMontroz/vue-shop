/** * Корневой компонент приложения. * Отвечает за загрузку товаров, фильтрацию, поиск и избранное.
* Здесь находится основная бизнес-логика проекта. */

<script setup>
import { onMounted, provide, reactive, ref, watch } from 'vue'
import axios from 'axios'
import AppHeader from './components/Header/Header.vue'
import CardList from './components/Card/CardList.vue'
import Drawer from './components/Cart/Drawer.vue'

/**
 * Список товаров, загружаемых с API.
 * Каждый товар имеет базовые поля из источника данных,
 * а также дополнительные поля, которые добавляются в приложении.
 *
 * Структура одного товара:
 * {
 *   id: number,            // уникальный ID товара
 *   brand: string,         // бренд (Apple / Samsung / Google и т.д.)
 *   title: string,         // полное название модели
 *   price: number,         // стоимость
 *   imageUrl: string,      // путь к изображению
 *   isFavorite: boolean,   // флаг "в избранном" (добавляется в приложении)
 *   favoriteId: number|null, // ID в таблице favorites на сервере
 *   isAdded: boolean       // флаг "в корзине" (на будущее)
 * }
 *
 * @type {import('vue').Ref<Array<{
 *   id: number,
 *   brand: string,
 *   title: string,
 *   price: number,
 *   imageUrl: string,
 *   isFavorite: boolean,
 *   favoriteId: number|null,
 *   isAdded: boolean
 * }>>}
 */
const items = ref([])

//это у нас массив cart в нем у нас будет храниться список наших товаров в корзине
const cart = ref([])

//флаг который указывает что Drawer будет открыт
const drawerOpen = ref(false)

//функция closeDrawer мы прокидываем в AppDrawer , а потом в AppDrawerHead чтоб закрывать корзину (а тут injectом закрываем)
const closeDrawer = () => {
  drawerOpen.value = false
}

//функция open мы ее открываем emit
const openDrawer = () => {
  drawerOpen.value = true
}

/**
 * Реактивные фильтры для списка товаров.
 *
 * Используются в запросах к API (brand, title) и для сортировки.
 *
 * Структура:
 * {
 *   sortBy: string,     // параметр сортировки (пока не используется активно)
 *   brand: string,      // выбранный бренд ("Apple", "Samsung", "Google" или "")
 *   searchQuery: string // строка поиска по названию товара
 * }
 *
 * Примеры значений:
 * - sortBy: "title"
 * - brand: "Apple" / "Samsung" / "Google" / ""
 * - searchQuery: "17 pro max"
 *
 * @type {{
 *   sortBy: string,
 *   brand: string,
 *   searchQuery: string
 * }}
 */
const filters = reactive({
  sortBy: 'title',
  brand: '',
  searchQuery: '',
})

/**
 * Добавляет или удаляет товар из корзины.
 *
 * @param {Object} item — товар, который нужно добавить или убрать
 *
 * Логика:
 * - Если товара нет в корзине → добавить.
 * - Если товар уже есть → удалить.
 *
 * Уникальность определяется по item.id.
 */
const toggleCart = (item) => {
  const index = cart.value.findIndex((cartItem) => cartItem.id === item.id)
  console.log('🟥 App.vue: toggleCart id=', item.id)

  if (index === -1) {
    console.log('🟥 App.vue: adding item to cart')
    cart.value.push(item) // кладём ТОТ ЖЕ объект
    item.isAdded = true
  } else {
    console.log('🟥 App.vue: removing item from cart')
    cart.value.splice(index, 1)
    item.isAdded = false
  }
}

/**
 * Загружает список избранных товаров с API и обновляет состояние items,
 * помечая те товары, которые присутствуют в таблице favorites на сервере.
 *
 * Каждая запись в /favorites имеет структуру:
 * {
 *   id: number,        // ID записи избранного
 *   parentId: number   // ID товара (items.id), к которому относится избранное
 * }
 *
 * Логика работы:
 * 1. Получаем массив избранных записей с сервера.
 * 2. Для каждого товара из items ищем, есть ли запись favorites с таким parentId.
 * 3. Если запись есть:
 *    - ставим item.isFavorite = true
 *    - сохраняем favoriteId для последующего удаления (DELETE)
 * 4. Если записи нет — оставляем товар без изменений.
 *
 * Функция вызывает только обновление items.value, ничего не возвращает.
 *
 * @returns {Promise<void>}
 */
const fetchFavorites = async () => {
  try {
    const { data: favorites } = await axios.get(`https://f9b85f72bbd82117.mokky.dev/favorites`)

    items.value = items.value.map((item) => {
      const favorite = favorites.find((favorite) => favorite.parentId === item.id)

      if (!favorite) {
        return item
      }

      return {
        ...item,
        isFavorite: true,
        favoriteId: favorite.id,
      }
    })
  } catch (err) {
    console.log(err)
  }
}

/**
 * Добавляет или удаляет товар из избранного.
 *
 * Логика:
 * 1. Если товар НЕ в избранном:
 *    - отправляем POST на /favorites с объектом { parentId: item.id }
 *    - сервер создаёт запись favorites и возвращает её id
 *    - помечаем товар локально:
 *        item.isFavorite = true
 *        item.favoriteId = id записи избранного
 *
 * 2. Если товар УЖЕ в избранном:
 *    - отправляем DELETE на /favorites/:favoriteId
 *    - сервер удаляет запись
 *    - сбрасываем локальные поля:
 *        item.isFavorite = false
 *        item.favoriteId = null
 *
 * Почему обновляем UI сразу:
 * - чтобы пользователь видел мгновенную реакцию (оптимистичное обновление),
 *   без ожидания ответа сервера.
 *
 * @param {Object} item — объект товара из items.value
 * @param {number} item.id — ID товара
 * @param {boolean} item.isFavorite — текущий статус избранного
 * @param {number|null} item.favoriteId — ID записи в /favorites (если есть)
 *
 * @returns {Promise<void>} — ничего не возвращает, изменяет item по ссылке
 */
const addToFavorite = async (item) => {
  try {
    if (!item.isFavorite) {
      const obj = {
        parentId: item.id,
      }

      const { data } = await axios.post(`https://f9b85f72bbd82117.mokky.dev/favorites`, obj)

      item.isFavorite = true
      item.favoriteId = data.id
    } else {
      await axios.delete(`https://f9b85f72bbd82117.mokky.dev/favorites/${item.favoriteId}`)
      item.isFavorite = false
      item.favoriteId = null
    }
  } catch (err) {
    console.log(err)
  }
}

/**
 * Загружает список товаров с API и применяет фильтры (бренд и строку поиска).
 * После получения данных функция добавляет к каждому товару дополнительные
 * поля, необходимые приложению (isFavorite, favoriteId, isAdded).
 *
 * Логика фильтрации:
 * - filters.brand → передается как brand=Apple / brand=Samsung (или пропускается)
 * - filters.searchQuery → передается как title=*строка* (поиск по подстроке)
 *
 * После загрузки товаров выполняется fetchFavorites(), который помечает
 * товары, находящиеся в списке избранного.
 *
 * Используется:
 * - при первом рендере (onMounted)
 * - при изменении filters.brand и filters.searchQuery (watch)
 *
 * @returns {Promise<void>} ничего не возвращает, обновляет items.value
 */
const fetchItems = async () => {
  try {
    const params = {}

    if (filters.brand) params.brand = filters.brand
    if (filters.searchQuery) params.title = `*${filters.searchQuery}*`

    const { data } = await axios.get('https://f9b85f72bbd82117.mokky.dev/items', { params })

    items.value = data.map((obj) => ({
      ...obj,
      isFavorite: false,
      favoriteId: null,
      isAdded: false,
    }))

    await fetchFavorites()
  } catch (e) {
    console.log(e)
  }
}

/**
 * Логика, выполняющаяся при первом рендере компонента.
 * 1. Загружаются все товары с сервера (fetchItems).
 * 2. Загружаются избранные записи и помечаются товары (fetchFavorites).
 *
 * Используется для инициализации состояния приложения перед тем,
 * как пользователь начнет взаимодействие с UI.
 *
 * Выполняется только один раз — при монтировании компонента.
 */
onMounted(async () => {
  await fetchItems()
})

/**
 * Следит за изменением значений фильтров brand и searchQuery.
 * Как только один из фильтров меняется — вызывается fetchItems(),
 * который загружает новый список товаров с учетом выбранных фильтров.
 *
 * Такой подход позволяет:
 * - автоматически обновлять товары при поиске
 * - автоматически обновлять товары при выборе бренда
 * - не вызывать лишних запросов, так как следим только за нужными полями
 *
 * Используется массив зависимостей, чтобы watch реагировал на изменение
 * любого из указанных значений.
 */
watch(() => [filters.brand, filters.searchQuery], fetchItems)

provide('cart', { cart, closeDrawer, openDrawer, toggleCart })
</script>

<template>
  <drawer v-if="drawerOpen" />
  <div class="bg-white w-4/5 m-auto rounded-xl shadow-xl mt-14">
    <app-header :total-price="1500" :@open-drawer="openDrawer" />
    <div class="p-10">
      <div class="flex justify-between items-center">
        <h2 class="text-3xl font-bold mb-8">Смартфоны</h2>

        <div class="flex gap-4">
          <select v-model="filters.brand" class="py-2 px-3 border rounded-md outline-none">
            <option value="">Все бренды</option>
            <option value="Apple">Apple</option>
            <option value="Google">Google</option>
            <option value="Samsung">Samsung</option>
          </select>

          <div class="relative">
            <img class="absolute left-4 top-3" src="/search.svg" alt="Поиск" />
            <input
              v-model="filters.searchQuery"
              class="border rounded-md py-2 pl-11 pr-4 outline-none focus:border-gray-400"
              type="text"
              placeholder="Поиск..."
            />
          </div>
        </div>
      </div>
      <div class="mt-10">
        <card-list :items="items" @add-to-favorite="addToFavorite" @toggle-cart="toggleCart" />
      </div>
    </div>
  </div>
</template>
