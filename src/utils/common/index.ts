/*
 * @Author: 言棠
 * @version: 3.0.0
 * @Descripttion: 授人以渔，功德无量，利在千秋
 * @Date: 2022-04-12 09:50:33
 * @LastEditTime: 2022-12-29 11:04:57
 */
import moment from "moment";
import { ElNotification } from "element-plus";

/**
 * 字符串截取位数
 */
export function interceptStr(str: any, n: any) {
  var n = n || 6;
  if (str) {
    var str = str.toString();
    return (
      str.substring(0, n) + "***" + str.substring(str.length - n, str.length)
    );
  } else {
    return "-";
  }
}

/**
 * 是否移动端
 */
export function isMobile() {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
    return true;
  } else {
    return false;
  }
}

/**
 * 群名/用户名校验
 * @param name
 */
export function nameVerify(name: string): boolean {
  let nameReg = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
  if (name.length === 0) {
    ElNotification({
      title: "Error",
      message: "请输入名字",
      type: "error",
      duration: 1500,
    });
    return false;
  }
  if (!nameReg.test(name)) {
	ElNotification({
      title: "Error",
      message: "名字只含有汉字、字母、数字和下划线",
      type: "error",
      duration: 1500,
    });
    return false;
  }
  if (name.length > 9) {
	ElNotification({
      title: "Error",
      message: "名字太长",
      type: "error",
      duration: 1500,
    });
    return false;
  }
  return true;
}

/**
 * 密码校验
 * @param password
 */
export function passwordVerify(password: string): boolean {
  const passwordReg = /^\w+$/gis;
  if (password.length === 0) {
	ElNotification({
      title: "Error",
      message: "请输入密码",
      type: "error",
      duration: 1500,
    });
    return false;
  }
  if (!passwordReg.test(password)) {
	ElNotification({
      title: "Error",
      message: "密码只含有字母、数字和下划线",
      type: "error",
      duration: 1500,
    });
    return false;
  }
  if (password.length > 9) {
	ElNotification({
      title: "Error",
      message: "密码太长",
      type: "error",
      duration: 1500,
    });
    return false;
  }
  return true;
}

// 判断一个字符串是否包含另外一个字符串
export function isContainStr(str1: string, str2: string) {
  return str2.indexOf(str1) >= 0;
}

/**
 * 屏蔽词
 * @param text 文本
 */
export function parseText(text: string) {
  return text;
}

/**
 * 判断是否URL
 * @param text 文本
 */
export function isUrl(text: string) {
  // 解析网址
  const UrlReg = new RegExp(
    /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/
  );
  return UrlReg.test(text);
}

/**
 * 根据图片url设置图片框宽高, 注意是图片框
 */
export function getImageStyle(src: string) {
  let arr = src.split("$");
  let width = Number(arr[2]);
  let height = Number(arr[3]);
  if (isMobile()) {
    // 如果是移动端,图片最大宽度138, 返回值加12是因为设置的是图片框的宽高要加入padding值
    if (width > 138) {
      height = (height * 138) / width;
      width = 138;
      return {
        width: `${width}px`,
        height: `${height}px`,
      };
    }
  }
  return {
    width: `${width}px`,
    height: `${height}px`,
  };
}

/**
 * 消息时间格式化
 * @param time
 */
export function formatTime(time: number) {
  // 大于昨天
  if (Number(moment().add(-1, "days").startOf("day")) > time) {
    return moment(time).format("M/D HH:mm");
  }
  // 昨天
  if (Number(moment().startOf("day")) > time) {
    return "昨天 " + moment(time).format("HH:mm");
  }
  // 大于五分钟不显示秒
  if (new Date().valueOf() > time + 300000) {
    return moment(time).format("HH:mm");
  }
  return moment(time).format("HH:mm:ss");
}

/**
 * @description 生成随机数
 * @param {Number} min 最小值
 * @param {Number} max 最大值
 * @return number
 */
export function randomNum(min: number, max: number): number {
  let num = Math.floor(Math.random() * (min - max) + max);
  return num;
}

/**
 * @description 获取当前时间对应的提示语
 * @return string
 */
export function getTimeState() {
  // 获取当前时间
  let timeNow = new Date();
  // 获取当前小时
  let hours = timeNow.getHours();
  // 判断当前时间段
  if (hours >= 0 && hours <= 6) return `凌晨好 🌛`;
  if (hours >= 6 && hours <= 10) return `早上好 ⛅`;
  if (hours >= 10 && hours <= 14) return `中午好 🌞`;
  if (hours >= 14 && hours <= 18) return `下午好 🌞`;
  if (hours >= 18 && hours <= 24) return `晚上好 🌛`;
}
