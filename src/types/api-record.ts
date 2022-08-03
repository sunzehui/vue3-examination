interface ExamPaper {
    id: number;
    desc: string;
    name: string;
    create_time: string;
}

interface ExamRoom {
    id: number;
    desc: string;
    name: string;
    create_time: string;
    begin_time: string;
    end_time: string;
    for_classes: ForClasses;
}

interface ForClasses {
    id: number;
    name: string;
    create_time: string;
}


export interface ExamRecord {
    id: number;
    create_time: string;
    submit_time: string;
    answer: string;
    score: number;
    user: User;
    exam_room: ExamRoom;
    exam_paper: ExamPaper;
}

interface User {
    id: number;
    username: string;
    nickname: string;
    create_time: string;
    user_type: number;
}

export interface SanitizeExamRecord {
    exam_name: string,
    paper_name: string,
    classes: string,
    score: number,
    begin_time: string,
    end_time: string
}

interface Answer {
    id: number;
    content: string;
    is_answer: boolean;
}

export interface ChoiceQAnswerRecord {
    standAnswer: StandAnswer;
    userAnswer: number[];
    isAnswerTruly: boolean;
    qScore: number;
    type: number;
}

interface StandAnswer {
    id: number;
    content: string;
    resolution: string;
    create_time: string;
    score: number;
    type: number;
    answer: Answer[];
}

interface Answer {
    id: number;
    pos: string;
    content: string;
    score: number;
}

export interface FillBlankQRecord {
    standAnswer: StandAnswer;
    userAnswer: UserAnswer[];
    type: number;
    qScore: number;
}

interface StandAnswer {
    id: number;
    content: string;
    resolution: string;
    create_time: string;
    score: number;
    type: number;
    answer: Answer[];
}

interface UserAnswer {
    isAnswerTruly: boolean;
    pos: string;
    content: string;
}

