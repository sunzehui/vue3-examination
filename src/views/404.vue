<template>
  <n-empty description="是一个飞机">
    <template #icon>
      <n-icon>
        <Airplane />
      </n-icon>
    </template>
    <template #extra>
      <n-button size="small" @click="$router.push({ name: 'home' })">
        404 页面未找到，看看别的？
      </n-button>
    </template>
  </n-empty>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Airplane } from "@icon-park/vue-next";
export default defineComponent({
  components: {
    Airplane,
  },
});
</script>
