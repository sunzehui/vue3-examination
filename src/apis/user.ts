import {http} from "@/plugins/axios";
import {AxiosRequestConfig} from "axios";
import {LoginResult, UserProfile} from "@/types/api-user";
import {ApiResult} from "@/types/tools";

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

export function ApiGetClassesListToRegister(): ApiResult<{ id: number, name: string }[]> {
    return http.request({
        url: `classes/anonymous`,
        method: 'get'
    })
}

export function ApiGetUserProfile(): ApiResult<UserProfile> {
    return http.request(<AxiosRequestConfig>{
        url: `user/me`,
        method: "GET",
    });
}

export function ApiUpdateProfile(user: any): ApiResult<UserProfile> {
    return http.request({
        url: 'user',
        method: 'patch',
        data: user
    })
}

export function ApiUploadAvatar(file: File, fileName: string): ApiResult<UserProfile> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('name', fileName)
    return http.request({
        url: `user/avatar`,
        method: "PATCH",
        data: formData,
    })
}

