export default {
    name: 'exam',
    path: "/exam",
    redirect: {name: 'room'},
    component: () => import("@/layouts/exam-room.vue"),
    children: [
        {
            name: "room",
            path: "room/:id",
            alias: "在线考场",
            component: () => import("@/views/examination/index.vue")
        },

    ]
}