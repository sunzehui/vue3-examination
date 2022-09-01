import {http} from "@/plugins/axios";
import {ApiResult} from "@/types/tools";
import {ExamRecord} from "@/types/api-record";

export function ApiGetExamRecord(
    id?: number
): ApiResult<ExamRecord[] | ExamRecord> {
    let url = `exam-record/${id}`;
    if (!id) url = "exam-record";
    return http.request({
        url,
        method: "get",
    });
}

export function ApiGetClassesExamRecord(
    roomId: number,
    classesId: number
): ApiResult<ExamRecord[]> {
    return http.request({
        url: "exam-record/classes/" + classesId,
        method: "get",
        params: {
            roomId,
        },
    });
}

export function ApiGetExamStatistic(classesId: number): ApiResult<any> {
    return http.request({
        url: "exam-record/statistic",
        method: "get",
        params: {
            classesId,
        },
    });
}
