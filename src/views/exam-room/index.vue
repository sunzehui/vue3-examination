<script lang="ts" setup>
import ClassesSelect from '@/components/classes-select.vue';
import {ApiGetExamRoom} from "@/apis/exam-room";
import {ExamRoom} from "@/types/api-exam-room";
import {ElMessage} from "element-plus";
import {useRouter} from 'vue-router'
import {Role} from '@/types/api-user'
import {useSocket} from "@/composables/useSocket";
import {Resp} from "@/types/api";

const {socket} = useSocket()
const router = useRouter();

const interval = setInterval(() => {
  socket.emit('findAllExamClock', (examRoomResult: Resp<ExamRoom[]>) => {
    examRoomList.value = (examRoomResult.data)
    console.log(examRoomResult.data)
  })
}, 3000)
onUnmounted(() => {
  clearInterval(interval)
})

const go2CreateExam = () => {
  router.push({name: 'exam-create'});
}
const handleSelectClasses = async (val: string) => {
  try {
    const classesId = Number(val.split('-')[1]);
    const examRoomResult = await ApiGetExamRoom(classesId)
    examRoomList.value = (examRoomResult.data)
  } catch (e: any) {
    ElMessage.error({
      message: e.message
    })
  }
}
const examRoomList = ref<ExamRoom[] | null>(null);
onMounted(async () => {
  const examRoomResult = await ApiGetExamRoom()
  examRoomList.value = (examRoomResult.data)
})
</script>

<template>

  <n-scrollbar>
    <ClassesSelect @selectUpdate="handleSelectClasses"/>
    <n-button @click="go2CreateExam" v-role="Role.teacher">创建考试</n-button>
    <div class="card-container">
      <template v-for="exam in examRoomList" :key="exam.id">
        <ExamCard :exam="exam"/>
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
