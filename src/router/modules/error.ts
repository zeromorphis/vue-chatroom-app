/*
 * @Descripttion: 授人以渔，功德无量，利在千秋
 * @version: 4.0.0
 * @Author: 言棠
 * @Date: 2022-09-15 17:43:59
 * @LastEditors: 言棠
 * @LastEditTime: 2022-09-15 20:39:37
 */
import { RouteRecordRaw } from "vue-router";

// 错误页面模块
const errorRouter: Array<RouteRecordRaw> = [
	{
		path: "/404",
		name: "404",
		component: () => import("@/components/ErrorMessage/404.vue"),
		meta: {
			title: "404页面",
			requiresAuth: false,
			key: "404"
		}
	},
	{
		path: "/500",
		name: "500",
		component: () => import("@/components/ErrorMessage/500.vue"),
		meta: {
			title: "500页面",
			requiresAuth: false,
			key: "500"
		}
	}
];

export default errorRouter;
