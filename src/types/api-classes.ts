interface ClassesResult {
    id: number;
    name: string;
    create_time: string;
    created_by: Users;
    users: Users[];
}

interface IUsers {
    id: number;
    username: string;
    nickname: string;
    create_time: string;
    user_type: number;
}

export type Users = Partial<IUsers>;

export interface nameOption {
    label: string;
    value: string;
}
