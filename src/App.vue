<!--
 * @Descripttion: 授人以渔，功德无量，利在千秋
 * @version: 4.0.0
 * @Author: 言棠
 * @Date: 2022-08-19 18:35:07
 * @LastEditors: 言棠
 * @LastEditTime: 2022-12-15 17:53:01
-->
<template>
  <a-config-provider :locale="locale">
    <router-view @mouseover="updateLastTime()" @click="updateLastTime()" v-slot="{ Component }">
      <keep-alive :include="cacheRouter">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </a-config-provider>
</template>

<script lang="ts">
import { onBeforeMount, watch, provide, defineComponent } from "vue";
import * as echarts from "echarts";
import { useRouter } from "vue-router";
import cacheRouter from "@/router/cacheRouter";
import { useUserStoreWithOut } from '@/store/modules/user';
import { useChatStoreWithOut } from '@/store/modules/chat';
import { useGlobalStoreWithOut } from '@/store/modules/global';
import { isMobile } from "@/utils/common";
import { DEFAULT_BACKGROUND, LOGIN_URL } from "@/config/config";
import { useAntdI18n } from "@/hooks/useI18n";
export default defineComponent({
  name: "App",
  setup() {
    console.log("%cGLOB_API_URL%c" + import.meta.env.VITE_API_URL, 'background: #00cc00; color: #fff; border-radius: 3px 0 0 3px;padding:2px 5px', 'background: #3E4F; color: #3E4F; border-radius: 0 3px 3px 0;padding:2px 5px',)
    provide("echarts", echarts);
    const router = useRouter();
    const { locale } = useAntdI18n();
    const useUserStore = useUserStoreWithOut();
    const useChatStore = useChatStoreWithOut();
    const useGlobalStore = useGlobalStoreWithOut();

    // 更新用户的最后操作时间
    const updateLastTime = () => {
      useGlobalStore.SET_LASTTIME(new Date().getTime());
    }

    // 背景图变更重新存储
    watch(() => useGlobalStore.background, (newVal, oldVal) => {
      if (!newVal || !newVal.trim().length) {
        useGlobalStore.SET_BACKGROUND(DEFAULT_BACKGROUND);
      }
    }, { immediate: true, deep: true }); // 开启深度监听

    // 判断是否超时
    const isTimeOut = () => {
      // 页面上一次的点击时间
      let lastTime: number = useGlobalStore.lastTime;
      let currentTime: number = new Date().getTime();
      let sys_timeout: number = 20 * 60 * 1000;// 超时时间, 如果20分钟都没有点击页面就算超时
      // 超时了
      if ((currentTime - lastTime) >= sys_timeout) {
        return true;
      } else {
        return false;
      }
    };

    // 是否超时需要自动退出操作
    const isLoginOut = () => {
      setInterval(async () => {
        // 判断一下是否超时，如果超时了就退出
        if (isTimeOut()) {
          await useUserStore.$reset();
          await useChatStore.$reset();
          await useGlobalStore.$reset();
          router.push({ path: LOGIN_URL });
        }
      }, 2000);
    };

    onBeforeMount(() => {
      isLoginOut();//是否超时
      useGlobalStore.SET_MOBILE(isMobile());
    });

    return {
      locale,
      cacheRouter,
      updateLastTime,
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