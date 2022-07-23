import { Component, defineComponent,PropType  } from "vue";
import { DoneAll,SleepOne, TurnOn } from "@icon-park/vue-next";
import { NTag, NIcon } from "naive-ui";
import {TagStatus} from '@/enum/tag-status';
interface TagOpt {
  title:string,
  type:'info'|'primary'|'default',
  icon: Component
}
type TagMap = Record<TagStatus, TagOpt>

const tagMap = {
  [TagStatus.wait]:{
    title:"未开始",
    type:'info',
    icon:SleepOne
  },
  [TagStatus.on]:{
    title:"正在考试",
    type:'primary',
    icon:TurnOn
  },
  [TagStatus.off]:{
    title:"考试结束",
    type:'default',
    icon:DoneAll
  }
} as TagMap;

export default defineComponent({
  name: "SwitchTag",
  props: {
    status:{
      type: Number as PropType<TagStatus>,
      required: true
    }
  },
  setup(props) {

    const tag = tagMap[props.status];
    return () => (
      <>
        <NTag
          round
          style={{padding:'17px 20px'}}
          type={tag.type}
          v-slots={{
            icon:()=> <NIcon component={tag.icon} />,
          }}
        >
          {tag.title}
        </NTag>
      </>
    );
  },
});
