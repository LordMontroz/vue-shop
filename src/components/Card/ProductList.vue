<script setup>
import ProductCard from '@/components'

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  isFavorites: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['addToFavorite', 'toggle-cart'])

const handleFavorite = (item) => {
  if (props.isFavorites) {
    emit('addToFavorite', item)
  }
}

const handleToggleCart = (item) => {
  emit('toggle-cart', item)
}
</script>

<template>
  <div class="grid grid-cols-4 gap-5" v-auto-animate>
    <ProductCard
      v-for="item in props.items"
      :key="item.id"
      :item="item"
      @favorite="handleFavorite"
      @toggle-cart="handleToggleCart"
    />
  </div>
</template>
