# 国利网安前端交付平台 BY 介绍

本前端框架基于 vue、vite 和 monorepo 技术方案，致力于打造易用、灵活、高效的前端交付平台

## 目录

### monorepo 目录

- apps 应用集
- configs # 开发环境配置
  - css-preprocess # css 预处理配置
  - lint # lint 配置
- domains # 业务领域包（包含一点业务就算领域包）
- packages # 公共包（无业务）
- scripts # 工程化脚本 配置
- .gitignore
- package.json
- .editorconfig
- .eslintrc.js
- .npmrc # npm 本地配置
- .prettierignore
- .prettierrc.js
- .stylelintignore # 样式 lint 忽略
- .stylelintrc.js # 样式 lint 配置
- pnpm-workspace.yaml # 工作区
- tsconfig.json # 顶级类型声明配置
- turbo.json # turbo 配置
- vitest.config.ts vitest 配置
- README.md
- LICENSE

### app 目录

- public # 公开静态资源
  - logos # 图标 OEM
    - gls # 默认图标 OEM
    - usr # 用户自定义 OEM
  - favicon.ico # 网站小图标
  - settings.js # OEM 配置
- src
  - domain # app 业务领域
  - entry # 应用入口相关
    - config # 配置入口
    - interface # app 对外暴露的接口
    - layout # 布局入口
    - languages # app 国际化相关
    - router # app 路由相关
    - store # app 状态相关
    - theme # app 主题相关
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
