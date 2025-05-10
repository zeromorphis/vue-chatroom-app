<!--
 * @Author: YT
 * @Date: 2025-05-10 17:15:18
 * @LastEditors: YT
 * @LastEditTime: 2025-05-10 21:11:44
 * @Description: 当时只道是寻常
 * @FilePath: /dev/vue-chatroom-app/src/components/Language/index.vue
-->
<template>
  <el-dropdown @command="handleSetLanguage" placement="bottom-start">
    <el-icon :size="22">
      <Promotion />
    </el-icon>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item :disabled="language && language === 'en'" command="en">English</el-dropdown-item>
        <el-dropdown-item :disabled="language && language === 'zh-cn'" command="zh-cn">简体中文</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts" name="Language">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useGlobalStoreWithOut } from '@/store/modules/global';

const i18n = useI18n();
const useGlobalStore = useGlobalStoreWithOut();
const language = computed((): string => useGlobalStore.language);
// 切换语言
const handleSetLanguage = (lang: string) => {
  i18n.locale.value = lang;
  useGlobalStore.SET_LANGUAGE(lang);
};
</script>