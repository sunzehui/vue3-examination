import { RouteRecordRaw } from "vue-router";

export default {
  name: "exam",
  path: "/exam",
  redirect: { name: "404" },
  component: () => import("@/layouts/exam-room.vue"),
  children: [
    {
      name: "room",
      path: "room/:rid",
      props: true,
      component: () => import("@/views/examination/index.vue"),
      children: [
        {
          name: "question-panel",
          path: "q/:idx",
          component: () => import("@/views/examination/question-panel.vue"),
        },
      ],
    },
  ],
} as RouteRecordRaw;
