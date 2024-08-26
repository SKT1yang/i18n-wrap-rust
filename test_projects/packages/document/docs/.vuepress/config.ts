/*
 * @name: Do not edit
 * @description: Do not edit
 * @path: \document\docs\.vuepress\config.ts
 */
import { defineUserConfig, defaultTheme, type UserConfig } from "vuepress";

const config: UserConfig = defineUserConfig({
  lang: "zh-CN",
  title: "",
  description: "这是我的第一个 VuePress 站点",
  locales: {
    // 键名是该语言所属的子路径
    // 作为特例，默认语言可以使用 '/' 作为其路径。
    "/": {
      lang: "zh-CN",
      title: "",
      description: "Vue 驱动的静态网站生成器",
    },
  },

  theme: defaultTheme({
    logo: "/logo.png",
    // 默认主题配置
    navbar: [
      {
        text: "规范指南",
        children: [
          {
            text: "前端规范",
            link: "/",
          },
          {
            text: "命名规范",
            link: "/name",
          },
          {
            text: "视觉与交互规范",
            link: "/view",
          },
          {
            text: "版本控制规范",
            link: "/version/semantic",
          },
        ],
      },
    ],
  }),
});

export default config;
