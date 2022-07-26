import { ref } from "vue";
import { useUserStore } from "@/store/user";
import { useRouter } from "vue-router";
import { ApiLogin } from "@/apis/user";
import { isEmpty } from "lodash-es";

export default function () {
  // 预览模式下方便预览
  const isPreview = import.meta.env.MODE === "preview";
  const username = ref(isPreview ? "sunzehui233" : "");
  const password = ref(isPreview ? "sunzehui233" : "");
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
    const user = {
      username: unref(username),
      password: unref(password),
    };
    const loginResult = await ApiLogin(user);
    if (loginResult.statusCode === 200) {
      userStore.setUser(loginResult.data);
      await router.push({
        name: "home",
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
