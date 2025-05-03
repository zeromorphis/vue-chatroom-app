import { ref, watch } from 'vue';
import { useGlobalStoreWithOut } from '@/store/modules/global';

import enUS from 'ant-design-vue/es/locale/en_US';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

/**
 * 监听Antd组件语言变化
 */
export function useAntdI18n() {
    const useGlobalStore = useGlobalStoreWithOut();
    const locale = ref(enUS);
    dayjs.locale('en');

    watch(() => useGlobalStore.language, (newVal) => {
        locale.value = newVal === 'en' ? enUS : zhCN
        dayjs.locale(newVal);
    }, { immediate: true, deep: true }); // 开启深度监听

    return { locale };
}