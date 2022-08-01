import axios, {AxiosError, AxiosRequestConfig} from "axios";
import errorStore from "@/store/errorStore";
import {ElLoading, ElMessage} from "element-plus";
import {useLocalStorage} from "@vueuse/core";
import {get} from "lodash";


export interface Resp<D = any> {
    data: D,
    message: string,
    statusCode: number;
}

function getToken() {
    const user = useLocalStorage('user', {})
    return get(unref(user), 'token.value');
}

export default class Axios {
    private instance;
    private loading: any;

    constructor(config: AxiosRequestConfig) {
        this.instance = axios.create(config);
        this.interceptors();
    }

    public async request<T = any, D = Resp<T>>(config: AxiosRequestConfig): Promise<D> {
        try {
            const response = await this.instance.request<D>(config)
            return response.data;
        } catch (e: unknown) {
            if (axios.isAxiosError(e)) {
                const response = get(e, 'response', null)
                if (response)
                    return response.data;
            }
            throw e;
        }
    }

    private interceptors() {
        this.interceptorsRequest();
        this.interceptorsResponse();
    }

    private interceptorsRequest() {
        this.instance.interceptors.request.use(
            (config: AxiosRequestConfig) => {
                this.loading = this.loading ?? ElLoading.service({
                    background: "rgba(255,255,255,0.1)",
                    fullscreen: false
                })
                const token = getToken();
                errorStore().resetError();
                config.headers = {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`
                };
                return config;
            },
            (error: any) => {
                return Promise.reject(error);
            }
        );
    }

    private interceptorsResponse() {
        this.instance.interceptors.response.use(
            (response) => {
                this.loading.close();
                if (response.data?.message) {
                    ElMessage({
                        type: "success",
                        message: response.data.message,
                        grouping: true,
                        duration: 2000,
                    });
                }
                return response;
            },
            (error) => {
                this.loading.close();
                if (!error.response) {
                    return Promise.reject(error)
                }
                const {
                    response: {status, data},
                } = error;
                const {message} = data;
                switch (status) {
                    case 422:
                        ElMessage.error(message)
                        break;
                    case 401:
                        ElMessage({type: "error", message: message ?? "没有操作权限"});
                        break;
                    case 404:
                        // router.push('404')
                        break;
                    case 429:
                        ElMessage({
                            type: "error",
                            message: message ?? "请示过于频繁，请稍候再试",
                        });
                        break;
                    default:
                        if (message) {
                            ElMessage({type: "error", message: message ?? "服务器错误"});
                        }
                }
                return Promise.reject(error);
            }
        );
    }
}
