<template>
  <n-card title="考试记录">
    <n-space vertical :size="12">
      <n-data-table
          ref="table"
          :columns="columns"
          :data="data"
      />
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import {ApiGetExamRecord} from '@/apis/exam-record'
import {DataTableColumns, NButton} from "naive-ui";
import {SanitizeExamRecord} from "@/types/api-record";
import {get, map} from "lodash";
import dayjs from "dayjs";
import {getLocalTimeFormat} from "@/utils/tools";

const data = ref<SanitizeExamRecord[]>([])
const columns = ref<DataTableColumns>([])
const router = useRouter()
const go2Detail = (record_id: number) => {
  console.log(record_id)
  router.push({name: 'exam-record', params: {record_id}})
}

async function init() {
  const examRecordListResult = await ApiGetExamRecord()
  data.value = examRecordListResult.data.map(item => {
    return {
      id: item.id,
      exam_name: get(item, 'exam_room.name'),
      paper_name: get(item, 'exam_paper.name'),
      classes: `${get(item, 'exam_room.for_classes.name')}-${get(item, 'exam_room.for_classes.id')}`,
      score: item.score,
      begin_time: getLocalTimeFormat(get(item, 'exam_room.begin_time')),
      end_time: getLocalTimeFormat(get(item, 'exam_room.end_time'))
    }
  });

  columns.value = [
    {
      title: '考试名称',
      key: 'exam_name',

    },
    {
      title: '试卷名称',
      key: 'paper_name',
    },
    {
      title: '所在班级',
      key: 'classes',
      defaultFilterOptionValues: map(unref(data), 'classes'),
      filterOptions:
          map(unref(data), item => ({
            label: item.classes, value: item.classes
          })),
      filter(value, row) {
        return ~row.classes.indexOf(value)
      }
    }, {
      title: '分数',
      key: 'score',
      sorter: (row1, row2) => row1.score - row2.score
    },
    {
      title: "开考时间",
      key: 'begin_time',
      defaultSortOrder: 'ascend',
      sorter: (a, b) => {
        return +dayjs(a.begin_time) - (+dayjs(b.begin_time))
      }
    },
    {
      title: '停考时间',
      key: "end_time",
      sorter: (a, b) => {
        return +dayjs(a.end_time) - (+dayjs(b.end_time))
      }
    },
    {
      title: '操作',
      key: 'actions',
      render(row) {
        return h(
            NButton,
            {
              strong: true,
              tertiary: true,
              size: 'small',
              onClick: () => go2Detail(row.id)
            },
            {default: () => '查看'}
        )
      }
    }
  ]

}

onMounted(init)
const tableRef = ref(null)


const table = tableRef;
</script>

<style scoped>

</style>