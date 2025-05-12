<template>
  <div class="tool_container">
    <div class="tool-avatar">
      <div class="tool-avatar-img" @click="showUserInfoFun()">
        <img v-if="userinfo" :src="userinfo.avatar" />
      </div>
      <div class="tool-avatar-name">{{ userinfo.username }}</div>
    </div>
    <el-tooltip placement="top">
      <template #content>
        <div slot="title">
          <div>请文明聊天</div>
          <div>截图粘贴可发送图片</div>
        </div>
      </template>
      <el-icon class="tool-tip icon">
        <Opportunity />
      </el-icon>
    </el-tooltip>
    <el-icon class="tool-skin icon" @click="showBackgroundModal = true">
      <MagicStick />
    </el-icon>
    <el-icon class="tool-out icon" @click="logOut">
      <TurnOff />
    </el-icon>
    <el-dialog v-model="showUserModal" title="用户信息" width="500" align-center>
      <div class="tool-user">
        <div @mouseover="showUpload = true" @mouseleave="showUpload = false" class="tool-user-avatar"
          :class="{ active: showUpload || uploading }">
          <el-avatar :src="userinfo.avatar" class="img" :size="120"></el-avatar>
          <el-upload v-if="showUpload && !uploading" class="tool-user-upload" :show-file-list="false"
            :before-upload="beforeUpload">
            <div class="text">
              <el-icon style="margin-right: 4px;">
                <UploadFilled />
              </el-icon>
              <span>更换头像</span>
            </div>
          </el-upload>
          <el-icon class="loading" v-if="uploading"><Loading /></el-icon>
        </div>
        <div class="tool-user-info">
          <div class="tool-user-title">更改用户名</div>
          <el-input class="tool-user-input" v-model="username" placeholder="请输入用户名"></el-input>
          <el-button type="primary" @click="changeUserNameFun">确认</el-button>
        </div>
        <div class="tool-user-info">
          <div class="tool-user-title">更改密码</div>
          <el-input type="password" class="tool-user-input" v-model="password" placeholder="请输入密码"></el-input>
          <el-button type="primary" @click="changePasswordFun">确认</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog v-model="showBackgroundModal" title="主题" width="500" align-center>
      <div class="tool-user-info">
        <div class="tool-user-title" style="width: 65px;">
          <span>背景图</span>
          <el-tooltip placement="top">
            <template #content>
              <div slot="title">
                <span>输入空格时为默认背景, 支持 jpg, png, gif等格式</span>
              </div>
            </template>
            <el-icon style="margin-left: 5px;">
              <InfoFilled />
            </el-icon>
          </el-tooltip>
        </div>
        <el-input v-model="background" class="tool-user-input" placeholder="请输入背景图片网址"></el-input>
        <el-button type="primary" @click="changeBackgroundFun()">确认</el-button>
      </div>
      <div class="tool-recommend">
        <div v-for="(item, index) in wallpaperList" :key="index" @click="setBackgroundFun(item.imgurl)"
          class="recommend">
          <img :src="item.imgurl" :alt="item.title" />
          <span class="text">{{ item.title }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { ref, reactive, onBeforeMount, computed, toRefs, defineComponent, SetupContext } from "vue";
import { useUserStoreWithOut } from '@/store/modules/user';
import { useChatStoreWithOut } from '@/store/modules/chat';
import { useGlobalStoreWithOut } from '@/store/modules/global';
import { nameVerify, passwordVerify } from '@/utils/common';
import { setUserAvatarApi, patchUserNameApi, patchPasswordApi } from '@/api/modules/user';
import { DEFAULT_BACKGROUND, DEFAULT_GROUP_ID } from '@/config/config';
import { ElMessage } from "element-plus";
import md5 from "js-md5";
interface FormState {
  username: string;
  password: string;
  avatar: string;
  uploading: boolean;
  background: string;
}
export default defineComponent({
  name: "GenalTool",
  emits: ['logout'],
  setup(props, content: SetupContext) {
    const useUserStore = useUserStoreWithOut();
    const useChatStore = useChatStoreWithOut();
    const useGlobalStore = useGlobalStoreWithOut();
    const userinfo = computed<object>(() => useUserStore.userinfo);
    const socket = computed<SocketIOClient.Socket>(() => useChatStore.socket);
    const showUserModal = ref<boolean>(false);
    const showUpload = ref<boolean>(false);
    const showBackgroundModal = ref<boolean>(false);

    const wallpaperList = reactive<object[]>([
      {
        title: '阿童木',
        imgurl: 'https://images.weserv.nl/?url=https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/23fa890c0c244db1b2d6e0927113475c~tplv-k3u1fbpfcp-zoom-1.image?imageView2/2/w/800/q/85',
      },
      {
        title: 'VSCode摸鱼',
        imgurl: 'https://images.weserv.nl/?url=https://raw.githubusercontent.com/alexanderbast/vscode-snazzy/master/sample.jpg',
      },
      {
        title: '山谷',
        imgurl: 'https://images.weserv.nl/?url=https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/453b8ebcdefa46a69c620da13f346ce2~tplv-k3u1fbpfcp-zoom-1.image?imageView2/2/w/800/q/85',
      },
      {
        title: '云朵',
        imgurl: 'https://pic2.zhimg.com/v2-f76706d67343c66b08c937ec6bc42942_r.jpg?source=1940ef5c',
      },
      {
        title: '少女',
        imgurl: 'https://images.weserv.nl/?url=https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cc98cbc4ca284fc0aa509b12db0e325e~tplv-k3u1fbpfcp-zoom-1.image?imageView2/2/w/800/q/85',
      },
      {
        title: '猫咪',
        imgurl: 'https://picb.zhimg.com/v2-263525f6c912d300abfa0eed3acbfd4b_r.jpg',
      },
      {
        title: 'In a cavern by',
        imgurl: 'https://images2.alphacoders.com/661/661667.png',
      },
      {
        title: 'Autumn',
        imgurl: 'https://images4.alphacoders.com/692/692750.jpg',
      },
      {
        title: '死宅专享',
        imgurl: 'https://konachan.net/sample/df0af807b95d915714acdfbb53d8f6be/Konachan.com%20-%20350504%20sample.jpg',
      }
    ]);

    const formState = reactive<FormState>({
      username: '',
      password: '',
      avatar: '',
      uploading: false,
      background: '',
    });

    onBeforeMount(async () => {
      formState.username = useUserStore.userinfo.username;
    });

    function showUserInfoFun() {
      formState.username = useUserStore.userinfo.username;
      showUserModal.value = true;
    }

    function beforeUpload(file: any) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/gif';
      if (!isJpgOrPng) {
        ElMessage.error("请上传jpeg/jpg/png/gif格式的图片!");
        return;
      }
      const isLt1M = file.size / 1024 / 1024 < 0.5;
      if (!isLt1M) {
        ElMessage.error("图片必须小于500K!");
        return;
      }
      formState.avatar = file;
      handleUpload();
      return false;
    }

    async function handleUpload() {
      formState.uploading = true;
      const formData = new FormData();
      formData.append('avatar', formState.avatar);
      formData.append('userId', useUserStore.userinfo.userId);
      formData.append('password', useUserStore.userinfo.password);
      setUserAvatarApi(formData).then((res: any) => {
        useUserStore.SET_USERINFO(res.data);
        useChatStore.SET_USER_GATHER(res.data);
        formState.uploading = false;
        showUpload.value = false;
        // 通知其他用户个人信息改变
        socket.value.emit('joinGroupSocket', {
          groupId: DEFAULT_GROUP_ID,
          userId: res.data.userId,
        });
        showUserModal.value = false;
        ElMessage.success(res.msg);
      }).catch((err: any) => {
        ElMessage.error(err.msg);
      });
    }

    async function changeUserNameFun() {
      if (!nameVerify(formState.username)) {
        return;
      }
      let userinfo: User = JSON.parse(JSON.stringify(useUserStore.userinfo));
      userinfo.username = formState.username;
      patchUserNameApi(userinfo).then((res: any) => {
        useUserStore.SET_USERINFO(res.data);
        useChatStore.SET_USER_GATHER(res.data);
        // 通知其他用户个人信息改变
        socket.value.emit('joinGroupSocket', {
          groupId: DEFAULT_GROUP_ID,
          userId: res.data.userId,
        });
        showUserModal.value = false;
        ElMessage.success(res.msg);
      }).catch((err: any) => {
        ElMessage.error(err.msg);
      });
    }

    async function changePasswordFun() {
      if (!passwordVerify(formState.password)) {
        return;
      }
      let userinfo: User = JSON.parse(JSON.stringify(useUserStore.userinfo));
      try {
        let res = await patchPasswordApi(userinfo, md5(formState.password));
        useUserStore.SET_USERINFO(res.data);
        useChatStore.SET_USER_GATHER(res.data);
        showUserModal.value = false;
        formState.password = '';
        ElMessage.success(res.msg);
      } catch (err: any) {
        ElMessage.error(err.msg);
      }
    }

    // 选择现有背景
    function setBackgroundFun(url: string) {
      useGlobalStore.SET_BACKGROUND(url);
    }

    // 输入框设置背景
    function changeBackgroundFun() {
      if (!formState.background.trim().length) {
        useGlobalStore.SET_BACKGROUND(DEFAULT_BACKGROUND);
      } else {
        useGlobalStore.SET_BACKGROUND(formState.background);
      }
      showBackgroundModal.value = false;
    }

    // 登出
    function logOut() {
      content.emit('logout');
    }

    return {
      userinfo,
      showUserModal,
      showUpload,
      showUserInfoFun,
      showBackgroundModal,
      setBackgroundFun,
      changeBackgroundFun,
      logOut,
      beforeUpload,
      changeUserNameFun,
      changePasswordFun,
      wallpaperList,
      ...toRefs(formState),
    };
  },
});
</script>

