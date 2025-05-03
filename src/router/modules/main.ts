/*
 * @Descripttion: 授人以渔，功德无量，利在千秋
 * @version: 4.0.0
 * @Author: 言棠
 * @Date: 2022-09-15 17:17:49
 * @LastEditors: 言棠
 * @LastEditTime: 2022-11-29 14:18:05
 */
import { RouteRecordRaw } from "vue-router";

// 主页面模块
const mainRouter: Array<RouteRecordRaw> = [
	{
		path: "/login",
		name: "login",
		component: () => import("@/views/login/index.vue"),
		meta: {
			title: "登录",
			requiresAuth: false,
			keepAlive: true,
		}
	},
	{
		path: "/chat",
		name: "chat",
		component: () => import("@/views/chat/index.vue"),
		meta: {
			title: "聊天室",
			requiresAuth: false,
			keepAlive: true,
		}
	},
];

export default mainRouter;
