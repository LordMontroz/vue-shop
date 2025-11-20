import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import Favorites from '@/pages/Favorites.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: Favorites,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
