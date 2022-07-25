import {defineStore} from "pinia";
import {useLocalStorage} from "@vueuse/core";
import {get, isEmpty, isNil, now} from "lodash";

const store = {
    state: () => {
        return {
            user: useLocalStorage('user', {})
        }
    },
    actions: {
        setUser(user: LoginResult) {
            this.user.userInfo = user.userInfo;
            this.user.token = user.token;
            this.user.token.expires = now() + user.token.expires*1000;
        },
    },
    getters: {
        isAuthenticated: (state) => {
            const tokenVal = get(state,'user.token.value')
            const tokenExp = get(state,'user.token.expires')
            if(isNil(tokenVal)||isNil(tokenExp)){
                return false
            }
            return tokenVal !== "" && tokenExp > Date.now();
        },
        username: (state) => {
            return state.userInfo.username;
        }
    }
}

export const useUserStore = defineStore("user", store);
