import {ref} from "vue";
import {ElMessage} from "element-plus";
import {ApiGetClassesListToRegister, ApiLogin, ApiRegister} from "@/apis/user";
import {useUserStore} from "@/store/user";
import {useRouter} from "vue-router";
import {isEmpty, isNil} from "lodash-es";
import {Role} from "@/types/api-user";

interface classesState {
    show: boolean,
    list: { label: string, value: number }[],
    select: number | null
}

export default function useRegister() {
    const username = ref("");
    const password = ref("");
    const nickname = ref('')
    const userRole = ref(Role.student)

    const classes = reactive<classesState>({
        show: true,
        list: [],
        select: null
    })

    async function init() {
        const classesListResult = await ApiGetClassesListToRegister();
        const classesList = classesListResult.data;
        if (isNil(classesList) || isEmpty(classesList)) {
            classes.show = false
            return;
        }
        classes.list = classesListResult.data.map(item => ({
            label: item.name,
            value: item.id
        }));
    }

    const userStore = useUserStore()


    const router = useRouter();

    const usernameRule = (value) => {
        return true;
        // 用户名可能是邮箱也可能是手机号
        const isEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value);
        if (isEmail) {
            return true;
        }
        const isValidName = /^[a-zA-Z0-9]{6,18}$/.test(value);
        if (isValidName) {
            return true;
        }
        return "用户名不符合规范，请检查！";
    }

    const passwordRule = (value) => {
        return true
        const isValid = /(?=^.{6,18}$).*$/.test(value);
        if (!isValid) {
            return "密码长度为6-18位！";
        }
        return true;
    }


    const onSubmit = async () => {
        const user = {
            username: username.value,
            password: password.value,
            nickname: nickname.value,
            classes: classes.select,
            role: userRole.value
        };
        const registerResult = await ApiRegister(user)
        if (registerResult.statusCode !== 200) {
            ElMessage.error('注册失败')
            return;
        }
        ElMessage.success("注册成功！");
        // 注册后跳转登录
        const loginUser = await ApiLogin(user)
        if (!loginUser) {
            await router.push("/login");
        }
        userStore.setUser(loginUser.data);
        await router.push({
            path: "/panel",
        });
    }
    onMounted(init)
    return {
        onSubmit, userRole, classes, username, password, nickname, usernameRule, passwordRule
    }
}