import {http} from "@/plugins/axios";
import {ApiResult} from "@/types/tools";
import {ExamRoom} from "@/types/api-exam-room";

// 查询所有考场
export function ApiGetExamRoom(classesId?: number): ApiResult<ExamRoom[]> {
    return http.request({
        url: "exam-room",
        method: "get",
        params: {
            'classesId': classesId
        }
    });
}

export function ApiGetExamDetail(examId: number): ApiResult<ExamRoom> {
    return http.request({
        url: "exam-room/" + examId,
        method: "get"
    })
}

export function ApiSubmitExamRoom(examRoom: ExamRoom) {
    return http.request({
        url: "exam-room",
        method: 'post',
        data: examRoom
    })
}