<template>
  <n-form
      ref="formRef"
      :model="model"
      :disabled="false"
      v-if="!examStore.isQListEmpty"
  >

    <n-form-item
        v-for="Q in choiceQ"
        :key="Q.id"
    >
      <ChoiceQ :q="Q"/>
    </n-form-item>

    <n-form-item
        v-for="Q in fillBlankQ"
        :key="Q.id"
    >
      <FillBlankQ :q="Q"/>
    </n-form-item>

  </n-form>
  <n-empty class="mt-20" description="老师未添加题目" v-if="examStore.isQListEmpty">
    <template #extra>
      <n-button size="small" @click="$router.push({name:'exam-panel'})">
        返回面板
      </n-button>
    </template>
  </n-empty>
</template>

<script setup lang="ts">
import {useExamStore} from "@/store/exam";
import {get, isNil} from "lodash";
import {QType, Question} from "@/types/api-exam-paper";
import ChoiceQ from '@/components/choice-q.vue'
import FillBlankQ from "@/components/fillblank-q";

const model = ref<Question[]>([])
const route = useRoute();
const examStore = useExamStore();
const choiceQ = ref<Question[]>([]);
const fillBlankQ = ref<Question[]>([])

onMounted(async () => {
  const examRoomId = get(route, 'params.id', null);
  if (isNil(examRoomId)) return;
  await examStore.getExamPaperByRoomId(examRoomId);
  model.value = examStore.examQList;
  choiceQ.value = unref(model).filter((Q: Question) => Q.type === QType.choice);
  fillBlankQ.value = unref(model).filter((Q: Question) => Q.type === QType.fill_blank);
})


</script>

<style scoped>

</style>