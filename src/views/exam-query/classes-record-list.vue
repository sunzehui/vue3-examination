<template>
  <n-card>
    <template #header>
      <n-space justify="start" class="flex items-baseline">
        <n-h3>
          {{ examData.classesName }}
        </n-h3>
        <n-h4>
          {{ examData.roomName }}
        </n-h4>
        <n-h3> 平均分：{{ scoreAvg }}</n-h3>
        <n-h3> 标准差：{{ scoreSD }}</n-h3>
      </n-space>
    </template>
    <n-space vertical :size="12">
      <n-data-table ref="table" :columns="columns" :data="data"/>
    </n-space>
    <!-- Form -->
    <el-dialog v-model="dialogFormVisible" title="学生成绩">
      <ExamRecordComponent :record_id="recordId"/>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialogFormVisible = false"
          >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </n-card>
</template>

<script setup lang="ts">
import {
  ApiGetClassesExamRecord,
  ApiGetExamRecord,
  ApiGetExamStatistic,
} from "@/apis/exam-record";
import {DataTableColumns, NButton} from "naive-ui";
import {SanitizeExamRecord} from "@/types/api-record";
import {get, map, toNumber} from "lodash";
import dayjs from "dayjs";
import {getLocalTimeFormat} from "@/utils/tools";
import {useUserStore} from "@/store/user";
import _ from "lodash";
import {getScoreSD} from "@/utils/tools";

const data = ref<any[]>([]);
const columns = ref<DataTableColumns>([]);
const router = useRouter();
const examData = ref({});
const recordId = ref<number>();
const openDialog = (record_id: number) => {
  console.log(record_id)
  recordId.value = record_id;
  dialogFormVisible.value = true;
};

const route = useRoute();
const allScore = ref<any>([]);
watchEffect(() => {
  allScore.value = unref(data).map((item) => item.score);
});

const scoreSD = computed(() => {
  return getScoreSD(unref(allScore));
});

const scoreAvg = computed(() => {
  return _.mean(unref(allScore));
});

async function init() {
  const room_id = toNumber(route.query.room_id);
  const classes_id = toNumber(route.query.classes_id);
  const examRecordListResult = await ApiGetClassesExamRecord(
      room_id,
      classes_id
  );

  data.value = examRecordListResult.data.map((item) => {
    examData.value = {
      roomName: item?.exam_room?.name,
      classesName: item?.classes?.name,
    };
    return {
      id: item.id,
      user_name: get(item, "user.nickname"),
      score: item.score,
      create_time: getLocalTimeFormat(get(item, "create_time")),
      submit_time: getLocalTimeFormat(get(item, "submit_time")),
    };
  });

  columns.value = [
    {
      title: "学生姓名",
      key: "user_name",
    },
    {
      title: "分数",
      key: "score",
      sorter: (row1, row2) => row1.score - row2.score,
    },
    {
      title: "进入考场时间",
      key: "create_time",
      defaultSortOrder: "ascend",
      sorter: (a, b) => {
        return +dayjs(a.create_time) - +dayjs(b.create_time);
      },
    },
    {
      title: "交卷时间",
      key: "submit_time",
      sorter: (a, b) => {
        return +dayjs(a.submit_time) - +dayjs(b.submit_time);
      },
    },
    {
      title: "操作",
      key: "actions",
      render(row) {
        return h(
            NButton,
            {
              strong: true,
              tertiary: true,
              size: "small",
              onClick: () => openDialog(row.id),
            },
            {default: () => "答题记录"}
        );
      },
    },
  ];
}

onMounted(init);
const tableRef = ref(null);

const dialogFormVisible = ref(false);

const table = tableRef;
</script>

<style scoped></style>
