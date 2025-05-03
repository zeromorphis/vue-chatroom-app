/*
 * @version: 3.0.0
 * @Date: 2022-05-23 16:14:13
 * @LastEditors: 言棠
 * @Descripttion: 授人以渔，功德无量，利在千秋
 * @LastEditTime: 2022-09-15 18:52:37
 * @FilePath: /yw/mini-hero/src/router/routes/webRoutes.ts
 */
import { RouteRecordRaw } from "vue-router";

import mainRouter from "../modules/main";
import errorRouter from "../modules/error";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        redirect: { name: "chat" }
    },
    ...mainRouter,
    {
        // 找不到路由重定向到404页面
        path: "/:pathMatch(.*)",
        redirect: { name: "404" }
    },
    ...errorRouter
]

export default routes;