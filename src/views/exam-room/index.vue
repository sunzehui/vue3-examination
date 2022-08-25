<script lang="ts" setup>
import ClassesSelect from "@/components/classes-select.vue";
import { ApiGetExamRoom } from "@/apis/exam-room";
import { ExamRoom } from "@/types/api-exam-room";
import { useRouter } from "vue-router";
import { Role } from "@/types/api-user";
import { useSocket } from "@/composables/useSocket";
import { Resp } from "@/types/api";
import { useRequest } from "vue-request";
import { last } from "lodash";
const { socket } = useSocket();

const interval = setInterval(() => {
  socket.emit("findAllExamClock", (examRoomResult: Resp<ExamRoom[]>) => {
    mutate(examRoomResult.data);
  });
}, 3000);
onUnmounted(() => {
  clearInterval(interval);
});

const go2CreateExam = () => {
  const router = useRouter();
  router.push({ name: "exam-create" });
};
const getExamRoomService = async () => {
  const result = await ApiGetExamRoom(unref(classesId));
  if (result.data) return result.data;
  return [];
};

const classesId = ref<undefined | number>();
const { data: examList, mutate } = useRequest(getExamRoomService, {
  cacheKey: "examRoomList",
  cacheTime: 300000, // 5 minutes
  refreshDeps: [classesId],
});
const handleSelectClasses = async (val: string) => {
  classesId.value = Number(last(val.split("-")));
};
</script>

<template>
  <n-scrollbar>
    <ClassesSelect @selectUpdate="handleSelectClasses" />
    <n-button @click="go2CreateExam" v-role="Role.teacher">创建考试</n-button>
    <div class="card-container">
      <template v-for="exam in examList" :key="exam.id">
        <ExamCard :exam="exam" />
      </template>
    </div>
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
