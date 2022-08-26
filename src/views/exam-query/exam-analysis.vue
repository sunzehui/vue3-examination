<script setup lang="ts">
import {use} from "echarts/core";
import {CanvasRenderer} from "echarts/renderers";
import {LineChart} from "echarts/charts";
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  MarkPointComponent,
} from "echarts/components";
import VChart from "vue-echarts";
import {UniversalTransition} from "echarts/features";
import {
  ApiGetClassesExamRecord,
} from "@/apis/exam-record";
import {DataTableColumns} from "naive-ui";
import {get, groupBy, keys, maxBy, meanBy, minBy} from "lodash-es";
import {getScoreSD} from "@/utils/tools";

use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  MarkPointComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
]);

const recordData = ref<any>([])
const data = ref<any[]>([]);
const columns = ref<DataTableColumns>([]);
const route = useRoute();
const allScore = ref<any>([]);

watchEffect(() => {
  allScore.value = unref(recordData).map((item) => item.score);
});

function getDataList(groupData: { number: Array<any> }, totalStu: number) {
  let dataList: Record<any, number>[] = [];
  Object.entries(groupData).map((item) => {
    const scoreNum = item[1].length;
    const freq = scoreNum / totalStu;
    dataList.push({
      scoreRange: item[0],
      scoreNum,
      freq,
    });
  });
  return dataList;
}

async function init() {
  const room_id = Number(route.query.room_id);
  const classes_id = Number(route.query.classes_id);
  const examRecordListResult = await ApiGetClassesExamRecord(
      room_id,
      classes_id
  );
  recordData.value = examRecordListResult.data.map((item) => {
    return {
      id: item.id,
      user_name: get(item, "user.nickname"),
      score: item.score,
    };
  });
  const recordList = unref(recordData)
  const groupData = _(recordList)
      .groupBy((item) => parseInt('' + (item.score) / 10, 10) + '0')
      .value();
  const totalStu = recordList.length;

  data.value = getDataList(groupData, totalStu);
  columns.value = [
    {
      title: "分数段",
      key: "scoreRange",
    },
    {
      title: "人数",
      key: "scoreNum",
      sorter: (row1, row2) => row1.score - row2.score,
    },
    {
      title: "频率/比重",
      key: "freq",
      sorter: (row1, row2) => row1.freq - row2.freq,
    },
  ];
}

onMounted(init);

// 分数统计以及绘制表格
const tableRef = ref(null);
const scoreGroup = computed(() => groupBy((unref(allScore)), (item) => {
  return parseInt('' + (item) / 10, 10) + '0'
}))
const scoreRange = computed(() => keys((unref(scoreGroup))));
const scoreStuNum = computed(() => {
  return (unref(scoreGroup)).map((item) => item.length)
});
const scoreMax = computed(() => maxBy((unref(recordData)), 'score'))
const scoreMin = computed(() => minBy((unref(recordData)), 'score'))
const scoreAvg = computed(() => meanBy((unref(recordData)), 'score'))
const scoreSD = computed(() => getScoreSD(allScore.value).toFixed(2))
const table = tableRef;

const option = ref({
  title: {
    text: "分数统计",
  },
  tooltip: {
    trigger: "axis",
  },
  legend: {},
  toolbox: {
    show: true,
    feature: {
      dataZoom: {
        yAxisIndex: "none",
      },
      dataView: {readOnly: false},
      magicType: {type: ["line", "bar"]},
      restore: {},
      saveAsImage: {},
    },
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: scoreRange,
  },
  yAxis: {
    type: "value",
    axisLabel: {
      formatter: (value: string) => `${parseInt(value, 10)} 人`,
    },
  },
  series: [
    {
      name: "人数",
      type: "line",
      data: scoreStuNum,
    },
  ],
});
</script>

<template>
  <v-chart class="chart" :option="option"/>
  <n-card>
    <n-grid cols="2">
      <n-gi>
        <n-h3 v-if="scoreMax">最高分：{{ scoreMax.user_name }} {{ scoreMax.score }}分</n-h3>
        <n-h3 v-if="scoreMin">最低分：{{ scoreMin.user_name }} {{ scoreMin.score }}分</n-h3>
      </n-gi>
      <n-gi>
        <n-h3>平均分：{{ scoreAvg }}</n-h3>
        <n-h3>标准差：{{ scoreSD }}</n-h3>
      </n-gi>
    </n-grid>
    <n-space vertical :size="12">
      <n-data-table ref="table" :columns="columns" :data="data"/>
    </n-space>
  </n-card>
</template>
