<!--
 * @Descripttion: 给你两窝窝
 * @version: 5.0.0
 * @Author: 言棠
 * @Date: 2022-12-01 17:54:08
 * @LastEditors: 言棠
 * @LastEditTime: 2022-12-09 16:51:44
-->
<template>
  <div class="not-container">
    <img src="@/assets/images/error/500.png" class="not-img" alt="500" />
    <div class="not-detail">
      <h2>500</h2>
      <h4>Sorry, something went wrong~🤦‍♂️🤦‍♀️</h4>
      <a-button type="primary" @click="goHome">Back Home</a-button>
    </div>
  </div>
</template>

<script setup lang="ts" name="500">
import { useRouter } from "vue-router";
const router = useRouter();
const goHome = () => {
  router.push('/');
}
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
