import {defineStore} from "pinia";
import {ApiGetExamDetail, ApiGetExamPaper, ApiGetExamRoom} from "@/apis/exam-room";
import {get, isEmpty, isNil} from "lodash";
import {ExamPaper} from "@/types/api-exam-paper";
import {AnswerRecord, ExamRoom} from "@/types/api-exam-room";

export const useExamStore = defineStore('exam', {
    state() {
        return {
            exam_id: null,
            examPaper: {} as ExamPaper,
            examRoom: {} as ExamRoom,
            userAnswer: [] as AnswerRecord[]
        }
    },
    actions: {
        async getExamPaperId(examRoomId: number) {
            const result = await ApiGetExamDetail(examRoomId);
            this.examRoom = result.data;
            return get(result, 'data.use_exam_paper.id', null);
        },
        async getExamPaper(examRoomId: number) {
            const examPaperId = await this.getExamPaperId(examRoomId);
            if (!examPaperId) {
                return null;
            }
            const result = await ApiGetExamPaper(examRoomId)
            this.examPaper = result.data;
            return result.data;
        },
    },
    getters: {
        examQList(state) {
            return get(state, 'examPaper.question', null);
        },
        isQListEmpty(state) {
            const qList = get(state, 'examPaper.question');
            return (isNil(qList)) || (isEmpty(qList));
        }
    }
})