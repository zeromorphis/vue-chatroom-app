/*
 * @Author: 言棠
 * @version: 3.0.0
 * @Descripttion: 授人以渔，功德无量，利在千秋
 * @Date: 2022-04-14 20:56:23
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-05-03 17:12:43
 */
import { defineStore } from "pinia";
import { store } from "@/store";
import { getLocale } from "@/locales";
import { GlobalState, ThemeConfigProps } from "../interface";
import piniaPersistConfig from "../utils/piniaPersist";
import { isMobile } from "@/utils/common";
import { DEFAULT_PRIMARY } from "@/config/config";

export const useGlobalStore = defineStore("global", {
  state: (): GlobalState => {
    return {
      lastTime: new Date().getTime(),
      language: getLocale(),
      mobile: isMobile(),
      background: "",
      themeConfig: {
        // 深色模式
        isDark: false,
        // 默认 primary 主题颜色
        primary: DEFAULT_PRIMARY,
        // 灰色模式
        isGrey: false,
        // 色弱模式
        isWeak: false,
        // 页面水印
        watermark: false,
      },
    };
  },
  actions: {
    SET_LASTTIME(lastTime: number) {
      this.lastTime = lastTime;
    },
    SET_LANGUAGE(language: string) {
      this.language = language;
    },
    SET_MOBILE(payload: boolean) {
      this.mobile = payload;
    },
    SET_BACKGROUND(payload: string) {
      this.background = payload;
    },
    SET_THEMECONFIG(themeConfig: ThemeConfigProps) {
      this.themeConfig = themeConfig;
    },
  },
  persist: piniaPersistConfig("globalState"),
});

export function useGlobalStoreWithOut() {
  return useGlobalStore(store);
}
