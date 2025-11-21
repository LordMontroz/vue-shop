<script setup>
import { inject } from 'vue'
import CartItem from '@/components'

const { cart, toggleCart } = inject('cart')

const onClickRemove = (item) => {
  toggleCart(item)
}
</script>

<template>
  <div class="flex flex-col flex-1 gap-4 justify-between" v-auto-animate>
    <cart-item
      v-for="item in cart"
      :key="item.id"
      :item="item"
      @toggle-cart="() => onClickRemove(item)"
    />
  </div>
</template>
