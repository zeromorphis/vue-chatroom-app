<!--
 * @Descripttion: 授人以渔，功德无量，利在千秋
 * @version: 4.0.0
 * @Author: 言棠
 * @Date: 2022-08-19 18:35:07
 * @LastEditors: YT
 * @LastEditTime: 2025-05-10 21:51:03
-->
<template>
  <el-config-provider :locale="locale">
    <router-view v-slot="{ Component }">
      <el-watermark id="watermark" :font="font" :content="themeConfig.watermark ? ['言棠', '版权所有'] : ''">
        <keep-alive :include="cacheRouter">
          <component :is="Component" />
        </keep-alive>
      </el-watermark>
    </router-view>
  </el-config-provider>
</template>

<script lang="ts">
import { onBeforeMount, reactive, computed, watch, provide, defineComponent } from "vue";
import * as echarts from "echarts";
import { useRouter } from "vue-router";
import cacheRouter from "@/router/cacheRouter";
import { useUserStoreWithOut } from '@/store/modules/user';
import { useChatStoreWithOut } from '@/store/modules/chat';
import { useGlobalStoreWithOut } from '@/store/modules/global';
import { DEFAULT_BACKGROUND, LOGIN_URL } from "@/config/config";
import { useElementI18n } from "@/hooks/useI18n";
export default defineComponent({
  name: "App",
  setup() {
    console.log("%cGLOB_API_URL%c" + import.meta.env.VITE_API_URL, 'background: #00cc00; color: #fff; border-radius: 3px 0 0 3px;padding:2px 5px', 'background: #3E4F; color: #3E4F; border-radius: 0 3px 3px 0;padding:2px 5px',)
    provide("echarts", echarts);
    const router = useRouter();
    const { locale } = useElementI18n();
    const userStore = useUserStoreWithOut();
    const chatStore = useChatStoreWithOut();
    const globalStore = useGlobalStoreWithOut();
    const themeConfig = computed(() => globalStore.themeConfig);
    const font = reactive({ color: "rgba(0, 0, 0, .15)" });

    // 背景图变更重新存储
    watch(() => globalStore.background, (newVal, oldVal) => {
      if (!newVal || !newVal.trim().length) {
        globalStore.SET_BACKGROUND(DEFAULT_BACKGROUND);
      }
    }, { immediate: true, deep: true }); // 开启深度监听

    return {
      locale,
      cacheRouter,
      themeConfig,
      font,
    };
  },
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
}
</style>