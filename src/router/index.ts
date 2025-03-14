import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/size',
    name: 'Size',
    component: () => import('../views/Size.vue') // 确保路径正确
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

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
