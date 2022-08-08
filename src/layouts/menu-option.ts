import { RouterLink } from "vue-router";
import { MenuOption } from "naive-ui";
import {
  Aiming,
  EmotionHappy,
  EveryUser,
  FileFailed,
  Home,
  UserPositioning,
  WritingFluently,
} from "@icon-park/vue-next";
import { h } from "vue";
import { renderIcon } from "@/utils/tools";
import { useUserStore } from "@/store/user";
import { Role } from "@/types/api-user";

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
        { default: () => "考试面板" }
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
        { default: () => "班级信息" }
      ),
    key: "class-panel",
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
        { default: () => "个人信息" }
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
        { default: () => "成绩查询" }
      ),
    key: "score-query",
    icon: renderIcon(EmotionHappy),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: { name: "exam-analysis" },
        },
        { default: () => "成绩分析" }
      ),
    key: "score-analysis",
    icon: renderIcon(Aiming),
  },
] as MenuOption[];

const teacherOpt = [
  {
    label: "考试管理",
    key: "exam-manage",
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
            { default: () => "考试列表" }
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
            { default: () => "编辑考试" }
          ),
        key: "exam-room-edit",
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
            { default: () => "编辑试卷" }
          ),
        key: "exam-paper",
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
            { default: () => "成绩查询" }
          ),
        key: "score-query",
        icon: renderIcon(EmotionHappy),
      },
      {
        label: () =>
          h(
            RouterLink,
            {
              to: { name: "exam-analysis" },
            },
            { default: () => "成绩分析" }
          ),
        key: "score-analysis",
        icon: renderIcon(Aiming),
      },
    ],
  },
  {
    label: "信息管理",
    key: "infomation",
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
            { default: () => "班级信息" }
          ),
        key: "class-panel",
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
            { default: () => "个人信息" }
          ),
        key: "user-info",
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
