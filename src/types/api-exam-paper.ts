export interface ExamPaper {
    id: number,
    name: string,
    create_time: string,
    question: Question[],
    desc: string,
}

export enum QType {
    choice = 0,
    fill_blank = 1,
}

export enum QStatus {
    none,
    half,
    complete,
    'on-active'
}

interface QuestionBase {
    id: number;
    content: string;
    resolution: string;
    create_time: string;
}


export interface FillBlank {
    pos: number;
    score?: number,
    id?: number,
    content?: string,
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


