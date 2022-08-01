import {defineComponent, PropType} from "vue";
import {NButton, NFormItem, NIcon, NInput, NSpace} from "naive-ui";
import {FillBlank, QType, Question} from "@/types/api-exam-paper";
import {useExamStore} from "@/store/exam";
import {omit} from "lodash";


export default defineComponent({
    name: "FillBlankQ",
    props: {
        q: {
            type: Object as PropType<Question>,
            required: true
        },
        roomId: {
            type: Number,
            required: true
        }
    },
    setup(props, {slots}) {
        if (props.q === null) return;
        let Q = (props.q)
        watch(() => props.q, (val) => {
            Q = val
        })
        const blankPos = (Q.answer as FillBlank[]).sort((a, b) => Number(a.pos) - Number(b.pos))
        const examStore = useExamStore();
        const handleBlankInput = async (item: (FillBlank), input: string) => {
            await examStore.updateFBQ(props.roomId, Q.id, item, input);
        }
        const route = useRoute()

        return () => (
            <>
                <NSpace vertical class="text-lg flex flex-col gap-2 ">
                    <span>{Q.content}</span>
                    {
                        blankPos.map(
                            (item, idx) =>
                                <>
                                    <NFormItem>
                                        <sapn>第{Number(item.pos) + 1}空：</sapn>
                                        <NInput placeholder={item.content ?? ""}
                                                value={examStore.thisBlankContent(+route.params.rid, Q.id, item.id)}
                                                onInput={(input) => handleBlankInput(omit(item, 'content'), input)}
                                                style={{width: '300px'}}/>
                                    </NFormItem>

                                </>
                        )
                    }
                    {slots.default?.()}

                </NSpace>
            </>
        );
    },
});
