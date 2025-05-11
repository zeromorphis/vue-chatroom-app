<template>
  <div class="room_container" v-if='chatArr.length'>
    <div v-for="(chat, index) in chatArr" :key="(chat.userId || chat.groupId) + index">
      <div v-if="chat.groupId" class="room-card" :class="{ active: activeRoom && activeRoom.groupId === chat.groupId }" @click="changeActiveRoom(chat)">
        <el-badge :show-zero="false" class="room-card-badge" max="99" :value="unReadGather[chat.groupId]" />
        <img class="room-card-type" src="@/assets/images/chat/group.gif" alt="" />
        <div class="room-card-message">
          <div class="room-card-name">{{ chat.groupName }}</div>
          <div class="room-card-new" v-if="chat.messages">
            <div class="text" v-text="parseText(chat.messages[chat.messages.length - 1].content)" v-if="chat.messages[chat.messages.length - 1].messageType === 'text'"></div>
            <div class="image" v-if="chat.messages[chat.messages.length - 1].messageType === 'image'">[图片]</div>
          </div>
        </div>
      </div>
      <div v-else class="room-card" :class="{ active: activeRoom && !activeRoom.groupId && activeRoom.userId === chat.userId }" @click="changeActiveRoom(chat)">
        <el-badge :show-zero="false" class="room-card-badge" max="99" :value="unReadGather[chat.userId]" />
        <img class="room-card-type" :src="friendGather[chat.userId].avatar" :class="{ offLine: !isOnLine(chat.userId) }" alt="" />
        <div class="room-card-message">
          <div class="room-card-name">{{ chat.username }}</div>
          <div class="room-card-new" v-if="chat.messages">
            <div class="text" v-text="parseText(chat.messages[chat.messages.length - 1].content)" v-if="chat.messages[chat.messages.length - 1].messageType === 'text'"></div>
            <div class="image" v-if="chat.messages[chat.messages.length - 1].messageType === 'image'">[图片]</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onBeforeMount, computed, watch, defineComponent, SetupContext } from "vue";
import { useChatStoreWithOut } from '@/store/modules/chat';
import { parseText } from '@/utils/common';
import { DEFAULT_GROUP_ID } from '@/config/config';
export default defineComponent({
  name: "GenalRoom",
  emits: ['setActiveRoom'],
  setup(props, content: SetupContext) {
    const useChatStore = useChatStoreWithOut();
    const activeRoom = computed<GroupGather>(() => useChatStore.activeRoom);
    const groupGather = computed<GroupGather>(() => useChatStore.groupGather);
    const friendGather = computed<FriendGather>(() => useChatStore.friendGather);
    const unReadGather = computed<FriendGather>(() => useChatStore.unReadGather);
    const activeGroupUser = computed<ActiveGroupUser>(() => useChatStore.activeGroupUser);
    const chatArr = ref<Array<Group | Friend>>([]);

    onBeforeMount(async () => {
      sortChat();
    });

    // 消息排序
    watch([() => groupGather, () => friendGather], sortChat, { immediate: true, deep: true }); // 开启深度监听
    function sortChat() {
      chatArr.value = [];
      let groups = Object.values(groupGather.value);
      let friends = Object.values(friendGather.value);
      chatArr.value = [...groups, ...friends];
      // 对聊天窗进行排序(根据最新消息时间)
      chatArr.value = chatArr.value.sort((a: Group | Friend, b: Group | Friend) => {
        if (a.messages && b.messages) {
          return b.messages[b.messages.length - 1].time - a.messages[a.messages.length - 1].time;
        }
        if (a.messages) {
          return -1;
        }
        return 1;
      });
    }

    // 显示当前聊天组
    function changeActiveRoom(activeRoom: User & Group) {
      content.emit('setActiveRoom', activeRoom);
      useChatStore.LOSE_UNREAD_GATHER(activeRoom.groupId || activeRoom.userId)
    }

    // 查询默认群聊中是否存在该好友，存在即在线，不存在即离线模式
    function isOnLine(userId: string) {
      console.log(DEFAULT_GROUP_ID,userId)
      return activeGroupUser.value[DEFAULT_GROUP_ID].hasOwnProperty(userId);
    }

    return {
      chatArr,
      activeRoom,
      changeActiveRoom,
      unReadGather,
      parseText,
      friendGather,
      isOnLine
    };
  },
});
</script>

<style lang="scss" scoped>
@mixin actBtn($bcolor, $url, $x1, $y1, $bor, $col) {
  background: $bcolor;
  -webkit-mask: url($url);
  mask: url($url);
  -webkit-mask-size: $x1 $y1;
  mask-size: $x1 $y1;
  border: $bor;
  color: $col;
}
.room_container {
  height: calc(100% - 60px);
  overflow: auto;
  .room-card {
    position: relative;
    min-height: 70px;
    display: flex;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.2);
    padding: 5px 10px;
    text-align: left;
    transition: all 0.2s linear;
    cursor: pointer;
    &:hover {
      background-color: rgb(0, 0, 0, 0.4);
    }
    &.active {
      @include actBtn(
        rgb(0, 0, 0, 0.5),
        '@/assets/images/chat/animate.png',
        3000%,
        100%,
        none,
        #fff
      );
      -webkit-animation: ani 2s steps(29) forwards;
      animation: ani 0.5s steps(29) forwards;
    }
    .room-card-badge {
      position: absolute;
      right: 10px;
      top: 10px;
      :deep(.ant-badge-count) {
        box-shadow: none;
      }
    }
    .room-card-type {
      width: 45px;
      height: 45px;
      margin-right: 5px;
      border-radius: 50%;
      object-fit: cover;
      &.offLine {
        filter: grayscale(90%);
      }
    }
    .room-card-message {
      flex: 1;
      display: flex;
      width: 75%;
      flex-direction: column;
      .room-card-name {
        overflow: hidden; //超出的文本隐藏
        text-overflow: ellipsis; //溢出用省略号显示
        white-space: nowrap; //溢出不换行
      }
      .room-card-new {
        > * {
          display: block;
          overflow: hidden; //超出的文本隐藏
          text-overflow: ellipsis; //溢出用省略号显示
          white-space: nowrap; //溢出不换行
        }
        color: rgb(255, 255, 255, 0.6);
        font-size: 14px;
      }
    }
  }
}

@keyframes ani {
  from {
    -webkit-mask-position: 100% 0;
    mask-position: 100% 0;
  }

  to {
    -webkit-mask-position: 0 0;
    mask-position: 0 0;
  }
}
</style>
