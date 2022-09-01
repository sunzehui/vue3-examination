import { RouteRecordRaw } from "vue-router";
export default {
  path: "/404",
  name: "404",
  component: () => import("@/views/404.vue"),
} as RouteRecordRaw;
