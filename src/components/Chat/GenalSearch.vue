<template>
  <div class="search_container">
    <div class="search-select">
      <a-select show-search placeholder="搜索聊天组" :defaultActiveFirstOption="false" :showArrow="false" :filterOption="false" :notFoundContent="null" @search="handleSearchFun">
        <a-select-option v-for="(chat, index) in searchData" :key="index" @click="selectChatFun(chat)">
          <div v-if="chat.username">{{ chat.username }}</div>
          <div v-if="chat.groupName">{{ chat.groupName }}</div>
        </a-select-option>
      </a-select>
      <a-dropdown class="search-dropdown">
        <plus-circle-outlined class="search-dropdown-button" />
        <template #overlay>
          <a-menu slot="overlay">
            <a-menu-item>
              <div @click="() => (visibleAddGroup = !visibleAddGroup)">创建群聊</div>
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item>
              <div @click="() => (visibleJoinGroup = !visibleJoinGroup)">搜索群聊</div>
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item>
              <div @click="() => (visibleAddFriend = !visibleAddFriend)">搜索用户</div>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
    <!-- 创建群 -->
    <a-modal v-model:open="visibleAddGroup" centered footer="" title="创建群">
      <div style="display:flex">
        <a-input v-model:value="groupName" placeholder="请输入群名字"></a-input>
        <a-button @click="addGroupFun" type="primary">确定</a-button>
      </div>
    </a-modal>
    <!-- 搜索群 -->
    <a-modal v-model:open="visibleJoinGroup" centered footer="" title="搜索群">
      <div style="display:flex" v-if="visibleJoinGroup">
        <a-select show-search placeholder="请输入群名字" style="width: 90%" :default-active-first-option="false" :show-arrow="false" :filter-option="false" :not-found-content="null" @search="handleGroupSearch" @change="handleGroupChange">
          <a-select-option v-for="(group, index) in groupArr" :key="index" @click="handleGroupSelectFun(group)">
            <div>{{ group.groupName }}</div>
          </a-select-option>
        </a-select>
        <a-button @click="joinGroupFun" type="primary">加入群</a-button>
      </div>
    </a-modal>
    <!-- 搜索用户 -->
    <a-modal v-model:open="visibleAddFriend" centered footer="" title="搜索用户">
      <div style="display:flex" v-if="visibleAddFriend">
        <a-select show-search placeholder="请输入用户名" style="width: 90%" :default-active-first-option="false" :show-arrow="false" :filter-option="false" :not-found-content="null" @search="handleUserSearch" @change="handleUserChange">
          <a-select-option v-for="(user, index) in userArr" :key="index" @click="handleUserSelect(user)">
            <div>{{ user.username }}</div>
          </a-select-option>
        </a-select>
        <a-button @click="addFriendFun" type="primary">添加好友</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { ref, onBeforeMount, computed, watch, defineComponent, SetupContext } from "vue";
import { PlusCircleOutlined } from '@ant-design/icons-vue';
import { useChatStoreWithOut } from '@/store/modules/chat';
import { getGroupsByNameApi } from "@/api/modules/group";
import { getUsersByNameApi } from "@/api/modules/user";
import { nameVerify, isContainStr } from '@/utils/common';
import { message } from 'ant-design-vue';
export default defineComponent({
  name: "GenalSearch",
  components: {
    PlusCircleOutlined,
  },
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
          }
        } else if (isContainStr(value, chat.groupName)) {
          mySearchData.push(chat);
        }
      }
      searchData.value = mySearchData;
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

    async function handleGroupSearch(value: string) {
      if (!value) {
        return;
      }
      getGroupsByNameApi(value).then((res: any) => {
        groupArr.value = res.data;
      }).catch((err: any) => {
        message.error(err.msg);
      });
    }

    function handleGroupChange() {
      groupArr.value = [];
    }

    function handleGroupSelectFun(group: Group) {
      groupId.value = group.groupId;
    }

    // 加入群
    function joinGroupFun() {
      visibleJoinGroup.value = false;
      content.emit('joinGroup', groupId.value);
      groupId.value = '';
    }

    async function handleUserSearch(value: string) {
      if (!value) {
        return;
      }
      getUsersByNameApi(value).then((res: any) => {
        userArr.value = res.data;
      }).catch((err: any) => {
        message.error(err.msg);
      });
    }

    function handleUserChange() {
      userArr.value = [];
    }

    function handleUserSelect(friend: Friend) {
      friendId.value = friend.userId;
    }

    // 添加好友
    function addFriendFun() {
      visibleAddFriend.value = false;
      content.emit('addFriend', friendId.value);
      friendId.value = '';
    }

    return {
      searchData,
      handleSearchFun,
      selectChatFun,
      visibleAddGroup,
      groupName,
      addGroupFun,
      visibleJoinGroup,
      groupArr,
      handleGroupSearch,
      handleGroupChange,
      handleGroupSelectFun,
      joinGroupFun,
      visibleAddFriend,
      userArr,
      handleUserSearch,
      handleUserSelect,
      handleUserChange,
      addFriendFun
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
    .ant-select {
      width: 100%;
    }
  }
  .search-dropdown {
    position: absolute;
    right: 10px;
    top: 13px;
    width: 40px;
    height: 34px;
    font-size: 20px;
    cursor: pointer;
    line-height: 40px;
    color: gray;
    transition: 0.2s all linear;
    border-radius: 4px;
  }
}
</style>
