<script lang="ts" setup>
import {ref} from "vue";
import {useClassesStore} from "@/store/classes";
import {get, head, isEmpty, isNil} from "lodash";
import {ClassesResult, nameOption} from "@/types/api-classes";
import {ElMessage} from "element-plus";
import {getIdFromKey} from "@/utils/tools";
import

const classesStore = useClassesStore();
const options = ref<nameOption[]>([]);
const value = ref("");
const columns = classesStore.studentColumn;
const classesDetail = ref<ClassesResult | {}>({});

const fetchClasses = async (classesId: number) => {
  const result = await classesStore.getClassesStudent(classesId);
  if (isNil(result) || isEmpty(result)) return;
  classesDetail.value = result;
  return result;
}
const fetchFirstClasses = async (list: ClassesResult[]) => {
  if (isEmpty(list)) {
    return;
  }
  const classesId = get(head(list), "id");
  if (!classesId) return;
  const result = await fetchClasses(classesId) as ClassesResult;
  value.value = `${result.name}-${result.id}`;
};
const onSelectClasses = (val: string) => {
  const id = getIdFromKey(val);
  if (!id) {
    return
  }
  fetchClasses(id);
}

onMounted(async () => {
  const classesList = await classesStore.getClassesList();
  options.value = classesStore.nameOption;
  await fetchFirstClasses(classesList);
});
</script>
<template>
  <n-layout>
    <n-layout-header embedded style="padding: 24px; display: flex">
<!--      <n-popselect-->
<!--          @update:value="onSelectClasses"-->
<!--          v-model:value="value"-->
<!--          :options="options"-->
<!--          scrollable-->
<!--          size="medium"-->
<!--      >-->
<!--        <n-button style="margin-right: 8px">-->
<!--          {{ value || "未选择" }}-->
<!--        </n-button>-->
<!--      </n-popselect>-->
      <ClassesSelect @selectUpdate="onSelectClasses"/>
      <n-button @click="$router.push('join')">加入班级</n-button>
    </n-layout-header>

    <n-layout-content class="classes-layout-content">
      <n-card hoverable>
        <n-descriptions label-placement="left" :title="classesDetail.name">
          <n-descriptions-item>
            <template #label>创建人（老师）</template>
            {{ get(classesDetail, 'created_by.nickname', '未知') }}
          </n-descriptions-item>
          <n-descriptions-item label="早午餐"> 苹果</n-descriptions-item>
          <n-descriptions-item label="午餐"> 苹果</n-descriptions-item>
          <n-descriptions-item label="晚餐"> 苹果</n-descriptions-item>
          <n-descriptions-item label="夜宵"> 苹果</n-descriptions-item>
        </n-descriptions>
      </n-card>

      <n-card hoverable title="学生列表">
        <n-data-table
            :border="true"
            :columns="columns"
            :data="classesDetail.users"
            :max-height="550"
        />
      </n-card>
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

</style>
