import { http } from "@/plugins/axios";

export function findOne(id: number) {
  return http.request<null>({
    url: `classes/${id}`,
    method: "GET",
  });
}
