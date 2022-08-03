<template>
  <n-card class="mt-2">
    <n-layout>
      <n-layout-header class="pb-4">
        <span class="text-xl">{{ Q.content }}</span>
      </n-layout-header>
      <n-layout-content>
        <n-space v-if="Q.answer" class="check-box" vertical>
          <n-checkbox v-for="a in Q.answer" size="large"
                      :class=" {
                  surplus: AnswerType.surplus === a.answerType,
                  loss: AnswerType.loss === a.answerType,
                          }"
                      :checked="a.answerType===AnswerType.right||a.answerType===AnswerType.loss">
            {{ a.content }}
          </n-checkbox>
        </n-space>
      </n-layout-content>
      <n-space class="mt-4 bg-white">
        解析：{{ Q.resolution || '暂无' }}
      </n-space>
    </n-layout>
  </n-card>
</template>

<script lang="ts" setup>
import {ChoiceQAnswerRecord} from "@/types/api-record";

enum AnswerType {
  right,
  surplus,
  loss,
  normal
}

const props = defineProps<{
  record: ChoiceQAnswerRecord
}>()
const answerRecord = props.record;
const Q = ref({})
const userAnswer = answerRecord.userAnswer;
const standAnswer = answerRecord.standAnswer.answer.map(item => {
  const id = item.id;
  let answerType = null
  const isAnswerTruly = item.is_answer;
  if (userAnswer.includes(id)) {
    answerType = isAnswerTruly ? AnswerType.right : AnswerType.surplus
  } else {
    answerType = isAnswerTruly ? AnswerType.loss : AnswerType.normal
  }
  return {
    id: item.id,
    content: item.content,
    answerType
  }
});
Q.value = {
  content: answerRecord.standAnswer.content,
  answer: standAnswer,
  resolution: answerRecord.standAnswer.resolution
}
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