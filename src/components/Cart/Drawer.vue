<script setup>
import DrawerHead from './DrawerHeader.vue'
import CartListItem from './CartList.vue'

const emit = defineEmits(['createOrder'])

defineProps({
  totalPrice: Number,
  buttonDisabled: Boolean,
})
</script>

<template>
  <div class="fixed top-0 left-0 h-full w-full bg-black z-10 opacity-70"></div>
  <div class="bg-white w-96 h-full fixed right-0 top-0 z-20 p-8">
    <drawer-head />
    <cart-list-item />

    <div class="flex flex-col gap-4 mt-7">
      <div class="flex gap-2">
        <span>Итого:</span>
        <div class="flex-1 border-b border-dashed"></div>
        <b>{{ totalPrice }} руб.</b>
      </div>

      <div class="flex gap-2">
        <span>Доставка:</span>
        <div class="flex-1 border-b border-dashed"></div>
        <b>0 руб.</b>
      </div>
      <button
        :disabled="buttonDisabled"
        @click="emit('createOrder')"
        class="mt-4 transition bg-lime-500 w-full rounded-xl py-3 text-white disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-lime-600 active:bg-lime-700"
      >
        Оформить заказ
      </button>
    </div>
  </div>
</template>
