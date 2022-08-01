import {RouteRecordRaw} from "vue-router";

export default {
    name: 'exam',
    path: "/exam",
    redirect: {name: 'room'},
    component: () => import("@/layouts/exam-room.vue"),
    children: [
        {
            name: "room",
            path: "room/:rid",
            alias: "在线考场",
            component: () => import("@/views/examination/index.vue"),
            children: [
                {
                    name: 'question-panel',
                    path: 'q/:idx',
                    component: () => import('@/views/examination/question-panel.vue')
                }
            ]
        },

    ]
} as RouteRecordRaw