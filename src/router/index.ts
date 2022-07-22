import { RouteRecordRaw } from "vue-router";
export default {
  path: "/",
  component: () => import("@/layouts/default.vue"),
  children: [
    {
      name: "home",
      path: "",
      alias: "考试面板",
      component: () => import("@/views/front/index.vue"),
    },
    {
      name: "exam-query",
      path: "exam-query",
      alias: "成绩查询",
      component: () => import("@/views/exam-query/index.vue"),
    },
  ],
} as RouteRecordRaw;
