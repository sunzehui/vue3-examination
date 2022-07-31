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

<script lang="ts" setup>
const router = useRouter();
let handleBack = ref<any>(null);
let breadcrumb = ref<string[]>([])
const back2Info = () => {
  router.push({name: 'exam-list'})
}
const nameRoute = {
  'exam-room-edit': "考试列表",
  'create': "创建考试"
}
const getPathLabel = (path: string) => {
  const pathArray = path.split('/').slice(2)
  return pathArray.map(item => nameRoute[item as keyof typeof nameRoute]);
}
const route = useRoute();
watch(() => route.name, () => {
  const isCreate = route.name === 'exam-create';
  if (isCreate) {
    handleBack.value = back2Info

    breadcrumb.value = getPathLabel(route.path)
  } else {
    handleBack.value = null;
    breadcrumb.value = []
  }
}, {immediate: true})
</script>