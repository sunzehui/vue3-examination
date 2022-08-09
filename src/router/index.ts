import {RouteRecordRaw} from "vue-router";

export default {
    path: "/",
    redirect: "/login",
    children: [
        {
            name: "login",
            path: "/login",
            alias: "登录",
            meta: {
                publicRoute: true
            },
            component: () => import("@/views/login/index.vue"),
        },
        {
            name: "register",
            path: "/register",
            alias: "注册",
            meta: {
                publicRoute: true
            },
            component: () => import("@/views/user/register.vue"),
        },
    ],
} as RouteRecordRaw;
