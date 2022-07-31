<template>
  <n-card title="创建考试">

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
              验证
            </n-button>
          </div>
        </n-gi>
      </n-grid>
    </n-form>
  </n-card>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {FormInst} from 'naive-ui'
import {ApiGetMyExamPaper} from "@/apis/exam-paper";

import {ApiFindMyClasses} from "@/apis/classes";
import {ApiSubmitExamRoom} from "@/apis/exam-room";
import dayjs from "dayjs";
import {ElMessage} from "element-plus";

interface SelectOption {
  label: string,
  value: number
}

const usePaperListOptions = ref<SelectOption[]>([])

const paperListResult = await ApiGetMyExamPaper()
usePaperListOptions.value = (paperListResult.data).map(v => ({
  label: v.name, value: v.id
}))

const useClassesListOptions = ref<SelectOption[]>([])

const classesListResult = await ApiFindMyClasses();

useClassesListOptions.value = (classesListResult.data).map(v => ({
  label: v.name, value: v.id
}))
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
    const now = +dayjs()

    // @ts-ignore
    if (unref(model).begin_time < now || unref(model).end_time < now) {
      ElMessage.error("不可选择之前时间")
      return;
    }
    // @ts-ignore
    if (unref(model).begin_time >= unref(model).end_time) {
      ElMessage.error("结束时间不能小于开始时间")
      return;
    }
    console.log(unref(model).begin_time, unref(model).end_time)

    // @ts-ignore
    ApiSubmitExamRoom({
      ...unref(model),
      begin_time: dayjs(+unref(model).begin_time!).utc().format(),
      end_time: dayjs(+unref(model).end_time!).utc().format()
    }).then(console.log)
  })
}
const rules = {
  name: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入 考试名称'
  },
  desc: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入 通知内容'
  },
  use_exam_paper: {
    required: true,
    trigger: ['blur', 'change'],
    message: '请选择 使用试卷'
  },
  classes_id: {
    type: 'array',
    required: true,
    trigger: ['blur', 'change'],
    message: '请选择 使用班级'
  },
  begin_time: {
    type: 'number',
    required: true,
    trigger: ['blur', 'change'],
    message: '请输入 开始时间'
  },
  end_time: {
    type: 'number',
    required: true,
    trigger: ['blur', 'change'],
    message: '请输入 结束时间'
  },
}
const model = ref({
  name: null,
  desc: null,
  begin_time: null,
  end_time: null,
  exam_paper_id: null,
  classes_ids: null,
})

const formRef = ref<FormInst | null>(null)
</script>