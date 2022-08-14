import {defineStore} from "pinia";
import {ApiGetExamDetail} from "@/apis/exam-room";
import {ApiGetExamPaper, ApiSubmitPaper} from "@/apis/exam-paper";
import {cloneDeep, filter, get, isEmpty, isNil, keyBy, map, sortBy} from "lodash";
import {ExamineesPaperDto, ExamPaper, FillBlank, QStatus, QType, Question} from "@/types/api-exam-paper";
import {AnswerRecord, ChoiceRecord, ExamRoom, FillBlankRecord, RIdKeyAnswerRecord} from "@/types/api-exam-room";
import {useUserStore} from "@/store/user";
import {Role} from "@/types/api-user";
import {useSocket} from "@/composables/useSocket";

const userStore = useUserStore()

enum RecordActionType {
    get,
    set,
}

export const useExamStore = defineStore('exam', {
    state() {
        const {socket} = useSocket()

        return {
            exam_id: null,
            examPaper: {} as ExamPaper,
            examRoom: {} as ExamRoom,
            userAnswer: {} as RIdKeyAnswerRecord,
            server: socket
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
        async recordAnswer2Server(data: any) {
            this.server.emit("userAnswerRecord", {
                action: RecordActionType.set,
                examRoomId: this.examRoom.id,
                data
            })
        },
        async updateRecord(result: any) {
            this.userAnswer = result || []
        },
        async updateFBQ(roomId: number, qId: number, item: FillBlank /*answer*/, input: string) {
            const userAnswer = this.userAnswer[roomId] as AnswerRecord[] || []
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

            // set [roomid,userid] and result to server
            // refresh userAnswer
            const _userAnswer = cloneDeep(this.userAnswer);

            _userAnswer[roomId] = userAnswer
            await this.recordAnswer2Server(_userAnswer)
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

            const _userAnswer = cloneDeep(this.userAnswer);
            _userAnswer[roomId] = userAnswer
            await this.recordAnswer2Server(_userAnswer)
        },
        async submitPaper(roomId: number) {
            const paperId = this.examPaper.id;
            const thisAnswer = this.userAnswer[roomId] as ExamineesPaperDto[]
            if (isNil(thisAnswer)) throw new Error('cant find record');
            return await ApiSubmitPaper(paperId, roomId, thisAnswer);
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
                // 分析学生已作答题目，得出所有题目状态
                const allQ =
                    sortBy(get(state, 'examPaper.question', null), 'type') as (Question & { status: QStatus })[];
                if (!allQ) return []
                const recordQById = keyBy(get(state, ['userAnswer', rid]), 'qId');
                return allQ.map((q, idx) => {
                    let status = QStatus.none;
                    const useAnswerCount = get(recordQById[q.id], 'answer.length')
                    // 如果题目作答记录不存在，立即返回none
                    if (!useAnswerCount) {
                        return {
                            ...q, status, idx
                        }
                    }

                    if (q.type === QType.choice) {
                        // 选择题只需要选中一个即为已作答
                        status = useAnswerCount > 0 ? QStatus.complete : QStatus.none
                    } else if (q.type === QType.fill_blank) {
                        const answer = recordQById[q.id].answer as FillBlankRecord['answer']
                        const everyAnswerFill = answer.every(a => a.content !== '')
                        const someAnswerFill = answer.some(a => a.content !== '')

                        if (everyAnswerFill) {
                            // 填空题已作答的条件是：所有空位已填充答案
                            status = QStatus.complete
                        } else if (someAnswerFill) {
                            // 填空题未完全做完的条件是：部分空位已填充答案
                            status = QStatus.half
                        } else {
                            status = QStatus.none
                        }

                    }
                    return {
                        ...q, status, idx
                    }
                })
            }

        }
    },
})