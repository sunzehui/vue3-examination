<template>
  <n-page-header @back="handleBack" class="mb-4">
    <template #title>
      <h4
      >{{ route.meta.title }}</h4>
    </template>
    <template #header>
      <n-breadcrumb>
        <n-breadcrumb-item v-for="item in $route.matched">{{ item.meta.title }}</n-breadcrumb-item>
      </n-breadcrumb>
    </template>
  </n-page-header>
</template>

<script setup lang="ts">
const router = useRouter();
const route = useRoute()
let handleBack = ref<any>(null);
let breadcrumb = ref<string[]>([])
const props = defineProps<{
  backTo: string
}>()
const back2Info = () => {
  router.push({name: props.backTo})
}
const nameRoute = {
  'exam-room-edit': "编辑考试",
  'list': "考试列表",
  'create': "创建考试",
  'class-panel': '班级管理',
  'info': "班级信息",
  'join': "加入班级"
}
const getPathLabel = (path: string) => {
  const pathArray = path.split('/').slice(2)
  return pathArray.map(item => nameRoute[item as keyof typeof nameRoute]);
}
watch(() => route.name, (val) => {
  handleBack.value = val === props.backTo ? '' : back2Info
  breadcrumb.value = getPathLabel(route.path)
  console.log(route.matched)

}, {immediate: true})
</script>

<style scoped>

</style>