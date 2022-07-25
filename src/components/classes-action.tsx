import {defineComponent, PropType} from "vue";
import type {DataTableColumns} from 'naive-ui'
import {NButton, NDataTable, NDivider, NText, useDialog} from "naive-ui";
import {Users} from "@/types/api-classes";

export const StuList = defineComponent({
    name: "StuList",
    props: {
        users: {
            type: Array as PropType<Users[]>,
            require: true
        }
    },
    setup(props) {
        const createColumns = (): DataTableColumns<Users> => {
            return [
                {
                    title: '用户名',
                    key: 'username',
                    width: 120,
                },
                {
                    title: '昵称',
                    key: 'nickname'
                }
            ]
        }
        const data: Users[] = props.users || [];
        const columns = createColumns()
        const renderCell = (value: string | number) => {
            if (!value) {
                return h(NText, {depth: 3}, {default: () => '未填写'})
            }
            return value
        }
        return () => <>
            <NDataTable columns={columns} data={data} renderCell={renderCell}/>
        </>
    }
})


export default defineComponent({
    name: "SwitchTag",
    props: {
        clickHandler: {
            type: Function,
            required: true
        },
        userList: {
            type: Array as PropType<Users[]>,
            required: true
        }
    },

    setup(props) {
        const dialog = useDialog()

        const userList = ref(props.userList || []);
        const showStu = () => {
            dialog.info({
                title: '学生列表',
                content: () => <StuList users={userList.value}/>,
                positiveText: '确定',
            })
        }
        watch(() => props.userList, (value) => {
            userList.value = value;
        })
        const joinClasses = async () => {
            await props.clickHandler()
        }
        return () => (
            <>
                <NButton
                    strong
                    tertiary
                    disabled={!userList.value.length}
                    onClick={showStu}
                    size='small'>
                    显示学生
                </NButton>
                <NDivider vertical/>
                <NButton
                    strong
                    tertiary
                    size='small'
                    onClick={joinClasses}
                >
                    加入班级
                </NButton>
            </>
        );
    },
});
