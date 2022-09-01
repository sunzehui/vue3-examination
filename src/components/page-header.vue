<template>
  <n-page-header @back="handleBack" class="mb-4">
    <template #title>
      <h4>{{ route.meta.title }}</h4>
    </template>
    <template #header>
      <n-breadcrumb>
        <n-breadcrumb-item v-for="item in $route.matched">{{
          item.meta.title
        }}</n-breadcrumb-item>
      </n-breadcrumb>
    </template>
  </n-page-header>
</template>

<script setup lang="ts">
const router = useRouter();
const route = useRoute();
let handleBack = ref<any>(null);
const props = defineProps<{
  backTo: string;
}>();
const back2Info = () => {
  router.push({ name: props.backTo });
};
watch(
  () => route.name,
  (val) => {
    handleBack.value = val === props.backTo ? null : back2Info;
  },
  { immediate: true }
);
</script>
