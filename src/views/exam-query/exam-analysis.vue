<template>

  <v-chart class="chart" :option="option"/>
</template>

<script setup lang="ts">
import {use} from 'echarts/core';
import {CanvasRenderer} from 'echarts/renderers';
import {PieChart, LineChart} from 'echarts/charts';
import {
  TitleComponent,
  TitleComponentOption,
  ToolboxComponent,
  ToolboxComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  GridComponent,
  GridComponentOption,
  LegendComponent,
  LegendComponentOption,
  MarkLineComponent,
  MarkLineComponentOption,
  MarkPointComponent,
  MarkPointComponentOption
} from 'echarts/components';
import VChart, {THEME_KEY} from 'vue-echarts';
import {ref, defineComponent} from 'vue';
import {UniversalTransition} from "echarts/features";

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
  UniversalTransition
]);
const option = ref({
  title: {
    text: '分数统计'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {},
  toolbox: {
    show: true,
    feature: {
      dataZoom: {
        yAxisIndex: 'none'
      },
      dataView: {readOnly: false},
      magicType: {type: ['line', 'bar']},
      restore: {},
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [10, 20, 30, 40, 50, 60, 70],
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value} 人'
    }
  },
  series: [
    {
      name: 'Lowest',
      type: 'line',
      data: [1, 3, 2, 5, 3, 2, 0],
      markPoint: {
        // aAxis index
        // yAxis value
        data: [{name: '周最低', value: 2, xAxis: 2, yAxis: 2}]
      },
      markLine: {
        data: [
          {type: 'average', name: 'Avg'},
          [
            {
              symbol: 'none',
              x: '90%',
              yAxis: 'max'
            },
            {
              symbol: 'circle',
              label: {
                position: 'start',
                formatter: 'Max'
              },
              type: 'max',
              name: '最高点'
            }
          ]
        ]
      }
    }
  ]
});

</script>

<style scoped>

</style>