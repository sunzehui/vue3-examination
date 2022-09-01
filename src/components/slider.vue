<script lang="ts" setup>
import {useMediaQuery} from "@vueuse/core";

const inverted = ref(false);
const collapsed = ref(false);
const isXlScreen = useMediaQuery("(min-width: 1000px)");
const responsivePos = computed(() =>
    unref(isXlScreen) ? "static" : "absolute"
);
watch(
    isXlScreen,
    (val) => {
      collapsed.value = !val;
    },
    {immediate: true}
);
</script>

<template>
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
      :collapsed="collapsed"
      class="sidebar__menu-container"
      collapse-mode="transform"
      @collapse="collapsed = true"
      @expand="collapsed = false"
      show-trigger
  >
    <slot/>
  </n-layout-sider>
</template>
