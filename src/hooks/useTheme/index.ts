/*
 * @version: 3.0.0
 * @Date: 2022-12-02 21:12:26
 * @LastEditors: 言棠
 * @Descripttion: 人人都说顶峰相见，路边的水沟人满为患
 * @LastEditTime: 2022-12-05 14:10:29
 * @FilePath: /dev/vue3-chat-antd/src/hooks/useTheme/index.ts
 */
import { computed, onBeforeMount } from "vue";
import { getLightColor, getDarkColor } from "@/utils/theme/tool";
import { addClass, hasClass, removeClass } from '@/utils/theme/domUtils';
import { useGlobalStoreWithOut } from '@/store/modules/global';
import { DEFAULT_PRIMARY } from "@/config/config";
import { message } from 'ant-design-vue';

/**
 * @description 切换主题
 * */
export const useTheme = () => {
	const useGlobalStore = useGlobalStoreWithOut();
	const themeConfig = computed(() => useGlobalStore.themeConfig);

	// 切换暗黑模式
	const switchDark = async () => {
		const body = document.documentElement as HTMLElement;
		if (!body) {
			return;
		}
		const hasDarkClass = hasClass(body, 'dark');
		if (themeConfig.value.isDark) {
			body.setAttribute('class', 'dark');
			if (!hasDarkClass) {
				addClass(body, 'dark');
			}
		} else {
			body.setAttribute('class', 'light');
			if (hasDarkClass) {
				removeClass(body, 'dark');
			}
		}
		changePrimary(themeConfig.value.primary);
	};

	// 修改主题颜色
	const changePrimary = (val: string) => {
		if (!val) {
			val = DEFAULT_PRIMARY;
			message.success(`主题颜色已重置为 ${DEFAULT_PRIMARY}`);
		}
		useGlobalStore.SET_THEMECONFIG({ ...themeConfig.value, primary: val });
		// 为了兼容暗黑模式下主题颜色也正常，以下方法计算主题颜色 由深到浅 的具体颜色
		document.documentElement.style.setProperty("--ant-primary-color", themeConfig.value.isDark ? `${getDarkColor(themeConfig.value.primary, 0.6)}` : `${getLightColor(themeConfig.value.primary, 0.4)}`);
		document.documentElement.style.setProperty("--ant-primary-color-hover", themeConfig.value.isDark ? `${getDarkColor(themeConfig.value.primary, 0.4)}` : `${getLightColor(themeConfig.value.primary, 0.2)}`);
		document.documentElement.style.setProperty("--ant-primary-color-active", themeConfig.value.isDark ? `${getLightColor(themeConfig.value.primary, 0.4)}` : `${getDarkColor(themeConfig.value.primary, 0.2)}`);
		// 颜色加深或变浅
		for (let i = 1; i <= 10; i++) {
			document.documentElement.style.setProperty(`--ant-primary-${i}`, themeConfig.value.isDark ? `${getDarkColor(themeConfig.value.primary, i / 10)}` : `${getLightColor(themeConfig.value.primary, i / 10)}`);
		}
	};

	// 灰色和弱色切换
	const changeGreyOrWeak = (value: boolean, type: string) => {
		const body = document.body as HTMLElement;
		if (!value) return body.setAttribute("style", "");
		if (type === "grey") body.setAttribute("style", "filter: grayscale(1)");
		if (type === "weak") body.setAttribute("style", "filter: invert(80%)");
		let propName = type == "grey" ? "isWeak" : "isGrey";
		useGlobalStore.SET_THEMECONFIG({ ...themeConfig.value, [propName]: false });
	};

	onBeforeMount(() => {
		switchDark();
		changePrimary(themeConfig.value.primary);
		if (themeConfig.value.isGrey) changeGreyOrWeak(true, "grey");
		if (themeConfig.value.isWeak) changeGreyOrWeak(true, "weak");
	});

	return {
		switchDark,
		changePrimary,
		changeGreyOrWeak
	};
};
