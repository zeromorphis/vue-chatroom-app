<!--
 * @Descripttion: 给你两窝窝
 * @version: 5.0.0
 * @Author: 言棠
 * @Date: 2022-12-05 10:14:40
 * @LastEditors: YT
 * @LastEditTime: 2025-05-10 21:20:09
-->
<template>
  <div class="theme-setting">
    <el-icon @click="openDrawer" :size="20"><Setting /></el-icon>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import mittBus from "@/utils/mittBus";
export default defineComponent({
  name: "Fullscreen",
  setup() {
    const openDrawer = () => {
      mittBus.emit("openThemeDrawer");
    };
    return {
      openDrawer
    }
  }
})
</script>

<style scoped lang="scss">
.theme-setting {
  display: flex;
  align-items: center;
  margin: 0 12px;
  cursor: pointer;
}
</style>