<template>
  <n-space class="main-layout" vertical>
    <n-layout>
      <n-layout has-sider>
        <n-layout-sider
            :collapsed-trigger-style="{
            transform: 'scale(2) translateX(90%)',
          }"
            :collapsed-width="0"
            :inverted="inverted"
            :native-scrollbar="false"
            :position="responsivePos"
            :show-collapsed-content="false"
            :trigger-style="{ transform: 'scale(2) translateX(25%)' }"
            :width="240"
            bordered
            class="sidebar__menu-container"
            collapse-mode="transform"
            show-trigger
            content-style="padding:20px"
        >
          <n-empty v-if="isQEmpty"></n-empty>
          <n-space v-if="!isQEmpty" align="start" vertical>
            <h3 class="text-lg">选择题</h3>
            <n-card class="answer-panel">
              <div class="grid-card">
                <template v-for="q in choiceQStatus">
                  <div class="item" :class="statusMap[q.status]"></div>
                </template>
              </div>
            </n-card>
            <n-divider/>
          </n-space>

          <n-space v-if="!isQEmpty" align="start" vertical>
            <h3 class="text-lg">填空题</h3>
            <n-card class="answer-panel">
              <div class="grid-card">
                <template v-for="q in fillBlankQStatus">
                  <div class="item" :class="statusMap[q.status]"></div>
                </template>
              </div>
            </n-card>
            <n-divider/>

          </n-space>
          <n-alert v-if="!isQEmpty" :show-icon="false">
            <span>tips:</span>
            <div class="mt-2 flex gap-2 items-center">
              <div class="item on-active"></div>
              题目正在作答
            </div>
            <div class="mb-4 mt-4 flex gap-2 items-center">
              <div class="item half"></div>
              题目未完全做完
            </div>
            <div class="flex gap-2 items-center">
              <div class="item complete"></div>
              题目已作答
            </div>

          </n-alert>
        </n-layout-sider>
        <n-layout>
          <n-layout-header :inverted="inverted" bordered class="main-header">
            <div class="flex items-end">
              <h1>{{ examStore.examRoom.name }}</h1>
              <span>{{ examStore.examPaper.name }}</span>
            </div>

            <div class="right-bar">
              <span class="notify">
                <Bell/>
              </span>
              <div class="avatar">
                <img src="/images/xj.jpg"/>
              </div>
            </div>
          </n-layout-header>
          <n-layout-content class="main-content">
            <router-view/>
          </n-layout-content>
        </n-layout>
      </n-layout>
    </n-layout>
  </n-space>
</template>

<script lang="ts" setup>
import {useExamStore} from "@/store/exam";
import {QStatus, QType} from "@/types/api-exam-paper";

const statusMap = {
  [QStatus.none]: "",
  [QStatus.half]: "half",
  [QStatus.complete]: 'complete',
  [QStatus["on-active"]]: "on-active"
}
const examStore = useExamStore();
const isQEmpty = computed(() => examStore.isQListEmpty)
const choiceQStatus = ref();
const fillBlankQStatus = ref();
watch(() => examStore.userAnswerStatus, () => {
  choiceQStatus.value = examStore.userAnswerStatus.filter(q => q.type === QType.choice)
  fillBlankQStatus.value = examStore.userAnswerStatus.filter(q => q.type === QType.fill_blank)

}, {immediate: true})
</script>

<style lang="scss" scoped>
.sidebar__menu-container {
  height: 100vh;
  @apply pt-8;
}

.logo-wrap {
  height: 85px;
  font-size: 1.4rem;
  color: gray;
  display: flex;
  align-items: center;
  cursor: auto;
  user-select: none;
}

.main-header {
  height: 80px;
  display: flex;
  text-indent: 2rem;
  align-items: center;

  h1 {
    font-size: 2rem;
  }

  .right-bar {
    margin-left: auto;
    height: 100%;
    display: flex;
    align-items: center;
    gap: 30px;
    margin-right: 2rem;

    .avatar {
      height: 50px;
      width: 50px;
      border-radius: 50%;
      overflow: hidden;
      cursor: pointer;

      img {
        height: 100%;
        width: 100%;
        object-fit: cover;
      }
    }

    .notify {
      height: 30px;
      width: 30px;
      cursor: pointer;
    }
  }
}

.main-content {
  height: calc(100vh - 80px);
  background-color: #f5f5f5;
  padding: 2rem;
  box-sizing: border-box;
}

.answer-panel {
  .grid-card {
    @apply grid gap-4 grid-cols-5;

  }
}

.item {
  @apply h-5 w-5 border;
  &.half {
    @apply bg-half;
  }

  &.complete {
    @apply bg-complete;
  }

  &.on-active {
    @apply border-active border-2;
  }
}

</style>
