<template>
  <n-card title="所有试卷">
    <n-space vertical size="large">
      <n-button-group>
        <n-button type="primary" @click="$router.push({name:'exam-paper-create'})">
          创建试卷
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
import {ExamRoom} from "@/types/api-exam-room";

import {getLocalTimeFormat} from "@/utils/tools";
import dayjs from "dayjs";
import duration from 'dayjs/plugin/duration'
import {ApiGetMyExamPaper} from "@/apis/exam-paper";
import {NButton} from "naive-ui";

dayjs.extend(duration)
const router = useRouter()
const columns = [
  {
    title: '编号',
    key: 'id'
  }, {
    title: '试卷名',
    key: 'name'
  },
  {
    title: '创建时间',
    key: 'createTime'
  },
  {
    title: "操作",
    key: 'actions',
    render(row) {
      return h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: 'small',
            onClick: () => router.push({name: 'exam-paper-edit', params: {id: row.id}})
          },
          {default: () => '编辑'}
      )
    }
  }
]
const examRoomList = ref<ExamRoom[]>([]);

const tableData = computed(() => unref(examRoomList).map(item => {
          const createTime = getLocalTimeFormat(item.create_time);
          return {
            name: item.name,
            id: item.id,
            createTime,
          }
        }
    )
)
const loadExamRoom = async (classesId?: number) => {
  const examRoomResult = await ApiGetMyExamPaper()
  examRoomList.value = examRoomResult.data
}
onMounted(async () => {
  await loadExamRoom()
})
</script>

<style scoped>

</style>