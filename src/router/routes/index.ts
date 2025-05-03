/*
 * @Author: 言棠
 * @version: 1024
 * @Descripttion: 当时只道是寻常
 * @Date: 2024-03-25 15:42:29
 * @LastEditTime: 2025-05-03 16:23:48
 */
import type { RouteRecordRaw } from "vue-router";

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