<script setup>
import AppCard from './AppCard.vue'

const onClickAdd = () => {
  alert(111);
}
</script>

<template>
  <div class="grid grid-cols-4 gap-5">
    <app-card
      title="Смартфон Apple iPhone 17 Pro Max 256 Гб оранжевый (E-Sim, без RuStore)"
      image-url="/1.webp"
      :price="1250"
      :is-favorite="false"
      :onClickAdd="onClickAdd"
      :is-added="false"
      :onClickFavorite="onClickAdd"
    />
       <app-card
      title="Смартфон Apple iPhone 17 Pro Max 256 Гб оранжевый (E-Sim, без RuStore)"
      image-url="/1.webp"
      :price="1250"
      :is-favorite="false"
      :onClickAdd="onClickAdd"
      :is-added="false"
      :onClickFavorite="onClickAdd"
    />
       <app-card
      title="Смартфон Apple iPhone 17 Pro Max 256 Гб оранжевый (E-Sim, без RuStore)"
      image-url="/1.webp"
      :price="1250"
      :is-favorite="false"
      :onClickAdd="onClickAdd"
      :is-added="false"
      :onClickFavorite="onClickAdd"
    />
       <app-card
      title="Смартфон Apple iPhone 17 Pro Max 256 Гб оранжевый (E-Sim, без RuStore)"
      image-url="/1.webp"
      :price="1250"
      :is-favorite="false"
      :onClickAdd="onClickAdd"
      :is-added="false"
      :onClickFavorite="onClickAdd"
    />

  </div>
</template>
