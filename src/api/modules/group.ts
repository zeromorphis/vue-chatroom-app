/*
 * @Descripttion: 给你两窝窝
 * @version: 5.0.0
 * @Author: 言棠
 * @Date: 2022-11-29 10:35:42
 * @LastEditors: 言棠
 * @LastEditTime: 2022-11-29 10:54:06
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
