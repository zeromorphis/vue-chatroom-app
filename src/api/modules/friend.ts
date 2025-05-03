/*
 * @Author: 言棠
 * @version: 1024
 * @Descripttion: 当时只道是寻常
 * @Date: 2024-03-25 15:42:29
 * @LastEditTime: 2025-05-03 16:19:55
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
