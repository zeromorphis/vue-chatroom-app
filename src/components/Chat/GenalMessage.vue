<template>
  <div class="message_container">
    <div class="message-header">
      <div class="message-header-box">
        <div ref='headerDom' class="message-header-text">
          <div v-if="groupGather[activeRoom.groupId]" class="nickname">{{ groupGather[activeRoom.groupId].groupName }}
          </div>
          <div v-if="groupGather[activeRoom.groupId]" class="notice">
            <el-badge is-dot>{{ groupGather[activeRoom.groupId].notice }}</el-badge>
          </div>
          <div v-else class="nickname">{{ userGather[activeRoom.userId].username }}</div>
        </div>
      </div>
    </div>
    <transition name="loading">
      <div class="message-loading" v-if="spinning && !isNoData">
        <el-icon class="message-loading-icon">
          <Refresh />
        </el-icon>
      </div>
    </transition>
    <div ref="messageDom" class="message-main" :style="{ opacity: messageOpacity }">
      <div ref="messageContentDom" class="message-content">
        <transition v-if="isNoData" name="noData">
          <el-divider class="message-content-noData" style="border-color: #999">
            没有更多消息了
          </el-divider>
        </transition>
        <template v-for="item in activeRoom.messages" :key="item.userId + item.time">
          <div class="message-content-message"
            :class="{ 'message-content-message-right': item.userId === userinfo.userId }">
            <genalAvatar :data="item" :showTime="true" />
            <div class="message-content-box">
              <a class="message-content-link" v-if="isUrl(item.content)" :href="item.content" target="_blank">{{
                item.content }}</a>
              <div class="message-content-text" v-text="parseText(item.content)"
                v-else-if="item.messageType === 'text'"></div>
              <div class="message-content-image" v-if="item.messageType === 'image'"
                :style="getImageStyle(item.content)">
                <viewer style="display:flex;align-items:center;">
                  <img :src="'api/static/' + item.content" alt="" />
                </viewer>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <GenalInput />
  </div>
</template>

