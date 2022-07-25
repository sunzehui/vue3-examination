<script lang="ts" setup>
import {ref} from 'vue'
import {useClassesStore} from "@/store/classes";
import {isEmpty} from "lodash";

const classesStore = useClassesStore();
const options = ref(null)
const value = ref('');
const columns = classesStore.tableColumn;

onMounted(async () => {
  const classesList = await classesStore.getClassesList();
  options.value = classesStore.nameOption;
  console.log(classesList)
  if (!isEmpty(classesList)) {
    console.log({classesList})
    // await classesStore.getClassesDetail(unref(options)[0].id);
  }
})

</script>
<template>
  <n-layout>
    <n-layout-header embedded style="padding: 24px;display:flex;">
      <h2>选择班级：</h2>
      <n-popselect
          v-model:value="value"
          :options="options"
          scrollable
          size="medium"
      >
        <n-button style="margin-right: 8px">
          {{ value || '未选择' }}
        </n-button>
      </n-popselect>
    </n-layout-header>

    <n-layout-content class="classes-layout-content">

      <n-card hoverable>
        <n-descriptions label-placement="left" title="17大专软件2班">
          <n-descriptions-item>
            <template #label>
              早餐
            </template>
            苹果
          </n-descriptions-item>
          <n-descriptions-item label="早午餐">
            苹果
          </n-descriptions-item>
          <n-descriptions-item label="午餐">
            苹果
          </n-descriptions-item>
          <n-descriptions-item label="晚餐">
            苹果
          </n-descriptions-item>
          <n-descriptions-item label="夜宵">
            苹果
          </n-descriptions-item>
        </n-descriptions>
      </n-card>


      <n-data-table
          :border="true"
          :columns="columns"
          :data="classesMate"
          :max-height="550"
      />

    </n-layout-content>

  </n-layout>

</template>

<style lang="scss" scoped>
h2 {
  @apply text-lg;
}

.classes-layout-content {
  padding: 20px;

  :deep(.n-layout-scroll-container) {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
}

.light-green {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  background-color: rgba(0, 128, 0, 0.12);
}

.green {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  background-color: rgba(0, 128, 0, 0.24);
}
</style>