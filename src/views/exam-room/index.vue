<script lang="ts" setup>
import {TagStatus} from "@/enum/tag-status";
import {useUserStore} from "@/store/user";
import ClassesSelect from '@/components/classes-select.vue';
import {ApiGetExamRoom} from "@/apis/exam-room";
import {ExamRoom} from "@/types/api-exam-room";
import {getLocalTimeUnix, getTagStatus} from "@/utils/tools";
import {ElMessage} from "element-plus";
import {useExamStore} from "@/store/exam";
import {useRouter} from 'vue-router'
import {Role} from '@/types/api-user'

const router = useRouter();

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
  console.log(examRoomList.value)
})
const localTime = computed(() => getLocalTimeUnix)
const tagStatus = computed(() => getTagStatus)
const goExamRoom = (id: number) => {
  router.push({name: 'exam', params: {id}})
}
const goEditExamRoom = (id: number) => {
  router.push({name: 'exam-room-edit'})
}
</script>

<template>

  <n-scrollbar>
    <ClassesSelect @selectUpdate="handleSelectClasses"/>
    <n-button @click="go2CreateExam" v-role="Role.teacher">创建考试</n-button>
    <div class="card-container">

      <n-card v-for="exam in examRoomList" class="exam-card" :title="exam.name+'-'+exam.id">
        <template #header-extra> {{ exam.for_classes.name + '-' + exam.for_classes.id }}</template>
        <span>创建人：{{ exam.created_by.nickname }}</span>
        <p>
          {{ exam.desc }}
        </p>
        <template #footer>
          <NSpace justify="end">
            ⏰
            <n-time :time="localTime(exam.begin_time)" type="date"/>
            <n-divider vertical/>

            <n-time :time="localTime(exam.begin_time)" format="hh:mm" type="datetime"/>
            -
            <n-time :time="localTime(exam.end_time)" format="hh:mm" type="datetime"/>
          </NSpace>
        </template>
        <template #action>
          <n-space justify="space-between">
            <SwitchTag :status="tagStatus(exam.begin_time,exam.end_time)"/>
            <n-space justify="end">
              <n-button @click="goExamRoom(exam.id)" v-role="Role.student">进入考试</n-button>
              <n-button @click="goEditExamRoom(exam.id)" v-role="Role.teacher">编辑考试</n-button>
            </n-space>
          </n-space>
        </template>
      </n-card>
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
