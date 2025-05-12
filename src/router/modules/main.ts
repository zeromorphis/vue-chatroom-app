import type { RouteRecordRaw } from "vue-router";

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
			requiresAuth: true,
			keepAlive: true,
		}
	},
];

export default mainRouter;
