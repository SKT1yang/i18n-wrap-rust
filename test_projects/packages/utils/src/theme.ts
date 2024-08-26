/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-07-09 13:01:25
 * @path: \utils\src\theme.ts
 */
import { TinyColor } from "@ctrl/tinycolor";
import { onUnMountedOrDeactivated } from "./hooks";
import { onMounted, ref } from "vue";

type CssVariable = `--${string}`;

function getCssVariableValue(
  prop: string,
  element: HTMLElement = document.body
) {
  const computedStyle = window.getComputedStyle(element);
  return computedStyle.getPropertyValue(prop).trim();
}

function getOriginalCssVarProperty(
  prop: CssVariable,
  element: HTMLElement = document.body
) {
  return element.style.getPropertyValue(prop);
}

/**
 * css var的js函数版本
 * @param cssVariable css 变量key，"--" 开头
 * @param defaultValue 默认值
 * @param element 目标元素，未找到会向上递归
 */
function cssVar(
  prop: CssVariable,
  element: HTMLElement = document.body,
  defaultValue: string = ""
) {
  // 计算后的样式，已经计算了继承
  return getCssVariableValue(prop, element) || defaultValue;
}

function darken(color: string, brightness: number) {
  const instance = new TinyColor(color);
  return instance.darken(brightness).toHexString();
}

function lighten(color: string, brightness: number) {
  const instance = new TinyColor(color);
  return instance.lighten(brightness).toHexString();
}

type ColorScheme = "normal" | "light" | "dark" | "light dark" | "dark light";
type ColorSchemeMode = "light" | "dark";

function computeColorSchemeMode(colorScheme?: ColorScheme): ColorSchemeMode {
  switch (colorScheme) {
    case "normal":
      return "light";
    case "light":
      return "light";
    case "dark":
      return "dark";
    case "dark light":
      return matches();
    case "light dark":
      return matches();
    default:
      return "light";
  }
}

function matches(): ColorSchemeMode {
  if (
    window.matchMedia &&
    window.matchMedia(`(prefers-color-scheme: dark)`).matches
  ) {
    return "dark";
  } else {
    return "light";
  }
}

function useAntdFollowSystemTheme(theme: {
  darkAlgorithm: any;
  defaultAlgorithm: any;
}) {
  let algorithm = ref();

  onMounted(() => {
    if (document.documentElement.classList.contains("dark")) {
      algorithm.value = theme.darkAlgorithm;
    } else {
      algorithm.value = theme.defaultAlgorithm;
    }
  });

  const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQueryList.addEventListener("change", (event) => {
    if (event.matches) {
      algorithm.value = theme.darkAlgorithm;
    } else {
      algorithm.value = theme.defaultAlgorithm;
    }
  });

  const observer = new MutationObserver((MutationList) => {
    for (const mutation of MutationList) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class"
      ) {
        const target = mutation.target as HTMLElement;
        if (target.classList.contains("dark")) {
          algorithm.value = theme.darkAlgorithm;
        } else {
          algorithm.value = theme.defaultAlgorithm;
        }
      }
    }
  });

  observer.observe(document.documentElement, {
    attributes: true,
    subtree: false,
    childList: false,
  });

  return {
    algorithm,
  };
}

/**
 * 响应式获取主题明暗
 * @description 只能在setup中使用
 * @param element 目标元素
 * @param option
 */
function useColorSchemeMode(
  element: HTMLElement = document.documentElement,
  option = { autoDestroy: true }
) {
  const colorSchemeMode = ref<"light" | "dark">(
    element.classList.contains("dark") ? "dark" : "light"
  );

  const observer = new MutationObserver((MutationList) => {
    for (const mutation of MutationList) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class"
      ) {
        const target = mutation.target as HTMLElement;
        if (target.classList.contains("dark")) {
          colorSchemeMode.value = "dark";
        } else {
          colorSchemeMode.value = "light";
        }
      }
    }
  });

  observer.observe(element, {
    attributes: true,
    subtree: false,
    childList: false,
  });

  option.autoDestroy &&
    onUnMountedOrDeactivated(() => {
      observer && observer.disconnect();
    });

  return {
    colorSchemeMode,
  };
}

/**
 * 获取当前主题明暗（默认根元素即全局明暗）
 * @param element 查看明暗的目标元素
 * @param option mode：模式 class由元素class决定明暗；cssvar由元素继承的--color-scheme css变量决定
 */
function getColorSchemeMode(
  element?: HTMLElement,
  option?: {
    mode: "class" | "cssvar";
  }
) {
  const themeElement = element || document.documentElement;
  const { mode = "class" } = option || {};
  if (mode === "class") {
    return themeElement.classList.contains("dark") ? "dark" : "light";
  } else {
    return cssVar("--color-scheme", element);
  }
}

export {
  cssVar,
  getCssVariableValue,
  getOriginalCssVarProperty,
  darken,
  lighten,
  TinyColor,
  computeColorSchemeMode,
  useAntdFollowSystemTheme,
  getColorSchemeMode,
  useColorSchemeMode,
};
