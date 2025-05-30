// 所有群的群信息
declare interface GroupGather {
  [groupId: string]: Group;
}

// 群组
declare interface Group {
  groupId: string;
  userId: string; // 群主id
  groupName: string;
  notice: string;
  messages?: GroupMessage[];
  createTime: number;
}

// 群与用户关联表
declare interface GroupMap {
  groupId: string;
  userId: string;
}

// 群消息
declare interface GroupMessage {
  userId: string;
  groupId: string;
  content: string;
  messageType: MessageType;
  time: number;
}

// 所有好友的好友信息
declare interface FriendGather {
  [userId: string]: Friend;
}

// 好友
declare interface Friend {
  userId: string;
  username: string;
  avatar: string;
  role?: string;
  tag?: string;
  messages?: FriendMessage[];
  createTime: number;
}

// 用户与好友关联表
declare interface UserMap {
  friendId: string;
  userId: string;
}

// 好友消息
declare interface FriendMessage {
  userId: string;
  friendId: string;
  content: string;
  messageType: MessageType;
  time: number;
  type?: string;
}

declare interface SendMessage {
  type: string;
  message: string | File;
  width?: number;
  height?: number;
  messageType: MessageType[0] | MessageType[1];
}

// 消息类型
declare enum MessageType {
  text = 'text',
  image = 'image',
}

// 图片尺寸
declare interface ImageSize {
  width: number;
  height: number;
}

// 服务端返回值格式
declare interface ServerRes {
  code: number;
  msg: string;
  data: any;
}

// 所有群的在线用户合集
declare interface ActiveGroupUser {
  [key: string]: {
    [key: string]: User;
  };
}

// 未读消息对象
declare interface UnReadGather {
  [key: string]: number;
}

// 获取群分页消息参数
declare interface PagingParams {
  groupId?: string;
  userId?: string;
  friendId?: string;
  current: number;
  pageSize: number;
}

// 群分页消息返回值
declare interface PagingResponse {
  messageArr: GroupMessage[];
  userArr: User[];
}
