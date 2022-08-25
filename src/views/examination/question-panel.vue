<template>
  <ChoiceQ :q="Q" :roomId="roomId" v-if="choiceQShow" :key="Q.id"/>
  <FillBlankQ :q="Q" :roomId="roomId" v-if="fillBlankShow" :key="Q.id"/>
</template>

<script lang="ts" setup>
import ChoiceQ from '@/components/choice-q.vue';
import FillBlankQ from "@/components/fillblank-q";
import {ApiGetQuestion} from "@/apis/question";
import {QType, Question} from "@/types/api-exam-paper";
import {useExamStore} from "@/store/exam";
import {get, isEmpty, isNil} from "lodash-es";

const route = useRoute()
const Q = ref<Question | null>(null)
const roomId = Number(route.params.rid);
const fetchQuestion = async (id: number) => {
  if (isNaN(id)) return;
  const questionResult = await ApiGetQuestion(id)
  Q.value = questionResult.data;
}
const examStore = useExamStore()

const choiceQShow = computed(() => Q.value && Q.value.type === QType.choice)
const fillBlankShow = computed(() => Q.value && Q.value.type === QType.fill_blank)

watch(() => route.params.idx, async () => {
  const val = +get(route, 'params.idx', null);
  if (isNil(val) || val < 0) {
    // 不合法路径
    return;
  }
  if (isEmpty(examStore.examQList)) return
  const qid = get(examStore, `examQList[${val}].id`)
  if (!qid) return
  await fetchQuestion(qid)
}, {immediate: true})

defineExpose({
  ChoiceQ, FillBlankQ
})
</script>

<style scoped>

</style>