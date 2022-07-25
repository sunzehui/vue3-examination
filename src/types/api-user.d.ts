
interface LoginResult {
  userInfo: UserInfo;
  token: Token;
}
  
interface Token {
  value: string;
  expires: number;
}

interface UserInfo {
  id: number;
  username: string;
  role: number;
}