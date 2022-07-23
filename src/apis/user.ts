import {http} from "@/plugins/axios";
import {AxiosRequestConfig} from "axios";

export function ApiLogin(username: string, password: string) {
    return http.request<LoginResult>(<AxiosRequestConfig>{
        url: `auth/login`,
        method: "POST",
        data: {
            username,password
        }
    });
}
