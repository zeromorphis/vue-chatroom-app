<!--
 * @Descripttion: 给你两窝窝
 * @version: 5.0.0
 * @Author: 言棠
 * @Date: 2022-12-05 10:14:40
 * @LastEditors: YT
 * @LastEditTime: 2025-05-10 20:18:32
-->
<template>
  <div class="login-container flx-center">
    <div class="login-box">
      <div class="login-left">
        <img src="@/assets/images/login/group-chat.svg" alt="login" />
      </div>
      <div class="header">
        <div class="title">
          <img src="@/assets/images/logo.png">
          <span>CHATROOM</span>
        </div>
        <div class="tools-box">
          <ThemeSetting />
          <Language />
          <Fullscreen />
        </div>
      </div>
      <div class="login-form">
        <el-tabs v-model="activeKey">
          <el-tab-pane :label="t('login.loginButton')" name="1">
            <LoginForm />
          </el-tab-pane>
          <el-tab-pane :label="t('login.registerButton')" name="2">
            <RegisterForm />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
  <ThemeDrawer />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from "vue-i18n";
import LoginForm from "./components/LoginForm.vue";
import RegisterForm from "./components/RegisterForm.vue";
import Fullscreen from "@/components/Fullscreen/index.vue";
import Language from "@/components/Language/index.vue";
import ThemeSetting from "@/components/ThemeSetting/ThemeSetting.vue";
import ThemeDrawer from "@/components/ThemeSetting/ThemeDrawer.vue";

const { t } = useI18n();
const activeKey = ref('1');
</script>

<style scoped lang="scss">
.login-container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: var(--ant-primary-color);
  background-image: url('@/assets/images/login/login_bg.svg');
  background-position: 50%;
  background-size: 100% 100%;
  background-size: cover;
  padding: 30px;

  @media (max-width: 560px) {
    padding: 0;
  }

  .login-box {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    height: 100%;
    padding: 30px;
    position: relative;
    background-color: hsl(0deg 0% 100% / 80%);

    @media (max-width: 560px) {
      padding: 0;
      border-radius: 0;
    }

    .login-left {
      width: 800px;

      @media (max-width: 1100px) {
        display: none;
      }

      img {
        width: 100%;
        height: 100%;
      }
    }

    .header {
      width: 100%;
      position: absolute;
      top: 20px;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;

      .title {
        display: flex;
        align-items: center;

        img {
          width: 25px;
          height: 25px;
          display: block;
        }

        span {
          margin-left: 6px;
          font-family: 'DIN-Alternate-Bold';
          font-weight: bold;
        }
      }

      .tools-box {
        display: flex;
        align-items: center;
      }
    }

    .login-form {
      width: 420px;
      padding: 20px 40px 40px;
      border-radius: 10px;
      background-color: #fff;
      box-shadow: 2px 3px 7px rgb(0 0 0 / 20%);

      @media (max-width: 560px) {
        width: 90%;
        height: 75%;
      }
    }
  }
}
</style>
