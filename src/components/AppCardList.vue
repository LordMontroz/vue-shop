<script setup>
import AppCard from './AppCard.vue'

defineProps({
  items: Array,
})

const onClickAdd = () => {
  alert(111)
}
</script>

<template>
  <div class="grid grid-cols-4 gap-5">
    <app-card
      v-for="item in items"
      :key="item.id"
      :title="item.title"
      :image-url="item.imageUrl"
      :price="item.price"
      :onClickAdd="onClickAdd"
    />
  </div>
</template>
