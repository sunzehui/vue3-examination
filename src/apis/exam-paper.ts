import {ApiResult} from "@/types/tools";
import {http} from "@/plugins/axios";
import {ExamPaper} from "@/types/api-exam-paper";

export function ApiGetExamPaper(id?: number): ApiResult<ExamPaper[]> {
    let url = 'exam-paper'
    if (id) {
        url = url.concat('/' + id)
    }
    return http.request({
        url,
        method: "get",
    });
}