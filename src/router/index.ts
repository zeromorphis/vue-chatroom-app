/*
 * @Descripttion: YT
 * @version: 1.0.0
 * @Author: 言棠
 * @Date: 2021-11-24 12:53:12
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-05-02 19:42:47
 */
import type { App } from 'vue';
import { createRouter, createWebHashHistory, createWebHistory, Router } from "vue-router";
import routes from "./routes";
import { useUserStoreWithOut } from '@/store/modules/user';
import { useChatStoreWithOut } from '@/store/modules/chat';
import { useGlobalStoreWithOut } from '@/store/modules/global';
import { AxiosCanceler } from "@/api/helper/axiosCancel";
import { LOGIN_URL, ROUTER_WHITE_LIST } from "@/config/config";
import NProgress from "@/utils/nprogress";

const axiosCanceler = new AxiosCanceler();

const mode = import.meta.env.VITE_ROUTER_MODE;

const routerMode = {
  hash: () => createWebHashHistory(),
  history: () => createWebHistory()
};

/**
 * @description 📚 路由参数配置简介
 * @param path ==> 路由菜单访问路径
 * @param name ==> 路由 name (对应页面组件 name, 可用作 KeepAlive 缓存标识 && 按钮权限筛选)
 * @param redirect ==> 路由重定向地址
 * @param component ==> 视图文件路径
 * @param meta ==> 路由菜单元信息
 * @param meta.icon ==> 菜单和面包屑对应的图标
 * @param meta.title ==> 路由标题 (用作 document.title || 菜单的名称)
 * @param meta.activeMenu ==> 当前路由为详情页时，需要高亮的菜单
 * @param meta.isLink ==> 路由外链时填写的访问地址
 * @param meta.isHide ==> 是否在菜单中隐藏 (通常列表详情页需要隐藏)
 * @param meta.isFull ==> 菜单是否全屏 (示例：数据大屏页面)
 * @param meta.isAffix ==> 菜单是否固定在标签页中 (首页通常是固定项)
 * @param meta.isKeepAlive ==> 当前路由是否缓存
 * */

// 创建路由实例
export const router: Router = createRouter({
  history: routerMode[mode]() as any,
  routes,
  strict: true,
  scrollBehavior(to: any, from: any, savedPosition: any) {
    return new Promise(resolve => {
      if (savedPosition) {
        return savedPosition;
      } else {
        if (from.meta.saveSrollTop) {
          const top: number = document.documentElement.scrollTop || document.body.scrollTop;
          resolve({ left: 0, top });
        }
      }
    });
  }
});


router.beforeEach(async (to: any, from: any, next: any) => {
  // 在跳转路由之前，清除所有的请求
  axiosCanceler?.removeAllPending();

  // 1.NProgress 开始
  NProgress.start();

  // 2.动态设置标题
  const title = import.meta.env.VITE_GLOB_APP_TITLE;
  document.title = to.meta.title ? `${to.meta.title} - ${title}` : title;

  const userStore = useUserStoreWithOut();
  const chatStore = useChatStoreWithOut();
  const globalStore = useGlobalStoreWithOut();
  const hasToken = userStore.hasToken;

  // 3.判断是访问登陆页，有 Token 就在当前页面，没有 Token 重置路由到登陆页
  if (hasToken) {
    if (to.path === LOGIN_URL) {
      next({ path: '/' });
      NProgress.done();
    } else {
      next();
    }
  } else {
    // 删除令牌及用户缓存并转到登录页面重新登录
    await userStore.$reset();
    await chatStore.$reset();
    await globalStore.$reset();

    // 4.判断访问页面是否在路由白名单地址(静态路由)中，如果存在直接放行
    if (ROUTER_WHITE_LIST.includes(to.path)) {
      next();
    } else {
      // 5.没有 Token，没有重定向到 login 页面
      next({ path: LOGIN_URL, query: { redirect: to.fullPath } });
      NProgress.done();
    }
  }
})

/**
 * @description 路由跳转错误
 * */
router.onError((error) => {
  NProgress.done();
  console.warn("路由错误", error.message);
});

/**
 * @description 路由跳转结束
 * */
router.afterEach(() => {
  NProgress.done();
});

// 配置路由
export function setupRouter(app: App<Element>) {
  app.use(router);
}