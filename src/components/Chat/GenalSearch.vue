<template>
  <div class="search_container">
    <div class="search-select">
      <el-select v-model="selectChatValue" filterable placeholder="搜索聊天组" :filter-method="handleSearchFun">
        <el-option v-for="(chat, index) in searchData" :key="index"
          :label="chat.username ? chat.username : chat.groupName"
          :value="chat.username ? chat.username : chat.groupName" @click="selectChatFun(chat)" />
      </el-select>
      <el-dropdown trigger="click" @command="handleEditGroupFun">
        <el-icon class="search-dropdown-button">
          <CirclePlus />
        </el-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="1">创建群聊</el-dropdown-item>
            <el-dropdown-item command="2">搜索群聊</el-dropdown-item>
            <el-dropdown-item command="3">搜索用户</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <!-- 创建群 -->
    <el-dialog v-model="visibleAddGroup" title="创建群" width="500" align-center>
      <el-input v-model="groupName" placeholder="请输入群名字"></el-input>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="visibleAddGroup = false">取消</el-button>
          <el-button type="primary" @click="addGroupFun">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 搜索群 -->
    <el-dialog v-model="visibleJoinGroup" title="搜索群" width="500" align-center>
      <div style="display:flex" v-if="visibleJoinGroup">
        <el-select v-model="groupId" filterable remote placeholder="请输入群名字" :remote-method="handleGroupSearchFun">
          <el-option v-for="(group, index) in groupArr" :key="index" :label="group.groupName" :value="group.groupId"
            @change="handleGroupSelectFun(group)" />
        </el-select>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="visibleJoinGroup = false">取消</el-button>
          <el-button type="primary" @click="joinGroupFun">
            加入群
          </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 搜索用户 -->
    <el-dialog v-model="visibleAddFriend" title="搜索用户" width="500" align-center>
      <div style="display:flex" v-if="visibleAddFriend">
        <el-select v-model="friendId" filterable remote placeholder="请输入用户名" :remote-method="handleUserSearchFun">
          <el-option v-for="(user, index) in userArr" :key="index" :label="user.username" :value="user.userId"
            @change="handleUserSelectFun(user)" />
        </el-select>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="visibleAddFriend = false">取消</el-button>
          <el-button type="primary" @click="addFriendFun">
            添加好友
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { ref, onBeforeMount, computed, watch, defineComponent, SetupContext } from "vue";
import { useChatStoreWithOut } from '@/store/modules/chat';
import { getGroupsByNameApi } from "@/api/modules/group";
import { getUsersByNameApi } from "@/api/modules/user";
import { nameVerify, isContainStr } from '@/utils/common';
import { ElNotification } from "element-plus";
export default defineComponent({
  name: "GenalSearch",
  emits: ['setActiveRoom', 'addGroup', 'joinGroup', 'addFriend'],
  setup(props, content: SetupContext) {
    const useChatStore = useChatStoreWithOut();
    const groupGather = computed<GroupGather>(() => useChatStore.groupGather);
    const friendGather = computed<FriendGather>(() => useChatStore.friendGather);
    const visibleAddGroup = ref<boolean>(false);
    const visibleJoinGroup = ref<boolean>(false);
    const visibleAddFriend = ref<boolean>(false);

    const groupName = ref<string>('');
    const searchData = ref<Array<Group | Friend>>([]);
    const groupId = ref<string>('');
    const groupArr = ref<Array<Group>>([]);
    const friendId = ref<string>('');
    const userArr = ref<Array<User>>([]);
    const selectChatValue = ref<string>('');

    onBeforeMount(async () => {
      getSearchData();
    });

    // 监听搜索
    watch([() => groupGather, () => friendGather], getSearchData, { immediate: true, deep: true }); // 开启深度监听
    function getSearchData() {
      searchData.value = [...Object.values(groupGather.value), ...Object.values(friendGather.value)];
    }

    const handleSearchFun = (value: string) => {
      let mySearchData = [];
      searchData.value = [...Object.values(groupGather.value), ...Object.values(friendGather.value)];
      for (let chat of searchData.value) {
        if (chat.username) {
          if (isContainStr(value, chat.username)) {
            mySearchData.push(chat);
            searchData.value = mySearchData;
          }
        } else {
          if (isContainStr(value, chat.groupName)) {
            mySearchData.push(chat);
            searchData.value = mySearchData;
          }
        }
      }
    }

    function selectChatFun(activeRoom: User & Group) {
      content.emit('setActiveRoom', activeRoom);
    }

    // 创建群
    function addGroupFun() {
      visibleAddGroup.value = false;
      if (!nameVerify(groupName.value)) {
        visibleAddGroup.value = true;
        return;
      }
      content.emit('addGroup', groupName.value);
      groupName.value = '';
    }

    async function handleGroupSearchFun(value: string) {
      if (!value) {
        return;
      }
      getGroupsByNameApi(value).then((res: any) => {
        groupArr.value = res.data;
      }).catch((err: any) => {
        ElNotification({
          title: 'Error',
          message: err.msg,
          type: "error",
          duration: 1500
        });
      });
    }

    function handleGroupSelectFun(group: Group) {
      groupId.value = group.groupId;
    }

    // 加入群
    function joinGroupFun() {
      console.log(groupId.value, "groupId");
      visibleJoinGroup.value = false;
      content.emit('joinGroup', groupId.value);
      groupId.value = '';
    }

    async function handleUserSearchFun(value: string) {
      if (!value) {
        return;
      }
      getUsersByNameApi(value).then((res: any) => {
        userArr.value = res.data;
      }).catch((err: any) => {
        ElNotification({
          title: 'Error',
          message: err.msg,
          type: "error",
          duration: 1500
        });
      });
    }

    function handleUserSelectFun(friend: Friend) {
      friendId.value = friend.userId;
    }

    // 添加好友
    function addFriendFun() {
      visibleAddFriend.value = false;
      content.emit('addFriend', friendId.value);
      friendId.value = '';
    }

    const handleEditGroupFun = (type: string) => {
      switch (type) {
        case '1':
          visibleAddGroup.value = true;
          break;
        case '2':
          visibleJoinGroup.value = true;
          break;
        case '3':
          visibleAddFriend.value = true;
          break;
      }
    };

    return {
      selectChatValue,
      groupId,
      friendId,
      searchData,
      handleSearchFun,
      selectChatFun,
      visibleAddGroup,
      groupName,
      addGroupFun,
      visibleJoinGroup,
      groupArr,
      handleGroupSearchFun,
      handleGroupSelectFun,
      joinGroupFun,
      visibleAddFriend,
      userArr,
      handleUserSearchFun,
      handleUserSelectFun,
      addFriendFun,
      handleEditGroupFun,
    };
  },
});
</script>

<style lang="scss" scoped>
.search_container {
  position: relative;
  height: 60px;
  padding: 10px;
  display: flex;
  align-items: center;

  .search-select {
    width: 100%;
    display: flex;
    align-items: center;

    .el-select {
      width: 100%;
    }

    .search-dropdown-button {
      width: 40px;
      font-size: 25px;
      cursor: pointer;
      line-height: 40px;
      color: gray;
      transition: 0.2s all linear;
    }
  }
}
</style>
