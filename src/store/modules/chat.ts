/*
 * @Author: 言棠
 * @version: 3.0.0
 * @Descripttion: 授人以渔，功德无量，利在千秋
 * @Date: 2022-04-14 20:56:23
 * @LastEditors: YT
 * @LastEditTime: 2025-05-10 18:30:39
 */
import { defineStore } from "pinia";
import { store } from "@/store";
import { ChatState } from "../interface";
import piniaPersistConfig from "../utils/piniaPersist";
import { DEFAULT_GROUP_ID } from "@/config/config";
import { useUserStoreWithOut } from "@/store/modules/user";
import { io } from "socket.io-client";
import { message } from "ant-design-vue";

export const useChatStore = defineStore("chat", {
  state: (): ChatState => {
    return {
      socket: null,
      dropped: false,
      activeGroupUser: {},
      activeRoom: null,
      groupGather: {},
      userGather: {},
      friendGather: {},
      unReadGather: {},
    };
  },
  actions: {
    // 保存socket SocketIOClient.Socket
    SET_SOCKET(payload: SocketIOClient.Socket) {
      this.socket = payload;
    },
    // 设置用户是否处于掉线重连状态
    SET_DROPPED(payload: boolean) {
      this.dropped = payload;
    },
    // 设置群在线人数
    SET_ACTIVE_GROUP_USER(payload: ActiveGroupUser) {
      this.activeGroupUser = payload;
      for (let user of Object.values(payload[DEFAULT_GROUP_ID])) {
        // 如果当前userGather没有该在线用户, 应该马上存储, 不然该用户在下次发消息, 就看不见他的信息
        this.userGather[user.userId] = user;
      }
    },
    // 新增一条群消息
    ADD_GROUP_MESSAGE(payload: GroupMessage) {
      if (this.groupGather[payload.groupId].messages) {
        this.groupGather[payload.groupId].messages!.push(payload);
      } else {
        // vuex对象数组中对象改变不更新问题
        this.groupGather[payload.groupId]["messages"] = [payload];
      }
    },
    // 设置群消息
    SET_GROUP_MESSAGES(payload: GroupMessage[]) {
      if (payload && payload.length) {
        this.groupGather[payload[0].groupId]["messages"] = payload;
      }
    },
    // 新增一条私聊消息
    ADD_FRIEND_MESSAGE(payload: FriendMessage) {
      const useUserStore = useUserStoreWithOut();
      let userId = useUserStore.userinfo.userId;
      if (payload.friendId === userId) {
        if (this.friendGather[payload.userId].messages) {
          this.friendGather[payload.userId].messages!.push(payload);
        } else {
          this.friendGather[payload.userId]["messages"] = [payload];
        }
      } else {
        if (this.friendGather[payload.friendId].messages) {
          this.friendGather[payload.friendId].messages!.push(payload);
        } else {
          this.friendGather[payload.friendId]["messages"] = [payload];
        }
      }
    },
    // 设置私聊记录
    SET_FRIEND_MESSAGES(payload: FriendMessage[]) {
      const useUserStore = useUserStoreWithOut();
      let userId = useUserStore.userinfo.userId;
      if (payload && payload.length) {
        if (payload[0].friendId === userId) {
          this.friendGather[payload[0].userId]["messages"] = payload;
        } else {
          this.friendGather[payload[0].friendId]["messages"] = payload;
        }
      }
    },
    // 设置当前聊天对象(群或好友)
    SET_ACTIVE_ROOM(payload: Friend & Group) {
      this.activeRoom = payload;
    },
    // 设置所有的群的群详细信息(头像,群名字等)
    SET_GROUP_GATHER(payload: Group) {
      this.groupGather[payload.groupId] = payload;
    },
    // 设置所有的用户的用户详细信息(头像,昵称等)
    SET_USER_GATHER(payload: User) {
      this.userGather[payload.userId] = payload;
    },
    // 设置所有的好友的用户详细信息(头像,昵称等)
    SET_FRIEND_GATHER(payload: User) {
      this.friendGather[payload.userId] = payload;
    },
    // 退群
    DEL_GROUP(payload: GroupMap) {
      delete this.groupGather[payload.groupId];
    },
    // 删好友
    DEL_FRIEND(payload: UserMap) {
      delete this.friendGather[payload.friendId];
    },
    // 给某个聊天组添加未读消息
    ADD_UNREAD_GATHER(payload: string) {
      if (!this.unReadGather[payload]) {
        this.unReadGather[payload] = 1;
      } else {
        ++this.unReadGather[payload];
      }
    },
    // 给某个聊天组清空未读消息
    LOSE_UNREAD_GATHER(payload: string) {
      this.unReadGather[payload] = 0;
    },
    async connectSocket() {
      const useUserStore = useUserStoreWithOut();
      let userinfo = useUserStore.userinfo;

      const socket: SocketIOClient.Socket = io("ws://192.168.0.106:12345", {
        path: "/socket.io",
        transports: ["websocket"], // 👈 显式要求使用 websocket
        query: { userId: userinfo.userId }
      });

      // 建立连接
      socket.on("connect", async () => {
        console.log("客户端连接成功-connect", socket.id);
        // 获取聊天室所需所有信息
        socket.emit("chatData", userinfo);
        // 先保存好socket对象
        this.SET_SOCKET(socket);
      });

      // socket其他日志打印
      this.handleSocketInfo(socket);

      // 初始化事件监听
      socket.on("activeGroupUser", (data: any) => {
        console.log("activeGroupUser", data);
        this.SET_ACTIVE_GROUP_USER(data.data);
      });

      socket.on("addGroup", (res: ServerRes) => {
        console.log("on addGroup", res);
        if (res.code) {
          return message.error(res.msg);
        }
        message.success(res.msg);
        this.SET_GROUP_GATHER(res.data);
      });

      socket.on("joinGroup", async (res: ServerRes) => {
        console.log("on joinGroup", res);
        if (res.code) {
          return message.error(res.msg);
        }
        let newUser = res.data.user;
        let group = res.data.group;
        if (newUser.userId != userinfo.userId) {
          this.SET_USER_GATHER(newUser);
          return message.info(`${newUser.username}加入群${group.groupName}`);
        } else {
          console.log(this.groupGather, group.groupId);
          // 是用户自己 则加入到某个群
          if (!this.groupGather[group.groupId]) {
            this.SET_GROUP_GATHER(group);
            // 获取群里面所有用户的用户信息
            socket.emit("chatData", userinfo);
          }
          message.info(`成功加入群${group.groupName}`);
          this.SET_ACTIVE_ROOM(this.groupGather[group.groupId]);
        }
      });

      socket.on("joinGroupSocket", (res: ServerRes) => {
        console.log("on joinGroupSocket", res);
        if (res.code) {
          return message.error(res.msg);
        }
        let newUser: Friend = res.data.user;
        let group: Group = res.data.group;
        let friendGather = this.friendGather;
        if (newUser.userId != userinfo.userId) {
          this.SET_USER_GATHER(newUser);
          if (friendGather[newUser.userId]) {
            // 当用户的好友更新了用户信息
            let messages;
            if (friendGather[newUser.userId].messages) {
              messages = friendGather[newUser.userId].messages;
            }
            this.SET_FRIEND_GATHER(newUser);
            this.SET_FRIEND_MESSAGES(messages);
          }
          // @ts-ignore 解决重复进群消息问题
          if (window.msg === newUser.userId) {
            return;
          }
          // @ts-ignore
          window.msg = newUser.userId;
          return message.info(`${newUser.username}加入群${group.groupName}`);
        } else {
          if (!this.groupGather[group.groupId]) {
            this.SET_GROUP_GATHER(group);
          }
          this.SET_USER_GATHER(newUser);
        }
      });

      socket.on("groupMessage", (res: ServerRes) => {
        console.log("on groupMessage", res);
        if (!res.code) {
          this.ADD_GROUP_MESSAGE(res.data);
          let activeRoom = this.activeRoom;
          if (activeRoom && activeRoom.groupId !== res.data.groupId) {
            this.ADD_UNREAD_GATHER(res.data.groupId);
          }
        } else {
          message.error(res.msg);
        }
      });

      socket.on("addFriend", (res: ServerRes) => {
        console.log("on addFriend", res);
        if (!res.code) {
          this.SET_FRIEND_GATHER(res.data);
          this.SET_USER_GATHER(res.data);
          message.info(res.msg);
          socket.emit("joinFriendSocket", {
            userId: userinfo.userId,
            friendId: res.data.userId,
          });
        } else {
          message.error(res.msg);
        }
      });

      socket.on("joinFriendSocket", (res: ServerRes) => {
        console.log("on joinFriendSocket", res);
        if (!res.code) {
          console.log("成功加入私聊房间");
        }
      });

      socket.on("friendMessage", (res: ServerRes) => {
        console.log("on friendMessage", res);
        if (!res.code) {
          if (
            res.data.friendId === userinfo.userId ||
            res.data.userId === userinfo.userId
          ) {
            console.log("ADD_FRIEND_MESSAGE", res.data);
            this.ADD_FRIEND_MESSAGE(res.data);
            let activeRoom = this.activeRoom;
            if (
              activeRoom &&
              activeRoom.userId !== res.data.userId &&
              activeRoom.userId !== res.data.friendId
            ) {
              this.ADD_UNREAD_GATHER(res.data.userId);
            }
          }
        } else {
          message.error(res.msg);
        }
      });

      socket.on("chatData", (res: ServerRes) => {
        if (res.code) {
          return message.error(res.msg);
        }
        this.handleChatData(res.data);
        this.SET_DROPPED(false);
      });

      socket.on("editGroupName", (res: ServerRes) => {
        console.log("群昵称修改", res);
        if (!res.code) {
          this.SET_ACTIVE_ROOM(res.data);
          this.SET_GROUP_GATHER(res.data);
          message.success(res.msg);
        } else {
          message.error(res.msg);
        }
      });

      socket.on("editGroupNotice", (res: ServerRes) => {
        console.log("群昵称修改", res);
        if (!res.code) {
          this.SET_ACTIVE_ROOM(res.data);
          this.SET_GROUP_GATHER(res.data);
          message.success(res.msg);
        } else {
          message.error(res.msg);
        }
      });

      socket.on("exitGroup", (res: ServerRes) => {
        if (!res.code) {
          this.DEL_GROUP(res.data);
          this.SET_ACTIVE_ROOM(this.groupGather[DEFAULT_GROUP_ID]);
          message.success(res.msg);
        } else {
          message.error(res.msg);
        }
      });

      socket.on("exitFriend", (res: ServerRes) => {
        if (!res.code) {
          this.DEL_FRIEND(res.data);
          this.SET_ACTIVE_ROOM(this.groupGather[DEFAULT_GROUP_ID]);
          message.success(res.msg);
        } else {
          message.error(res.msg);
        }
      });
    },
    async handleChatData(payload: any) {
      const useUserStore = useUserStoreWithOut();
      let userinfo = useUserStore.userinfo;
      let socket = this.socket;
      let groupGather = this.groupGather;
      let groupArr = payload.groupData;
      let friendArr = payload.friendData;
      let userArr = payload.userData;
      if (groupArr.length) {
        for (let group of groupArr) {
          socket.emit("joinGroupSocket", {
            groupId: group.groupId,
            userId: userinfo.userId,
          });
          this.SET_GROUP_GATHER(group);
        }
      }
      if (friendArr.length) {
        for (let friend of friendArr) {
          socket.emit("joinFriendSocket", {
            userId: userinfo.userId,
            friendId: friend.userId,
          });
          this.SET_FRIEND_GATHER(friend);
        }
      }
      if (userArr.length) {
        for (let user of userArr) {
          this.SET_USER_GATHER(user);
        }
      }

      /**
       * 由于groupgather和userGather都更新了, 但是activeGather依旧是老对象,
       * 这里需要根据老的activeGather找到最新的gather对象,这样才能使得vue的watch监听新gather
       */
      let activeRoom = this.activeRoom;
      let groupGather2 = this.groupGather;
      let friendGather2 = this.friendGather;
      if (!activeRoom) {
        // 更新完数据没有默认activeRoom设置群为'默认聊天室'
        return this.SET_ACTIVE_ROOM(groupGather[DEFAULT_GROUP_ID]);
      }
      this.SET_ACTIVE_ROOM(
        groupGather2[activeRoom.groupId] || friendGather2[activeRoom.userId]
      );
    },
    async handleSocketInfo(socket: any) {
      // 连接错误
      socket.on("connect_error", (error: any) => {
        console.log("连接错误-connect_error", error);
      });

      // 错误
      socket.on("error", (error: any) => {
        console.log("错误-error", error);
      });

      // 断开连接
      socket.on("disconnect", (reason: any) => {
        console.log("断开连接-disconnect", socket.connected, reason); // false
      });

      // 连接超时
      socket.on("connect_timeout", (data: any) => {
        console.log("连接超时-connect_timeout", data);
      });

      // 重连成功
      socket.on("reconnect", (attemptNumber: any) => {
        // 重连尝试次数
        console.log("重连成功-reconnect", attemptNumber);
      });

      // 尝试重连时触发
      socket.on("reconnect_attempt", (attemptNumber: any) => {
        // 重连尝试次数
        console.log("尝试重连-reconnect_attempt", attemptNumber);
      });

      // 再次尝试重新连接时触发
      socket.on("reconnecting", (attemptNumber: any) => {
        // 重连尝试次数
        console.log("正在尝试重连-reconnecting", attemptNumber);
      });

      // 重连尝试错误
      socket.on("reconnect_error", (err: any) => {
        console.log("重连尝试错误-reconnect_error", err);
      });

      // 客户端不能重连时触发
      socket.on("reconnect_failed", (res: any) => {
        console.log("客户端不能连接-reconnect_failed", res);
      });

      // 当一个ping被发送到服务器时触发
      socket.on("ping", (res: any) => {
        console.log("一个ping发送到服务器-ping", res);
      });

      // 当服务器收到pong时触发
      socket.on("pong", (data: any) => {
        // data: 延迟多少ms
        console.log("服务器收到pong-pong", data);
      });
    },
  },
  persist: piniaPersistConfig("chatState"),
});

export function useChatStoreWithOut() {
  return useChatStore(store);
}
