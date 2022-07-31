import {ApiResult} from "@/types/tools";
import {http} from "@/plugins/axios";
import {ExamPaper} from "@/types/api-exam-paper";

export function ApiGetExamPaperList(): ApiResult<ExamPaper[]> {
    return http.request({
        url: 'exam-paper',
        method: 'get'
    })
}

export function ApiGetMyExamPaper() {
    return http.request({
        url: "exam-paper/mine",
        method: 'get'
    })
}

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

export function ApiCreatePaper(createPaperReq) {
    return http.request({
        url: "exam-paper",
        method: "post",
        data: createPaperReq
    })
}