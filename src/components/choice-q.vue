<template>
  <n-space justify="center" vertical>
      <span class="text-lg">
        {{ Q.content }}
      </span>
    <n-checkbox-group @update:value="handleCheckBoxUpdate" :value="examStore.thisChoiceValue(Q.id)">
      <n-space justify="start" vertical>
        <n-checkbox :value="A.id" size="large" v-for="A in Q.answer" :key="A.id">
          {{ A.content }}
        </n-checkbox>
      </n-space>
    </n-checkbox-group>
  </n-space>
</template>

<script setup lang="ts">
import {QType, Question} from "@/types/api-exam-paper";
import {useExamStore} from "@/store/exam";

const props = defineProps<{
  q: Partial<Question>
}>()
const examStore = useExamStore()
const Q = props.q

const handleCheckBoxUpdate = (val: number[]) => {
  if (!Q.id) throw new Error('q id not found')
  examStore.updateCQ(Q.id, val);
}
</script>

<style scoped>

</style>