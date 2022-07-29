import {FillBlank, QType} from "@/types/api-exam-paper";

export interface CreateQuestion {
    type: QType.choice,
    resolution: string,
    content: string,
    answer: (Choice | FillBlank)[]
}

export interface CreateQResult {
    choice: Choice[];
    q_type: number;
    content: string;
    resolution: string;
    id: number;
    create_time: string;
}

export interface Choice {
    content: string;
    is_answer: boolean;
    id: number;
    score: number;
}
