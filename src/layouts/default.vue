<template>
  <n-space vertical class="main-layout">
    <n-layout>
      <n-layout has-sider>
        <n-layout-sider
          bordered
          show-trigger
          :trigger-style="{ transform: 'scale(2) translateX(25%)' }"
          :collapsed-trigger-style="{
            transform: 'scale(2) translateX(90%)',
          }"
          collapse-mode="transform"
          :show-collapsed-content="false"
          :collapsed-width="0"
          :width="240"
          class="sidebar__menu-container"
          :native-scrollbar="false"
          :inverted="inverted"
        >
          <n-space class="logo-wrap" justify="center">
            Study Day Day Up
          </n-space>
          <n-menu
            :inverted="inverted"
            :collapsed="collapsed"
            v-model:value="activeKey"
            :collapsed-icon-size="0"
            :options="menuOptions"
          />
        </n-layout-sider>
        <n-layout>
          <n-layout-header class="main-header" :inverted="inverted" bordered>
            <h1>在线考试系统</h1>
            <div class="right-bar">
              <span class="notify">
                <Bell />
              </span>
              <div class="avatar">
                <img src="/images/xj.jpg" />
              </div>
            </div>
          </n-layout-header>
          <n-layout-content class="main-content">
            <router-view />
          </n-layout-content>
        </n-layout>
      </n-layout>
    </n-layout>
  </n-space>
</template>

<script lang="ts" setup>
import menuOptions from "./menu-option";
import { Bell } from "@element-plus/icons-vue";

const inverted = ref(false);
const collapsed = ref(false);
const activeKey = ref<string | null>("exam-panel");
</script>

<style scoped lang="scss">
.sidebar__menu-container {
  height: 100vh;
}
.logo-wrap {
  height: 85px;
  font-size: 1.4rem;
  color: gray;
  display: flex;
  align-items: center;
  cursor: nomal;
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
