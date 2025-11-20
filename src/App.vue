<script setup>
import { computed, provide, ref, watch } from 'vue'
import AppHeader from './components/Header/Header.vue'
import Drawer from './components/Cart/Drawer.vue'

/* ---------------- API ---------------- */
const API = 'https://f9b85f72bbd82117.mokky.dev'

/* ---------------- КОРЗИНА ---------------- */
const cart = ref([])
const drawerOpen = ref(false)
const isCreatingOrder = ref(false)
const orderId = ref(null)

/* --- Загрузка корзины --- */
const saved = localStorage.getItem('cart')
if (saved) {
  try {
    cart.value = JSON.parse(saved)
  } catch (e) {
    console.log('Ошибка загрузки корзины:', e)
  }
}

/* --- Сохранение корзины --- */
watch(
  cart,
  (newCart) => {
    localStorage.setItem('cart', JSON.stringify(newCart))
  },
  { deep: true },
)

/* --- Sidebar --- */

const openDrawer = () => {
  orderId.value = null // при открытии сбрасываем старый номер заказа
  drawerOpen.value = true
}
const closeDrawer = () => (drawerOpen.value = false)

/* --- Добавить / удалить товар --- */
const toggleCart = (item) => {
  const index = cart.value.findIndex((cartItem) => cartItem.id === item.id)

  if (index === -1) {
    cart.value.push(item)
    item.isAdded = true
  } else {
    cart.value.splice(index, 1)
    item.isAdded = false
  }
}

/* --- Создание заказа --- */

const totalPrice = computed(() => cart.value.reduce((acc, item) => acc + item.price, 0))

const cartIsEmpty = computed(() => cart.value.length === 0)

const cartButtonDisabled = computed(() => isCreatingOrder.value || cartIsEmpty.value)

const createOrder = async () => {
  try {
    isCreatingOrder.value = true

    const payload = {
      items: JSON.parse(JSON.stringify(cart.value)),
      totalPrice: totalPrice.value,
    }

    const response = await fetch(`${API}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    // сохраняем номер заказа
    orderId.value = data.id

    // очищаем корзину
    cart.value = []
    window.dispatchEvent(new CustomEvent('cart-cleared'))
  } catch (e) {
    console.log('Ошибка заказа:', e)
  } finally {
    isCreatingOrder.value = false
  }
}

/* --- Глобальный provide для корзины --- */
provide('cart', { cart, closeDrawer, openDrawer, toggleCart })
</script>

<template>
  <drawer
    v-if="drawerOpen"
    :total-price="totalPrice"
    :button-disabled="cartButtonDisabled"
    :order-id="orderId"
    @create-order="createOrder"
  />

  <div class="bg-white w-4/5 m-auto rounded-xl shadow-xl mt-14">
    <app-header :total-price="totalPrice" @open-drawer="openDrawer" />

    <div class="p-10">
      <RouterView />
    </div>
  </div>
</template>
