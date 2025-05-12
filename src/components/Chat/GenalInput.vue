<!--
 * @Descripttion: 给你两窝窝
 * @version: 5.0.0
 * @Author: 言棠
 * @Date: 2022-11-30 18:01:37
 * @LastEditors: YT
 * @LastEditTime: 2025-05-11 16:13:48
-->
<template>
  <div class="messageInput_container" v-if="activeRoom">
    <el-popover placement="top-start" trigger="hover" width="280" class="message-popver">
      <template #reference>
        <div class="messagte-tool-icon">😃</div>
      </template>
      <el-tabs v-model="activeKey" :stretch="true">
        <el-tab-pane label="Emoji" name="1">
          <GenalEmoji @addEmoji="addEmoji" />
        </el-tab-pane>
        <el-tab-pane label="工具" name="2">
          <div class="message-tool-item">
            <el-upload :show-file-list="false" :before-upload="beforeImgUpload">
              <div class="message-tool-contant">
                <img src="@/assets/images/chat/photo.png" class="message-tool-item-img" alt="" />
                <div class="message-tool-item-text">图片</div>
              </div>
            </el-upload>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-popover>
    <el-input autocomplete="off" type="text" placeholder="说点什么" v-model="text" ref="inoutDom" autoFocus
      style="color:#000;" @change="preSendMessage()" />
    <img class="message-input-button" @click="preSendMessage()" src="@/assets/images/chat/send.png" alt="" />
  </div>
</template>

<script lang="ts">
import { ref, computed, watch, onBeforeMount, nextTick, defineComponent } from "vue";
import { useUserStoreWithOut } from '@/store/modules/user';
import { useChatStoreWithOut } from '@/store/modules/chat';
import { useGlobalStoreWithOut } from '@/store/modules/global';
import GenalEmoji from './GenalEmoji.vue';
import { throttle } from 'throttle-debounce';
import { ElMessage } from "element-plus";
export default defineComponent({
  name: "GenalInput",
  components: {
    GenalEmoji,
  },
  setup() {
    const useUserStore = useUserStoreWithOut();
    const useChatStore = useChatStoreWithOut();
    const useGlobalStore = useGlobalStoreWithOut();
    const userinfo = computed<object>(() => useUserStore.userinfo);
    const mobile = computed<boolean>(() => useGlobalStore.mobile);
    const activeRoom = computed<Group & Friend>(() => useChatStore.activeRoom);
    const socket = computed<SocketIOClient.Socket>(() => useChatStore.socket);
    const text = ref<string>('');
    const inoutDom = ref<HTMLElement>(null);
    const activeKey = ref('1');


    onBeforeMount(() => {
      initPaste();
    });

    watch(() => activeRoom, () => {
      nextTick(() => {
        focusInput();
      });
    }, { immediate: true, deep: true }); // 开启深度监听

    //  监听图片粘贴事件
    function initPaste() {
      document.addEventListener('paste', (event) => {
        let items = event.clipboardData && event.clipboardData.items;
        let url = window.URL || window.webkitURL;
        let file = null;
        if (items && items.length) {
          // 检索剪切板items
          for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
              file = items[i].getAsFile();
              break;
            }
          }
        }
        if (file) {
          handleImgUpload(file);
        }
      });
    }

    // 消息发送前校验-节流
    const preSendMessage = throttle(1000, () => {
      if (!text.value.trim()) {
        ElMessage.error("不能发送空消息!");
        return;
      }
      if (text.value.length > 220) {
        ElMessage.error("消息太长!");
        return;
      }
      if (activeRoom.value.groupId) {
        sendMessage({ type: 'group', message: text.value, messageType: 'text' });
      } else {
        sendMessage({ type: 'friend', message: text.value, messageType: 'text' });
      }
      text.value = '';
    })

    // 消息发送
    function sendMessage(data: SendMessage) {
      console.log(data)
      if (data.type === 'group') {
        socket.value.emit('groupMessage', {
          userId: userinfo.value.userId,
          groupId: activeRoom.value.groupId,
          content: data.message,
          width: data.width,
          height: data.height,
          messageType: data.messageType,
        });
      } else {
        socket.value.emit('friendMessage', {
          userId: userinfo.value.userId,
          friendId: activeRoom.value.userId,
          content: data.message,
          width: data.width,
          height: data.height,
          messageType: data.messageType,
        });
      }
    }

    // 添加emoji到input
    function addEmoji(emoji: string) {
      const inputDom = inoutDom.value as HTMLFormElement;
      if (inputDom.selectionStart || inputDom.selectionStart === '0') {
        // 得到光标前的位置
        const startPos = inputDom.selectionStart;
        // 得到光标后的位置
        const endPos = inputDom.selectionEnd;
        // 在加入数据之前获得滚动条的高度
        const restoreTop = inputDom.scrollTop;
        // emoji表情插入至当前光标指定位置
        text.value = text.value.substring(0, startPos) + emoji + text.value.substring(endPos, text.value.length);
        // 如果滚动条高度大于0
        if (restoreTop > 0) {
          // 返回
          inputDom.scrollTop = restoreTop;
        }
        inputDom.focus();
        // 设置光标位置至emoji表情后一位
        const position = startPos + emoji.length;
        if (inputDom.setSelectionRange) {
          inputDom.focus();
          setTimeout(() => {
            inputDom.setSelectionRange(position, position);
          }, 10);
        } else if (inputDom.createTextRange) {
          const range = inputDom.createTextRange();
          range.collapse(true);
          range.moveEnd('character', position);
          range.moveStart('character', position);
          range.select();
        }
      } else {
        text.value += emoji;
        inputDom.focus();
      }
    }

    // focus input框
    function focusInput() {
      if (!mobile.value) {
        inoutDom.value.focus();
      }
    }

    // 计算图片的比例
    function getImageSize(data: ImageSize) {
      let { width, height } = data;
      if (width > 335 || height > 335) {
        if (width > height) {
          height = 335 * (height / width);
          width = 335;
        } else {
          width = 335 * (width / height);
          height = 335;
        }
      }
      return {
        width,
        height,
      };
    }

    // 图片上传校验
    function beforeImgUpload(file: File) {
      handleImgUpload(file);
      return false;
    }

    // 图片消息发送-节流
    const handleImgUpload = throttle(1000, async (imageFile: File) => {
      const isJpgOrPng = imageFile.type === 'image/jpeg' || imageFile.type === 'image/png' || imageFile.type === 'image/jpg' || imageFile.type === 'image/gif';
      if (!isJpgOrPng) {
        return ElNotification.error('请选择jpeg/jpg/png/gif格式的图片!');
      }
      const isLt1M = imageFile.size / 1024 / 1024 < 0.5;
      if (!isLt1M) {
        return ElNotification.error('图片必须小于500K!');
      }
      let image = new Image();
      let url = window.URL || window.webkitURL;
      image.src = url.createObjectURL(imageFile);
      image.onload = () => {
        let imageSize: ImageSize = getImageSize({ width: image.width, height: image.height });
        sendMessage({
          type: activeRoom.value.groupId ? 'group' : 'friend',
          message: imageFile,
          width: imageSize.width,
          height: imageSize.height,
          messageType: 'image',
        });
      };
    });

    return {
      activeKey,
      activeRoom,
      beforeImgUpload,
      preSendMessage,
      inoutDom,
      text,
      addEmoji
    };
  },
});
</script>

