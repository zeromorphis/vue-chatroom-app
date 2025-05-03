/*
 * @Author: 言棠
 * @version: 1024
 * @Descripttion: 当时只道是寻常
 * @Date: 2024-03-25 15:42:29
 * @LastEditTime: 2025-05-03 16:20:07
 */
import http from "@/api";
import { PORT1 } from "@/api/config/servicePort";

enum Api {
  findByName = '/group/findByName',
  groupMessages = '/group/groupMessages',
}
/**
 * 群名模糊搜索用户
 * @param string
 */
export function getGroupsByNameApi(groupName: string) {
  return http.get(`${PORT1 + Api.findByName}?groupName=${groupName}`);
}

/**
 * 群分页消息
 * @param params
 */
export async function getGroupMessagesApi(params: PagingParams) {
  return await http.get(PORT1 + Api.groupMessages, { params });
}
