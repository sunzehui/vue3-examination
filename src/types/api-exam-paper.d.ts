import FillblankQ from "@/components/fillblank-q";

export interface ExamPaper {
    id: number,
    name: string,
    question: Question[],
}

export enum QType {
    choice = 0,
    fill_blank = 1,
}

interface QuestionBase {
    id: number;
    content: string;
    resolution: string;
    create_time: string;
}


export interface FillBlank {
    pos: string;
}

export interface Choice {
    content: string;
    is_answer: boolean;
    resolution: string;
}

export type Question = (
    | {
    type: QType.choice;
    answer: Choice[];
}
    | {
    type: QType.fill_blank;
    answer: FillBlank[];
}
    ) & QuestionBase;