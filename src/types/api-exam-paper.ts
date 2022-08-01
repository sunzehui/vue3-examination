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

export type ExamineesPaperDto = (
    | {
    type: QType.choice;
    answer: Choice[];
}
    | {
    type: QType.fill_blank;
    answer: FillBlank[];
}
    ) & {
    qId: number;
};


interface AnswerRecord {
    standAnswer: StandAnswer[];
    userAnswer: UserAnswer[];
    isAnswerTruly?: boolean;
    qScore: number;
    type: number;
}

export interface PaperResult {
    answerRecord: AnswerRecord[];
    totalScore: number;
}

interface StandAnswer {
    id: number;
    pos: string;
    content: string;
    score: number;
}

interface UserAnswer {
    isAnswerTruly: boolean;
    pos: string;
    content: string;
}