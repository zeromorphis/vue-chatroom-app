<!--
 * @Descripttion: 给你两窝窝
 * @version: 5.0.0
 * @Author: 言棠
 * @Date: 2022-12-05 11:17:27
 * @LastEditors: 言棠
 * @LastEditTime: 2022-12-05 11:21:54
-->
<template>
  <a-switch v-model:checked="themeConfig.isDark" @change="onAddDarkChange">
    <template #checkedChildren>🌞</template>
    <template #unCheckedChildren>🌜</template>
  </a-switch>
</template>

<script setup lang="ts" name="SwitchDark">
import { computed } from "vue";
import { useGlobalStoreWithOut } from '@/store/modules/global';
import { useTheme } from "@/hooks/useTheme";
const useGlobalStore = useGlobalStoreWithOut();

const { switchDark } = useTheme();

const themeConfig = computed(() => useGlobalStore.themeConfig);

const onAddDarkChange = () => {
  switchDark();
};
</script>
