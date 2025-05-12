<!--
 * @Author: 言棠
 * @version: 3.0.0
 * @Descripttion: 授人以渔，功德无量，利在千秋
 * @Date: 2022-04-14 20:10:18
 * @LastEditors: YT
 * @LastEditTime: 2025-05-11 16:15:02
-->
# ChatRoom-App

### 简介 📖

Vue3 + TypeScript + Vite6 + ElementPlus + Pinia3 + Socket.IO

### 特性 ⭐

- **最新技术栈**：使用 Vue3/Vite6 等前端前沿技术开发
- **TypeScript**: 应用程序级 JavaScript 的语言

### 准备 🔨

- [Node](http://nodejs.org/) - 项目开发环境
- [Vite](https://vitejs.dev/) - 熟悉 Vite6 特性
- [Vue3](https://v3.vuejs.org/) - 熟悉 Vue3 基础语法
- [Vue-Router-Next](https://next.router.vuejs.org/) - 熟悉 vue-router 基本使用
- [TypeScript](https://www.typescriptlang.org/) - 熟悉 TypeScript 基本语法
- [ES6+](http://es6.ruanyifeng.com/) - 熟悉 ES6 基本语法
- [Pinia](https://pinia.vuejs.org/) - Pinia 基本使用
- [ElementPlus](https://element-plus.org/zh-CN/) - ElementPlus 基本使用
- [Socket.IO](https://socket.io/zh-CN/) - Socket.IO 基本使用

### 安装使用 📔

- 获取项目代码

```bash
git clone https://github.com/zeromorphis/vue-chatroom-app.git
```

- 安装依赖

```bash
cd vue-chatroom-app

yarn install 或 npm install

```

- 运行

```bash
yarn serve  或 npm run dev
```

- 打包

```bash
yarn build  或 npm run build 
```

### 文件资源目录 📚

```text
vue-chatroom-app
├─ build                   # Vite 配置项
├─ public                  # 静态资源文件
├─ src
│  ├─ api                  # API 接口管理
│  ├─ assets               # 静态资源文件
│  ├─ components           # 全局组件
│  ├─ config               # 全局配置项
│  ├─ directives           # 全局指令文件
│  ├─ enums                # 项目常用枚举
│  ├─ hooks                # 常用 Hooks 封装
│  ├─ locales              # 语言国际化 i18n
│  ├─ plugins              # 插件
│  ├─ router               # 路由管理
│  ├─ store                # pinia store
│  ├─ styles               # 全局样式文件
│  ├─ typings              # 全局 ts 声明
│  ├─ utils                # 常用工具库
│  ├─ views                # 项目所有页面
│  ├─ App.vue              # 项目主组件
│  ├─ main.ts              # 项目入口文件
│  └─ vite-env.d.ts        # 指定 ts 识别 vue
├─ .env                    # vite 常用配置
├─ .env.development        # 开发环境配置
├─ .env.production         # 生产环境配置
├─ .env.test               # 测试环境配置
├─ .gitignore              # 忽略 git 提交
├─ index.html              # 入口 html
├─ package-lock.json       # npm 依赖包包版本锁
├─ package.json            # 依赖包管理
├─ README.md               # README 介绍
├─ tsconfig.json           # typescript 全局配置
├─ tsconfig.node.json      # node 环境配置
├─ vite.config.ts          # vite 全局配置文件
└─ yarn.lock               # yarn 依赖包包版本锁
```

### 浏览器支持 🌎

- 本地开发推荐使用 Chrome 最新版浏览器 [Download](https://www.google.com/intl/zh-CN/chrome/)。
- 生产环境支持现代浏览器，不再支持 IE 浏览器，更多浏览器可以查看 [Can I Use Es Module](https://caniuse.com/?search=ESModule)。

| ![IE](https://i.imgtg.com/2023/04/11/8z7ot.png) | ![Edge](https://i.imgtg.com/2023/04/11/8zr3p.png) | ![Firefox](https://i.imgtg.com/2023/04/11/8zKiU.png) | ![Chrome](https://i.imgtg.com/2023/04/11/8zNrx.png) | ![Safari](https://i.imgtg.com/2023/04/11/8zeGj.png) |
| :---------------------------------------------: | :-----------------------------------------------: | :--------------------------------------------------: | :-------------------------------------------------: | :-------------------------------------------------: |
|                   not support                   |                  last 2 versions                  |                   last 2 versions                    |                   last 2 versions                   |                   last 2 versions                   |

### 项目后台接口 🧩

项目后台接口采用nestjs服务：

- server address： https://github.com/zeromorphis/nestjs-chatroom-server.git

### 捐赠 🍵

如果你正在使用这个项目或者喜欢这个项目的，可以通过以下方式支持我：

- Star、Fork、Watch 一键三连 🚀
- 通过微信、支付宝一次性捐款 ❤

|                                        微信                                        |                                       支付宝                                       |
| :--------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------: |
| <img src="https://i.miji.bid/2025/05/03/005c3cf7fcb014d74c5c27da05817def.jpeg" alt="Alipay QRcode" width=170> | <img src="https://i.miji.bid/2025/05/03/d56166261b20395226d129fe2f54505e.jpeg" alt="Wechat QRcode" width=170> |

### 维护者 👨‍👨‍👦‍👦

[@言棠](https://github.com/zeromorphis)

<div align="center">
  <img src="https://github-readme-stats.vercel.app/api?hide_title=false&hide_rank=false&show_icons=true&include_all_commits=true&count_private=true&disable_animations=false&theme=dracula&locale=en&hide_border=false&username=zeromorphis" height="160" alt="stats graph"  />
  &nbsp
  <img src="https://github-readme-stats.vercel.app/api/top-langs?locale=en&hide_title=false&layout=compact&card_width=350&langs_count=5&theme=dracula&hide_border=false&username=zeromorphis" height="160" alt="languages graph"  />
</div>
