<script setup>
const emit = defineEmits(['toggle-cart'])
/**
 * Компонент элемента корзины.
 * Принимает один товар из массива cart.
 */
const { item } = defineProps({
  item: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="flex items-center gap-5 border border-slate-100 p-4 rounded-xl">
    <img class="w-20 h-25" :src="item.imageUrl" :alt="item.title" />

    <div class="flex flex-col flex-1">
      <p class="line-clamp-2">{{ item.title }}</p>

      <div class="flex justify-between mt-2">
        <b class="flex-1">{{ item.price }} руб.</b>

        <img
          class="opacity-40 hover:opacity-100 cursor-pointer transition"
          src="/close.svg"
          alt="удалить"
          @click="emit('toggle-cart', item)"
        />
      </div>
    </div>
  </div>
</template>
