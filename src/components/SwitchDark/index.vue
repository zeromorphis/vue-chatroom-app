<!--
 * @Descripttion: 给你两窝窝
 * @version: 5.0.0
 * @Author: 言棠
 * @Date: 2022-12-05 11:17:27
 * @LastEditors: YT
 * @LastEditTime: 2025-05-10 21:29:24
-->
<template>
  <el-switch v-model="themeConfig.isDark" inline-prompt :active-icon="Sunny" :inactive-icon="Moon" @change="onAddDarkChange" />
</template>

<script setup lang="ts" name="SwitchDark">
import { computed } from "vue";
import { useGlobalStoreWithOut } from '@/store/modules/global';
import { useTheme } from "@/hooks/useTheme";
import { Sunny, Moon } from "@element-plus/icons-vue";

const useGlobalStore = useGlobalStoreWithOut();

const { switchDark } = useTheme();

const themeConfig = computed(() => useGlobalStore.themeConfig);

const onAddDarkChange = () => {
  switchDark();
};
</script>
