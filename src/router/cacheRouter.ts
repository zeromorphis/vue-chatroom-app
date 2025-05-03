/*
 * @Author: 言棠
 * @version: 1024
 * @Descripttion: 当时只道是寻常
 * @Date: 2024-03-25 15:42:29
 * @LastEditTime: 2025-05-03 16:23:39
 */
import { RouteRecordRaw, RouteRecordName } from "vue-router";
import routes from "./routes";

/**
 * @description 使用递归，过滤需要缓存的路由
 * @param {Array} _route 所有路由表
 * @param {Array} _cache 缓存的路由表
 * @return void
 * */
let cacheRouter: any[] = [];
const filterKeepAlive = (_route: RouteRecordRaw[], _cache: RouteRecordName[]): void => {
	_route.forEach(item => {
		item.meta?.keepAlive && item.name && _cache.push(item.name);
		item.children && item.children.length !== 0 && filterKeepAlive(item.children, _cache);
	});
};

filterKeepAlive(routes, cacheRouter);

export default cacheRouter;
