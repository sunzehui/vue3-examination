import {http} from "@/plugins/axios";
import {AxiosRequestConfig} from "axios";
import {QType} from "@/types/api-exam-paper";
import {CreateQResult, CreateQuestion} from "@/types/api-question";
import {ApiResult} from "@/types/tools";


export function ApiCreateQuestion(Q: CreateQuestion): ApiResult<CreateQResult[]> {
    return http.request({
        url: `question`,
        method: "POST",
        data: [Q]
    });
}