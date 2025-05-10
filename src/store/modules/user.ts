/*
 * @Author: 言棠
 * @version: 3.0.0
 * @Descripttion: 授人以渔，功德无量，利在千秋
 * @Date: 2022-04-14 20:56:23
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-05-03 17:13:10
 */
import { defineStore } from "pinia";
import { store } from "@/store";
import type { UserState } from "../interface";
import type { Login } from "@/api/interface";
import piniaPersistConfig from "../utils/piniaPersist";
import { loginApi, registerApi } from "@/api/modules/auth";
import { message } from "ant-design-vue";

export const useUserStore = defineStore("user", {
  state: (): UserState => {
    return {
      token: "",
      userinfo: {
        userId: "",
        username: "",
        password: "",
        token: "",
        avatar: "",
        role: "",
        tag: "",
        status: "",
        createTime: 0,
      },
    };
  },
  getters: {
    hasUserId(state): boolean {
      return state.userinfo?.userId ? true : false;
    },
    hasToken(state): boolean {
      return state.token ? true : false;
    },
  },
  actions: {
    SET_TOKEN(payload: string) {
      this.token = payload;
    },
    SET_USERINFO(payload: User) {
      this.userinfo = payload;
    },
    async register(params: Login.ReqLoginForm): Promise<any> {
      try {
        const res: any = await registerApi(params);
        // save token
        this.SET_TOKEN(res.data.token);
        this.SET_USERINFO(res.data);
        return res;
      } catch (error: any) {
        message.error(error.msg);
        return Promise.reject(error);
      }
    },
    async login(params: Login.ReqLoginForm): Promise<any> {
      try {
        const res: any = await loginApi(params);
        // save token
        this.SET_TOKEN(res.data.token);
        this.SET_USERINFO(res.data);
        return res;
      } catch (error: any) {
        message.error(error.msg);
        return Promise.reject(error);
      }
    },
  },
  persist: piniaPersistConfig("userState"),
});

export function useUserStoreWithOut() {
  return useUserStore(store);
}
