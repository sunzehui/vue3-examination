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
import {useDialog} from "naive-ui";
import {MaybeRef} from "@vueuse/core";

const route = useRoute();
const examStore = useExamStore();
const router = useRouter()
let now_idx = ref(0)

const examRoomId = computed(() => get(route, 'params.rid', null));
examStore.getExamPaperByRoomId(unref(examRoomId));

const isEnd = computed(() => unref(now_idx) + 1 >= unref(examStore.examQList).length)
const isStart = computed(() => unref(now_idx) <= 0)
const {socket} = useSocket()
socket.on('answerRecordUpdate', (res) => {
  examStore.updateRecord(res)
})

const go2Q = (idxOrRef: MaybeRef<number>) => {
  const idx = unref(idxOrRef)
  console.log({idx})
  router.push({name: 'question-panel', params: {idx}})
}
const initPageIndex = () => {
  const idx = Number(route.params.idx)
  const isValid = checkIdxValidate(idx)
  if (!isValid) {
    go2Q(0)
    return
  }
  go2Q(idx)
  now_idx.value = idx
}

onMounted(async () => {
  socket.emit('enterExamRoom', {
    examRoomId: unref(examRoomId)
  }, (res: any) => {
    examStore.updateRecord(res.data)
  })
  await initPageIndex()
})

const goNextQ = (step: -1 | 1) => {
  const qList = examStore.examQList
  const nextQ = unref(qList)[unref(now_idx) + step];
  if (nextQ) {
    now_idx.value += step
    go2Q(now_idx)
  }
}
const checkIdxValidate = (idx: number): boolean => {
  if (isNil(idx) || isNaN(idx)) return false;
  return !(idx < 0 || idx >= examStore.examQList.length);
}
// 监听题目变化，防止越界等非法路径
const unWatchRoute = watch(() => route.params.idx, (val) => {
  const isValid = checkIdxValidate(+val)
  if (!isValid) {
    go2Q(0)
  }
}, {immediate: true})

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

</script>

<style scoped>

</style>