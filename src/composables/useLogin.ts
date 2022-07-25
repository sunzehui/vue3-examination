import { ref } from "vue";
import { useUserStore } from "@/store/user";
import { useRouter } from "vue-router";
import { ApiLogin } from '@/apis/user';

export default function(){
    const username = ref("");
    const password = ref("");
    const router = useRouter();
    const userStore = useUserStore();

    const usernameRule = (username:unknown) => {
        const isEmpty = username.length === 0;
        if (isEmpty) {
            return "用户名不能为空！";
        }
        const isEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(username);
        if (isEmail) {
            return true;
        }
        const isValidName = /^[a-zA-Z0-9]{6,18}$/.test(username);
        if (isValidName) {
            return true;
        }
        return "用户名不符合规范，请检查！";
    };

    const passwordRule = (password) => {
        const notEmpty = password.length > 0;
        const isValid = /(?=^.{6,}$).*$/.test(password);
        return notEmpty && isValid;
    };
    
    const onSubmit = async () => {
        const user = await ApiLogin(unref(username),unref(password));
        console.log(user)
        // if (user) {
        //     userStore.setToken(user.data.token);
        //     router.push({
        //         path: "/memo",
        //     });
        // }
    };
    return {
        username,password,usernameRule,passwordRule,onSubmit
    }
}