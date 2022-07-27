<template>
  <n-space justify="center" vertical>
      <span class="text-lg">
        {{ Q.content }}
      </span>
    <n-checkbox-group>
      <n-space justify="start" vertical>
        <n-checkbox :value="A.id" size="large" v-for="A in Q.answer" :key="A.id">
          {{ A.content }}
        </n-checkbox>
      </n-space>
    </n-checkbox-group>
  </n-space>
</template>

<script setup lang="ts">
import {Question} from "@/types/api-exam-paper";

const props = defineProps<{
  q: Partial<Question>
}>()
const Q = props.q;
</script>

<style scoped>

</style>