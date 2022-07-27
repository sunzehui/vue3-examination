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


interface ExamPaper {
    id: number;
    name: string;
    create_time: string;
}

export class Choice {
    content: string;
}

export class FillBlank {
    pos: string;
    content: string;
}

export interface ChoiceRecord {
    type: QType.choice
    answer: Choice[]
}

export interface FillBlankRecord {
    type: QType.fill_blank,
    answer: FillBlank[]
}

export type AnswerRecord = ChoiceRecord | FillBlankRecord & {
    qId: number;
};

