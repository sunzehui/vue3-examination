<template>
  <ExamRecordComp :record_id="$route.params.record_id"/>
</template>

<script setup lang="ts">
import ExamRecordComp from '@/components/exam-record-component.vue'
</script>
