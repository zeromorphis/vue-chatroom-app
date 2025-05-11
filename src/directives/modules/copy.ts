/*
 * @Author: 言棠
 * @version: 1024
 * @Descripttion: 当时只道是寻常
 * @Date: 2025-05-03 16:34:36
 * @LastEditTime: 2025-05-11 15:54:33
 */
/**
 * v-copy
 * 复制某个值至剪贴板
 * 接收参数：string类型/Ref<string>类型/Reactive<string>类型
 */

import type { Directive, DirectiveBinding } from "vue";
import { ElNotification } from "element-plus";
interface ElType extends HTMLElement {
  copyData: string | number;
}
const copy: Directive = {
  mounted(el: ElType, binding: DirectiveBinding) {
    el.copyData = binding.value;
    el.addEventListener("click", handleClick);
  },
  updated(el: ElType, binding: DirectiveBinding) {
    el.copyData = binding.value;
  },
  beforeUnmount(el: ElType) {
    el.removeEventListener("click", handleClick);
  },
};

async function handleClick(this: any) {
  try {
    await navigator.clipboard.writeText(this.copyData);
    ElNotification({
      title: "Success",
      message: "复制成功",
      type: "success",
      duration: 1500,
    });
  } catch (err) {
    console.error("复制操作不被支持或失败: ", err);
  }
}

export default copy;
