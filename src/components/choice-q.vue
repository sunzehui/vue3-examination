<script setup lang="ts">
import {Question} from "@/types/api-exam-paper";
import {useExamStore} from "@/store/exam";

const examStore = useExamStore()

const props = defineProps<{
  q: Partial<Question>,
  roomId: number
}>()
let Q = computed(() => props.q)

const handleCheckBoxUpdate = (val: number[]) => {
  const q = unref(Q)
  if (!(q).id) throw new Error('q id not found')
  examStore.updateCQ(+props.roomId, (q).id, val);
}
</script>

<template>
  <n-space justify="center" vertical>
      <span class="text-lg">
        {{ Q.content }}
      </span>
    <n-checkbox-group @update:value="handleCheckBoxUpdate" :value="examStore.thisChoiceValue($route.params.rid,Q)">
      <n-space justify="start" vertical>
        <n-checkbox :value="A.id" size="large" v-for="A in Q.answer" :key="A.id">
          {{ A.content }}
        </n-checkbox>
      </n-space>
    </n-checkbox-group>
    <slot/>
  </n-space>
</template>
