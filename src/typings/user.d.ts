/*
 * @Descripttion: 给你两窝窝
 * @version: 5.0.0
 * @Author: 言棠
 * @Date: 2022-11-29 14:00:57
 * @LastEditors: 言棠
 * @LastEditTime: 2022-12-09 15:07:16
 */
declare interface User {
  userId: string;
  username: string;
  password: string;
  token?: string;
  avatar: string;
  role?: string;
  tag?: string;
  status?: string;
  createTime: number;
}
