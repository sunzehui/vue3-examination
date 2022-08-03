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

<script setup lang="ts">
import {Question} from "@/types/api-exam-paper";
import {useExamStore} from "@/store/exam";

const props = defineProps<{
  q: Partial<Question>,
  roomId: string
}>()
let Q = ref(props.q || {})
watch(() => props.q, (val) => {
  Q.value = val
})

const examStore = useExamStore()

const handleCheckBoxUpdate = (val: number[]) => {
  if (!unref(Q).id) throw new Error('q id not found')
  examStore.updateCQ(+props.roomId, unref(Q).id, val);
}
</script>

<style scoped>

</style>