<template>
  <n-popselect
      @update:value="v => $emit('selectUpdate',v)"
      v-model:value="value"
      :options="options"
      scrollable
      size="medium"
  >
    <n-button style="margin-right: 8px">
      {{ value || "未选择" }}
    </n-button>
  </n-popselect>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {nameOption} from "@/types/api-classes";
import {useClassesStore} from "@/store/classes";
import {ApiFindMyClasses} from "@/apis/classes";

const options = ref<nameOption[]>([]);
const value = ref("");

onMounted(async () => {
  const classesListResult = await ApiFindMyClasses()
  const classesListData = classesListResult.data || [];
  options.value = classesListData.map(item => ({
    label: `${item.name}-${item.id}`, value: `${item.name}-${item.id}`
  }));
});
</script>

<style scoped>

</style>