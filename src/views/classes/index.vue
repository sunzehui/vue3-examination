<script setup lang="ts">
import PageHeader from '@/components/page-header.vue'

const indexPage = 'info'
</script>

<template>
  <PageHeader :backTo="indexPage"/>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" :key="$route.name"/>
    </keep-alive>
  </router-view>
</template>
