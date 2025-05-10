<!--
 * @Author: YT
 * @Date: 2025-05-10 17:15:18
 * @LastEditors: YT
 * @LastEditTime: 2025-05-10 21:19:24
 * @Description: 当时只道是寻常
 * @FilePath: /dev/vue-chatroom-app/src/components/Fullscreen/index.vue
-->
<template>
  <div class="fullscreen">
    <el-icon v-if="isFullscreen" @click="toggle" :size="20"><Close /></el-icon>
    <el-icon v-if="!isFullscreen" @click="toggle" :size="20"><FullScreen /></el-icon>
  </div>
</template>

<script setup lang="ts" name="Fullscreen">
import { useFullscreen } from "@vueuse/core";
const { toggle, isFullscreen } = useFullscreen();
</script>

<style scoped lang="scss">
.fullscreen {
  display: flex;
  align-items: center;
  margin: 0 12px;
  cursor: pointer;
}
</style>