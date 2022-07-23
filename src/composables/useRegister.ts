import {ref} from "vue";
import {ElMessage} from "element-plus";
import {ApiLogin, ApiRegister} from "@/apis/user";
import {useUserStore} from "@/store/user";
import {useRouter} from "vue-router";

export default function useRegister() {
    const username = ref("");
    const password = ref("");
    const userStore = useUserStore()

    const router = useRouter();

    const usernameRule = (value) => {
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
        };
        const registerResult = await ApiRegister(user)
        if (registerResult.statusCode !== 200) {
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
    return {
        onSubmit, username, password, usernameRule, passwordRule
    }
}