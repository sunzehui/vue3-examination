export default {
    name: 'home',
    path: "/panel",
    redirect: "/panel/exam-panel",
    component: () => import("@/layouts/default.vue"),
    children: [
        {
            name: "exam-paper-edit",
            path: "exam-paper-edit",
            alias: "编辑试卷",
            component: () => import("@/views/exam-paper-edit/index.vue"),
        },
        {
            name: "exam-panel",
            path: "exam-panel",
            alias: "考试面板",
            component: () => import("@/views/exam-room/index.vue"),
        },
        {
            name: "exam-room-edit",
            path: "exam-room-edit",
            component: () => import("@/views/exam-room-edit/index.vue"),
            redirect: {name: "exam-list"},
            children: [
                {
                    name: "exam-list",
                    path: "",
                    component: () => import("@/views/exam-room-edit/list.vue")
                },
                {
                    name: 'exam-create',
                    path: 'create',
                    component: () => import("@/views/exam-room-edit/create.vue")
                }

            ]
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