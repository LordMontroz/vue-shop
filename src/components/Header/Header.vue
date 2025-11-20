<script setup>
defineProps({
  totalPrice: Number,
})
const emit = defineEmits(['openDrawer'])
</script>

<template>
  <header class="flex justify-between border-b border-slate-200 px-10 py-8">
    <RouterLink to="/">
      <div class="flex items-center gap-4">
        <img src="/logo.svg" alt="logo" class="w-10" />
        <div>
          <h2 class="text-xl font-bold uppercase">05.ru</h2>
          <p class="text-slate-400">Интернет-магазин</p>
        </div>
      </div>
    </RouterLink>

    <ul class="flex items-center gap-10">
      <li
        @click="emit('openDrawer')"
        class="flex items-center cursor-pointer gap-3 text-gray-500 hover:text-black"
      >
        <img src="/cart2.svg" alt="cart" />
        <b>{{ totalPrice }} руб.</b>
      </li>
      <RouterLink to="/favorites">
        <li class="flex items-center cursor-pointer gap-3 text-gray-500 hover:text-black">
          <img src="/heart.svg" alt="heart" />
          <span>Избранное</span>
        </li>
      </RouterLink>
      <li class="flex items-center cursor-pointer gap-3 text-gray-500 hover:text-black">
        <img src="/profile.svg" alt="profile" />
        <span>Личный кабинет</span>
      </li>
    </ul>
  </header>
</template>
