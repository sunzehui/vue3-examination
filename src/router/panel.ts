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
            meta: {title: '成绩查询'},
            redirect: {name: 'exam-score'},
            component: () => import("@/views/exam-query/index.vue"),
            children: [
                {
                    name: 'exam-score',
                    path: 'score',
                    meta: {title: '分数查询'},
                    component: () => import('@/views/exam-query/exam-score.vue')
                },
                {
                    name: 'classes-record-list',
                    path: 'classes',
                    meta: {title: '班级分数'},
                    component: () => import('@/views/exam-query/classes-record-list.vue'),
                    children: [
                        {
                            name: 'exam-record-inner',
                            path: 'record/:record_id',
                            meta: {title: '考试记录'},
                            component: () => import('@/views/exam-query/exam-record.vue')
                        }
                    ]
                }, {
                    name: "exam-analysis",
                    path: "exam-analysis",
                    alias: "成绩分析",
                    component: () => import("@/views/exam-query/exam-analysis.vue"),
                },
                {
                    name: 'exam-record',
                    path: 'record/:record_id',
                    meta: {title: '考试记录'},
                    component: () => import('@/views/exam-query/exam-record.vue')
                }
            ]
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
                }, {
                    name: 'create',
                    path: "create",
                    alias: '创建班级',
                    meta: {title: "创建班级"},
                    component: () => import("@/views/classes/create.vue")
                }
            ]
        }
        , {
            name: 'user-profile',
            path: 'mine',
            meta: {title: "个人信息"},
            component: () => import('@/views/user/profile.vue')
        }
    ]

}