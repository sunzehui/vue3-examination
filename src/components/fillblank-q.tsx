import {defineComponent, PropType} from "vue";
import {NInput} from "naive-ui";
import {FillBlank, QType, Question} from "@/types/api-exam-paper";
import {splitByIndex} from "@/utils/tools";
import {useExamStore} from "@/store/exam";
import {omit} from "lodash";


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
        const blankPos = (Q.answer as FillBlank[]).sort((a, b) => Number(a.pos) - Number(b.pos))
        const contentTrunk = splitByIndex(Q, blankPos);
        if (!contentTrunk) throw new Error()
        const examStore = useExamStore();
        const handleBlankInput = async (item: (FillBlank), input: string) => {
            await examStore.updateFBQ(Q.id, item, input);
        }

        return () => (
            <>
                    <span class="text-lg flex flex-wrap gap-2 items-center">
 {
     contentTrunk.map(
         (item, idx) => idx === contentTrunk.length - 1 ? <span>{item.content}</span> :
             <>
                 <span>{item.content}</span>
                 <NInput placeholder={`${item.score}分`}
                         value={examStore.thisBlankContent(Q.id, item.id)}
                         onInput={(input) => handleBlankInput(omit(item, 'content'), input)}
                         style={{width: '300px'}}/>
             </>
     )
 }
                    </span>
            </>
        );
    },
});
