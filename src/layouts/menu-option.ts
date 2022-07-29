import {RouterLink} from "vue-router";
import {MenuOption} from "naive-ui";
import {
    Aiming,
    EmotionHappy,
    EveryUser,
    FileFailed,
    Home,
    UserPositioning,
    WritingFluently,
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
        type: "group",
        label: "个人信息",
        key: "people",
        children: [
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
                key: "score-query",
                icon: renderIcon(EmotionHappy),
            },
            {
                label: "成绩分析",
                key: "score-analysis",
                icon: renderIcon(Aiming),
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
                key: "class-panel",
                icon: renderIcon(EveryUser),
            },
            {
                label: "账户信息",
                key: "user-profile",
                icon: renderIcon(UserPositioning),
            },
        ],
    },
    {
        type: "group",
        label: "知识回顾",
        key: "knowledge",
        children: [
            {
                label: "错题记录",
                key: "error-record",
                icon: renderIcon(FileFailed),
            },
            {
                label: "考试记录",
                key: "exam-record",
                icon: renderIcon(WritingFluently),
            },
        ],
    },
] as MenuOption[];

const teacherOpt = [
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
                        name: "exam-paper-edit",
                    },
                },
                {default: () => "试卷管理"}
            ),
        key: "exam-edit",
        icon: renderIcon(Aiming),
    }, {
        label: "题目管理",
        key: "question-edit",
        icon: renderIcon(Aiming),
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
        key: "score-query",
        icon: renderIcon(EmotionHappy),
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
        key: "class-panel",
        icon: renderIcon(EveryUser),
    }, {
        label: "个人信息",
        key: "user-info",
        icon: renderIcon(Aiming),
    },
    {
        label: "考试记录",
        key: "exam-record",
        icon: renderIcon(UserPositioning),
    },
] as MenuOption[];
const userStore = useUserStore()
const role = userStore.role;
let exportOpt = null
if (role === Role.teacher) {
    exportOpt = teacherOpt
} else if (role === Role.student) {
    exportOpt = studentOpt
}
export default exportOpt;