/*
 * @name: 主题中心
 * @description:
 * @date: 2023-02-03 10:26:21
 * @path: \vue-package-quickstart\src\entry\theme\index.ts
 */
/* 第三方模块 */
import { ThemeCenter, ThemeScope, setupTheme } from "@guolisec/theme";

/* 业务模块 */

function inject() {
  const scope = new ThemeScope({
    seed: {
      colorScheme: "dark",
    },
  });

  const themeCenter = new ThemeCenter({
    scopes: [scope],
    persist: false,
  });

  // ! 初始化全局路由实例
  setupTheme(themeCenter);
}

inject();
