<template>
  <n-card class="exam-card" :title="exam.name+'-'+exam.id">
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
        <SwitchTag :status="thisTagStatus"/>
        <n-space justify="end">
          <n-button @click="goExamRoom(exam.id)" v-role="Role.student">进入考试</n-button>
          <n-button @click="goEditExamRoom(exam.id)" v-role="Role.teacher">编辑考试</n-button>
        </n-space>
      </n-space>
    </template>
  </n-card>
</template>

<script setup lang="ts">
import {ExamRoom} from "@/types/api-exam-room";
import {getLocalTimeUnix, getTagStatus} from "@/utils/tools";
import {Role} from '@/types/api-user'
import {isNil} from "lodash";
import {TagStatus} from "@/enum/tag-status";
import {useDialog} from "naive-ui";

const router = useRouter()
const props = defineProps<{
  exam: ExamRoom
}>()
const thisTagStatus = ref(TagStatus.wait)
const exam = ref(props.exam)

watch(() => props.exam, (val) => {
  if (isNil(val)) return;
  exam.value = val
  thisTagStatus.value = getTagStatus(val.begin_time, val.end_time)
}, {immediate: true})

const localTime = computed(() => getLocalTimeUnix)
const dialog = useDialog()

const goExamRoom = (id: number) => {
  const status = TagStatus.on ?? unref(thisTagStatus)

  if (status === TagStatus.wait) {
    dialog.error({
      content: "考试未开始哦！请耐心等待！"
    })
  } else if (status === TagStatus.off) {
    dialog.error({
      content: "考试已结束，请去考试记录查询成绩！"
    })
  } else if (status === TagStatus.on) {
    router.push({name: 'exam', params: {rid: id}})
  }
}
const goEditExamRoom = (id: number) => {
  router.push({name: 'exam-room-edit'})
}
</script>

<style scoped>

</style>