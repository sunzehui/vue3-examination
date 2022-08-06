export enum Role {
    student = 0,
    teacher = 1
}

export interface LoginResult {
    userInfo: UserInfo;
    token: Token;
}

export interface Token {
    value: string;
    expires: number;
}

export interface UserInfo {
    id: number;
    username: string;
    role: Role;
}

interface JoinClasses {
    id: number;
    name: string;
    create_time: string;
}

export interface UserProfile {
    id: number;
    username: string;
    nickname: string;
    create_time: string;
    user_type: number;
    avatar_url: string,
    join_classes: JoinClasses[];
    created_classes: any[];
}

