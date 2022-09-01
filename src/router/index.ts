import { RouteRecordRaw } from "vue-router";

export default {
  path: "/",
  redirect: "/login",
  children: [
    {
      name: "login",
      path: "/login",
      meta: {
        publicRoute: true,
        title: "登录",
      },
      component: () => import("@/views/user/login.vue"),
    },
    {
      name: "register",
      path: "/register",
      meta: {
        publicRoute: true,
        title: "注册",
      },
      component: () => import("@/views/user/register.vue"),
    },
  ],
} as RouteRecordRaw;