<script lang="ts">
import { ref, onMounted, computed, watch, nextTick, defineComponent } from "vue";
import { useUserStoreWithOut } from '@/store/modules/user';
import { useChatStoreWithOut } from '@/store/modules/chat';
import { getGroupMessagesApi } from "@/api/modules/group";
import { getFriendMessageApi } from "@/api/modules/friend";
import { isUrl, getImageStyle, parseText } from '@/utils/common';
import GenalAvatar from './GenalAvatar.vue';
import GenalInput from './GenalInput.vue';
export default defineComponent({
  name: "GenalSearch",
  components: {
    GenalAvatar,
    GenalInput,
  },
  setup() {
    const useUserStore = useUserStoreWithOut();
    const useChatStore = useChatStoreWithOut();
    const activeRoom = computed<Group & Friend>(() => useChatStore.activeRoom);
    const groupGather = computed<GroupGather>(() => useChatStore.groupGather);
    const userGather = computed<FriendGather>(() => useChatStore.userGather);
    const userinfo = computed<object>(() => useUserStore.userinfo);
    const socket = computed<SocketIOClient.Socket>(() => useChatStore.socket);
    const needScrollToBottom = ref<boolean>(true);
    const messageDom = ref<HTMLElement>(null);
    const messageContentDom = ref<HTMLElement>(null);
    const headerDom = ref<HTMLElement>(null);
    const messageOpacity = ref<number>(1);
    const lastMessagePosition = ref<number>(0);
    const spinning = ref<boolean>(false);
    const pageSize = ref<number>(30);
    const isNoData = ref<boolean>(false);

    onMounted(() => {
      messageDom.value.addEventListener('scroll', handleScroll);
      scrollToBottom();
    });

    // 点击切换房间进入此方法
    watch(() => activeRoom.value, (newVal, oldVal) => {
      if (newVal.userId !== oldVal.userId) {
        changeActiveRoom();
      }
    }, { immediate: false, deep: true }); // 开启深度监听
    function changeActiveRoom() {
      messageOpacity.value = 0;
      isNoData.value = false;
      // 聊天名过渡动画
      if (headerDom.value) {
        headerDom.value.classList.add('transition');
        setTimeout(() => {
          headerDom.value.classList.remove('transition');
        }, 400);
      }
      // 大数据渲染优化
      if (activeRoom.value.messages && activeRoom.value.messages.length > pageSize.value) {
        activeRoom.value.messages = activeRoom.value.messages.splice(activeRoom.value.messages.length - pageSize.value, pageSize.value) as GroupMessage[] & FriendMessage[];
      }
      scrollToBottom();
    }

    // 在分页信息的基础上来了新消息
    const addMessage = () => {
      if (activeRoom.value.messages) {
        // 新消息来了只有是自己发的消息和消息框本身在底部才会滚动到底部
        let messages = activeRoom.value.messages;
        if (messages[messages.length - 1].userId === userinfo.value.userId || (messageDom.value && messageDom.value.scrollTop + messageDom.value.offsetHeight + 100 > messageContentDom.value.scrollHeight)) {
          scrollToBottom();
        }
      }
    }

    // 新消息会进入此方法
    watch(() => activeRoom.value.messages, (newVal, oldVal) => {
      changeMessages();
    }, { immediate: true, deep: true }); // 开启深度监听
    function changeMessages() {
      if (needScrollToBottom.value) {
        addMessage();
      }
      needScrollToBottom.value = true;
    }

    // 监听socket断连给出重连状态提醒
    watch(() => socket.value.disconnected, (newVal, oldVal) => {
      connectingSocket();
    }, { immediate: true, deep: true }); // 开启深度监听
    function connectingSocket() {
      if (socket.value.disconnected) {
        useChatStore.SET_DROPPED(true);
      }
    }

    //  监听滚动事件
    const handleScroll = (event: Event) => {
      if (event.currentTarget) {
        // 只有有消息且滚动到顶部时才进入
        if (messageDom.value.scrollTop === 0) {
          lastMessagePosition.value = messageContentDom.value.offsetHeight;
          let messages = activeRoom.value.messages;
          if (messages && messages.length >= pageSize.value && !spinning.value) {
            getMoreMessage();
          }
        }
      }
    }

    // 获取更多消息
    async function getMoreMessage() {
      if (isNoData.value) {
        return false;
      }
      spinning.value = true;
      if (activeRoom.value.groupId) {
        await getGroupMessages();
      } else {
        await getFriendMessages();
      }
      nextTick(() => {
        messageDom.value.scrollTop = messageContentDom.value.offsetHeight - lastMessagePosition.value;
        spinning.value = false;
        messageOpacity.value = 1;
      });
    }

    // 获取群聊消息
    async function getGroupMessages() {
      let groupId = activeRoom.value.groupId;
      let current = activeRoom.value.messages!.length;
      let currentMessage = activeRoom.value.messages ? activeRoom.value.messages : [];
      getGroupMessagesApi({ groupId, current, pageSize: pageSize.value }).then((res: any) => {
        if (!res.data.messageArr.length || res.data.messageArr.length < pageSize.value) {
          isNoData.value = true;
        }
        needScrollToBottom.value = false;
        useChatStore.SET_GROUP_MESSAGES([...res.data.messageArr, ...currentMessage]);
        for (let user of res.data.userArr) {
          if (!userGather.value[user.userId]) {
            useChatStore.SET_USER_GATHER(user);
          }
        }
      })
    }

    // 获取私聊消息
    async function getFriendMessages() {
      let userId = userinfo.value.userId;
      let friendId = activeRoom.value.userId;
      let current = activeRoom.value.messages!.length;
      let currentMessage = activeRoom.value.messages ? activeRoom.value.messages : [];
      getFriendMessageApi({ userId, friendId, current, pageSize: pageSize.value, }).then((res: any) => {
        if (!res.data.messageArr.length || res.data.messageArr.length < pageSize.value) {
          isNoData.value = true;
        }
        needScrollToBottom.value = false;
        useChatStore.SET_FRIEND_MESSAGES([...res.data.messageArr, ...currentMessage]);
      })
    }

    // 滚动到底部
    function scrollToBottom() {
      nextTick(() => {
        messageDom.value.scrollTop = messageDom.value.scrollHeight;
        messageOpacity.value = 1;
      });
    }

    return {
      userinfo,
      activeRoom,
      userGather,
      groupGather,
      spinning,
      isNoData,
      messageOpacity,
      needScrollToBottom,
      messageDom,
      messageContentDom,
      headerDom,
      isUrl,
      getImageStyle,
      parseText,
    };
  },
});
</script>

