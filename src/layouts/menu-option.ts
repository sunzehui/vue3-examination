import { RouterLink } from "vue-router";
import { MenuOption, NIcon } from "naive-ui";
import {
  Aiming,
  Bookmark,
  EmotionHappy,
  EveryUser,
  FileFailed,
  FileStaffOne,
  UserPositioning,
  WritingFluently,
} from "@icon-park/vue-next";
import { Home } from "@icon-park/vue-next";
import { h, Component } from "vue";
import { renderIcon } from "@/utils/tools";
export default [
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
            { default: () => "成绩查询" }
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
        label: "班级信息",
        key: "classes",
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
