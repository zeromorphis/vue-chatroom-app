<!--
 * @Descripttion: 给你两窝窝
 * @version: 5.0.0
 * @Author: 言棠
 * @Date: 2022-11-29 14:49:18
 * @LastEditors: YT
 * @LastEditTime: 2025-05-10 22:58:22
-->
<template>
  <div class="genalJoin_register">
    <el-form ref="registerRef" :model="register" :rules="registerRules" size="large">
      <el-form-item prop="username">
        <el-input v-model="register.username" :placeholder="t('login.userName')">
          <template #prefix>
            <el-icon class="el-input__icon">
              <user />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="register.password" type="password" :placeholder="t('login.password')" show-password
          autocomplete="new-password">
          <template #prefix>
            <el-icon class="el-input__icon">
              <lock />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item class="flx-center">
        <el-button :icon="CircleClose" round size="large" @click="resetFormFun(registerRef)" class="login-form-button">{{ t("login.resetButton") }}</el-button>
        <el-button :icon="UserFilled" round size="large" type="primary" :loading="loading"
          @click="registerFun(registerRef)" class="login-form-button">{{ t("login.registerButton") }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { ref, reactive, defineComponent } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useUserStoreWithOut } from '@/store/modules/user';
import { useChatStoreWithOut } from '@/store/modules/chat';
import { getTimeState } from "@/utils/common";
import { HOME_URL } from "@/config/config";
import type { Login } from "@/api/interface";
import { ElNotification } from "element-plus";
import type { ElForm } from "element-plus";
import { CircleClose, UserFilled } from "@element-plus/icons-vue";
import md5 from "js-md5";

export default defineComponent({
  name: "RegisterForm",
  setup() {
    const { t } = useI18n();
    const router = useRouter();
    const useUserStore = useUserStoreWithOut();
    const useChatStore = useChatStoreWithOut();

    type FormInstance = InstanceType<typeof ElForm>;
    const registerRef = ref<FormInstance>();
    const registerRules = reactive({
      username: [{ required: true, message: t('login.accountPlaceholder'), trigger: "blur" }],
      password: [{ required: true, message: t('login.passwordPlaceholder'), trigger: "blur" }]
    });

    const loading = ref(false);
    const register = reactive<Login.ReqLoginForm>({
      username: '',
      password: '',
    });

    const registerFun = async (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      formEl.validate(async valid => {
        if (!valid) return;
        loading.value = true;
        try {
          let res = await useUserStore.register({ ...register, password: md5(register.password) });
          if (res) {
            // 进入系统事件
            await handleJoin();
            router.push({ path: HOME_URL });
            ElNotification({
              title: getTimeState(),
              message: "欢迎登录 Chat-Room",
              type: "success",
              duration: 3000
            });
          }
        } finally {
          loading.value = false;
        }
      });
    };

    // resetForm
    const resetFormFun = (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      formEl.resetFields();
    };

    // 进入系统初始化事件
    const handleJoin = async () => {
      await useChatStore.connectSocket();
    }

    return {
      t,
      loading,
      register,
      registerRef,
      registerRules,
      CircleClose, UserFilled,
      registerFun,
      resetFormFun,
    };
  },
});
</script>

<style lang="scss" scoped>
.genalJoin_register {
  :deep(.el-form-item__content) {
    display: flex;
    justify-content: center;
  }
  .login-form-button {
    width: 45%;
  }

  :deep(.el-form-item:last-child) {
    margin-bottom: 0;
  }
}
</style>