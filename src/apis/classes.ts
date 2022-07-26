import {http} from "@/plugins/axios";
import {Resp} from "@/plugins/axios/Axios";
import {ClassesResult} from "@/types/api-classes";

type ApiResult<T> = Promise<Resp<T>>

export function ApiFindClassesDetail(id: number) {
    return http.request<null>({
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

export function ApiJoinClass(id: number): ApiResult<ClassesResult> {
    return http.request({
        url: "classes/join/" + id,
        method: "post",
    });
}
