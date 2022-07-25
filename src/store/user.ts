import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";

// import jwtDecode from "jwt-decode";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      token: useLocalStorage("token", {
        token: "",
        expires: 0,
      }),
      userInfo: useLocalStorage("userInfo", {
        last_login: "",
        daily_grid: {},
        username: "浮墨用户",
      }),
    };
  },
  actions: {
    setToken(_token: ILoginResp["token"]) {
      const token = _token.token;
      const expires = jwtDecode(_token.token).exp * 1000;
      this.token = {
        token,
        expires,
      };
    },
  },
  getters: {
    isAuthenticated: (state) => {
      return state.token.token !== "" && state.token.expires > Date.now();
    },
    username: (state) => {
      return state.userInfo.username;
    },
  },
});
