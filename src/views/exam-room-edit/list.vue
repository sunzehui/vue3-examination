<script setup lang="ts">
import {ApiGetExamRoom} from "@/apis/exam-room";
import ClassesSelect from '@/components/classes-select.vue'
import {getIdFromKey, getLocalTimeFormat, getTime} from "@/utils/tools";
import dayjs from "dayjs";
import duration from 'dayjs/plugin/duration'
import {useRequest} from "vue-request";

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

const tableData = computed(() => {
      const _tableData = unref(examRoomList) ?? []
      return _tableData.map(item => {
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
      })
    }
)
const loadExamRoomService = async (classesId?: number) => {
  const examRoomResult = await ApiGetExamRoom(classesId)
  return examRoomResult.data
}
const classesId = ref();
const {data: examRoomList, runAsync, loading} = useRequest(loadExamRoomService, {
  refreshDeps: [classesId]
})
const classesSelectRef = ref<typeof ClassesSelect | null>(null)
const resetList = async () => {
  await runAsync()
  if (!classesSelectRef.value) {
    await nextTick()
    return;
  }
  classesSelectRef.value.setValueNone()
}
const onSelectClasses = (val: string) => {
  const id = getIdFromKey(val);
  if (!id) {
    return
  }
  classesId.value = id;
}

</script>

<template>
  <n-card title="所有考试">
    <n-space vertical size="large">
      <n-button-group>
        <ClassesSelect ref="classesSelectRef" @selectUpdate="onSelectClasses"/>
        <n-button type="primary" @click="$router.push({name:'exam-create'})">
          创建考试
        </n-button>
        <n-button type="info" @click="resetList">
          刷新列表
        </n-button>
      </n-button-group>

      <n-data-table
          :columns="columns"
          :data="tableData"
          :max-height="444"
          :loading="loading"
      />
    </n-space>
  </n-card>
</template>


