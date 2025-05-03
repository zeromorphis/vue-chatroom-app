/*
 * @Author: 言棠
 * @version: 1024
 * @Descripttion: 当时只道是寻常
 * @Date: 2024-03-25 15:42:29
 * @LastEditTime: 2025-05-03 16:19:46
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