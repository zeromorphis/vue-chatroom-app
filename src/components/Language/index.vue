<!--
 * @Author: YT
 * @Date: 2025-05-10 17:15:18
 * @LastEditors: YT
 * @LastEditTime: 2025-05-11 10:27:33
 * @Description: 当时只道是寻常
 * @FilePath: /dev/vue-chatroom-app/src/components/Language/index.vue
-->
<template>
  <el-dropdown trigger="click" @command="changeLanguage">
    <el-icon :size="22">
      <Promotion />
    </el-icon>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item in languageList"
          :key="item.value"
          :command="item.value"
          :disabled="language === item.value"
        >
          {{ item.label }}
        </el-dropdown-item>
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

const languageList = [
  { label: "简体中文", value: "zh-cn" },
  { label: "English", value: "en" }
];
// 切换语言
const changeLanguage = (lang: string) => {
  i18n.locale.value = lang;
  useGlobalStore.SET_LANGUAGE(lang);
};
</script>