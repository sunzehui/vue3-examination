<script lang="ts" setup>
import EditChoiceQ from '@/components/edit-choice-q.vue'
import EditFillBlankQ from "@/components/edit-fillblank-q.vue";
import {Add, Close} from '@icon-park/vue-next'
import {QType, Question} from "@/types/api-exam-paper";
import ChoiceQ from '@/components/choice-q.vue'
import FillBlankQ from "@/components/fillblank-q";
import {FormInst, NLayoutContent} from "naive-ui";
import {v4 as uuid} from 'uuid';
import {ApiAddQuestion2Paper, ApiGetExamPaper, ApiRemoveQuestion2Paper} from "@/apis/exam-paper";
import {Component} from "vue";

interface QListComponent {
  uid: string,
  type: null | Component
}

const route = useRoute()
const paperId = Number(route.params.id as string);
if (!paperId) {
  throw  new Error()
}
const contentRef = ref<typeof NLayoutContent | null>(null)
const Qlist = ref<QListComponent[]>([])

const model = ref<Question[]>([])
const choiceQ = ref<Question[]>([]);
const fillBlankQ = ref<Question[]>([])
const baseInfoModel = ref({
  name: '',
  desc: '',
})

const appendQ = (type: QType) => {
  const component: QListComponent = {
    uid: uuid(),
    type: null
  }
  if (type === QType.fill_blank) {
    component.type = EditFillBlankQ
  } else if (type === QType.choice) {
    component.type = EditChoiceQ
  }
  Qlist.value.push(component)
  // 添加后滚动到最底部
  nextTick(() => {
    contentRef.value?.scrollTo({
      top: Number.MAX_SAFE_INTEGER,
      behavior: 'smooth'
    });
  })
}

const handleQSave = async ({uid, qId}: Record<any, string>) => {
  // remove dom from page
  Qlist.value = unref(Qlist).filter(c => c.uid !== uid)
  await ApiAddQuestion2Paper(paperId, +qId);
  await loadDetail()
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

const removeQ = (qId: number) => {
  ApiRemoveQuestion2Paper(paperId, qId).then(loadDetail)
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

            <n-form-item
                v-for="Q in choiceQ"
                :key="Q.id"
            >

              <n-space vertical class="self-start">
                <n-h3>选择题：</n-h3>
              </n-space>
              <ChoiceQ :q="Q">
                <span>解析：{{ Q.resolution }}</span>
                <n-button @click="removeQ(Q.id)">
                  <n-icon>
                    <Close/>
                  </n-icon>
                  删除
                </n-button>
              </ChoiceQ>
            </n-form-item>

            <n-form-item
                v-for="Q in fillBlankQ"
                :key="Q.id"
            >
              <n-space vertical class="self-start">
                <n-h3>填空题：</n-h3>
              </n-space>

              <FillBlankQ :q="Q">
                <span>解析：{{ Q.resolution }}</span>
                <n-button @click="removeQ(Q.id)">
                  <n-icon>
                    <Close/>
                  </n-icon>
                  删除
                </n-button>
              </FillBlankQ>

            </n-form-item>

          </n-form>
          <template v-for="item in Qlist">
            <Component :is="item.type" :uid="item.uid" @save="handleQSave" :selectPaper="selectPaper"/>
          </template>


          <n-popconfirm positive-text="选择题" negative-text="填空题" :show-icon="false"
                        @positive-click="appendQ(QType.choice)"
                        @negative-click="appendQ(QType.fill_blank)">
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
