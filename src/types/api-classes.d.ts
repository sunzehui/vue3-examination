interface ClassesResult {
    id: number;
    name: string;
    create_time: string;
    users: Users[];
}

interface IUsers {
    id: number;
    username: string;
    nickname: string;
    create_time: string;
    user_type: number;
}

export type Users = Partial<IUsers>
