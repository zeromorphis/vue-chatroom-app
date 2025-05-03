<!--
 * @Descripttion: 给你两窝窝
 * @version: 5.0.0
 * @Author: 言棠
 * @Date: 2022-11-29 14:49:18
 * @LastEditors: 言棠
 * @LastEditTime: 2022-12-28 18:32:13
-->
<template>
  <div class="genalJoin_register">
    <a-form :model="formState" name="register" autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
      <a-form-item name="username" :rules="[{ required: true, message: t('login.accountPlaceholder') }]">
        <a-input v-model:value="formState.username" :placeholder="t('login.userName')" />
      </a-form-item>
      <a-form-item name="password" :rules="[{ required: true, message: t('login.passwordPlaceholder') }]">
        <a-input-password v-model:value="formState.password" :placeholder="t('login.password')" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" class="login-form-button">{{t("login.registerButton")}}</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts">
import { reactive, toRaw, defineComponent } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useUserStoreWithOut } from '@/store/modules/user';
import { useChatStoreWithOut } from '@/store/modules/chat';
import { getTimeState } from "@/utils/common";
import { HOME_URL } from "@/config/config";
import { notification } from 'ant-design-vue';
import md5 from "js-md5";
interface FormState {
  username: string;
  password: string;
}
export default defineComponent({
  name: "RegisterForm",
  setup() {
    const { t } = useI18n();
    const router = useRouter();
    const useUserStore = useUserStoreWithOut();
    const useChatStore = useChatStoreWithOut();

    const formState = reactive<FormState>({
      username: '',
      password: '',
    });

    const onFinish = async (values: any) => {
      console.log('Success:', values);
      let res = await useUserStore.register(toRaw({ username: values.username, password: md5(values.password) }));
      if (res) {
        // 进入系统事件
        await handleJoin();
        router.push({ path: HOME_URL });
        notification['success']({
          message: getTimeState(),
          description: `欢迎登录 ${res.data.username}`,
          duration: 4.5
        });
      }
    };

    const onFinishFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo);
    };

    // 进入系统初始化事件
    const handleJoin = async () => {
      await useChatStore.connectSocket();
    }
    return {
      t,
      formState,
      onFinish,
      onFinishFailed,
    };
  },
});
</script>

<style lang="scss" scoped>
.genalJoin_register {
  .login-form-button {
    width: 100%;
  }
  :deep(.ant-form-item:last-child) {
    margin-bottom: 0;
  }
}
</style>