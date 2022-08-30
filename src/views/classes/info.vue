<script lang="ts" setup>
import {useClassesStore} from "@/store/classes";
import {first, get} from "lodash-es";
import {ClassesResult} from "@/types/api-classes";
import {getIdFromKey} from "@/utils/tools";
import {useRequest} from "vue-request";
import {ApiFindClassesDetail, ApiFindClassesStudent, ApiFindMyClasses} from "@/apis/classes";
import {MaybeRef} from "@vueuse/core";
import ClassesSelect from '@/components/classes-select.vue'
import {Role} from '@/types/api-user'

const classesStore = useClassesStore();
const activeClasses = reactive<{ id: null | number, label: string, classes: ClassesResult | null }>({
  id: null,
  label: '',
  classes: null
});

const findMyClassesService = async () => {
  const result = await ApiFindMyClasses();
  return result.data || []
}
const {data: classesList} = useRequest(findMyClassesService, {
  cacheKey: 'classesList',
  cacheTime: 300000,
  onSuccess(data) {
    const headClasses = first(data) ?? null
    if (!headClasses) return;
    activeClasses.id = headClasses.id;
  }
})
const classesSelect = ref<typeof ClassesSelect | null>(null)
const fetchStuListService = async (classesId: MaybeRef<number | null>) => {
  const id = unref(classesId)
  if (!id) throw new Error("id not found!")
  const result = await ApiFindClassesStudent(id);
  return result.data;
};
const {data: classesDetail} = useRequest(() => fetchStuListService(activeClasses.id), {
  cacheKey: `stuList-${activeClasses.id}`,
  cacheTime: 300000,
  refreshDeps: [() => activeClasses.id],
  ready: computed(() => !!unref(activeClasses.id)),
  async onSuccess(data) {
    if (!classesSelect.value) {
      return
    }
    classesSelect.value.setActive(`${data.name}-${data.id}`)
  }
})
const onSelectClasses = (val: string) => {
  const id = getIdFromKey(val);
  if (!id) {
    return;
  }
  activeClasses.id = id;
};
</script>
<template>
  <n-layout>
    <n-layout-header embedded style="padding: 24px; display: flex">
      <ClassesSelect ref="classesSelect" @selectUpdate="onSelectClasses"/>
      <n-button @click="$router.push('join')" v-role="Role.student">加入班级</n-button>
      <n-button @click="$router.push('create')" v-role="Role.teacher">创建班级</n-button>
    </n-layout-header>
    <n-layout-content class="classes-layout-content">
      <n-card hoverable>
        <n-descriptions label-placement="left" :title="get(classesDetail,'name')">
          <n-descriptions-item>
            <template #label>创建人（老师）</template>
            {{ get(classesDetail, "created_by.nickname", "未知") }}
          </n-descriptions-item>
        </n-descriptions>
      </n-card>

      <n-card hoverable title="学生列表">
        <n-data-table
            :border="true"
            :columns="classesStore.studentColumn"
            :data="get(classesDetail,'users',[])"
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
