/*
 * @Author: YT
 * @Date: 2025-05-10 17:15:18
 * @LastEditors: YT
 * @LastEditTime: 2025-05-10 21:50:46
 * @Description: 当时只道是寻常
 * @FilePath: /dev/vue-chatroom-app/src/hooks/useI18n/index.ts
 */
import { ref, watch } from 'vue';
import { useGlobalStoreWithOut } from '@/store/modules/global';

import en from 'element-plus/es/locale/lang/en'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

/**
 * 监听Antd组件语言变化
 */
export function useElementI18n() {
    const useGlobalStore = useGlobalStoreWithOut();
    const locale = ref(en);
    dayjs.locale('en');

    watch(() => useGlobalStore.language, (newVal) => {
        locale.value = newVal === 'en' ? en : zhCn
        dayjs.locale(newVal);
    }, { immediate: true, deep: true }); // 开启深度监听

    return { locale };
}