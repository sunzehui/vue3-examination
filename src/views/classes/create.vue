<script lang="ts" setup>
import {DataTableRowKey, NLayoutContent} from "naive-ui";
import {get, isNil} from "lodash-es";
import {useClassesStore} from "@/store/classes";
import {useRequest} from "vue-request";
import {ApiCreateClasses, ApiFindAllStudent, ApiFindClassesStudent} from "@/apis/classes";

const baseInfoModel = ref({
  name: null,
})

const contentRef = ref<typeof NLayoutContent | null>(null)
const createClasses = async () => {
  const classesPayload = {
    name: unref(baseInfoModel).name,
    students: unref(checkedListRef)
  }
  await ApiCreateClasses(classesPayload);
}
const classesStore = useClassesStore();
const fetchStuListService = async () => {
  const result = await ApiFindAllStudent();
  return result.data;
};
const {data: classesDetail} = useRequest(() => fetchStuListService(), {
  cacheKey: `stuList`,
  cacheTime: 300000,
})
const rowKey = ((obj: any) => obj.id)
const checkedListRef = ref<DataTableRowKey[]>([])
const handleCheck = (rowKeys: DataTableRowKey[]) => {
  checkedListRef.value = rowKeys
}
</script>

<template>
  <n-space vertical size="large">
    <n-layout>
      <n-layout-content content-style="padding: 24px;" ref="contentRef">
        <n-space vertical size="large">
          <n-form
              ref="formRef"
              :model="baseInfoModel"
              :disabled="false"
          >
            <n-input-group>
              <n-input-group-label>班级名称：</n-input-group-label>
              <n-input v-model:value="baseInfoModel.name" placeholder="请输入班级名称"/>
            </n-input-group>

            <n-card title="选择学生" class="mt-6">
              <n-data-table
                  :border="true"
                  :columns="classesStore.studentColumnForCreate"
                  :data="get(classesDetail,'users',[])"
                  :max-height="550"
                  :row-key="rowKey"
                  @update:checked-row-keys="handleCheck"
              />
            </n-card>
          </n-form>
        </n-space>
        <n-space size="large" style="margin-top: 20px;" justify="end">
          <n-button size="large">取消</n-button>
          <n-button type="primary" size="large" @click="createClasses">确定</n-button>
        </n-space>
      </n-layout-content>
    </n-layout>
  </n-space>
</template>
