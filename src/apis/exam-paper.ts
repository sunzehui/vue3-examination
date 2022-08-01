import {ApiResult} from "@/types/tools";
import {http} from "@/plugins/axios";
import {ExamineesPaperDto, ExamPaper, PaperResult} from "@/types/api-exam-paper";

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
        url: `exam-paper/${p_id}/question/add`,
        method: "patch",
        params: {q_id}
    })
}

export function ApiRemoveQuestion2Paper(p_id: number, q_id: number) {
    return http.request({
        url: `exam-paper/${p_id}/question/remove`,
        method: "patch",
        params: {q_id}
    })
}

export function ApiCreatePaper(createPaperReq: any) {
    return http.request({
        url: "exam-paper",
        method: "post",
        data: createPaperReq
    })
}


export function ApiSubmitPaper(paperId: number, roomId: number, userAnswer: ExamineesPaperDto[]): ApiResult<PaperResult> {
    return http.request({
        url: `exam-paper/${paperId}/submit`,
        method: "post",
        params: {
            room_id: roomId
        },
        data: userAnswer
    })
}
