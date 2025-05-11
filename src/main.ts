/*
 * @Descripttion: 授人以渔，功德无量，利在千秋
 * @version: 4.0.0
 * @Author: 言棠
 * @Date: 2022-06-27 09:21:55
 * @LastEditors: YT
 * @LastEditTime: 2025-05-11 16:14:41
 */
import "@/styles/index.scss"; // 所有样式统一注入
import "virtual:svg-icons-register"; // svg icons

import { createApp } from "vue";
import App from "./App.vue";
import { setupStore } from "@/store";
import { setupI18n } from "@/locales";
import { router, setupRouter } from "@/router";
import { registerDirectives } from "@/directives";
import { registerVueViewer } from "@/plugins/viewer";
import { registerGlobElementPlusComp } from "@/plugins/elementPlus";

async function bootstrap() {
  const app = createApp(App);

  // 注册全局ui组件
  registerGlobElementPlusComp(app);

  // 注册全局VueViewer组件
  registerVueViewer(app);

  // 配置Pinia
  setupStore(app);

  // 配置i18n
  setupI18n(app);

  // 配置路由
  setupRouter(app);

  // 注册全局指令
  registerDirectives(app);

  // 路由准备完毕再挂载
  await router.isReady().then(() => app.mount("#app"));
}

void bootstrap();
