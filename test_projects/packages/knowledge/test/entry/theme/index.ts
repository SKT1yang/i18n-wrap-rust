/*
 * @name: 主题中心
 * @description: 默认全局主题，涉及局部主题按需求修改此文件
 * @date: 2023-02-03 10:26:21
 * @path: \knowledge\src\entry\theme\index.ts
 */
/* 第三方模块 */
import { ref } from "vue";
import {
  ThemeCenter,
  ThemeScope,
  setupTheme,
  useTheme,
  type ThemeName,
} from "@guolisec/theme";

/* 业务模块 */

/**
 * 主题初始化注入
 */
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

  return scope;
}

const themeScope = inject();

/**
 * 修改主题
 * @param theme 主题名
 */
function changeTheme(theme: ThemeName) {
  const themeCenter = useTheme();
  themeCenter.change(theme || "default");
}

/**
 * 获取全局主题明暗
 */
function getCurrentColorScheme() {
  const themeCenter = useTheme();
  const currentColorScheme = ref(themeCenter.getColorSchemeMode());
  themeScope.on("change", ({ colorSchemeMode }) => {
    currentColorScheme.value = colorSchemeMode;
  });
  return currentColorScheme;
}

/**
 * 修改全局主题明暗
 * @param colorScheme 明暗配置： "dark" | "light"
 */
function changeColorScheme(colorScheme: "dark" | "light") {
  const themeCenter = useTheme();
  themeCenter.change(themeScope.token?.theme || "default", {
    colorScheme: colorScheme,
  });
}

/**
 * 切换全局主题明暗
 */
function switchColorScheme() {
  const currentColorScheme = getCurrentColorScheme();
  let colorScheme: "dark" | "light" =
    currentColorScheme.value === "dark" ? "light" : "dark";
  changeColorScheme(colorScheme);
}

export {
  themeScope,
  getCurrentColorScheme,
  changeTheme,
  changeColorScheme,
  switchColorScheme,
};
