<template>
  <PageHeader back-to="exam-list"/>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" :key="$route.name"/>
    </keep-alive>
  </router-view>
</template>

<script lang="ts" setup>
import PageHeader from '@/components/page-header.vue'
</script>