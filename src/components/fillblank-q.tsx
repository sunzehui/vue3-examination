import {defineComponent, PropType} from "vue";
import {NFormItem, NInput, NSpace} from "naive-ui";
import {FillBlank, QType, Question} from "@/types/api-exam-paper";
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
        const examStore = useExamStore();
        const handleBlankInput = async (item: (FillBlank), input: string) => {
            await examStore.updateFBQ(Q.id, item, input);
        }
        return () => (
            <>
                <NSpace vertical class="text-lg flex flex-wrap gap-2 ">
                    <span>{Q.content}</span>
                    {
                        blankPos.map(
                            (item, idx) =>
                                <>
                                    <NFormItem>
                                        <sapn>第{Number(item.pos) + 1}空：</sapn>
                                        <NInput placeholder={item.content ?? ""}
                                                value={examStore.thisBlankContent(Q.id, item.id)}
                                                onInput={(input) => handleBlankInput(omit(item, 'content'), input)}
                                                style={{width: '300px'}}/>
                                    </NFormItem>

                                </>
                        )
                    }
                </NSpace>
            </>
        );
    },
});
