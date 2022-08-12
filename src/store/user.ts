import {defineStore} from "pinia";
import {useLocalStorage} from "@vueuse/core";
import {get, isNil, now} from "lodash";
import {LoginResult, UserProfile,} from "@/types/api-user";
import {ApiGetUserProfile, ApiUploadAvatar} from "@/apis/user";
import {getAvatarPath} from "@/utils/tools";
import router from '@/router/register'

export const useUserStore = defineStore("user", {
    state: () => {
        return {
            user: useLocalStorage('user', {} as Partial<LoginResult>),
            userProfile: useLocalStorage("userProfile", {} as Partial<UserProfile>)
        }
    },
    actions: {
        setUser(user: LoginResult) {
            this.user.userInfo = user.userInfo;
            this.user.token = user.token;
            this.user.token.expires = now() + user.token.expires * 1000;
        },
        async getUserProfile() {
            const result = await ApiGetUserProfile()
            this.userProfile = result.data;
        },
        async uploadAvatar(file: File, fileName: string) {
            const result = await ApiUploadAvatar(file, fileName);
            if (result.statusCode === 200) {
                await this.getUserProfile()
            }
        },
        async logout() {
            this.userProfile = {};
            this.user = {}
            await router.push({name: "login"})
        }
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
            return get(state, 'user.userInfo.username');
        },
        token: (state) => {
            return get(state, 'user.token.value');
        },
        role: (state) => {
            return get(state, 'user.userInfo.role');
        },
        roleFormat: state => {
            return get(state, 'user.userInfo.role') === 1 ? '教师' : '学生'
        },
        avatar: state => {
            return getAvatarPath(get(state, 'userProfile.avatar_url', 'default_avatar.png'))
        }
    }
});
