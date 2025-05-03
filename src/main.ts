/*
 * @Descripttion: 授人以渔，功德无量，利在千秋
 * @version: 4.0.0
 * @Author: 言棠
 * @Date: 2022-06-27 09:21:55
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-05-03 16:37:33
 */
import "@/styles/index.scss"; // 所有样式统一注入
import "virtual:svg-icons-register"; // svg icons

import { createApp } from "vue";
import App from "./App.vue";
import { setupStore } from "@/store";
import { setupI18n } from "@/locales";
import { router, setupRouter } from "@/router";
import { registerDirectives } from "@/directives";
import { registerGlobAntdComp } from "@/plugins/antd";
import { registerVueViewer } from "@/plugins/viewer";
async function bootstrap() {
  const app = createApp(App);

  // 注册全局ant-design-vue组件
  registerGlobAntdComp(app);

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
