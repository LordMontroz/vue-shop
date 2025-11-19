<script setup>
import AppHeader from './components/AppHeader.vue'
import AppCardList from './components/AppCardList.vue'
import AppDrawer from './components/AppDrawer.vue'
</script>

<template>
  <app-drawer />
  <div class="bg-white w-4/5 m-auto rounded-xl shadow-xl mt-14">
    <app-header />
    <div class="p-10">
      <h2 class="text-3xl font-bold mb-8">Смартфоны</h2>
      <app-card-list />
    </div>
  </div>
</template>
