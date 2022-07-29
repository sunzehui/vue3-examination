<template>
  <n-card title="填空题">
    <n-space vertical>
      <n-alert class="select-none" title="添加提示" type="default">
        <template #icon>
          <n-icon>
            <TipsOne/>
          </n-icon>
        </template>
        <span>在此输入问题题干,在分割线下用鼠标选取挖空</span>
      </n-alert>
      <n-input type="textarea" v-model:value="content"/>
      <n-divider/>
      <article @mouseup="findSelection" @mousedown="recordStart" class="min-h-[20px]">
        <p ref="qContentRef">
          {{ content || '请输入题干' }}
        </p>
      </article>
      <n-divider/>

      <div v-show="isFormShow" class="grid gap-2 grid-cols-[50px_100px_100px_1fr]">
        <span>删除</span>
        <span>位置</span>
        <span>分值</span>
        <span>答案</span>
        <template v-for="value in answer" :key="value.uid">
          <n-button type="primary" @click="delAnswer(value.uid)">
            <Close/>
          </n-button>
          <n-input-number
              v-model:value="value.pos"
              placeholder="请选择"
              disabled
          />
          <n-input-number
              v-model:value="value.score"
              placeholder="分值"
          />
          <n-input v-model:value="value.content" type="text"
                   placeholder="答案"
          />
        </template>

      </div>

      <pre>{{ JSON.stringify(value, null, 2) }}</pre>
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
import {isEmpty, omit, sortedUniqBy, uniqBy} from "lodash";
import {FillBlank, QType} from "@/types/api-exam-paper";
import {v4 as uuidv4} from 'uuid';
import {ApiCreateQuestion} from "@/apis/question";
import {Ref} from "vue";

const resolution = ref('')
let mouseStart = (0);
const recordStart = (e) => {
  mouseStart = e.screenX
}

const fillTextColor = async (textRef: Ref<HTMLParagraphElement | null>, text: string) => {
  if (!textRef.value && !textRef.value) {
    return
  }

  await nextTick()

  const originText = textRef.value.innerText;
  const ret = originText.replace(text, `<span class="text-select">${text}</span>`)
  textRef.value.innerHTML = ret
}
const createTag = (event, block, id) => {

  const scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;

  // Get cursor position
  let posX = event.clientX - block.dimensions[0].Width;
  if (event.clientX - mouseStart < 0) {
    posX = event.clientX;
  }
  const posY = event.clientY + 20 + scrollTop;
  console.log(posX)

  const tag = document.createElement('div')
  tag.className = 'pos_tag'

  tag.style = 'color:red;position: absolute; top: ' + posY + 'px; left: ' + posX + 'px;'
  tag.innerText = '^'
  tag.id = 't' + id.split('-')[0];
  document.body.insertAdjacentElement('beforeend', tag);

}
const findSelection = (event) => {
  let block = rb.extractSelectedBlock(window, document);
  if (isEmpty(unref(content))) {
    ElMessage.error("请先输入内容！")
    return
  }
  if (!block) {
    ElMessage.error("请使用鼠标在题干中选取！");
    return;
  }

  const {startCharIndex, text} = block.rangeMeta;
  const uid = uuidv4()
  const newAnswer = [...unref(answer), ({
    uid, score: 2, pos: Number(startCharIndex), content: text
  })]
  createTag(event, block, uid);
  answer.value = uniqBy(Array.from(newAnswer), item => {
    return unref(item).pos
  }).sort((a, b) => a.pos - b.pos)

  ElMessage.info("选中：" + text);
}
const cleanTag = () => {
  const tags = Array.from(document.querySelectorAll('.pos_tag'))
  tags.forEach(el => document.body.removeChild(el))
}
const qContentRef = ref(null);
const content = ref('')
const answer = ref<(FillBlank & { uid: string })[]>([]);
const isFormShow = computed(() => !isEmpty([...unref(answer)]))

const delAnswer = (uid: string) => {
  answer.value = unref(answer).filter(a => a.uid !== uid)
  const tag = document.querySelector('#t' + uid.split('-')[0])
  document.body.removeChild(tag)
}

const buildQuestion = () => {
  const _answer = (unref(answer)).map(a => omit(a, 'uid'));
  return {
    type: QType.fill_blank,
    resolution: unref(resolution),
    content: unref(content),
    answer: _answer
  }
}

const saveFBQ = async () => {
  const Q = buildQuestion();
  const createResult = await ApiCreateQuestion(Q);
  cleanTag();
  return createResult.data;
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