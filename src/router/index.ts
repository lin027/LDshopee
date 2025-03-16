import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/size',
    name: 'Size',//@ts-ignore
    component: () => import('../views/Size.vue')  
  },
  {
    path: '/',
    redirect: '/size'
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView
  },
  {
    path: '/personalShop',
    name: 'PersonalShop',
    component: () => import('../views/PersonalShop.vue')
  },

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
  routes
});

export default router;
