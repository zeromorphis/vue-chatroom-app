<!--
 * @Author: 言棠
 * @version: 3.0.0
 * @Descripttion: 人人都说顶峰相见，路边的水沟人满为患
 * @Date: 2022-04-14 13:54:14
 * @LastEditTime: 2023-10-22 18:14:45
-->
<template>
  <div class="chat_container" :style="{'--bg-image': `url('${background}')`}">
    <img class="background" v-if="background" :src="background" />
    <div class="chat_box">
      <div class="chat-part1" v-if="visibleTool">
        <GenalTool @logout="logOutFun" />
      </div>
      <div class="chat-part2">
        <GenalSearch @addGroup="addGroupFun" @joinGroup="joinGroupFun" @addFriend="addFriendFun" @setActiveRoom="setActiveRoomFun" />
        <GenalRoom @setActiveRoom="setActiveRoomFun" />
      </div>
      <div class="chat-part3">
        <div class="chat-tools-wrap">
          <div class="chat-tool">
            <menu-fold-outlined @click="toggleTool" v-if="visibleTool" />
            <menu-unfold-outlined @click="toggleTool" v-else />
          </div>
          <message-outlined class="chat-team" @click="visibleDrawer = true" />
        </div>
        <GenalMessage v-if="activeRoom" />
        <div class="chat-tools-wrap-right" :class="{'flexEnd': (activeRoom && !groupGather[activeRoom.groupId]) }">
          <div class="tool-left">
            <sync-outlined spin class="message-dropped-icon" v-if="dropped" />
            <div v-else class="group-friend">
              <GenalActive v-if="activeRoom && groupGather[activeRoom.groupId]" type="group" />
              <GenalActive v-else type="friend" />
            </div>
          </div>
          <GenalGroupEdit v-if="activeRoom && groupGather[activeRoom.groupId]" />
        </div>
      </div>
      <a-drawer placement="left" class="chat-drawer" :closable="false" :open="visibleDrawer" @close="visibleDrawer = false" maskClosable width='65%' style="height:100%">
        <div class="chat-drawer-box">
          <GenalSearch @addGroup="addGroupFun" @joinGroup="joinGroupFun" @addFriend="addFriendFun" @setActiveRoom="setActiveRoomFun" />
          <GenalRoom @setActiveRoom="setActiveRoomFun" />
        </div>
      </a-drawer>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, defineComponent } from "vue";
import { useRouter } from "vue-router";
import { useUserStoreWithOut } from '@/store/modules/user';
import { useChatStoreWithOut } from '@/store/modules/chat';
import { useGlobalStoreWithOut } from '@/store/modules/global';
import { LOGIN_URL } from "@/config/config";
import { MessageOutlined, MenuFoldOutlined, MenuUnfoldOutlined, SyncOutlined } from '@ant-design/icons-vue';
import GenalTool from '@/components/Chat/GenalTool.vue';
import GenalSearch from '@/components/Chat/GenalSearch.vue';
import GenalRoom from '@/components/Chat/GenalRoom.vue';
import GenalMessage from '@/components/Chat/GenalMessage.vue';
import GenalActive from '@/components/Chat/GenalActive.vue';
import GenalGroupEdit from '@/components/Chat/GenalGroupEdit.vue';
export default defineComponent({
  name: "Chat",
  components: {
    MessageOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    SyncOutlined,
    GenalTool,
    GenalSearch,
    GenalRoom,
    GenalMessage,
    GenalActive,
    GenalGroupEdit
  },
  setup() {
    const router = useRouter();
    const useUserStore = useUserStoreWithOut();
    const useChatStore = useChatStoreWithOut();
    const useGlobalStore = useGlobalStoreWithOut();
    const hasUserId = computed<boolean>(() => useUserStore.hasUserId);
    const background = computed<string>(() => useGlobalStore.background);
    const visibleTool = ref<boolean>(true);
    const visibleDrawer = ref<boolean>(false);
    const dropped = computed<boolean>(() => useChatStore.dropped);
    const userinfo = computed<object>(() => useUserStore.userinfo);
    const activeRoom = computed<Friend & Group>(() => useChatStore.activeRoom);
    const groupGather = computed<GroupGather>(() => useChatStore.groupGather);
    const socket = computed<SocketIOClient.Socket>(() => useChatStore.socket);

    // 进入系统初始化事件
    const handleJoin = async () => {
      await useChatStore.connectSocket();
    }

    watch(() => hasUserId, async (newVal, oldVal) => {
      if (hasUserId.value) await handleJoin()
    }, { immediate: true, deep: true }); // 开启深度监听

    // 注销
    const logOutFun = async () => {
      useUserStore.$reset();
      useChatStore.$reset();
      useGlobalStore.$reset();
      router.push({ path: LOGIN_URL });
    }

    // 创建群组
    const addGroupFun = async (groupName: string) => {
      socket.value.emit('addGroup', {
        userId: userinfo.value.userId,
        groupName: groupName,
        createTime: new Date().valueOf(),
      });
    }

    // 加入群组
    function joinGroupFun(groupId: string) {
      socket.value.emit('joinGroup', {
        userId: userinfo.value.userId,
        groupId: groupId,
      });
    }

    // 添加好友
    function addFriendFun(friendId: string) {
      socket.value.emit('addFriend', {
        userId: userinfo.value.userId,
        friendId: friendId,
        createTime: new Date().valueOf(),
      });
    }

    // 设置当前聊天窗
    function setActiveRoomFun(room: Friend & Group) {
      useChatStore.SET_ACTIVE_ROOM(room);
    }

    function toggleTool() {
      visibleTool.value = !visibleTool.value;
    }

    const onWindowResize = (event) => {
      visibleTool.value = true;
    }

    onMounted(() => {
      window.addEventListener('resize', onWindowResize);
    })

    onUnmounted(() => {
      window.removeEventListener('resize', onWindowResize)
    })

    return {
      background,
      visibleTool,
      logOutFun,
      addGroupFun,
      joinGroupFun,
      addFriendFun,
      setActiveRoomFun,
      visibleDrawer,
      toggleTool,
      groupGather,
      activeRoom,
      dropped,
    };
  },
});
</script>

