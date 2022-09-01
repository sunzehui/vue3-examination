<template>
  <n-layout content-style="padding:2rem" v-if="paperData">
    <n-layout-header class="grid items-end grid-cols-2">
      <n-space class="flex items-end my-2">
        <span class="text-2xl font-bold">{{ get(paperData, 'exam_room.name') }}</span>
        <span>{{ get(paperData, 'exam_paper.name') }}</span>
      </n-space>
      <span class="text-2xl text-center">得分：{{ get(paperData, 'score') }}</span>
      <n-alert :show-icon="false" class="col-span-2 mt-2 check-box">
        <n-checkbox checked/>
        ：正确答案并且已选<br/>
        <n-checkbox class="surplus"/>
        ：多选或错选<br/>
        <n-checkbox class="loss"/>
        ：少选
      </n-alert>
    </n-layout-header>
    <n-layout-content>
      <template v-if="recordList" v-for="record in recordList">
        <RecordChoiceQ
            :record="record"
            v-if="record.type === QType.choice"
            :key="record.id"
        />
        <RecordFillblankQ
            :record="record"
            v-if="record.type === QType.fill_blank"
            :key="record.id"
        />
      </template>
    </n-layout-content>
  </n-layout>
</template>

<script lang="ts" setup>
import {ApiGetExamRecord} from "@/apis/exam-record";
import {get} from 'lodash-es'
import RecordChoiceQ from "@/components/record-choice-q.vue";
import RecordFillblankQ from "@/components/record-fillblank-q.vue";
import {QType} from "@/types/api-exam-paper";

const props = defineProps<{
  record_id: number;
}>();
const paperData = ref<any>();

const init = async () => {
  const res = await ApiGetExamRecord(unref(rid));
  paperData.value = res.data;
  recordList.value = JSON.parse(unref(paperData).answer);
};

const rid = ref(+props.record_id);
watch(
    () => props.record_id,
    async (value) => {
      rid.value = value;
      console.log(rid.value)
      await init();
    }
);
console.log(rid)
const recordList = ref([]);
onMounted(init);
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
