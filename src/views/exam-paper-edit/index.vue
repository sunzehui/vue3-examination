<template>
  <n-space vertical size="large">
    <n-layout has-sider>
      <n-layout-sider
          collapse-mode="transform"
          :collapsed-width="0"
          :width="240"
          show-trigger="arrow-circle"
          content-style="padding: 4px;"
          bordered
          style="height: calc(100vh - 144px)"
      >
        <LeftList @update:value="handleSelectChange"/>
      </n-layout-sider>
      <n-layout-content style="height: calc(100vh - 144px)" content-style="padding: 24px;">
        <n-space vertical size="large">
          <EditChoiceQ :selectPaper="selectPaper"/>
          <EditFillBlankQ :selectPaper="selectPaper"/>
        </n-space>
      </n-layout-content>
    </n-layout>
  </n-space>
</template>

<script lang="ts" setup>
import LeftList from '@/components/left-list.vue'
import EditChoiceQ from '@/components/edit-choice-q.vue'
import EditFillBlankQ from "@/components/edit-fillblank-q.vue";

const selectPaper = ref<string>()
const handleSelectChange = (val: string) => {
  selectPaper.value = val;
}
</script>

<style scoped>

</style>