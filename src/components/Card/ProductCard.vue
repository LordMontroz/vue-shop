<script setup>
/**
 * Компонент карточки товара.
 * Принимает один объект item и эмитит событие "favorite".
 */
const { item } = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['favorite', 'toggle-cart'])

const onClickFavorite = () => {
  emit('favorite', item)
}

const onClickAdd = () => {
  emit('toggle-cart', item)
}
</script>

<template>
  <div
    class="relative bg-white border border-slate-100 rounded-3xl p-8 cursor-pointer hover:-translate-y-2 hover:shadow-xl transition"
  >
    <img
      :src="!item.isFavorite ? '/like-1.svg' : '/like-2.svg'"
      alt="like"
      class="absolute top-8 left-8"
      @click.stop="onClickFavorite"
    />

    <div class="flex justify-center">
      <img class="w-35 h-40" :src="item.imageUrl" alt="iphone" />
    </div>

    <p class="mt-2 line-clamp-2">{{ item.title }}</p>

    <div class="flex justify-between mt-5">
      <div class="flex flex-col">
        <span class="text-slate-400">Цена</span>
        <b>{{ item.price }} руб.</b>
      </div>

      <img
        :src="!item.isAdded ? '/plus.svg' : '/checked.svg'"
        alt="Добавить"
        @click.stop="onClickAdd"
      />
    </div>
  </div>
</template>
