<script setup>
defineProps({
  title: String,
  description: String,
  imageUrl: String,
})
</script>

<template>
  <div class="flex flex-col items-center text-center w-72 mx-auto">
    <img height="120" width="120" :src="imageUrl" alt="info image" />
    <h2 class="mt-4 text-2xl">{{ title }}</h2>
    <p class="text-gray-400">{{ description }}</p>
  </div>
</template>
