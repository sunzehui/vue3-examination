<template>
  <n-card class=" mt-2">
    <div class="text-xl w-full pb-4">
      {{ Q.content }}
    </div>
    <div class="answer grid gap-2 grid-cols-2 ">
      <div>
        我的答案
      </div>
      <div>
        正确答案
      </div>
      <template v-for="qa in Q.answer">
        <n-input :status="qa.truly||'error'" :value="qa.m_a"/>
        <n-input :value="qa.s_a"/>
      </template>

    </div>
    <n-space class="mt-4">
      解析：{{ Q.resolution || '暂无' }}
    </n-space>
  </n-card>
</template>

<script lang="ts" setup>
import {FillBlankQRecord} from "@/types/api-record";

const props = defineProps<{
  record: FillBlankQRecord
}>()
const answerRecord = props.record;
const Q = ref({})
console.log(answerRecord)
const standAnswer = answerRecord.standAnswer.answer.map(item => {
  const myAnswer = answerRecord.userAnswer.find(ua => ua.pos == item.pos) || {}
  return {
    id: item.id,
    s_a: item.content,
    pos: item.pos,
    m_a: myAnswer?.content || '',
    truly: myAnswer?.isAnswerTruly ?? false
  }
}).sort((a, b) => a.pos - b.pos);
Q.value = {
  content: answerRecord.standAnswer.content,
  answer: standAnswer,
  resolution: answerRecord.standAnswer.resolution
}

</script>

<style scoped>

</style>