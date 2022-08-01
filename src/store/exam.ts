import {defineStore} from "pinia";
import {ApiGetExamDetail} from "@/apis/exam-room";
import {ApiGetExamPaper, ApiSubmitPaper} from "@/apis/exam-paper";
import {filter, get, isEmpty, isNil, keyBy, map, sortBy} from "lodash";
import {ExamineesPaperDto, ExamPaper, FillBlank, QStatus, QType, Question} from "@/types/api-exam-paper";
import {AnswerRecord, ChoiceRecord, ExamRoom, FillBlankRecord, RIdKeyAnswerRecord} from "@/types/api-exam-room";
import {useLocalStorage} from "@vueuse/core";
import {useUserStore} from "@/store/user";
import {Role} from "@/types/api-user";

const userStore = useUserStore()

export const useExamStore = defineStore('exam', {
    state() {
        return {
            exam_id: null,
            examPaper: {} as ExamPaper,
            examRoom: {} as ExamRoom,
            userAnswer: useLocalStorage('userAnswer', {} as RIdKeyAnswerRecord)
        }
    },
    actions: {
        async getExamPaperId(examRoomId: number) {
            const result = await ApiGetExamDetail(examRoomId);
            this.examRoom = result.data;
            return get(result, 'data.use_exam_paper.id', null);
        },
        async getExamPaperByRoomId(examRoomId: number) {
            const examPaperId = await this.getExamPaperId(examRoomId);
            if (!examPaperId) {
                return null;
            }
            const result = await ApiGetExamPaper(examPaperId)
            this.examPaper = result.data;
            return result.data;
        },
        async getExamPaper(examPaperId: number) {
            const result = await ApiGetExamPaper(examPaperId)
            this.examPaper = result.data;
            return result.data;
        },
        async updateFBQ(roomId: number, qId: number, item: FillBlank /*answer*/, input: string) {
            const userAnswer = this.userAnswer[roomId] as AnswerRecord[]
            const oldQIdx = userAnswer.findIndex(Q => Q.qId === qId);
            const oldQ = userAnswer[oldQIdx] as FillBlankRecord;
            const thisAnswer = {
                content: input,
                pos: item.pos,
                id: item.id
            };
            if (isNil(oldQ) || isEmpty(oldQ)) {
                userAnswer.push({
                    qId,
                    type: QType.fill_blank,
                    answer: [thisAnswer]
                })
            } else {
                // 如果已经存在Q，判断answer存在
                const answerIdx = (userAnswer[oldQIdx] as FillBlankRecord).answer.findIndex(a => a.id === item.id);
                if (answerIdx >= 0) {
                    // 存在则覆盖
                    oldQ.answer[answerIdx] = thisAnswer;
                } else {
                    // 不存在则添加
                    oldQ.answer.push(thisAnswer);
                }
                (userAnswer[oldQIdx] as FillBlankRecord) = oldQ;
            }
            this.userAnswer[roomId] = userAnswer
        },
        async updateCQ(roomId: number, id: number, answer: number[]) {
            const userAnswer = this.userAnswer[roomId] as AnswerRecord[] || []
            const thisAnswer: AnswerRecord = {
                qId: id,
                type: QType.choice,
                answer
            }
            const QIdx = userAnswer.findIndex(q => q.qId === id);
            if (QIdx >= 0) {
                userAnswer[QIdx].answer = answer;
            } else {
                userAnswer.push(thisAnswer);
            }
            this.userAnswer[roomId] = userAnswer

        },
        async submitPaper(roomId: number) {
            const paperId = this.examPaper.id;
            const thisAnswer = this.userAnswer[roomId] as ExamineesPaperDto[]
            if (isNil(thisAnswer)) throw new Error('cant find record');
            const result = await ApiSubmitPaper(paperId, roomId, thisAnswer);
            return result;
        }

    },
    getters: {
        examQList(state) {
            return sortBy(get(state, 'examPaper.question', null), 'type');
        },
        isQListEmpty(state) {
            const qList = get(state, 'examPaper.question');
            return (isNil(qList)) || (isEmpty(qList));
        },
        thisBlankContent(state) {
            return (rid: number, qId: number, blankId: number | undefined) => {
                const userAnswer = state.userAnswer[rid] || []
                const blankQ = userAnswer.find(q => q.qId === qId) as (FillBlankRecord | null);
                if (!blankQ) return ''
                const blankA = blankQ.answer.find(a => a.id === blankId) || {content: ""};
                return blankA.content;
            }
        },
        thisChoiceValue(state) {
            return (rid: number, Q: Question) => {
                const userRole = userStore.role;
                const userAnswer = state.userAnswer[rid] || []
                if (userRole === Role.student) {
                    const choiceQ = userAnswer.find(q => q.qId === Q.id) as (ChoiceRecord | null);
                    if (!choiceQ) return []
                    return choiceQ.answer;
                } else if (userRole === Role.teacher) {
                    // 老师接口附带答案直接获取
                    const rightAnswer = filter(Q.answer, 'is_answer')

                    return map(rightAnswer, 'id');
                }
            }

        },
        userAnswerStatus(state) {
            return (rid: number) => {

                const allQ =
                    sortBy(get(state, 'examPaper.question', null), 'type') as (Question & { status: QStatus })[];
                if (!allQ) return []
                const recordQById = keyBy(get(state, ['userAnswer', rid]), 'qId');
                return allQ.map((q, idx) => {
                    let status = QStatus.none;
                    const useAnswerCount = get(recordQById[q.id], 'answer.length')
                    if (!useAnswerCount) {
                        return {
                            ...q, status, idx
                        }
                    }
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
                        ...q, status, idx
                    }
                })
            }

        }
    }
})