<template>
  <n-space vertical size="large">
    <n-layout has-sider>
      <n-layout-sider
          collapse-mode="transform"
          :collapsed-width="0"
          :width="240"
          show-trigger="arrow-circle"
          content-style="padding: 4px;"
          bordered
          style="height: calc(100vh - 144px)"
      >
        <LeftList @update:value="handleSelectChange"/>
      </n-layout-sider>
      <n-layout-content style="height: calc(100vh - 144px)" content-style="padding: 24px;" ref="contentRef">
        <n-space vertical size="large">
          <n-form
              ref="formRef"
              :model="model"
              :disabled="false"
              v-if="!examStore.isQListEmpty"
          >

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
      </n-layout-content>
    </n-layout>
  </n-space>
</template>

<script lang="ts" setup>
import LeftList from '@/components/left-list.vue'
import EditChoiceQ from '@/components/edit-choice-q.vue'
import EditFillBlankQ from "@/components/edit-fillblank-q.vue";
import {Add} from '@icon-park/vue-next'

const contentRef = ref<typeof NLayoutContent | null>(null)
const Qlist = ref<(typeof EditChoiceQ | typeof EditFillBlankQ)[]>([])
const selectPaper = ref<string>()
const handleSelectChange = (val: string) => {
  selectPaper.value = val;
}


import {useExamStore} from "@/store/exam";
import {QType, Question} from "@/types/api-exam-paper";
import ChoiceQ from '@/components/choice-q.vue'
import FillBlankQ from "@/components/fillblank-q";
import {NLayoutContent} from "naive-ui";
import {isNil, last} from "lodash";
import {getIdFromKey} from "@/utils/tools";
import {v4 as uuidv4} from 'uuid';

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
const examStore = useExamStore();
const choiceQ = ref<Question[]>([]);
const fillBlankQ = ref<Question[]>([])

const loadPaperQList = async () => {
  const paperId = getIdFromKey(selectPaper.value as string);
  if (isNil(paperId)) return;
  await examStore.getExamPaper(paperId);
  model.value = examStore.examQList;
  choiceQ.value = unref(model).filter((Q: Question) => Q.type === QType.choice);
  fillBlankQ.value = unref(model).filter((Q: Question) => Q.type === QType.fill_blank);
}
const handleQSave = (uid) => {

  // remove dom from page
  Qlist.value = unref(Qlist).filter(c => c.uid !== uid)
  loadPaperQList()
}
watchEffect(() => {
  loadPaperQList()
})
defineExpose({
  EditChoiceQ, EditFillBlankQ
})
</script>

<style scoped>

</style>