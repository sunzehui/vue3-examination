<script lang="ts" setup>
import { ElLoading } from "element-plus";

const loadingInstance = ElLoading.service({
  background: "rgba(255,255,255,.5)",
});

const resolve = () => {
  loadingInstance.close();
};
</script>

<template>
  <n-dialog-provider>
    <router-view #default="{ Component }">
      <suspense @resolve="resolve">
        <template #default>
          <component :is="Component" />
        </template>
      </suspense>
    </router-view>
  </n-dialog-provider>
</template>
