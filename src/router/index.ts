import { RouteRecordRaw } from 'vue-router'
export default {
  path: '/',
  component: () => import('@/layouts/front.vue'),
  children: [
    {
      name: 'home',
      path: '',
      alias: '/',
      component: () => import('@/views/front/index.vue'),
    },
  ],
} as RouteRecordRaw
