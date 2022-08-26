<script lang="ts" setup>
import {ref} from 'vue'
import {FormInst} from 'naive-ui'
import {ApiGetMyExamPaper} from "@/apis/exam-paper";
import {ApiFindMyClasses} from "@/apis/classes";
import {ApiCreateExamRoom} from "@/apis/exam-room";
import dayjs from "dayjs";
import {ElMessage} from "element-plus";
import rules from './createFormRule'
import {ExamPaper} from "@/types/api-exam-paper";

interface SelectOption {
  label: string,
  value: number
}

const model = ref({
  name: null,
  desc: null,
  begin_time: null,
  end_time: null,
  exam_paper_id: null,
  classes_ids: null,
})
const paperListData = ref<ExamPaper[]>([])
const usePaperListOptions = computed(() =>
    unref(paperListData).map(v => ({
      label: v.name, value: v.id
    }))
)
const useClassesListOptions = ref<SelectOption[]>([])
const formRef = ref<FormInst | null>(null)

async function init() {
  const result = await ApiGetMyExamPaper()
  paperListData.value = result.data;

  const classesListResult = await ApiFindMyClasses();
  useClassesListOptions.value = (classesListResult.data).map(v => ({
    label: v.name, value: v.id
  }))
}


// 只能选择当前之后的时间
const dateDisabled = (ts: number) => {
  return ts < Date.now() - 86400000
}
const submitExamRoom = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate((errors) => {
    if (errors) {
      return
    }
    const {begin_time, end_time} = unref(model)
    if (!(begin_time && end_time)) return;
    const now = +dayjs()

    if (begin_time < now || end_time < now) {
      ElMessage.error("不可选择之前时间")
      return;
    }
    if (begin_time >= end_time) {
      ElMessage.error("结束时间不能小于开始时间")
      return;
    }
    // @ts-ignore
    ApiCreateExamRoom({
      ...unref(model),
      begin_time: dayjs(begin_time).utc().format(),
      end_time: dayjs(end_time).utc().format()
    }).then(() => init)
  })
}

onMounted(init);
</script>
<template>
  <n-card title="填写考试信息">
    <n-form
        ref="formRef"
        :model="model"
        :rules="rules"
        size="large"
        label-placement="top"
    >
      <n-grid :cols="24" :x-gap="24">
        <n-form-item-gi :span="12" label="考试名称" path="name">
          <n-input v-model:value="model.name" placeholder="考试名称"/>
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="考试通知" path="desc">
          <n-input
              v-model:value="model.desc"
              placeholder="考试通知"
              type="textarea"
              :autosize="{
            minRows: 3,
            maxRows: 5
          }"
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="使用试卷" path="exam_paper_id">
          <n-select
              v-model:value="model.exam_paper_id"
              placeholder="请选择"
              :options="usePaperListOptions"
          />
        </n-form-item-gi>
        <n-form-item-gi
            :span="12"
            label="关联班级"
            path="classes_ids"
        >
          <n-select
              v-model:value="model.classes_ids"
              placeholder="请选择"
              :options="useClassesListOptions"
              multiple
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="考试开始时间" path="begin_time">
          <n-date-picker :is-date-disabled="dateDisabled" v-model:value="model.begin_time" type="datetime"/>
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="考试结束时间" path="end_time">
          <n-date-picker :is-date-disabled="dateDisabled" v-model:value="model.end_time" type="datetime"/>
        </n-form-item-gi>
        <n-gi :span="24">
          <div style="display: flex; justify-content: flex-end">
            <n-button round type="primary" @click="submitExamRoom">
              保存
            </n-button>
          </div>
        </n-gi>
      </n-grid>
    </n-form>
  </n-card>
</template>

