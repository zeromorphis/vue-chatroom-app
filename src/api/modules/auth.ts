/*
 * @Descripttion: 给你两窝窝
 * @version: 5.0.0
 * @Author: 言棠
 * @Date: 2022-11-28 17:41:52
 * @LastEditors: 言棠
 * @LastEditTime: 2022-11-29 10:59:01
 */
import http from "@/api";
import { PORT1 } from "@/api/config/servicePort";

enum Api {
    login = '/auth/login',
    register = '/auth/register',
}

/**
 * 登录
 * @param data
 */
export function loginApi(data: any) {
    return http.post(PORT1 + Api.login, data);
}

/**
 * 注册
 * @param data
 */
export function registerApi(data: any) {
    return http.post(PORT1 + Api.register, data);
}