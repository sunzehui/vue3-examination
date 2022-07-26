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
