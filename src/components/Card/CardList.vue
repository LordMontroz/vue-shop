<script setup>
import Card from './ProductCard.vue'

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
const emit = defineEmits(['addToFavorite', 'toggle-cart'])

/**
 * Обработка клика по сердечку.
 */
const handleFavorite = (item) => {
  if (!isFavorites) {
    emit('addToFavorite', item)
  }
}

/**
 * Обработка клика добавления в корзину.
 */
const handleToggleCart = (item) => {
  console.log('🟨 CardList.vue: EVENT toggle-cart id=', item.id)
  emit('toggle-cart', item)
}
</script>

<template>
  <div class="grid grid-cols-4 gap-5" v-auto-animate>
    <card
      v-for="item in items"
      :key="item.id"
      :item="item"
      @favorite="() => handleFavorite(item)"
      @toggle-cart="() => handleToggleCart(item)"
    />
  </div>
</template>
