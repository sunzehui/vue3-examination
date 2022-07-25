import {http} from "@/plugins/axios";
import {Resp} from "@/plugins/axios/Axios";
import {ClassesResult} from "@/types/api-classes";

export function ApiFindClassesDetail(id: number) {
    return http.request<null>({
        url: `classes/${id}`,
        method: "GET",
    });
}


export function ApiFindClassesList(): Promise<Resp<ClassesResult[]>> {
    return http.request<ClassesResult[]>({
        url: "classes",
        method: 'get'
    })
}

export function ApiJoinClass(id: number): Promise<Resp<ClassesResult>> {
    return http.request({
        url: 'classes/join/' + id,
        method: 'post'
    })
}
