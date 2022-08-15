import {Resp} from "@/types/api";

export type ApiResult<T> = Promise<Resp<T>>
