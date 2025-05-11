<!--
 * @Descripttion: 给你两窝窝
 * @version: 5.0.0
 * @Author: 言棠
 * @Date: 2022-11-30 16:20:43
 * @LastEditors: YT
 * @LastEditTime: 2025-05-11 10:53:55
-->
<template>
  <div class="avatar_container" v-if="userGather[data.userId]">
    <div v-if="data.userId !== userinfo.userId" class="noHasSelf">
      <el-popover trigger="click">
        <template #reference>
          <el-avatar shape="square" :size="32" :src="userGather[data.userId].avatar" />
        </template>
        <div class="avatar-card">
          <el-avatar shape="square" :size="60" :src="userGather[data.userId].avatar" />
          <div>{{ userGather[data.userId].username }}</div>
          <el-button v-if="userinfo.role === 'admin'" style="margin-bottom: 5px;" @click="deleteUser(data.userId)"
            type="primary">
            删除用户
          </el-button>
          <el-button @click="setActiveRoom(data.userId)" type="primary"
            v-if="friendGather[data.userId]">进入私聊</el-button>
          <el-button @click="addFriend(data.userId)" type="primary" v-else>添加好友</el-button>
        </div>
      </el-popover>
      <div class="userinfo-wrap">
        <span class="avatar-name">{{ userGather[data.userId].username }}</span>
        <span class="avatar-time" v-if="showTime">{{ formatTime(data.time) }}</span>
      </div>
    </div>
    <div v-if="data.userId === userinfo.userId && !showGroupList" class="hasSelf">
      <div class="userinfo-wrap">
        <span class="avatar-time" v-if="showTime">{{ formatTime(data.time) }}</span>
        <span class="avatar-name">{{ userGather[data.userId].username }}</span>
      </div>
      <el-avatar shape="square" :size="32" :src="userGather[data.userId].avatar" />
    </div>
    <div v-if="data.userId === userinfo.userId && showGroupList" class="has-self-left">
      <el-avatar shape="square" :size="32" :src="userGather[data.userId].avatar" />
      <div class="userinfo-wrap">
        <span class="avatar-name">{{ userGather[data.userId].username }}</span>
        <span class="avatar-time" v-if="showTime">{{ formatTime(data.time) }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useUserStoreWithOut } from '@/store/modules/user';
import { useChatStoreWithOut } from '@/store/modules/chat';
import { deleteUserApi } from '@/api/modules/user';
import { formatTime } from '@/utils/common';
import { ElNotification } from "element-plus";
export default defineComponent({
  name: "GenalAvatar",
  props: {
    data: {
      type: Object,
      default: null,// 用户信息
    },
    showTime: {
      type: Boolean,
      default: true,// 是否显示时间
    },
    showGroupList: {
      type: Boolean,
      default: false,// 是否为群组列表
    },
  },
  setup() {
    const useUserStore = useUserStoreWithOut();
    const useChatStore = useChatStoreWithOut();
    const userinfo = computed<object>(() => useUserStore.userinfo);
    const userGather = computed<FriendGather>(() => useChatStore.userGather);
    const friendGather = computed<FriendGather>(() => useChatStore.friendGather);
    const socket = computed<SocketIOClient.Socket>(() => useChatStore.socket);

    // 添加好友
    function addFriend(friendId: string) {
      socket.value.emit('addFriend', {
        userId: userinfo.value.userId,
        friendId: friendId,
        createTime: new Date().valueOf(),
      });
    }

    // 进入当前聊天组
    function setActiveRoom(userId: string) {
      useChatStore.SET_ACTIVE_ROOM(friendGather.value[userId]);
    }

    // 删除好友
    async function deleteUser(userId: string) {
      try {
        let res = await deleteUserApi({ uid: userinfo.value.userId, psw: userinfo.value.password, did: userId });
        ElNotification({
          title: 'Success',
          message: res.msg,
          type: "success",
          duration: 1500
        });
      } catch (error) {
        ElNotification({
          title: "Error",
          message: error.msg,
          type: "error",
          duration: 1500
        });
      }
    }

    return {
      userinfo,
      userGather,
      friendGather,
      addFriend,
      setActiveRoom,
      deleteUser,
      formatTime
    };
  },
});
</script>

<style lang="scss" scoped>
.avatar_container {
  display: flex;
  align-items: center;
  height: 37px;

  .noHasSelf,
  .has-self-left {
    width: 100%;
    display: flex;
    align-items: center;

    .userinfo-wrap {
      display: flex;
      align-items: center;

      .avatar-name {
        margin-left: 5px;
        font-size: 14px;
      }

      .avatar-time {
        font-size: 12px;
        color: rgb(255, 255, 255, 0.75);
        margin-left: 3px;
      }
    }
  }

  .hasSelf {
    width: 100%;
    display: flex;
    justify-content: flex-end;

    .userinfo-wrap {
      display: flex;
      align-items: center;

      .avatar-time {
        font-size: 12px;
        color: rgb(255, 255, 255, 0.75);
        margin-right: 3px;
      }

      .avatar-name {
        margin-right: 5px;
        font-size: 14px;
      }
    }
  }
}

.avatar-card {
  display: flex;
  font-size: 18px;
  flex-direction: column;
  align-items: center;

  >div {
    margin: 4px;
  }
}
</style>
