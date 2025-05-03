<template>
  <a-dropdown>
    <translation-outlined class="toolBar-icon" />
    <template #overlay>
      <a-menu @click="handleSetLanguage">
        <a-menu-item :disabled="language && language === 'en'" key="en">English</a-menu-item>
        <a-menu-item :disabled="language && language === 'zh-cn'" key="zh-cn">简体中文</a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script setup lang="ts" name="Language">
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { TranslationOutlined } from '@ant-design/icons-vue';
import { useGlobalStoreWithOut } from '@/store/modules/global';

const i18n = useI18n();
const useGlobalStore = useGlobalStoreWithOut();
const language = computed((): string => useGlobalStore.language);
// 切换语言
const handleSetLanguage = (lang: any) => {
  i18n.locale.value = lang.key;
  useGlobalStore.SET_LANGUAGE(lang.key);
};
</script>

<style scoped lang="scss">
.toolBar-icon {
  font-size: 22px;
  margin: 0 8px;
}
</style>