<style lang="scss">
.chat_container {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.85);
  .background {
    position: absolute;
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
  .chat_box {
    font-size: 16px;
    z-index: 999;
    max-width: 1000px;
    min-width: 300px;
    width: 100%;
    height: 80%;
    max-height: 900px;
    min-height: 470px;
    position: relative;
    margin: auto 20px;
    box-shadow: 10px 20px 80px rgba(0, 0, 0, 0.8);
    display: flex;
    border-radius: 5px;
    overflow: hidden;
    .chat-part1 {
      width: 74px;
      height: 100%;
      background-color: rgb(0, 0, 0, 0.7);
    }
    .chat-part2 {
      width: 230px;
      height: 100%;
      background-color: rgb(0, 0, 0, 0.3);
    }
    .chat-part3 {
      flex: 1;
      height: 100%;
      background-color: rgb(0, 0, 0, 0.2);
      overflow-y: hidden;
      position: relative;
      display: flex;
      .chat-tools-wrap {
        width: 90px;
        height: 60px;
        padding: 0 12px;
        position: absolute;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .chat-tool {
          display: none;
        }
        .chat-team {
          display: none;
        }
      }
      .chat-tools-wrap-right {
        width: 90px;
        height: 60px;
        padding: 0 12px;
        position: absolute;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .tool-left {
          display: flex;
          align-items: center;
          .message-dropped-icon {
            font-size: 25px;
          }
        }
      }
      .flexEnd {
        justify-content: flex-end;
      }
      .chat-group {
        height: 53px;
        border-bottom: 1px solid #ccc;
        line-height: 50px;
        font-weight: bold;
      }
    }
  }
  .chat_box::after {
    content: '';
    background: var(--bg-image) 0 / cover fixed;
    position: absolute;
    object-fit: cover;
    width: 100%;
    height: 100%;
    filter: blur(10px);
    transform: scale(1.08);
    z-index: -1;
  }
  @media screen and (max-width: 768px) {
    .chat_box {
      margin: 0;
      height: 100%;
      .chat-part2 {
        display: none;
      }
      .chat-part3 {
        .chat-tools-wrap {
          .chat-tool {
            display: block;
            font-size: 25px;
            line-height: 25px;
            &:active {
              color: skyblue;
            }
          }
          .chat-team {
            display: block;
            font-size: 25px;
            line-height: 25px;
            &:active {
              color: skyblue;
            }
          }
        }
      }
    }
  }
}
// 抽屉组件重写样式
.chat-drawer {
  .ant-drawer-content-wrapper {
    background-color: rgba(54, 50, 50, 0.6) !important;

    .ant-drawer-content {
      background-color: rgba(0, 0, 0, 0.6) !important;

      .ant-drawer-body {
        padding: 0 !important;
        .chat-drawer-box {
          height: 100%;
          overflow: hidden;
          // 移动端群组部分
          .room-card {
            background-color: rgba(115, 165, 200, 0.2);
            .room-card-name {
              color: rgba(255, 255, 255, 0.85);
            }
            .room-card-new {
              .text {
                color: rgb(238, 214, 214);
              }
            }
          }
          .room-card.active {
            background-color: rgba(115, 165, 200, 0.35);
          }
        }
      }
    }
  }
}
</style>
