import {highlight} from "prismjs";
import {http} from "@/plugins/axios";
import {ApiResult} from "@/types/tools";
import {ExamRecord} from "@/types/api-record";

export function ApiGetExamRecord(id?: number): ApiResult<ExamRecord[]|ExamRecord> {
    let url = `exam-record/${id}`
    if (!id) url = 'exam-record'
    return http.request({
        url,
        method: 'get'
    })
}
