<template>
  <div class="active_container">
    <div v-if="type === 'group'">
      <el-icon @click="() => (showGroupUser = !showGroupUser)" class="active-button"
        :class="{ 'heightLight': showGroupUser }">
        <UserFilled />
      </el-icon>
      <el-drawer class="acitve-drawer" direction="rtl" v-model="showGroupUser" @close="showGroupUser = false" size='45%'
        :with-header="false">
        <div class="active-content" v-if="activeGroupUser[activeRoom.groupId]">
          <div class="actiev-content-title">群聊管理</div>
          <div class="actiev-content-box-wrap">
            <div class="active-content-sum">在线人数: {{ activeNum }}</div>
            <div class="active-content-users">
              <div class="active-content-user" v-for="data in activeGroupUser[activeRoom.groupId]" :key="data.userId">
                <GenalAvatar :data="data" :showTime="false" :showGroupList="true" />
              </div>
            </div>
            <div class="active-content-out-wrap">
              <el-button type="danger" class="active-content-out" :disabled="activeRoom.groupId === DEFAULT_GROUP_ID"
                @click="exitGroup">退出</el-button>
            </div>
          </div>
        </div>
      </el-drawer>
    </div>
    <div v-else>
      <el-popconfirm title="确定要删除该好友吗？" @confirm="exitFriend" icon-color="#626AEF" confirm-button-text="Yes"
        cancel-button-text="No" placement="bottom-end">
        <template #reference>
          <el-icon class="active-button">
            <DeleteFilled />
          </el-icon>
        </template>
      </el-popconfirm>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, defineComponent } from "vue";
import { TeamOutlined, UserDeleteOutlined } from '@ant-design/icons-vue';
import { useUserStoreWithOut } from '@/store/modules/user';
import { useChatStoreWithOut } from '@/store/modules/chat';
import { DEFAULT_GROUP_ID } from '@/config/config';
import GenalAvatar from './GenalAvatar.vue';
export default defineComponent({
  name: "GenalActive",
  components: {
    TeamOutlined,
    UserDeleteOutlined,
    GenalAvatar,
  },
  props: {
    type: {
      type: String,
      default: 'group',
    },
  },
  setup() {
    const useUserStore = useUserStoreWithOut();
    const useChatStore = useChatStoreWithOut();
    const showGroupUser = ref<boolean>(false);
    const activeRoom = computed<Group & Friend>(() => useChatStore.activeRoom);
    const activeGroupUser = computed<ActiveGroupUser>(() => useChatStore.activeGroupUser);
    const userinfo = computed<object>(() => useUserStore.userinfo);
    const socket = computed<SocketIOClient.Socket>(() => useChatStore.socket);
    const activeNum = computed<number>(() => Object.keys(useChatStore.activeGroupUser[useChatStore.activeRoom.groupId]).length);

    // 抽屉组件绑定到GenalMessage组件上
    function getElement() {
      return document.getElementsByClassName('message_container')[0];
    }

    // 退出群聊
    function exitGroup() {
      socket.value.emit('exitGroup', {
        userId: userinfo.value.userId,
        groupId: activeRoom.value.groupId,
      });
    }

    // 删除好友
    function exitFriend() {
      socket.value.emit('exitFriend', {
        userId: userinfo.value.userId,
        friendId: activeRoom.value.userId,
      });
    }

    return {
      activeNum,
      showGroupUser,
      getElement,
      activeRoom,
      activeGroupUser,
      exitGroup,
      exitFriend,
      DEFAULT_GROUP_ID
    };
  },
});
</script>

<style lang="scss">
.active_container {
  border-radius: 0 0 5px 5px;

  .active-button {
    font-size: 25px;
    cursor: pointer;

    &:active {
      color: skyblue;
    }
  }

  .active-button.heightLight {
    color: skyblue;
  }
}

::-webkit-scrollbar {
  display: none !important;
}

// 抽屉组件重写样式
.acitve-drawer {
  .el-drawer__body {
    background-color: rgba(0, 0, 0, 0.5) !important;

    // 在线人数部分
    .active-content {
      height: 100%;
      border-radius: 0 0 5px 5px;
      text-align: left;

      .actiev-content-title {
        text-align: center;
        height: 60px;
        line-height: 60px;
        padding: 0 12px;
        font-size: 16px;
        color: #fff;
        border-bottom: 0.5px solid rgba(0, 0, 0, 1);
      }

      .actiev-content-box-wrap {
        height: calc(100% - 60px);

        .active-content-sum {
          font-weight: bold;
          height: 40px;
          line-height: 40px;
          padding: 0 12px;
        }

        .active-content-users {
          height: calc(100% - 40px - 40px);
          overflow-y: scroll;

          .active-content-user {
            overflow: hidden; //超出的文本隐藏
            text-overflow: ellipsis; //溢出用省略号显示
            white-space: nowrap; //溢出不换行
            text-align: left;
            padding: 3px 12px;
            display: flex;
            align-items: center;
          }
        }

        .active-content-out-wrap {
          width: 100%;
          height: 40px;
          padding: 6px 12px;

          .active-content-out {
            width: 100%;
            height: 28px;
          }
        }
      }
    }
  }
}
</style>
