import axios, { AxiosRequestConfig } from "axios";
import errorStore from "@/store/errorStore";
import { ElLoading, ElMessage } from "element-plus";
interface Resp<T> {
  data: T,
  message:string,
  statusCode:number;
}
export default class Axios {
  private instance;
  private loading: any;
  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config);
    this.interceptors();
  }
  public async request<T, D = Resp<T>>(config: AxiosRequestConfig) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.instance.request<D>(config)
        resolve(response.data)
      } catch (error) {
        reject(error)
      }
    }) as Promise<D>
  }

  private interceptors() {
    this.interceptorsRequest();
    this.interceptorsResponse();
  }

  private interceptorsRequest() {
    this.instance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        this.loading = ElLoading.service({
          background: "rgba(255,255,255,0.1)",
        });
        errorStore().resetError();
        config.headers = {
          Accept: "application/json",
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
        const {
          response: { status, data },
        } = error;
        const { message } = data;
        switch (status) {
          case 422:
            errorStore().setErrors(error.response.data.errors);
            break;
          case 401:
            ElMessage({ type: "error", message: message ?? "没有操作权限" });
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
              ElMessage({ type: "error", message: message ?? "服务器错误" });
            }
        }
        return Promise.reject(error);
      }
    );
  }
}
