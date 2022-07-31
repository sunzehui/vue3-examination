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

            <n-form-item
                v-for="Q in choiceQ"
                :key="Q.id"
            >
              <ChoiceQ :q="Q"/>
            </n-form-item>

            <n-form-item
                v-for="Q in fillBlankQ"
                :key="Q.id"
            >
              <FillBlankQ :q="Q"/>
            </n-form-item>

          </n-form>
          <template v-for="item in Qlist">
            <Component :is="item.type" :uid="item.uid" @save="handleQSave" :selectPaper="selectPaper"/>
          </template>


          <n-popconfirm positive-text="选择题" negative-text="填空题" :show-icon="false" @positive-click="appendQ('choice')"
                        @negative-click="appendQ('fillblank')">
            <template #trigger>
              <n-button style="width: 100%" dashed>
                <n-icon>
                  <Add/>
                </n-icon>&nbsp;
                添加题目
              </n-button>
            </template>
            选择题目类型
          </n-popconfirm>

        </n-space>

        <n-space size="large" style="margin-top: 20px;" justify="end">
          <n-button size="large">取消</n-button>
          <n-button type="primary" size="large" @click="savePaper">确定</n-button>
        </n-space>
      </n-layout-content>
    </n-layout>
  </n-space>
</template>

<script lang="ts" setup>
import EditChoiceQ from '@/components/edit-choice-q.vue'
import EditFillBlankQ from "@/components/edit-fillblank-q.vue";
import {Add} from '@icon-park/vue-next'

const contentRef = ref<typeof NLayoutContent | null>(null)
const Qlist = ref<(typeof EditChoiceQ | typeof EditFillBlankQ)[]>([])


import {QType, Question} from "@/types/api-exam-paper";
import ChoiceQ from '@/components/choice-q.vue'
import FillBlankQ from "@/components/fillblank-q";
import {FormInst, NLayoutContent} from "naive-ui";
import {v4 as uuidv4} from 'uuid';
import {ApiAddQuestion2Paper, ApiGetExamPaper} from "@/apis/exam-paper";
import {isNil} from "lodash";
import {useExamStore} from "@/store/exam";


const appendQ = (type: "fillblank" | 'choice') => {
  const component = {
    uid: uuidv4(),
    type: null
  }
  if (type === 'fillblank') {
    component.type = EditFillBlankQ
  } else if (type === 'choice') {
    component.type = EditChoiceQ
  }
  Qlist.value.push(component)
  nextTick(() => {
    contentRef.value?.scrollTo({
      top: Number.MAX_SAFE_INTEGER,
      behavior: 'smooth'
    });
  })
}
const model = ref<Question[]>([])
const choiceQ = ref<Question[]>([]);
const fillBlankQ = ref<Question[]>([])
const baseInfoModel = ref({
  name: '',
  desc: '',
})

const handleQSave = async ({uid, qId}) => {
  // remove dom from page
  Qlist.value = unref(Qlist).filter(c => c.uid !== uid)
  await ApiAddQuestion2Paper(paperId, qId);
  await loadDetail()
}

const route = useRoute()
const paperId = Number(route.params.id as string);
if (!paperId) {
  throw  new Error()
}

const loadDetail = async () => {
  // 加载基础信息
  const paperResult = await ApiGetExamPaper(+paperId)
  baseInfoModel.value.name = paperResult.data.name;
  baseInfoModel.value.desc = paperResult.data.desc;
//  加载题目
  model.value = paperResult.data.question;
  choiceQ.value = unref(model).filter((Q: Question) => Q.type === QType.choice);
  fillBlankQ.value = unref(model).filter((Q: Question) => Q.type === QType.fill_blank);
}
onMounted(loadDetail)

defineExpose({
  EditChoiceQ, EditFillBlankQ
})


const formRef = ref<FormInst | null>(null)
</script>


<style scoped>

</style>
