/*
 * @Descripttion: 给你两窝窝
 * @version: 5.0.0
 * @Author: 言棠
 * @Date: 2022-11-29 10:35:42
 * @LastEditors: 言棠
 * @LastEditTime: 2022-11-29 10:50:34
 */
import http from "@/api";
import { PORT1 } from "@/api/config/servicePort";

enum Api {
  friendMessages = '/friend/friendMessages',
}

/**
 * 群分页消息
 * @param params
 */
export async function getFriendMessageApi(params: PagingParams) {
  return await http.get(PORT1 + Api.friendMessages, { params });
}
