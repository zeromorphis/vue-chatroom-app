<!--
 * @Descripttion: 给你两窝窝
 * @version: 5.0.0
 * @Author: 言棠
 * @Date: 2022-12-05 10:14:40
 * @LastEditors: 言棠
 * @LastEditTime: 2022-12-05 10:16:06
-->
<template>
  <div class="theme-setting">
    <SvgIcon name="theme" @click="openDrawer" :iconStyle="{width: '22px', height: '22px' }" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SvgIcon from "@/components/SvgIcon/index.vue";
import mittBus from "@/utils/mittBus";
export default defineComponent({
  name: "Fullscreen",
  components: {
    SvgIcon,
  },
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
  margin: 0 8px;
  cursor: pointer;
}
</style>