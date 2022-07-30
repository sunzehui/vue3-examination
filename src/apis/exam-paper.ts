import {ApiResult} from "@/types/tools";
import {http} from "@/plugins/axios";
import {ExamPaper} from "@/types/api-exam-paper";

export function ApiGetExamPaper(id?: number)
    : ApiResult<typeof id extends undefined ? ExamPaper[] : ExamPaper> {

    let url = 'exam-paper'
    if (id) {
        url = url.concat('/' + id)
    }
    return http.request({
        url,
        method: "get",
    });
}

export function ApiAddQuestion2Paper(p_id: number, q_id: number) {
    return http.request({
        url: `exam-paper/${p_id}/question`,
        method: "patch",
        params: {q_id}
    })
}