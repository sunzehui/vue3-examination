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
      <n-input type="textarea" v-model:value="content"
               ref="contentInputRef"
               :validation-status="inputContentValidationStatus"/>
      <n-dynamic-input :max="10" :min="2" v-model:value="customValue" :on-create="handleChoiceCreate">
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
        <n-button @click="saveChoiceQ">仅保存</n-button>
        <n-button @click="saveChoiceQAndJoinPaper">保存并加入试卷</n-button>
      </n-space>

    </n-space>
  </n-card>
</template>

<script lang="ts" setup>
import {ApiCreateQuestion} from "@/apis/question";
import {QType} from "@/types/api-exam-paper";
import {CreateQResult} from '@/types/api-question';
import {TipsOne} from "@icon-park/vue-next";
import {head, isEmpty, isNil, last} from "lodash";
import {getIdFromKey} from "@/utils/tools";
import {ElMessage} from "element-plus";
import {ApiAddQuestion2Paper} from "@/apis/exam-paper";

const emit = defineEmits(['save'])
const props = defineProps<{
  selectPaper: String
  uid: String
}>()
const content = ref('')
const resolution = ref('')
const handleChoiceCreate = () => {
  return {
    is_answer: false,
    content: '',
    score: 0
  }
}

const customValue = ref([])
const validate = () => {
  if (isEmpty(unref(content))) {
    ElMessage.error("请输入内容")
    return false;
  } else if (unref(customValue).length < 2) {
    ElMessage.error("最少输入两个选项")
    return false
  }
  return true;
}
const buildQuestion = () => {

  return {
    type: QType.choice,
    resolution: unref(resolution),
    content: unref(content),
    answer: unref(customValue)
  }
}
const saveChoiceQ = async () => {
  const Q = buildQuestion();
  const isValid = validate();
  if (!isValid) {
    return
  }
  const createResult = await ApiCreateQuestion(Q);
  return createResult.data;
}


const saveChoiceQAndJoinPaper = async () => {
  const createdQ = await saveChoiceQ();
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
  console.log(result)
}
</script>

<style scoped>

</style>