<style lang="scss" scoped>
.message_container {
  width: 100%;
  overflow: hidden;
  height: 100%;

  .message-header {
    width: 100%;
    height: 60px;
    padding: 0 100px;
    background-color: rgb(0, 0, 0, 0.6);

    .message-header-box {
      height: 100%;
      position: relative;

      .message-header-text {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .nickname {
          color: #fff;
          font-size: 16px;
          line-height: 16px;
        }

        .notice {
          margin-top: 6px;
          line-height: 12px;

          :deep(.ant-badge-status-text) {
            color: #fff;
            font-size: 12px;
          }
        }
      }

      .message-header-icon {
        margin-left: 5px;
      }
    }
  }

  .message-loading {
    position: absolute;
    left: calc(50% - 18px);
    top: 60px;
    z-index: 99;

    .message-loading-icon {
      margin: 10px auto;
      font-size: 20px;
      padding: 8px;
      border-radius: 50%;
      background-color: rgb(0, 0, 0, 0.8);
    }
  }

  .message-main {
    height: calc(100% - 100px);
    overflow: auto;
    position: relative;

    .message-content {
      .message-content-noData {
        font-size: 14px;
        color: #fff;
      }

      .message-content-message {
        margin: 15px 20px;
        text-align: left;

        .message-content-box {
          margin-top: 5px;
          display: flex;

          .message-content-link,
          .message-content-text {
            max-width: 60%;
            display: inline-block;
            padding: 6px 10px;
            background-color: rgba(255, 255, 255, 1);
            font-size: 14px;
            color: rgb(25, 25, 25);
            border-radius: 5px;
            word-break: break-all;
          }

          .message-content-link {
            color: rgb(69, 87, 131);
          }

          .message-content-image {
            width: 200px;
            display: block;
            border-radius: 5px;
            overflow: hidden;

            img {
              width: 100%;
              height: auto;
              display: block;
              cursor: pointer;
            }
          }
        }
      }

      .message-content-message-right {
        .message-content-box {
          display: flex;
          justify-content: flex-end;

          .message-content-link,
          .message-content-text {
            display: inline-block;
            background-color: rgb(169, 233, 122);
          }

          .message-content-image {
            display: block;
          }
        }
      }
    }
  }

  .message-input {
    display: flex;
    flex-wrap: nowrap;
    position: absolute;
    width: 100%;
    bottom: 0px;

    input {
      height: 40px;
    }

    .message-input-button {
      width: 30px;
      cursor: pointer;
      position: absolute;
      right: 10px;
      top: 4px;
    }
  }
}

//输入框样式
.ant-input {
  padding: 0 50px 0 50px;
}

// 消息工具样式
.messagte-tool-icon {
  position: absolute;
  left: 0;
  top: 0;
  width: 50px;
  height: 40px;
  text-align: center;
  line-height: 42px;
  font-size: 16px;
  cursor: pointer;
  z-index: 99;
}

.message-tool-item {
  width: 0px;
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

// 移动端样式
@media screen and (max-width: 768px) {
  .message_container {
    .message-header {
      .message-header-box {
        .message-header-text {
          .notice {
            display: none;
          }
        }
      }
    }

    .message-main {
      .message-content-image {
        img {
          cursor: pointer;
          max-width: 138px !important;
          height: inherit !important;
        }
      }
    }
  }
}

@media screen and (max-width: 500px) {
  .message_container {
    .message-header-box {
      .message-header-text {
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        .notice {
          display: none;
        }
      }

      .message-header-icon {
        position: absolute;
        top: 17px;
        right: 60px;
        font-size: 25px;
      }
    }
  }
}

.loading-enter-active {
  transition: all 0.3s ease;
}

.loading-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.loading-enter,
.loading-leave-to {
  transform: translateY(-30px);
  opacity: 0;
}

.noData-enter-active,
.noData-leave-active {
  transition: opacity 1s;
}

.noData-enter,
.noData-leave-to {
  opacity: 0;
}

.transition {
  display: inline-block;
  animation: transition 0.4s ease;
}

@keyframes transition {
  0% {
    transform: translateY(-40px);
    opacity: 0;
  }

  60% {
    transform: translateY(10px);
    opacity: 0.6;
  }

  100% {
    transform: translateY(0px);
    opacity: 1;
  }
}
</style>
