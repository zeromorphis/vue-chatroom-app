<!--
 * @Descripttion: 给你两窝窝
 * @version: 5.0.0
 * @Author: 言棠
 * @Date: 2022-12-08 11:50:38
 * @LastEditors: 言棠
 * @LastEditTime: 2023-10-22 18:17:14
-->
<template>
  <div class="groupedit_container">
    <a-dropdown :trigger="['click']">
      <setting-outlined class="group-setting-icon" />
      <template #overlay>
        <a-menu>
          <a-menu-item :disabled="activeRoom.groupId === DEFAULT_GROUP_ID" @click="() => (visibleEditGroupName = !visibleEditGroupName)">
            编辑群名称
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item @click="() => (visibleEditGroupNotice = !visibleEditGroupNotice)">编辑群公告</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
    <!-- 编辑群名称 -->
    <a-modal v-model:open="visibleEditGroupName" centered footer="" title="编辑群名称">
      <div style="display:flex">
        <a-input v-model:value="groupName" :maxlength='220' :disabled="activeRoom.groupId === DEFAULT_GROUP_ID" placeholder="请输入群名字"></a-input>
        <a-button @click="editGroupNameFun" :disabled="activeRoom.groupId === DEFAULT_GROUP_ID" type="primary">确定</a-button>
      </div>
    </a-modal>
    <!-- 编辑群公告 -->
    <a-modal v-model:open="visibleEditGroupNotice" centered footer="" title="编辑群公告">
      <div style="display:flex">
        <a-input v-model:value="groupNotice" :maxlength='220' placeholder="请输入群名字"></a-input>
        <a-button @click="editGroupNoticeFun" type="primary">确定</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { ref, computed, watch, defineComponent } from "vue";
import { SettingOutlined } from '@ant-design/icons-vue';
import { useUserStoreWithOut } from '@/store/modules/user';
import { useChatStoreWithOut } from '@/store/modules/chat';
import { DEFAULT_GROUP_ID } from '@/config/config';
export default defineComponent({
  name: "GenalGroupEdit",
  components: {
    SettingOutlined,
  },
  setup() {
    const useUserStore = useUserStoreWithOut();
    const useChatStore = useChatStoreWithOut();
    const userinfo = computed<object>(() => useUserStore.userinfo);
    const activeRoom = computed<Group & Friend>(() => useChatStore.activeRoom);
    const socket = computed<SocketIOClient.Socket>(() => useChatStore.socket);
    const visibleEditGroupName = ref<boolean>(false);
    const visibleEditGroupNotice = ref<boolean>(false);
    const groupName = ref<string>('');
    const groupNotice = ref<string>('');

    watch(() => activeRoom.value, async (newVal, oldVal) => {
      groupName.value = newVal.groupName;
      groupNotice.value = newVal.notice;
    }, { immediate: true, deep: true }); // 开启深度监听

    // 群名称修改（默认群禁止任何人修改群昵称）
    function editGroupNameFun() {
      socket.value.emit('editGroupName', {
        userId: userinfo.value.userId,
        groupId: activeRoom.value.groupId,
        groupName: groupName.value,
      });
    }

    // 群公告修改
    function editGroupNoticeFun() {
      socket.value.emit('editGroupNotice', {
        userId: userinfo.value.userId,
        groupId: activeRoom.value.groupId,
        notice: groupNotice.value,
      });
    }

    return {
      groupName,
      groupNotice,
      visibleEditGroupName,
      visibleEditGroupNotice,
      editGroupNameFun,
      editGroupNoticeFun,
      activeRoom,
      DEFAULT_GROUP_ID
    };
  },
});
</script>

<style lang="scss">
.groupedit_container {
  .group-setting-icon {
    font-size: 25px;
    cursor: pointer;
  }
}
</style>