<style lang="scss" scoped>
.tool_container {
  padding: 10px 5px;
  height: 98%;
  position: relative;

  .tool-avatar {
    margin-top: 3px;

    .tool-avatar-img {
      margin: 0 auto;
      width: 55px;
      height: 55px;
      border-radius: 50%;
      overflow: hidden;
      cursor: pointer;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .tool-avatar-name {
      color: #fff;
      overflow: hidden; //超出的文本隐藏
      text-overflow: ellipsis; //溢出用省略号显示
      white-space: nowrap; //溢出不换行
      margin-top: 2px;
    }
  }

  .tool-tip {
    bottom: 130px;
  }

  .tool-skin {
    bottom: 70px;
  }

  .tool-out {
    bottom: 10px;
  }

  .icon {
    display: flex;
    flex-direction: column;
    position: absolute;
    left: 25px;
    font-size: 25px;
    cursor: pointer;
    z-index: 100;

    &:hover {
      color: skyblue;
    }
  }
}

.tool-user {
  text-align: center;
  font-size: 16px;

  .tool-user-avatar {
    position: relative;
    width: 120px;
    height: 120px;
    overflow: hidden;
    margin: 0 auto 24px;
    border-radius: 50%;
    cursor: pointer;

    .tool-user-upload {
      width: 100%;
      height: 100%;

      .text {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        height: 120px;
        line-height: 120px;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .loading {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 50%;
      left: 50%;
      margin: -18px 0 0 -18px;
      font-size: 35px;
      font-weight: bold;
      color: #fff;
    }

    .img {
      width: 100%;
      height: 100%;
      transition: 0.2s all linear;
    }

    &.active {
      .img {
        filter: blur(3px);
      }
    }
  }
}

.tool-user-info {
  display: flex;
  justify-content: left;
  align-items: center;

  .tool-user-input {
    flex: 1;
    margin-right: 5px;
  }

  .tool-user-title {
    display: flex;
    align-items: center;
    width: 90px;
    text-align: left;
    font-weight: bold;
    word-break: keep-all;
    margin-right: 15px;
  }

  &:nth-child(2) {
    margin-bottom: 15px;
  }
}

.tool-recommend {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
  max-height: 300px;
  overflow-y: scroll;

  .recommend {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    width: 25%;
    height: 100px;
    overflow: hidden;
    transition: 0.3s all linear;
    position: relative;
    cursor: pointer;

    img {
      width: 95%;
      height: 95%;
      object-fit: cover;
    }

    .text {
      position: absolute;
      color: rgba(255, 255, 255, 0.85);
      font-weight: 600;
      transition: 0.3s all linear;
      opacity: 0;
    }

    &:hover {
      box-shadow: 1px 5px 10px gray;

      .text {
        opacity: 1;
      }
    }
  }
}

@media screen and (max-width: 788px) {
  .tool-recommend {
    font-size: 12px;

    .recommend {
      width: 50%;
      height: 150px;

      img {
        width: 95%;
        height: 95%;
        object-fit: cover;
      }
    }
  }
}

@media screen and (max-width: 420px) {
  .tool-recommend {
    max-height: 360px;

    .recommend {
      width: 100%;
      height: 120px;

      img {
        width: 95%;
        height: 95%;
        object-fit: cover;
      }
    }
  }
}
</style>
