<!--
 * @Descripttion: 给你两窝窝
 * @version: 5.0.0
 * @Author: 言棠
 * @Date: 2022-12-01 17:54:08
 * @LastEditors: YT
 * @LastEditTime: 2025-05-10 21:54:00
-->
<template>
  <div class="not-container">
    <img src="@/assets/images/error/404.png" class="not-img" alt="404" />
    <div class="not-detail">
      <h2>404</h2>
      <h4>Sorry, the page you visited does not exist~🤷‍♂️🤷‍♀️</h4>
      <el-button type="primary" @click="goHome">Back Home</el-button>
    </div>
  </div>
</template>

<script setup lang="ts" name="404">
import { useRouter } from "vue-router";
const router = useRouter();
const goHome = () => {
  router.push('/');
}
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
