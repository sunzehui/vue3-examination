<script setup lang="ts">
import PageHeader from '@/components/page-header.vue'

const indexPage = 'exam-score'
</script>

<template>
  <PageHeader :backTo="indexPage"/>
  <router-view v-slot="{ Component }">
    <component :is="Component" :key="$route.name"/>
  </router-view>
</template>
