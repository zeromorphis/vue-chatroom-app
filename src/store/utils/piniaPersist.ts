/*
 * @Author: 言棠
 * @version: 1024
 * @Descripttion: 当时只道是寻常
 * @Date: 2024-03-25 15:42:29
 * @LastEditTime: 2025-05-03 16:24:41
 */
import { PersistedStateOptions } from "pinia-plugin-persistedstate";

/**
 * @description pinia持久化参数配置
 * @param {String} key 存储到持久化的 name
 * @return persist
 * */
const piniaPersistConfig = (key: string, paths?: string[]) => {
	const persist: PersistedStateOptions = {
		key,
		// storage: window.localStorage
		storage: window.sessionStorage,
		paths
	};
	return persist;
};

export default piniaPersistConfig;
