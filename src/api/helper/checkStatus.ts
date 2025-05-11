import { ElNotification } from "element-plus";

/**
 * @description: 校验网络请求状态码
 * @param {Number} status
 * @return void
 */
export const checkStatus = (status: number): void => {
  switch (status) {
    case 400:
      ElNotification({
        title: "Error",
        message: "请求失败！请您稍后重试",
        type: "error",
        duration: 1500,
      });
      break;
    case 401:
      ElNotification({
        title: "Error",
        message: "登录失效！请您重新登录",
        type: "error",
        duration: 1500,
      });
      break;
    case 403:
      ElNotification({
        title: "Error",
        message: "当前账号无权限访问!",
        type: "error",
        duration: 1500,
      });
      break;
    case 404:
      ElNotification({
        title: "Error",
        message: "你所访问的资源不存在！",
        type: "error",
        duration: 1500,
      });
      break;
    case 405:
      ElNotification({
        title: "Error",
        message: "请求方式错误！请您稍后重试",
        type: "error",
        duration: 1500,
      });
      break;
    case 408:
      ElNotification({
        title: "Error",
        message: "请求超时！请您稍后重试",
        type: "error",
        duration: 1500,
      });
      break;
    case 500:
      ElNotification({
        title: "Error",
        message: "服务异常！",
        type: "error",
        duration: 1500,
      });
      break;
    case 502:
      ElNotification({
        title: "Error",
        message: "网关错误！",
        type: "error",
        duration: 1500,
      });
      break;
    case 503:
      ElNotification({
        title: "Error",
        message: "服务不可用！",
        type: "error",
        duration: 1500,
      });
      break;
    case 504:
      ElNotification({
        title: "Error",
        message: "网关超时！",
        type: "error",
        duration: 1500,
      });
      break;
    default:
      ElNotification({
        title: "Error",
        message: "请求失败！",
        type: "error",
        duration: 1500,
      });
  }
};
