import {defineStore} from "pinia";
import {useLocalStorage} from "@vueuse/core";
import {get, isNil, now} from "lodash";
import {LoginResult,} from "@/types/api-user";


export const useUserStore = defineStore("user", {
    state: () => {
        return {
            user: useLocalStorage('user', {} as LoginResult)
        }
    },
    actions: {
        setUser(user: LoginResult) {
            this.user.userInfo = user.userInfo;
            this.user.token = user.token;
            this.user.token.expires = now() + user.token.expires * 1000;
        },
    },
    getters: {
        isAuthenticated: (state) => {
            const tokenVal = get(state, 'user.token.value')
            const tokenExp = get(state, 'user.token.expires')
            if (isNil(tokenVal) || isNil(tokenExp)) {
                return false
            }
            return tokenVal !== "" && tokenExp > Date.now();
        },
        username: (state) => {
            return state.user.userInfo.username;
        },
        token: (state) => {
            return state.user.token.value;
        },
        role: (state) => {
            return state.user.userInfo.role;
        }
    }
});
