import {ClassesResult, Users} from "@/types/api-classes";

export interface ExamRoom {
    id: number;
    name: string;
    create_time: string;
    begin_time: string;
    end_time: string;
    created_by: Users,
    for_classes: ClassesResult
}

