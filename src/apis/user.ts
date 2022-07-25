import { http } from "@/plugins/axios";

export function ApiLogin(username:string,password:string) {
  return http.request<null>({
    url: `auth/login`,
    method: "POST",
    data:{
        username,password
    }
  });
}
