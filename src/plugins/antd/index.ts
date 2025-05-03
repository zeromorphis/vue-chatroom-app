/*
 * @Author: 言棠
 * @version: 3.0.0
 * @Descripttion: 授人以渔，功德无量，利在千秋
 * @Date: 2022-04-17 15:46:53
 * @LastEditors: 言棠
 * @LastEditTime: 2023-10-22 17:56:24
 */
import { App } from "vue";
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

export function registerGlobAntdComp(app: App<Element>) {
  app.use(Antd)
}