<template>
  <n-menu
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :options="menuOptions"
      class="left-list-menu"
      v-model:value="selectPaper"
  />
</template>

<script lang="ts" setup>
import {MenuOption} from "naive-ui";
import {ApiGetExamPaper} from "@/apis/exam-paper";
import {renderIcon} from "@/utils/tools";
import {NewspaperFolding} from "@icon-park/vue-next";
import {ExamPaper} from "@/types/api-exam-paper";
import {head} from "lodash";

const emit = defineEmits(['update:value'])

const optionAdapter = (res: ExamPaper[]) => {
  return res.map(paper => ({
    label: paper.name,
    key: `${paper.name}-${paper.id}`,
    icon: renderIcon(NewspaperFolding)
  }))
}

const menuOptions = ref<any>([])
const selectPaper = ref();

watch(selectPaper, (v) => {
  emit("update:value", selectPaper.value)
})

onMounted(async () => {
  const result = await ApiGetExamPaper();
  menuOptions.value = optionAdapter(result.data)
  const headPaper = head(unref(menuOptions)) as (MenuOption | null)
  if (!headPaper) return;
  selectPaper.value = headPaper.key;
})
</script>

<style lang="scss" scoped>

.left-list-menu {
  :deep(.n-menu-item) {
    height: auto;
  }

  :deep(.n-menu-item-content .n-menu-item-content__icon) {
    align-self: self-start;
    margin-top: 10px;
  }

  :deep(.n-menu-item-content) {
    padding-top: 20px;
    padding-bottom: 20px;
  }

  :deep(.n-menu-item-content .n-menu-item-content-header) {
    word-break: break-all;
    text-overflow: initial;
    white-space: initial;
  }
}
</style>