<template>
  <n-card v-if="!examStore.isQListEmpty">
    <n-space style="height: 600px">
      <router-view/>
    </n-space>
    <n-space justify="end">
      <n-button v-show="isEnd" type="warning" @click="submitPaper">检查无误，提交</n-button>
      <n-button :disabled="isStart" type="primary" @click="goNextQ(-1)">上一题</n-button>
      <n-button :disabled="isEnd" type="primary" @click="goNextQ(1)">下一题</n-button>
    </n-space>
  </n-card>

  <n-empty class="mt-20" description="老师未添加题目" v-if="examStore.isQListEmpty">
    <template #extra>
      <n-button size="small" @click="$router.push({name:'exam-panel'})">
        返回面板
      </n-button>
    </template>
  </n-empty>
</template>

<script setup lang="ts">
import {useExamStore} from "@/store/exam";
import {get, isNil,} from "lodash";

import {useLocalStorage} from "@vueuse/core";
import {Ref} from "vue";
import {useDialog} from "naive-ui";

const route = useRoute();
const examStore = useExamStore();
const router = useRouter()
const lastInputQ: Ref<null | number> = useLocalStorage('lastInputQ', null)
const examRoomId = computed(() => get(route, 'params.rid', null));
let now_idx = 0

await examStore.getExamPaperByRoomId(unref(examRoomId));
const go2Q = (idx: number) => {
  router.push({name: 'question-panel', params: {idx}})
}
const isEnd = ref(false)
const isStart = ref(false)

const initPageIndex = () => {
  const val = route.params.idx as string || unref(lastInputQ)
  let idx = Number(val)
  // 首次进入跳转到上次题目记录，否则跳转到第一题
  if (isNaN(idx)) {
    go2Q(0)
  } else {
    go2Q(idx)
    now_idx = idx
  }
}

const goNextQ = (step: -1 | 1) => {
  const qList = examStore.examQList
  const nextQ = unref(qList)[now_idx + step];
  if (nextQ) {
    now_idx += step
    go2Q(now_idx)
  }
}
const dialog = useDialog()
const submitPaper = async () => {
  unWatchRoute()
  const result = await examStore.submitPaper(unref(examRoomId));
  if (result.statusCode === 200) {
    dialog.success({
      title: '提交成功',
      content: '得分：' + result.data.totalScore + '分',
      positiveText: '查看详情',
      onPositiveClick: () => {
        console.log(1)
      }
    })
  } else if (result.statusCode === 422) {
    dialog.warning({
      title: '请检查',
      content: result.message,
      positiveText: '返回首页',
      onPositiveClick: () => {
        router.replace({name: 'home'})
      }
    })
  }
}
onMounted(async () => {
  await initPageIndex()
})


const unWatchRoute = watch(() => route.params.idx, (val) => {
  const idx = +val;
  if (isNil(idx) || isNaN(idx)) return;
  console.log(idx)
  if (idx < 0) {
    go2Q(0);
    return
  }
  const qList = examStore.examQList;
  isEnd.value = idx + 1 >= unref(qList).length
  isStart.value = idx <= 0
  lastInputQ.value = idx;
}, {immediate: true})
</script>

<style scoped>

</style>