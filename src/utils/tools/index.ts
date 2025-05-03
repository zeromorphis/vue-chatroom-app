/*
 * @Descripttion: 授人以渔，功德无量，利在千秋
 * @version: 4.0.0
 * @Author: 言棠
 * @Date: 2022-09-15 15:24:24
 * @LastEditors: 言棠
 * @LastEditTime: 2023-10-22 18:38:23
 */
/**
 * @description 拼接document标题
 * @param {String} route_title 当前路由title
 * @returns string
 */
export function getPageTitle(route_title: string) {
	const title: string = import.meta.env.VITE_GLOB_APP_TITLE
	if (route_title) {
		return `${route_title} - ${title}`
	}
	return `${title}`
}


/**
 * @description 获取浏览器默认语言
 * @return string
 */
export const getBrowserLang = () => {
	let browserLang = navigator.language ? navigator.language : navigator.browserLanguage;
	let defaultBrowserLang = "";
	if (browserLang.toLowerCase() === "cn" || browserLang.toLowerCase() === "zh" || browserLang.toLowerCase() === "zh-cn") {
		defaultBrowserLang = "zh-cn";
	} else {
		defaultBrowserLang = "en";
	}
	return defaultBrowserLang;
};

/**
 * @description 处理env配置项非法字符
 * @param {Object} envConf 当前访问地址
 * @returns object
 */
export function wrapperEnv(envConf: Recordable): ViteEnv {
	const ret: any = {};
	for (const envName of Object.keys(envConf)) {
		let realName = envConf[envName].replace(/\\n/g, "\n");
		realName = realName === "true" ? true : realName === "false" ? false : realName;

		if (envName === "VITE_PORT") {
			realName = Number(realName);
		}
		ret[envName] = realName;
		process.env[envName] = realName;
	}
	return ret;
}