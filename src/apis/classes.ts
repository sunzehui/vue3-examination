import {http} from "@/plugins/axios";
import {Resp} from '@/types/api'
import {ClassesResult} from "@/types/api-classes";

type ApiResult<T> = Promise<Resp<T>>

export function ApiFindClassesDetail(id: number): ApiResult<ClassesResult> {
    return http.request({
        url: `classes/${id}`,
        method: "GET",
    });
}

export function ApiFindClassesStudent(id: number): ApiResult<ClassesResult> {
    return http.request({
        url: `classes/${id}/student`,
        method: "get",
    });
}

export function ApiFindClassesList(): ApiResult<ClassesResult[]> {
    return http.request<ClassesResult[]>({
        url: "classes",
        method: "get",
    });
}

export function ApiFindMyClasses(): ApiResult<ClassesResult[]> {
    return http.request({
        url: "classes/mine",
        method: 'get'
    })
}

export function ApiJoinClass(id: number): ApiResult<ClassesResult> {
    return http.request({
        url: "classes/join/" + id,
        method: "post",
    });
}
