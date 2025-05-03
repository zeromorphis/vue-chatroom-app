/*
 * @Author: 言棠
 * @version: 1024
 * @Descripttion: 当时只道是寻常
 * @Date: 2025-05-03 16:34:36
 * @LastEditTime: 2025-05-03 16:42:58
 */
import { App, Directive } from "vue";
import copy from "./modules/copy";
import waterMarker from "./modules/waterMarker";
import draggable from "./modules/draggable";
import debounce from "./modules/debounce";
import throttle from "./modules/throttle";
import longpress from "./modules/longpress";

const directivesList: { [key: string]: Directive } = {
  copy,
  waterMarker,
  draggable,
  debounce,
  throttle,
  longpress
};

const directives = {
  install: function (app: App<Element>) {
    Object.keys(directivesList).forEach(key => {
      app.directive(key, directivesList[key]);
    });
  }
};

export function registerDirectives(app: App<Element>) {
  app.use(directives);
}
