import {http} from "@/plugins/axios";
import {AxiosRequestConfig} from "axios";
import {LoginResult} from "@/types/api-user";

interface IUser {
    username: string,
    password: string
}

export function ApiLogin(user: IUser) {
    return http.request<LoginResult>(<AxiosRequestConfig>{
        url: `auth/login`,
        method: "POST",
        data: user
    });
}


export function ApiRegister(user: IUser) {
    return http.request<LoginResult>(<AxiosRequestConfig>{
        url: `user/register`,
        method: "POST",
        data: user
    });
}

