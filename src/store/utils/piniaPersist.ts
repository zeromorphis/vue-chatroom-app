/*
 * @Descripttion: 授人以渔，功德无量，利在千秋
 * @version: 4.0.0
 * @Author: 言棠
 * @Date: 2022-09-15 15:16:55
 * @LastEditors: 言棠
 * @LastEditTime: 2022-12-05 11:45:07
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
