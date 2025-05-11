<!--
 * @Descripttion: 给你两窝窝
 * @version: 5.0.0
 * @Author: 言棠
 * @Date: 2022-12-08 11:50:38
 * @LastEditors: YT
 * @LastEditTime: 2025-05-11 10:32:40
-->
<template>
  <div class="groupedit_container">
    <el-dropdown trigger="click" @command="handleEditGroupNameFun">
      <el-icon class="group-setting-icon">
        <Setting />
      </el-icon>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item :disabled="activeRoom.groupId === DEFAULT_GROUP_ID" command="1">编辑群名称</el-dropdown-item>
          <el-dropdown-item command="2">编辑群公告</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <!-- 编辑群名称 -->
    <el-dialog v-model="visibleEditGroupName" title="编辑群名称" width="500" align-center>
      <el-input v-model="groupName" :maxlength='220' :disabled="activeRoom.groupId === DEFAULT_GROUP_ID"
        placeholder="请输入群名字"></el-input>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="visibleEditGroupName = false">取消</el-button>
          <el-button type="primary" @click="editGroupNameFun">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 编辑群公告 -->
    <el-dialog v-model="visibleEditGroupNotice" title="编辑群公告" width="500" align-center>
      <el-input v-model="groupNotice" :maxlength='220' placeholder="请输入群名字"></el-input>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="visibleEditGroupNotice = false">取消</el-button>
          <el-button type="primary" @click="editGroupNoticeFun">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { ref, computed, watch, defineComponent } from "vue";
import { useUserStoreWithOut } from '@/store/modules/user';
import { useChatStoreWithOut } from '@/store/modules/chat';
import { DEFAULT_GROUP_ID } from '@/config/config';
export default defineComponent({
  name: "GenalGroupEdit",
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

    const handleEditGroupNameFun = (type: string) => {
      switch (type) {
        case '1':
          visibleEditGroupName.value = true;
          break;
        case '2':
          visibleEditGroupNotice.value = true;
          break;
      }
    };

    // 群名称修改（默认群禁止任何人修改群昵称）
    function editGroupNameFun() {
      socket.value.emit('editGroupName', {
        userId: userinfo.value.userId,
        groupId: activeRoom.value.groupId,
        groupName: groupName.value,
      });
      visibleEditGroupName.value = false;
    }

    // 群公告修改
    function editGroupNoticeFun() {
      socket.value.emit('editGroupNotice', {
        userId: userinfo.value.userId,
        groupId: activeRoom.value.groupId,
        notice: groupNotice.value,
      });
      visibleEditGroupNotice.value = false;
    }

    return {
      groupName,
      groupNotice,
      visibleEditGroupName,
      visibleEditGroupNotice,
      handleEditGroupNameFun,
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
