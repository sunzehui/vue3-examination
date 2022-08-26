<script setup lang="ts">
import PageHeader from '@/components/page-header.vue'
</script>

<template>
  <PageHeader backTo="exam-paper-list"/>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" :key="$route.name"/>
    </keep-alive>
  </router-view>
</template>
