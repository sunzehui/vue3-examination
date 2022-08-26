import {http} from "@/plugins/axios";
import {ApiResult} from "@/types/tools";
import {ExamRoom} from "@/types/api-exam-room";
import {MaybeRef} from "@vueuse/core";

// 查询所有考场
export function ApiGetExamRoom(classesId?: MaybeRef<number | null>): ApiResult<ExamRoom[]> {
    const id = unref(classesId)
    return http.request({
        url: "exam-room",
        method: "get",
        params: {
            'classesId': id
        }
    });
}

export function ApiGetExamDetail(examId: number): ApiResult<ExamRoom> {
    return http.request({
        url: "exam-room/" + examId,
        method: "get"
    })
}

export function ApiCreateExamRoom(examRoom: Partial<ExamRoom>) {
    return http.request({
        url: "exam-room",
        method: 'post',
        data: examRoom
    })
}