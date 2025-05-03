<template>
  <div v-if="drawerVisible">
    <a-drawer v-model:open="drawerVisible" placement="right" title="基本设置">
      <div class="theme-item">
        <span>主题颜色</span>
        <input type="color" :value="themeConfig.primary" @input="e => onColorChange(e)" />
      </div>
      <div class="theme-item">
        <span>暗黑模式</span>
        <SwitchDark></SwitchDark>
      </div>
      <div class="theme-item">
        <span>灰色模式</span>
        <a-switch v-model:checked="themeConfig.isGrey" @change="changeGreyOrWeak($event, 'grey')" />
      </div>
      <div class="theme-item">
        <span>色弱模式</span>
        <a-switch v-model:checked="themeConfig.isWeak" @change="changeGreyOrWeak($event, 'weak')" />
      </div>
      <div class="theme-item">
        <span>全局水印</span>
        <a-switch v-model:checked="themeConfig.watermark"  />
      </div>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import { useTheme } from "@/hooks/useTheme";
import { useGlobalStoreWithOut } from '@/store/modules/global';
import mittBus from "@/utils/mittBus";
import SwitchDark from "@/components/SwitchDark/index.vue";
import { ConfigProvider } from 'ant-design-vue';

const { changePrimary, changeGreyOrWeak } = useTheme();

const globalStore = useGlobalStoreWithOut();
const themeConfig = computed(() => globalStore.themeConfig);

// 切换布主题颜色
const onColorChange = (e: any) => {
  changePrimary(e.target.value)
};

// 监听主题切换，重设主题
watch(() => themeConfig.value.primary, (newValue) => {
  ConfigProvider.config({
    theme: {
      primaryColor: newValue
    },
  });
}, { immediate: true, deep: true }); // 首次加载页面执行，开启深度监听

// 打开主题设置
const drawerVisible = ref(false);
mittBus.on("openThemeDrawer", () => {
  drawerVisible.value = true
});
</script>

<style scoped lang="scss">
.theme-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 14px 0;
  span {
    font-size: 14px;
  }
}
</style>
