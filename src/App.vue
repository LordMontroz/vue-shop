<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import axios from 'axios'
import AppHeader from './components/AppHeader.vue'
import AppCardList from './components/AppCardList.vue'
import AppDrawer from './components/AppDrawer.vue'

const items = ref([])

const filters = reactive({
  brand: '',
  searchQuery: '',
})

const onChangeSelect = (event) => {
  filters.brand = event.target.value
}

onMounted(async () => {
  try {
    const { data } = await axios.get('https://f9b85f72bbd82117.mokky.dev/items')
    items.value = data
  } catch (e) {
    console.log(e)
  }
})

watch(
  () => filters.brand,
  async () => {
    try {
      let url = 'https://f9b85f72bbd82117.mokky.dev/items'

      // если бренд выбран — добавляем фильтр
      if (filters.brand) {
        url += '?brand=' + filters.brand
      }

      const { data } = await axios.get(url)
      items.value = data
    } catch (e) {
      console.log(e)
    }
  },
)
</script>

<template>
  <app-drawer />
  <div class="bg-white w-4/5 m-auto rounded-xl shadow-xl mt-14">
    <app-header />
    <div class="p-10">
      <div class="flex justify-between items-center">
        <h2 class="text-3xl font-bold mb-8">Смартфоны</h2>

        <div class="flex gap-4">
          <select @change="onChangeSelect" class="py-2 px-3 border rounded-md outline-none">
            <option value="">Все бренды</option>
            <option value="Apple">Apple</option>
            <option value="Google">Google</option>
            <option value="Samsung">Samsung</option>
          </select>

          <div class="relative">
            <img class="absolute left-4 top-3" src="/search.svg" alt="Поиск" />
            <input
              class="border rounded-md py-2 pl-11 pr-4 outline-none focus:border-gray-400"
              type="text"
              placeholder="Поиск..."
            />
          </div>
        </div>
      </div>
      <div class="mt-10">
        <app-card-list :items="items" />
      </div>
    </div>
  </div>
</template>
