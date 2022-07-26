import {Resp} from "@/plugins/axios/Axios";

export type ApiResult<T> = Promise<Resp<T>>
