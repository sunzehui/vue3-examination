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

const classesStore = useClassesStore();
const options = ref<nameOption[]>([]);
const value = ref("");

onMounted(async () => {
  await classesStore.getClassesList();
  options.value = classesStore.nameOption;
});
</script>

<style scoped>

</style>