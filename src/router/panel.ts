export default {
    name: 'home',
    path: "/panel",
    redirect: "/panel/exam-panel",
    component: () => import("@/layouts/default.vue"),
    children: [
        {
            name: "exam-panel",
            path: "exam-panel",
            alias: "考试面板",
            component: () => import("@/views/front/index.vue"),

        },
        {
            name: "exam-query",
            path: "exam-query",
            alias: "成绩查询",
            component: () => import("@/views/exam-query/index.vue"),
        },
        {
            name: "class-panel",
            path: "class-panel",
            alias: "班级管理",
            component: () => import("@/views/classes/index.vue"),
            redirect: {name: 'info'},
            children: [
                {
                    name: 'info',
                    path: "info",
                    alias: '班级信息',
                    meta: {title: "班级信息"},
                    component: () => import("@/views/classes/info.vue")
                },
                {
                    name: 'join',
                    path: "join",
                    alias: '加入班级',
                    meta: {title: "加入班级"},
                    component: () => import("@/views/classes/join-classes.vue")
                }
            ]
        }
    ]
}