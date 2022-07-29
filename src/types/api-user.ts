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

