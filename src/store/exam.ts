import {defineStore} from "pinia";
import {ApiGetExamDetail, ApiGetExamPaper} from "@/apis/exam-room";
import {get, isEmpty, isNil, keyBy} from "lodash";
import {ExamPaper, FillBlank, QStatus, QType, Question} from "@/types/api-exam-paper";
import {AnswerRecord, ChoiceRecord, ExamRoom, FillBlankRecord} from "@/types/api-exam-room";
import {useLocalStorage} from "@vueuse/core";

export const useExamStore = defineStore('exam', {
    state() {
        return {
            exam_id: null,
            examPaper: {} as ExamPaper,
            examRoom: {} as ExamRoom,
            userAnswer: useLocalStorage('userAnswer', [] as AnswerRecord[])
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

        async updateFBQ(qId: number, item: FillBlank /*answer*/, input: string) {
            const oldQIdx = this.userAnswer.findIndex(Q => Q.qId === qId);
            const oldQ = this.userAnswer[oldQIdx] as FillBlankRecord;
            const thisAnswer = {
                content: input,
                pos: item.pos,
                id: item.id
            };
            if (isNil(oldQ) || isEmpty(oldQ)) {
                this.userAnswer.push({
                    qId,
                    type: QType.fill_blank,
                    answer: [thisAnswer]
                })
            } else {
                // 如果已经存在Q，判断answer存在
                const answerIdx = (this.userAnswer[oldQIdx] as FillBlankRecord).answer.findIndex(a => a.id === item.id);
                if (answerIdx >= 0) {
                    // 存在则覆盖
                    oldQ.answer[answerIdx] = thisAnswer;
                } else {
                    // 不存在则添加
                    oldQ.answer.push(thisAnswer);
                }
                (this.userAnswer[oldQIdx] as FillBlankRecord) = oldQ;
            }
        },
        async updateCQ(id: number, answer: number[]) {
            const thisAnswer: AnswerRecord = {
                qId: id,
                type: QType.choice,
                answer
            }
            const QIdx = this.userAnswer.findIndex(q => q.qId === id);
            if (QIdx >= 0) {
                this.userAnswer[QIdx].answer = answer;
            } else {
                this.userAnswer.push(thisAnswer);
            }

        },


    },
    getters: {
        examQList(state) {
            return get(state, 'examPaper.question', null);
        },
        isQListEmpty(state) {
            const qList = get(state, 'examPaper.question');
            return (isNil(qList)) || (isEmpty(qList));
        },
        thisBlankContent(state) {
            return (qId: number, blankId: number) => {
                const blankQ = state.userAnswer.find(q => q.qId === qId) as (FillBlankRecord | null);
                if (!blankQ) return ''
                const blankA = blankQ.answer.find(a => a.id === blankId) || {content: ""};
                return blankA.content;
            }
        },
        thisChoiceValue(state) {
            return (qId: number) => {
                const choiceQ = state.userAnswer.find(q => q.qId === qId) as (ChoiceRecord | null);
                if (!choiceQ) return []
                return choiceQ.answer;
            }
        },
        userAnswerStatus(state) {
            const allQ = state.examPaper.question as (Question & { status: QStatus })[];
            if (!allQ) return []
            const recordQById = keyBy(state.userAnswer, 'qId');
            return allQ.map(q => {
                let status = QStatus.none;
                const useAnswerCount = recordQById[q.id].answer.length
                const everyAnswerEmpty = (recordQById[q.id].answer as FillBlankRecord['answer']).every(a => a.content === '')
                if (q.type === QType.choice) {
                    status = useAnswerCount > 0 ? QStatus.complete : QStatus.none
                } else if (q.type === QType.fill_blank) {
                    status = useAnswerCount === 0 ? QStatus.none : QStatus.half;
                    if (everyAnswerEmpty) {
                        status = QStatus.none
                    }
                    if (q.answer.length === useAnswerCount) {
                        status = QStatus.complete
                    }
                }
                return {
                    ...q, status
                }
            })
        }
    }
})