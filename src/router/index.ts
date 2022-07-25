import { RouteRecordRaw } from "vue-router";
export default {
  path: "/",
  redirect: "/login",
  children: [
    {
      name: "login",
      path: "/login",
      alias: "登录",
      component: () => import("@/views/login/index.vue"),
    },
    {
      name: "register",
      path: "/register",
      alias: "注册",
      component: () => import("@/views/register/index.vue"),
    },
  ],
} as RouteRecordRaw;
