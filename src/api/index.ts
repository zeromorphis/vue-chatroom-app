/*
 * @Descripttion: 授人以渔，功德无量，利在千秋
 * @version: 4.0.0
 * @Author: 言棠
 * @Date: 2022-09-15 15:28:17
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-05-02 19:52:10
 */
import axios, {
  AxiosInstance,
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { AxiosCanceler } from "./helper/axiosCancel";
import { ResultData } from "@/api/interface";
import { checkStatus } from "./helper/checkStatus";
import { ResultEnum } from "@/enums/httpEnum";
import { useUserStoreWithOut } from "@/store/modules/user";
import { useChatStoreWithOut } from "@/store/modules/chat";
import { useGlobalStoreWithOut } from "@/store/modules/global";
import { router } from "@/router";
import NProgress from "@/utils/nprogress";
import { LOGIN_URL } from "@/config/config";

const axiosCanceler = new AxiosCanceler();

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  loading?: boolean;
  cancel?: boolean;
}

const config = {
  // 默认地址请求地址，可在 .env.** 文件中修改
  baseURL: import.meta.env.VITE_API_URL as string,
  // 设置超时时间
  timeout: ResultEnum.TIMEOUT as number,
  // 跨域时候允许携带凭证
  withCredentials: true,
};

class RequestHttp {
  service: AxiosInstance;
  public constructor(config: AxiosRequestConfig) {
    // 实例化axios
    this.service = axios.create(config);

    /**
     * @description 请求拦截器
     * 客户端发送请求 -> [请求拦截器] -> 服务器
     * token校验(JWT) : 接受服务器返回的token,存储到vuex/pinia/本地储存当中
     */
    this.service.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        const userStore = useUserStoreWithOut();
        // * 将当前请求添加到 pending 中
        // 重复请求不需要取消，在 api 服务中通过指定的第三个参数: { cancel: false } 来控制
        config.cancel ??= true;
        config.cancel && axiosCanceler.addPending(config);
        if (config.headers && typeof config.headers.set === "function") {
          config.headers.set("token", userStore.token);
        }
        NProgress.start();
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    /**
     * @description 响应拦截器
     *  服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
     */
    this.service.interceptors.response.use(
      (response: AxiosResponse & { config: CustomAxiosRequestConfig }) => {
        const useUserStore = useUserStoreWithOut();
        const useChatStore = useChatStoreWithOut();
        const useGlobalStore = useGlobalStoreWithOut();

        const { data, config } = response;
        // * 在请求结束后，移除本次请求，并关闭请求 loading
        axiosCanceler.removePending(config);
        // * 全局错误信息拦截（防止下载文件得时候返回数据流，没有code，直接报错）
        if (response.status === 200 && data.code == 0) {
          NProgress.done();
          return data;
        }
        if (response.status === 200 && data.code == 401) {
          useUserStore.$reset();
          useChatStore.$reset();
          useGlobalStore.$reset();
          router.replace({ path: LOGIN_URL });
          return Promise.reject(data);
        }
        if (response.status === 200 && data.code != 0) {
          return Promise.reject(data);
        }
      },
      async (error: AxiosError) => {
        const { response } = error;
        // 请求超时单独判断，因为请求超时没有 response
        if (error.message.indexOf("timeout") !== -1)
          console.error("请求超时，请稍后再试");
        // 根据响应的错误状态码，做不同的处理
        if (response) checkStatus(response.status);
        // 服务器结果都没有返回(可能服务器错误可能客户端断网)，断网处理:可以跳转到断网页面
        if (!window.navigator.onLine) router.replace({ path: "/500" });
        return Promise.reject(error);
      }
    );
  }

  // * 常用请求方法封装
  get<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
    return this.service.get(url, { params, ..._object });
  }
  post<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
    return this.service.post(url, params, _object);
  }
  put<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
    return this.service.put(url, params, _object);
  }
  patch<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
    return this.service.patch(url, params, _object);
  }
  delete<T>(url: string, params?: any, _object = {}): Promise<ResultData<T>> {
    return this.service.delete(url, { params, ..._object });
  }
  head<T>(url: string, params?: any, _object = {}): Promise<ResultData<T>> {
    return this.service.head(url, { params, ..._object });
  }
  options<T>(url: string, params?: any, _object = {}): Promise<ResultData<T>> {
    return this.service.options(url, { params, ..._object });
  }
}

export default new RequestHttp(config);
