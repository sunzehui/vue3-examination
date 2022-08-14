<script lang="ts" setup>
import {NLayoutContent} from "naive-ui";
import {ApiCreatePaper} from "@/apis/exam-paper";
import {get, isNil} from "lodash";
import {useRouter} from 'vue-router'

const router = useRouter()

const baseInfoModel = ref({
  name: null,
  desc: null,
})

const contentRef = ref<typeof NLayoutContent | null>(null)
const savePaper = async () => {
  const paperResult = await ApiCreatePaper(unref(baseInfoModel))
  const paperId = get(paperResult, 'data.id')
  if (!isNil(paperId)) {
    await router.push({name: "exam-paper-edit", params: {id: paperId}})
  }
}
</script>

<template>
  <n-space vertical size="large">
    <n-layout>
      <n-layout-content content-style="padding: 24px;" ref="contentRef">
        <n-space vertical size="large">
          <n-form
              ref="formRef"
              :model="baseInfoModel"
              :disabled="false"
          >
            <n-grid :cols="24" :x-gap="24">
              <n-form-item-gi :span="12" label="试卷名称" path="name">
                <n-input v-model:value="baseInfoModel.name" placeholder="试卷名称"/>
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="试卷描述" path="desc">
                <n-input
                    v-model:value="baseInfoModel.desc"
                    placeholder="试卷描述"
                    type="textarea"
                    :autosize="{
                      minRows: 3,
                      maxRows: 5
                    }"
                />
              </n-form-item-gi>
            </n-grid>
          </n-form>
        </n-space>
        <n-space size="large" style="margin-top: 20px;" justify="end">
          <n-button size="large">取消</n-button>
          <n-button type="primary" size="large" @click="savePaper">确定</n-button>
        </n-space>
      </n-layout-content>
    </n-layout>
  </n-space>
</template>
