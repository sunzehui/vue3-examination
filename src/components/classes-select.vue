<template>
  <n-popselect
      @update:value="v => $emit('selectUpdate',v)"
      v-model:value="active"
      :options="options"
      :scrollable="true"
      size="medium"
  >
    <n-button style="margin-right: 8px">
      {{ active || "未选择" }}
    </n-button>
  </n-popselect>
</template>

<script setup lang="ts">
import {nameOption} from "@/types/api-classes";
import {ApiFindMyClasses} from "@/apis/classes";
import {useRequest} from "vue-request";
import {useClassesStore} from "@/store/classes";

const options = ref<nameOption[]>([]);
const active = ref("");
const classesStore = useClassesStore()
const findMyClassesService = async () => {
  if (classesStore.cachedList) {
    return classesStore.cachedList
  }
  const result = await ApiFindMyClasses();
  const classesList = result.data
  classesStore.$patch({
    classesList
  })
  return classesList || []
}
const {data: classesList} = useRequest(findMyClassesService, {
  onSuccess(data) {
    options.value = data.map(item => ({
      label: `${item.name}-${item.id}`, value: `${item.name}-${item.id}`
    }));
  },
  cacheKey: 'classesList',
  cacheTime: 300000
})

const setValueNone = () => {
  active.value = ''
}
const setActive = (value: string) => {
  active.value = value;
}
defineExpose({
  setValueNone, classesList, setActive
})
</script>
