<script setup lang="ts">
const router = useRouter();
let handleBack = ref<any>(null);
let breadcrumb = ref<string[]>([])
const back2Info = () => {
  router.push({name: 'info'})
}
const nameRoute = {
  'class-panel': '班级管理',
  'info': "班级信息",
  'join': "加入班级"
}
const getPathLabel = (path: string) => {
  const pathArray = path.split('/').slice(2)
  return pathArray.map(item => nameRoute[item as keyof typeof nameRoute]);
}
const route = useRoute();
watch(() => route.name, () => {
  const isJoinClasses = route.name === 'join';
  handleBack.value = isJoinClasses ? back2Info : null;
  breadcrumb.value = getPathLabel(route.path)
}, {immediate: true})
</script>

<template>
  <n-page-header @back="handleBack" class="mb-4">
    <template #title>
      <h4
      >{{ route.meta.title }}</h4>
    </template>
    <template #header>
      <n-breadcrumb>
        <n-breadcrumb-item v-for="item in breadcrumb">{{ item }}</n-breadcrumb-item>
      </n-breadcrumb>
    </template>
  </n-page-header>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" :key="$route.name"/>
    </keep-alive>
  </router-view>
</template>
