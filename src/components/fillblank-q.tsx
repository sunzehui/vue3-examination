import {defineComponent, PropType} from "vue";
import {NFormItem, NInput, NSpace} from "naive-ui";
import {FillBlank, Question} from "@/types/api-exam-paper";
import {useExamStore} from "@/store/exam";
import {omit} from "lodash-es";

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
        const Q = computed(() => props.q)
        const route = useRoute()
        const examStore = useExamStore();

        const blankPos = (unref(Q).answer as FillBlank[]).sort((a, b) => Number(a.pos) - Number(b.pos))
        const handleBlankInput = async (item: (FillBlank), input: string) => {
            await examStore.updateFBQ(props.roomId, unref(Q).id, item, input);
        }

        return () => (
            <NSpace vertical class="text-lg flex flex-col gap-2">
                <span>{unref(Q).content}</span>
                {
                    blankPos.map(
                        (item, idx) =>
                            <NSpace>
                                <sapn>第{Number(item.pos) + 1}空：</sapn>
                                <NInput placeholder={item.content ?? ""}
                                        value={examStore.thisBlankContent(+route.params.rid, unref(Q).id, item.id)}
                                        onInput={(input) => handleBlankInput(omit(item, 'content'), input)}
                                        style={{width: '300px'}}/>
                            </NSpace>
                    )
                }
                {slots.default?.()}
            </NSpace>
        );
    },
});
