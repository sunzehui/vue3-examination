import {http} from "@/plugins/axios";
import {AxiosRequestConfig} from "axios";

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