<style lang="scss" scoped>
.messageInput_container {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  position: absolute;
  width: 100%;
  bottom: 0px;
  background-color: #fff;

  input {
    height: 40px;
  }

  .message-input-button {
    width: 30px;
    cursor: pointer;
    position: absolute;
    right: 10px;
  }
}

//输入框样式
.el-input {
  padding: 0 50px 0 50px;
  height: 40px;
}

.el-tab-pane {
  display: flex;
  justify-content: center;
}

:deep(.el-input__wrapper) {
  box-shadow: none;
}

.el-input__inner {
  padding: 0 50px 0 50px;
  height: 40px;
  border-radius: 5px;
  background-color: #f5f5f5;
  border: none;
  box-shadow: none;

  &:focus {
    box-shadow: none;
    border: none;
    outline: none;
  }
}

// 消息工具样式
.messagte-tool-icon {
  position: absolute;
  left: 0;
  width: 50px;
  height: 40px;
  text-align: center;
  line-height: 42px;
  font-size: 16px;
  cursor: pointer;
  z-index: 99;
}

.message-tool-item {
  width: 250px;
  height: 240px;
  cursor: pointer;

  .message-tool-contant {
    width: 50px;
    padding: 5px;
    border-radius: 5px;
    transition: all linear 0.2s;

    .message-tool-item-img {
      width: 40px;
    }

    .message-tool-item-text {
      text-align: center;
      font-size: 10px;
    }

    &:hover {
      background: rgba(135, 206, 235, 0.6);
    }
  }
}
</style>
