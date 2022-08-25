import {RouterLink} from "vue-router";
import {MenuOption} from "naive-ui";
import {
    Aiming,
    EmotionHappy,
    EveryUser,
    Home,
    UserPositioning,
} from "@icon-park/vue-next";
import {h} from "vue";
import {renderIcon} from "@/utils/tools";
import {useUserStore} from "@/store/user";
import {Role} from "@/types/api-user";

const studentOpt = [
    {
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        name: "home",
                    },
                },
                {default: () => "考试面板"}
            ),
        key: "exam-panel",
        icon: renderIcon(Home),
    },
    {
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        name: "class-panel",
                    },
                },
                {default: () => "班级信息"}
            ),
        key: "info",
        icon: renderIcon(EveryUser),
    },
    {
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        name: "user-profile",
                    },
                },
                {default: () => "个人信息"}
            ),
        key: "user-profile",
        icon: renderIcon(UserPositioning),
    },
    {
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        name: "exam-query",
                    },
                },
                {default: () => "成绩查询"}
            ),
        key: "exam-score",
        icon: renderIcon(EmotionHappy),
    },

] as MenuOption[];

const teacherOpt = [
    {
        label: "考试管理",
        key: "exam-paper",
        icon: renderIcon(Home),
        children: [
            {
                label: () =>
                    h(
                        RouterLink,
                        {
                            to: {
                                name: "home",
                            },
                        },
                        {default: () => "考试列表"}
                    ),
                key: "exam-panel",
                icon: renderIcon(Home),
            },
            {
                label: () =>
                    h(
                        RouterLink,
                        {
                            to: {
                                name: "exam-room-edit",
                            },
                        },
                        {default: () => "编辑考试"}
                    ),
                key: "exam-list",
                icon: renderIcon(Aiming),
            },
            {
                label: () =>
                    h(
                        RouterLink,
                        {
                            to: {
                                name: "exam-paper",
                            },
                        },
                        {default: () => "编辑试卷"}
                    ),
                key: "exam-paper-list",
                icon: renderIcon(Aiming),
            },
            {
                label: () =>
                    h(
                        RouterLink,
                        {
                            to: {
                                name: "exam-score",
                            },
                        },
                        {default: () => "成绩查询"}
                    ),
                key: "exam-score",
                icon: renderIcon(EmotionHappy),
            },
        ],
    },
    {
        label: "信息管理",
        key: "information",
        icon: renderIcon(Home),
        children: [
            {
                label: () =>
                    h(
                        RouterLink,
                        {
                            to: {
                                name: "class-panel",
                            },
                        },
                        {default: () => "班级信息"}
                    ),
                key: "info",
                icon: renderIcon(EveryUser),
            },
            {
                label: () =>
                    h(
                        RouterLink,
                        {
                            to: {
                                name: "user-profile",
                            },
                        },
                        {default: () => "个人信息"}
                    ),
                key: "user-profile",
                icon: renderIcon(Aiming),
            },
        ],
    },
] as MenuOption[];
const userStore = useUserStore();
const role = userStore.role;
let exportOpt = null;
if (role === Role.teacher) {
    exportOpt = teacherOpt;
} else if (role === Role.student) {
    exportOpt = studentOpt;
}
export default exportOpt;
