<template>
  <n-card title="所有考试">
    <n-space vertical size="large">
      <n-button-group>
        <ClassesSelect @selectUpdate="onSelectClasses"/>
        <n-button type="primary" @click="$router.push({name:'exam-create'})">
          创建考试
        </n-button>
        <n-button type="info" @click="loadExamRoom">
          刷新列表
        </n-button>
      </n-button-group>

      <n-data-table
          :columns="columns"
          :data="tableData"
          :max-height="444"
      />
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import {ApiGetExamRoom} from "@/apis/exam-room";
import ClassesSelect from '@/components/classes-select.vue'
import {ExamRoom} from "@/types/api-exam-room";

import {getIdFromKey, getLocalTimeFormat, getLocalTimeUnix, getTime} from "@/utils/tools";
import dayjs from "dayjs";
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

const columns = [
  {
    title: '考试名',
    key: 'name'
  },
  {
    title: '使用班级',
    key: 'usageClasses'
  },
  {
    title: '考试日期',
    key: 'dateRange'
  },
  {
    title: '考试时长',
    key: 'timeTotal'
  },
  {
    title: '创建时间',
    key: 'createTime'
  },

]
const examRoomList = ref<ExamRoom[]>([]);

const tableData = computed(() => unref(examRoomList).map(item => {
          const [startTime, startTimeUnix] = getTime(item.begin_time)
          const [endTime, endTimeUnix] = getTime(item.end_time)
          const dateRange = `${startTime} - ${endTime}`

          const timeTotal = dayjs.duration(endTimeUnix - startTimeUnix, 'milliseconds').asMinutes() + '分钟'
          const createTime = getLocalTimeFormat(item.create_time);
          return {
            name: item.name,
            usageClasses: item?.for_classes?.name || '未知',
            dateRange,
            timeTotal,
            createTime,
          }
        }
    )
)
const loadExamRoom = async (classesId?: number) => {
  const examRoomResult = await ApiGetExamRoom(classesId)
  examRoomList.value = examRoomResult.data
}
const onSelectClasses = (val: string) => {
  const id = getIdFromKey(val);
  if (!id) {
    return
  }
  loadExamRoom(id);
}
onMounted(async () => {
  await loadExamRoom()
})
</script>

<style scoped>

</style>