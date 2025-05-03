/*
 * @Description:
 * @Author: ZY
 * @Date: 2020-12-18 15:23:57
 * @LastEditors: 言棠
 * @LastEditTime: 2022-12-28 18:29:39
 */
import type { App } from "vue";
// import { createI18n } from 'vue-i18n/dist/vue-i18n.cjs.js'
import { createI18n } from 'vue-i18n' // import from runtime only

// User defined lang
import enLocale from './lang/en';
import zhLocale from './lang/zh-cn';

import { getSession } from "@/utils/storage";
import { getBrowserLang } from "@/utils/tools";

const messages = {
  'en': {
    ...enLocale,
  },
  'zh-cn': {
    ...zhLocale,
  }
}

export const getLocale = () => {
  // 缓存内设置的语言
  const sessionLanguage = getSession('language')
  if (sessionLanguage) {
    return sessionLanguage
  }
  // 当前环境默认语言
  return getBrowserLang()
}

const i18n = createI18n({
  legacy: false, // 如果要支持 compositionAPI，此项必须设置为 false
  locale: getLocale(), // 设置语言类型
  globalInjection: true, // 全局注册$t方法
  messages: messages
})

export function setupI18n(app: App<Element>) {
  app.use(i18n);
}

export default i18n;
