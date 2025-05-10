<!--
 * @Author: YT
 * @Date: 2025-05-10 17:15:18
 * @LastEditors: YT
 * @LastEditTime: 2025-05-10 21:31:56
 * @Description: 当时只道是寻常
 * @FilePath: /dev/vue-chatroom-app/src/components/ThemeSetting/ThemeDrawer.vue
-->
<template>
  <div v-if="drawerVisible">
    <el-drawer v-model="drawerVisible" direction="rtl" title="基本设置">
      <div class="theme-item">
        <span>主题颜色</span>
        <el-color-picker v-model="themeConfig.primary" @change="e => onColorChange(e)" />
      </div>
      <div class="theme-item">
        <span>暗黑模式</span>
        <SwitchDark></SwitchDark>
      </div>
      <div class="theme-item">
        <span>灰色模式</span>
        <el-switch v-model="themeConfig.isGrey" @change="changeGreyOrWeak($event, 'grey')" />
      </div>
      <div class="theme-item">
        <span>色弱模式</span>
        <el-switch v-model="themeConfig.isWeak" @change="changeGreyOrWeak($event, 'weak')" />
      </div>
      <div class="theme-item">
        <span>全局水印</span>
        <el-switch v-model="themeConfig.watermark" />
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
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
  changePrimary(e)
};

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
