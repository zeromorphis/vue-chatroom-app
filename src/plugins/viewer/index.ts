/*
 * @version: 3.0.0
 * @Date: 2022-11-30 22:20:01
 * @LastEditors: 言棠
 * @Descripttion: 人人都说顶峰相见，路边的水沟人满为患
 * @LastEditTime: 2022-11-30 22:25:51
 * @FilePath: /dev/vue3-vite-vant-elementplus-app/src/plugins/viewer/index.ts
 */
import { App } from "vue";
import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'

export function registerVueViewer(app: App<Element>) {
    app.use(VueViewer, {
        defaultOptions: {
            navbar: false,
            title: false,
            toolbar: {
                zoomIn: 1,
                zoomOut: 1,
                oneToOne: 4,
                reset: 4,
                prev: 0,
                next: 0,
                rotateLeft: 4,
                rotateRight: 4,
                flipHorizontal: 4,
                flipVertical: 4,
            },
        },
    });
}