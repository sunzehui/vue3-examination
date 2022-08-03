<template>
  <n-layout content-style="padding:2rem">
    <n-layout-header class="grid grid-cols-2 items-end">
      <n-space class="flex my-2 items-end ">
        <span class="text-2xl font-bold">考试名称</span>
        <span>试卷名称</span>
      </n-space>
      <span class="text-2xl text-center">得分：{{ paperData.totalScore }}</span>
      <n-alert :show-icon="false" class="mt-2 col-span-2 check-box">
        <n-checkbox checked/>
        ：正确答案并且已选<br>
        <n-checkbox class="surplus"/>
        ：多选或错选<br>
        <n-checkbox class="loss"/>
        ：少选
      </n-alert>

    </n-layout-header>
    <n-layout-content>
      <template v-if="recordList" v-for="record in recordList">
        <RecordChoiceQ :record="record" v-if="record.type === QType.choice" :key="record.id"/>
        <RecordFillblankQ :record="record" v-if="record.type===QType.fill_blank" :key="record.id"/>
      </template>


    </n-layout-content>
  </n-layout>

</template>

<script setup lang="ts">
import {ApiGetExamRecord} from "@/apis/exam-record";
import {ExamRecord} from "@/types/api-record";
import RecordChoiceQ from '@/components/record-choice-q.vue'
import {ChoiceQAnswerRecord} from "@/types/api-record";
import RecordFillblankQ from "@/components/record-fillblank-q.vue";
import {QType} from "@/types/api-exam-paper";

const Q = ref<ChoiceQAnswerRecord>()
const route = useRoute()
const rid = +route.params.record_id
const paperData = ref<any>([])

const recordList = ref([])
onMounted(async () => {

  const res = await ApiGetExamRecord(rid)
  paperData.value = JSON.parse((res.data as ExamRecord).answer);
  recordList.value = unref(paperData)['answerRecord']

  console.log(unref(Q))
})

</script>

<style scoped lang="scss">
.check-box {
  .loss {
    :deep(.n-checkbox-box) {
      background-color: #1e90ff !important;
    }
  }

  .surplus {
    :deep(.n-checkbox-box) {
      background-color: red !important;
    }
  }
}
</style>