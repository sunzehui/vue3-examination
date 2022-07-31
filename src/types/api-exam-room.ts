import {ClassesResult, Users} from "@/types/api-classes";
import {FillBlank, QType} from "@/types/api-exam-paper";

export interface ExamRoom {
    id: number;
    name: string;
    create_time: string;
    begin_time: string;
    end_time: string;
    created_by: Users,
    for_classes: ClassesResult,
    use_exam_paper?: ExamPaper;
}

type Override<P, S> = Omit<P, keyof S> & S;

// export type ExamRoomReq = Override<ExamRoom, {}>

interface ExamPaper {
    id: number;
    name: string;
    create_time: string;
}


export interface ChoiceRecord {
    type: QType.choice;
    answer: number[]
}

export interface FillBlankRecord {
    type: QType.fill_blank,
    answer: FillBlank[]
}

export type AnswerRecord = (ChoiceRecord | FillBlankRecord) & {
    qId: number;
};

