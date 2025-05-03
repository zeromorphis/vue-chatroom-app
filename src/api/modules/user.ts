/*
 * @Author: 言棠
 * @version: 1024
 * @Descripttion: 当时只道是寻常
 * @Date: 2024-03-25 15:42:29
 * @LastEditTime: 2025-05-03 16:20:13
 */
import http from "@/api";
import { PORT1 } from "@/api/config/servicePort";

enum Api {
  username = '/user/username',
  password = '/user/password',
  findByName = '/user/findByName',
  avatar = '/user/avatar',
  deleteUser = '/user',
}

/**
 * 更新用户名
 * @param params
 */
export const patchUserNameApi = (params: User) => {
  return http.patch(PORT1 + Api.username, params);
};

/**
 * 更新用户密码
 * @param user
 * @param password
 *
 */
export const patchPasswordApi = (user: User, password: string) => {
  return http.patch(`${PORT1 + Api.password}?password=${password}`, user);
};

/**
 * 用户名模糊搜索用户
 * @param username
 */
export function getUsersByNameApi(username: string) {
  return http.get(`${PORT1 + Api.findByName}?username=${username}`);
}

/**
 * 用户头像上传
 * @param params
 */
export function setUserAvatarApi(params: FormData) {
  return http.post(PORT1 + Api.avatar, params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

/**
 * 删除用户
 * @param params
 */
export function deleteUserApi(params: any) {
  return http.delete(PORT1 + Api.deleteUser, { params: params });
}
