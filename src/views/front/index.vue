<script lang="ts" setup>
import { TagStatus } from "@/enum/tag-status";
import { findOne } from "@/apis/classes";
findOne(1).then(console.log);
</script>

<template>
  <n-scrollbar>
    <div class="card-container">
      <n-card title="语文" class="exam-card" v-for="i in 25">
        <template #header-extra> 17大专软件2班 </template>
        王莉： 请同学们点击考试按钮开始考试
        <template #footer>
          <NSpace justify="end">
            ⏰
            <n-time :time="1658534651000" type="date" />
            <n-divider vertical />

            <n-time :time="1658534651000" format="hh:mm" type="datetime" />
            -
            <n-time :time="1658534651000" format="hh:mm" type="datetime" />
          </NSpace>
        </template>
        <template #action>
          <n-space justify="space-between">
            <SwitchTag :status="TagStatus.wait" />
            <n-space justify="end">
              <n-button>进入考试</n-button>
            </n-space>
          </n-space>
        </template>
      </n-card>
    </div>
  </n-scrollbar>
</template>

<style scoped lang="scss">
.card-container {
  @apply grid grid-cols-3 gap-4;
}
.exam-card {
  width: 350px;
  height: 260px;
}
</style>
