<script setup>
import AppCard from './AppCard.vue'

/**
 * Компонент списка карточек товаров.
 *
 * @prop {Array} items — товары для отображения
 * @prop {boolean} isFavorites — режим страницы избранного
 *
 * @event addToFavorite — вызывается при клике на сердечко
 */
const { items, isFavorites } = defineProps({
  items: Array,
  isFavorites: Boolean,
})

/**
 * Событие для передачи действия "избранное" наверх.
 */
const emit = defineEmits(['addToFavorite'])

/**
 * Обработка клика по сердечку.
 */
const handleFavorite = (item) => {
  if (!isFavorites) {
    emit('addToFavorite', item)
  }
}
</script>

<template>
  <div class="grid grid-cols-4 gap-5">
    <app-card
      v-for="item in items"
      :key="item.id"
      :item="item"
      @favorite="() => handleFavorite(item)"
    />
  </div>
</template>
