<script lang="ts" setup>
import ClassesSelect from "@/components/classes-select.vue";
import {ApiGetExamRoom} from "@/apis/exam-room";
import {useRouter} from "vue-router";
import {Role} from "@/types/api-user";
import {useRequest} from "vue-request";
import {getIdFromKey} from "@/utils/tools";


const go2CreateExam = () => {
  const router = useRouter();
  router.push({name: "exam-create"});
};
const getExamRoomService = async () => {
  const result = await ApiGetExamRoom(classesId);
  if (!result.data) return [];
  return result.data;
};

const classesId = ref<null | number>(null);
const {data: examList, mutate} = useRequest(getExamRoomService, {
  cacheKey: "examRoomList",
  cacheTime: 300000, // 5 minutes
  refreshDeps: [classesId],
  pollingInterval: 3000,
});
const handleSelectClasses = (val: string) => classesId.value = getIdFromKey(val)
</script>

<template>
  <n-scrollbar>
    <ClassesSelect @selectUpdate="handleSelectClasses"/>
    <n-button @click="go2CreateExam" v-role="Role.teacher">创建考试</n-button>
    <div class="card-container">
      <template v-for="exam in examList" :key="exam.id">
        <ExamCard :exam="exam"/>
      </template>
    </div>
    <n-empty v-if="!(examList && examList.length)" description="老师未创建考试">
      <template #extra>
        <n-button size="small">
          查看个人信息
        </n-button>
      </template>
    </n-empty>
  </n-scrollbar>
</template>

<style lang="scss" scoped>
.card-container {
  @apply grid justify-center justify-items-center gap-4;
  @apply grid-cols-4;
  @apply none:grid-cols-1;
  @apply md:grid-cols-2;
  @apply lg:grid-cols-2;
  @apply 2xl:grid-cols-3;
  @apply 3xl:grid-cols-4;
  @apply mt-4;
}

.exam-card {
  width: 350px;
  height: 260px;
}
</style>
