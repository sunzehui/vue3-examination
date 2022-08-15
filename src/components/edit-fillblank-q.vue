<script setup lang="ts">
import {TipsOne} from "@icon-park/vue-next";
import {ElMessage} from "element-plus";
import {head, isEmpty} from "lodash";
import {QType} from "@/types/api-exam-paper";
import {ApiCreateQuestion} from "@/apis/question";
import {toReactive} from "@vueuse/core";

interface DInputType {
  content: string
}

const props = defineProps<{
  selectPaper: String,
  uid: String
}>()
const emit = defineEmits(['save'])

const state = reactive({
  resolution: '',
  score: 2,
  dInputValue: [] as DInputType[],
  content: ''
})

const createDInputValue = (): DInputType => {
  return {
    content: ""
  }
}

const validate = () => {
  const {content, dInputValue} = state

  if (isEmpty(content)) {
    ElMessage.error("请输入内容")
    return false;
  } else if (dInputValue.length < 1) {
    ElMessage.error("最少挖一个空！")
    return false
  }
  return true;
}
const buildQuestion = () => {
  const {dInputValue, resolution, content, score} = state
  const answer = dInputValue.map((item, pos) => ({content: item.content, pos}));

  return {
    type: QType.fill_blank,
    resolution,
    content,
    score,
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
  const headQ = head(createResult.data)
  if (!headQ) {
    throw new Error()
  }

  emit('save', {qId: headQ.id, uid: props.uid})
  return createResult.data;
}

const {content, score, resolution, dInputValue} = toReactive(state)
</script>


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
        <n-button @click="saveFBQ">保存</n-button>
      </n-space>
    </n-space>
  </n-card>
</template>
