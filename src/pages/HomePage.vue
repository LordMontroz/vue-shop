<script setup>
import { inject, reactive, watch, ref, onMounted, onUnmounted } from 'vue'
import CardList from '../components/card/ProductList.vue'
import axios from 'axios'
import debounce from 'lodash.debounce'

const API = 'https://f9b85f72bbd82117.mokky.dev'

/* --- Корзина из provide --- */
const { cart, toggleCart } = inject('cart')

/* --- Товары --- */
const items = ref([])

/* --- Фильтры --- */
const filters = reactive({
  sortBy: 'title',
  brand: '',
  searchQuery: '',
})

/* --- Избранное --- */
const addToFavorite = async (item) => {
  try {
    if (!item.isFavorite) {
      const { data } = await axios.post(`${API}/favorites`, { parentId: item.id })
      item.isFavorite = true
      item.favoriteId = data.id
    } else {
      await axios.delete(`${API}/favorites/${item.favoriteId}`)
      item.isFavorite = false
      item.favoriteId = null
    }
  } catch (e) {
    console.log(e)
  }
}

/* --- Подтягиваем избранное --- */
const fetchFavorites = async () => {
  const { data: favorites } = await axios.get(`${API}/favorites`)

  items.value = items.value.map((item) => {
    const fav = favorites.find((f) => f.parentId === item.id)
    return fav ? { ...item, isFavorite: true, favoriteId: fav.id } : item
  })
}

/* --- Загружаем товары --- */
const fetchItems = async () => {
  const params = {}
  if (filters.brand) params.brand = filters.brand
  if (filters.searchQuery) params.title = `*${filters.searchQuery}*`

  const { data } = await axios.get(`${API}/items`, { params })

  // старые данные для восстановления
  const oldMap = new Map(items.value.map((i) => [i.id, i]))

  items.value = data.map((obj) => {
    const old = oldMap.get(obj.id)

    return {
      ...obj,
      isFavorite: old?.isFavorite ?? false,
      favoriteId: old?.favoriteId ?? null,
      isAdded: cart.value.some((c) => c.id === obj.id),
    }
  })

  await fetchFavorites()
}

const fetchItemsDebounced = debounce(fetchItems, 400)

onMounted(async () => {
  await fetchItems()

  const onCartCleared = () => {
    items.value = items.value.map((item) => ({
      ...item,
      isAdded: false,
    }))
  }

  window.addEventListener('cart-cleared', onCartCleared)

  // запоминаем, чтобы снять слушатель
  cleanup.value = () => window.removeEventListener('cart-cleared', onCartCleared)
})

const cleanup = ref(null)

onUnmounted(() => {
  if (cleanup.value) cleanup.value()
  fetchItemsDebounced.cancel()
})

watch(
  () => filters.brand,
  () => {
    fetchItems()
  },
)

watch(
  () => filters.searchQuery,
  () => {
    fetchItemsDebounced()
  },
)
</script>

<template>
  <div class="flex justify-between items-center">
    <h2 class="text-3xl font-bold mb-8">Смартфоны</h2>

    <div class="flex gap-4">
      <select v-model="filters.brand" class="py-2 px-3 border rounded-md">
        <option value="">Все бренды</option>
        <option value="Apple">Apple</option>
        <option value="Google">Google</option>
        <option value="Samsung">Samsung</option>
      </select>

      <div class="relative">
        <img class="absolute left-4 top-3" src="/search.svg" />
        <input
          v-model="filters.searchQuery"
          class="border rounded-md py-2 pl-11 pr-4"
          placeholder="Поиск..."
        />
      </div>
    </div>
  </div>

  <div class="mt-10">
    <card-list :items="items" @add-to-favorite="addToFavorite" @toggle-cart="toggleCart" />
  </div>
</template>
