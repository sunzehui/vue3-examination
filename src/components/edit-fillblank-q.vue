<template>
  <n-card title="填空题">
    <n-space vertical>
      <n-alert class="select-none" title="添加提示" type="default">
        <template #icon>
          <n-icon>
            <TipsOne/>
          </n-icon>
        </template>
        <span>在此输入问题题干,在分割线下填写答案</span>
      </n-alert>
      <n-input type="textarea" v-model:value="content"/>
      <n-space justify="start" class="items-center">
        <span>分值：</span>
        <n-input-number
            v-model:value="score"
            style="margin-right: 12px; width: 160px"
        />
      </n-space>
      <n-divider/>

      <n-dynamic-input
          v-model:value="dInputValue"
          show-sort-button
          placeholder="请输入"
          :on-create="createDInputValue"
      >
        <template #default="{ value,index }">
          <div style="display: flex; align-items: center; width: 100%">
            <n-input-number
                :value="index"
                style="margin-right: 12px; width: 160px"
                disabled
            />
            <n-input v-model:value="value.content" type="text"/>
          </div>
        </template>
      </n-dynamic-input>
      <pre>{{ JSON.stringify(dInputValue, null, 2) }}</pre>

      <n-input
          v-model:value="resolution"
          type="textarea"
          placeholder="题目解析"
      />
      <n-space justify="end">
        <n-button @click="saveFBQ">仅保存</n-button>
        <n-button @click="saveFBQAndJoinPaper">保存并加入试卷</n-button>
      </n-space>
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import {Close, TipsOne} from "@icon-park/vue-next";
import * as rb from "rangeblock"
import {ElMessage} from "element-plus";
import {head, isEmpty, isNil, omit, sortedUniqBy, uniqBy} from "lodash";
import {FillBlank, QType} from "@/types/api-exam-paper";
import {v4 as uuidv4} from 'uuid';
import {ApiCreateQuestion} from "@/apis/question";
import {getIdFromKey} from "@/utils/tools";
import {ApiAddQuestion2Paper} from "@/apis/exam-paper";

const createDInputValue = () => {
  return {
    content: ""
  }
}

const resolution = ref('')
const props = defineProps<{
  selectPaper: String,
  uid: String
}>()
const emit = defineEmits(['save'])
const score = ref(2)
const dInputValue = ref<string[]>([])
const content = ref('')
const validate = () => {
  if (isEmpty(unref(content))) {
    ElMessage.error("请输入内容")
    return false;
  } else if (unref(dInputValue).length < 1) {
    ElMessage.error("最少挖一个空！")
    return false
  }
  return true;
}
const buildQuestion = () => {
  const answer = (unref(dInputValue)).map((content, pos) => ({content, pos}));

  return {
    type: QType.fill_blank,
    resolution: unref(resolution),
    content: unref(content),
    score: unref(score),
    answer
  }
}

const saveFBQ = async () => {
  const Q = buildQuestion();
  const isValid = validate();
  if (!isValid) {
    return
  }
  const createResult = await ApiCreateQuestion(Q);
  return createResult.data;
}

const saveFBQAndJoinPaper = async () => {
  const createdQ = await saveFBQ();
  const headQ = head(createdQ)
  if (!headQ) {
    throw new Error()
  }
  const qId = headQ.id
  const paperId = getIdFromKey(props.selectPaper as string);
  if (isNil(paperId)) {
    ElMessage.error('错误的试卷')
    return;
  }
  const result = await ApiAddQuestion2Paper(paperId, qId);

  emit('save', props.uid)
}
</script>

<style scoped lang="scss">
.form-item-group {
}

</style>
<style>
.text-select {
  color: red
}
</style>