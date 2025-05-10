/*
 * @version: 3.0.0
 * @Date: 2022-12-02 21:12:26
 * @LastEditors: YT
 * @Descripttion: 人人都说顶峰相见，路边的水沟人满为患
 * @LastEditTime: 2025-05-10 21:46:38
 * @FilePath: /dev/vue-chatroom-app/src/hooks/useTheme/index.ts
 */
import { computed, onBeforeMount } from "vue";
import { getLightColor, getDarkColor } from "@/utils/theme/tool";
import { useGlobalStoreWithOut } from "@/store/modules/global";
import { DEFAULT_PRIMARY } from "@/config/config";
import { ElMessage } from "element-plus";

/**
 * @description 切换主题
 * */
export const useTheme = () => {
  const useGlobalStore = useGlobalStoreWithOut();
  const themeConfig = computed(() => useGlobalStore.themeConfig);

  // 切换暗黑模式
  const switchDark = async () => {
    const html = document.documentElement as HTMLElement;
    if (themeConfig.value.isDark) html.setAttribute("class", "dark");
    else html.setAttribute("class", "");
    changePrimary(themeConfig.value.primary);
  };

  // 修改主题颜色
  const changePrimary = (val: string) => {
    if (!val) {
      val = DEFAULT_PRIMARY;
      ElMessage({ type: "success", message: `主题颜色已重置为 ${DEFAULT_PRIMARY}` });
    }
	// 计算主题颜色变化
    document.documentElement.style.setProperty("--el-color-primary", val);
    document.documentElement.style.setProperty(
      "--el-color-primary-dark-2",
      themeConfig.value.isDark ? `${getLightColor(val, 0.2)}` : `${getDarkColor(val, 0.3)}`
    );
    for (let i = 1; i <= 9; i++) {
      const primaryColor = themeConfig.value.isDark ? `${getDarkColor(val, i / 10)}` : `${getLightColor(val, i / 10)}`;
      document.documentElement.style.setProperty(`--el-color-primary-light-${i}`, primaryColor);
    }
    useGlobalStore.SET_THEMECONFIG({ ...themeConfig.value, primary: val });
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
    changeGreyOrWeak,
  };
};
