/*
 * @Author: YT
 * @Date: 2025-05-10 17:15:18
 * @LastEditors: YT
 * @LastEditTime: 2025-05-10 20:42:44
 * @Description: 当时只道是寻常
 * @FilePath: /dev/vue-chatroom-app/src/api/interface/index.ts
 */
// * 请求响应参数(不包含data)
export interface Result {
	code: string;
	msg: string;
}

// * 请求响应参数(包含data)
export interface ResultData<T = any> extends Result {
	data?: T;
}

// 登录模块
export namespace Login {
  export interface ReqLoginForm {
    username: string;
    password: string;
  }
}