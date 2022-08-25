<script lang="ts" setup>
import {ApiCreateQuestion} from "@/apis/question";
import {QType} from "@/types/api-exam-paper";
import {TipsOne} from "@icon-park/vue-next";
import {head, isEmpty,} from "lodash-es";
import {ElMessage} from "element-plus";

const emit = defineEmits(['save'])
const props = defineProps<{
  selectPaper: String
  uid: String
}>()
const state = reactive({
  content: "",
  resolution: '',
  customValue: []
})
const handleChoiceCreate = () => {
  return {
    is_answer: false,
    content: '',
    score: 0
  }
}

const validate = () => {
  const {content, customValue} = state;
  if (isEmpty(content)) {
    ElMessage.error("请输入内容")
    return false;
  } else if (customValue.length < 2) {
    ElMessage.error("最少输入两个选项")
    return false
  }
  return true;
}
const buildQuestion = () => {
  const {resolution, customValue, content} = state;
  return {
    type: QType.choice,
    resolution: resolution,
    content: content,
    answer: customValue
  }
}
const saveChoiceQ = async () => {
  const Q = buildQuestion();
  const isValid = validate();
  if (!isValid) {
    throw new Error()
  }
  const createResult = await ApiCreateQuestion(Q);
  const headQ = head(createResult.data)
  if (!headQ) {
    throw new Error()
  }
  const qId = headQ.id
  emit('save', {qId, uid: props.uid})
  return createResult.data;
}
</script>

<template>
  <n-card title="选择题">
    <n-space vertical>
      <n-alert title="添加提示" type="default">
        <template #icon>
          <n-icon>
            <TipsOne/>
          </n-icon>
        </template>
        下方输入题目，点击 + 添加选项，按照 [ 是否答案、 分值、 选项内容 ] 添加
      </n-alert>
      <n-input type="textarea" v-model:value="state.content"
               ref="contentInputRef"
      />
      <n-dynamic-input :max="10" :min="2" v-model:value="state.customValue" :on-create="handleChoiceCreate">
        <template #create-button-default>
          添加选项
        </template>
        <template #default="{ value }">
          <div style="display: flex; align-items: center; width: 100%">
            <n-checkbox
                v-model:checked="value.is_answer"
                style="margin-right: 12px"
            />
            <n-space align="center">
              <n-input-number v-model:value="value.score" :disabled="!value.is_answer"/>
            </n-space>
            <n-input v-model:value="value.content" type="text"/>
          </div>
        </template>
      </n-dynamic-input>
      <n-input
          v-model:value="resolution"
          type="textarea"
          placeholder="题目解析"
      />
      <n-space justify="end">
        <n-button @click="saveChoiceQ">保存</n-button>
      </n-space>

    </n-space>
  </n-card>
</template>

