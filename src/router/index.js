import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '@/pages/HomePage.vue'
import FavoritesPage from '@/pages/FavoritesPage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: FavoritesPage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
