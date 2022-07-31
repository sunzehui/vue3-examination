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
        >
          <n-space class="logo-wrap" justify="center">
            Study Day Day Up
          </n-space>
          <n-menu
              v-model:value="activeKey"
              :collapsed="collapsed"
              :collapsed-icon-size="0"
              :inverted="inverted"
              :options="menuOptions"
          />
        </n-layout-sider>
        <n-layout>
          <n-layout-header :inverted="inverted" bordered class="main-header">
            <h1>在线考试系统</h1>
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
import menuOptions from "./menu-option";
import {Bell} from "@element-plus/icons-vue";
import {useMediaQuery} from "@vueuse/core";
import {useRoute} from 'vue-router'

const route = useRoute()
const responsivePos = ref("static")
const inverted = ref(false);
const collapsed = ref(false);
const activeKey = ref<string | null>("exam-panel");
watch(() => route.path, (value: string) => {
  const path = value.split("/")
  activeKey.value = path[2] || 'exam-panel';
}, {immediate: true})

const isXlScreen = useMediaQuery('(min-width: 1000px)')
watch(isXlScreen, () => {
  if (!isXlScreen.value) {
    responsivePos.value = 'absolute'
  } else {
    responsivePos.value = 'static'
  }
}, {immediate: true})
</script>

<style lang="scss" scoped>
.sidebar__menu-container {
  height: 100vh;
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
</style>
