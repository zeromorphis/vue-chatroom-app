<template>
  <div class="fullscreen">
    <SvgIcon v-if="isFullscreen" name="fullscreen-shrink" :iconStyle="{width: '22px', height: '22px'}" @click="toggle" />
    <SvgIcon v-else name="fullscreen-expand" :iconStyle="{width: '22px', height: '22px'}" @click="toggle" />
  </div>
</template>

<script setup lang="ts" name="Fullscreen">
import SvgIcon from "@/components/SvgIcon/index.vue";
import Icon from '@ant-design/icons-vue';
import { useFullscreen } from "@vueuse/core";
const { toggle, isFullscreen } = useFullscreen();
</script>

<style scoped lang="scss">
.fullscreen {
  display: flex;
  align-items: center;
  margin: 0 8px;
}
</style>