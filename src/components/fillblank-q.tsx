import {Component, defineComponent, PropType} from "vue";
import {NTag, NIcon, NInput} from "naive-ui";
import {FillBlank, Question} from "@/types/api-exam-paper";
import {splitByIndex} from "@/utils/tools";

const Content = defineComponent({
    name: "Content",
    props: {
        val: {
            type: Object as PropType<Question>,
            required: true
        }
    },
    setup(props) {
        const Q = props.val;
        // @ts-ignore
        const blankPos = Q.answer.map((a: FillBlank) => Number(a.pos)).sort((a, b) => a - b)
        const content = Q.content;
        console.log(blankPos)
        const contentTrunk = splitByIndex(content, blankPos);
        console.log(contentTrunk)
        return () => (
            <>

            </>
        )
    },

})

export default defineComponent({
    name: "FillBlankQ",
    props: {
        q: {
            type: Object as PropType<Question>,
            required: true
        }
    },
    setup(props) {
        const Q = props.q;
        // @ts-ignore
        const blankPos = Q.answer.map((a: FillBlank) => Number(a.pos)).sort((a, b) => a - b)
        const content = Q.content;
        const contentTrunk = splitByIndex(content, blankPos);

        return () => (
            <>
                    <span class="text-lg flex flex-wrap gap-2 items-center">
 {
     contentTrunk.map(
         (item, idx) => idx === contentTrunk.length - 1 ? <span>{item}</span> :
             <>
                 <span>{item}</span>
                 <NInput style={{width: '300px'}}/>
             </>
     )
 }
                    </span>
            </>
        );
    },
});
