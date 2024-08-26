<!--
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-06-04 22:38:44
 * @path: \vue-package-quickstart\README.MD
-->

## 目录

### app 目录

- public # 公开静态资源
  - logos # 图标 OEM
    - gls # 默认图标 OEM
    - usr # 用户自定义 OEM
  - favicon.ico # 网站小图标
  - settings.js # OEM 配置
- src # 库文件夹
  - domains # app 业务领域
    - demo # 某个具体领域
      - model # 数据状态层
      - service # 业务逻辑层
      - controller # 视图逻辑层
      - views # 视图层
  - entry # 应用入口相关
    - languages # 国际化
    - store # app 状态相关
    - theme # 主题
  - widgets # 对外小组件（应对视图等非核心业务变更，如布局）
  - shared # 共享文件
    - assets # 公共静态资源
    - components # 公共组件
    - style # 全局样式
    - utils # 公共工具方法
  - index.ts # 库入口文件

- test # 测试文件夹
  - entry # 应用入口相关
    - config # 配置入口
    - interface # app 对外暴露的接口
    - layout # 布局入口
    - router # app 路由相关
    - store # app 状态相关
  - extension # app 代码调度中心
  - pages # 页面集
  - shared # 共享文件
    - assets # 公共静态资源
    - components # 公共组件
    - style # 全局样式
    - utils # 公共工具方法
  - App.vue # 视图入口
  - main.ts # 入口文件
- package.json
- index.html
- .env
- .env.development
- .env.development.local
- .env.production
- postcss.config.cjs # postcss 配置
- tsconfig.json # lint 类型声明配置
- tsconfig.node.json # app node 脚本类型声明配置
- vite.config.ts # vite 配置
