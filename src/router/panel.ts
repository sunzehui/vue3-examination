export default {
    name: 'home',
    path: "/panel",
    redirect: "/panel/exam-panel",
    meta: {title: "考试面板"},
    component: () => import("@/layouts/default.vue"),
    children: [
        {
            name: "exam-paper",
            path: "exam-paper",
            alias: "试卷管理",
            meta: {title: '试卷管理'},
            redirect: {name: 'exam-paper-list'},
            component: () => import("@/views/exam-paper/index.vue"),
            children: [
                {
                    name: 'exam-paper-list',
                    path: 'list',
                    meta: {title: "试卷列表"},
                    component: () => import('@/views/exam-paper/list.vue')
                }, {
                    name: 'exam-paper-create',
                    path: 'create',
                    meta: {title: "试卷创建"},
                    component: () => import('@/views/exam-paper/create.vue')
                }, {
                    name: 'exam-paper-edit',
                    path: 'edit/:id',
                    meta: {title: "试卷编辑"},
                    component: () => import('@/views/exam-paper/edit.vue')
                },
            ]
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
            meta: {title: '考试管理'},
            component: () => import("@/views/exam-room-edit/index.vue"),
            redirect: {name: "exam-list"},
            children: [
                {
                    name: "exam-list",
                    path: "list",
                    meta: {title: "考试列表"},
                    component: () => import("@/views/exam-room-edit/list.vue")
                },
                {
                    name: 'exam-create',
                    path: 'create',
                    meta: {title: "创建考试"},
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
            meta: {title: "班级管理"},
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