import { ref } from "vue";
import { useUserStore } from "@/store/user";
import { useRouter } from "vue-router";
import { ApiLogin } from "@/apis/user";
import { isEmpty } from "lodash"
export default function () {
  const username = ref("");
  const password = ref("");
  const router = useRouter();
  const userStore = useUserStore();

  const usernameRule = (username: unknown) => {
    if (typeof username !== "string") {
      return false;
    }
    if (isEmpty(username)) {
      return "用户名不能为空！";
    }
    const isEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
      username
    );
    const isValidName = /^[a-zA-Z0-9]{6,18}$/.test(username);
    if (isEmail || isValidName) {
      return true;
    }
    return "用户名不符合规范，请检查！";
  };

  const passwordRule = (password: unknown) => {
    if (typeof password !== "string") {
      return false;
    }
    const notEmpty = !isEmpty(password);
    const isValid = /(?=^.{6,}$).*$/.test(password);
    return notEmpty && isValid;
  };

  const onSubmit = async () => {
    const loginResult = await ApiLogin(unref(username), unref(password));
    if (loginResult) {
        userStore.setUser(loginResult.data);
        await router.push({
          path: "/panel",
        });
    }
  };
  return {
    username,
    password,
    usernameRule,
    passwordRule,
    onSubmit,
  };
}
