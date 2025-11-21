<script setup>
import { ref, onMounted, inject, onUnmounted } from 'vue'
import axios from 'axios'
import CardList from '@/components/card/ProductList.vue'

const API = 'https://f9b85f72bbd82117.mokky.dev'

const items = ref([])

// корзина из provide, чтобы плюсик работал
const { cart, toggleCart } = inject('cart')

/**
 * Сбрасываем isAdded у товаров на этой странице,
 * когда оформлен заказ и корзина очищена.
 */
const handleCartCleared = () => {
  items.value = items.value.map((item) => ({
    ...item,
    isAdded: false,
  }))
}

/**
 * Загружаем избранные товары:
 * 1) /favorites -> берём parentId
 * 2) /items?id[]=... -> забираем товары
 * 3) помечаем isFavorite, favoriteId и isAdded
 */
const loadFavorites = async () => {
  try {
    const { data: favorites } = await axios.get(`${API}/favorites`)

    if (!favorites.length) {
      items.value = []
      return
    }

    const parentIds = favorites.map((f) => f.parentId)

    const { data: products } = await axios.get(`${API}/items`, {
      params: { id: parentIds },
    })

    const favByParentId = new Map(favorites.map((f) => [f.parentId, f.id]))

    items.value = products.map((product) => ({
      ...product,
      isFavorite: true,
      favoriteId: favByParentId.get(product.id),
      isAdded: cart.value.some((c) => c.id === product.id),
    }))
  } catch (e) {
    console.log('Ошибка загрузки избранного:', e)
  }
}

/**
 * Клик по сердечку на странице "Избранное".
 * Если было избранным → удаляем с сервера и из списка.
 * Если не было → можно добавить обратно.
 */
const handleFavoriteToggle = async (item) => {
  try {
    if (!item.isFavorite) {
      const { data } = await axios.post(`${API}/favorites`, {
        parentId: item.id,
      })
      item.isFavorite = true
      item.favoriteId = data.id
      return
    }

    await axios.delete(`${API}/favorites/${item.favoriteId}`)
    items.value = items.value.filter((p) => p.id !== item.id)
  } catch (e) {
    console.log('Ошибка обновления избранного:', e)
  }
}

onMounted(async () => {
  await loadFavorites()
  window.addEventListener('cart-cleared', handleCartCleared)
})

onUnmounted(() => {
  window.removeEventListener('cart-cleared', handleCartCleared)
})
</script>

<template>
  <h1 class="text-3xl font-bold mb-8">Избранное</h1>

  <card-list
    v-if="items.length"
    :items="items"
    @add-to-favorite="handleFavoriteToggle"
    @toggle-cart="toggleCart"
  />

  <p v-else class="text-gray-500 mt-5">Здесь пока пусто…</p>
</template>
