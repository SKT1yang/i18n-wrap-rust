/*
 * @name: Do not edit
 * @description: Do not edit
 * @path: \utils\src\echarts\useECharts.ts
 */
import type { EChartsOption } from "echarts";
import type { Ref } from "vue";
import { unref, nextTick, watch, computed, ref } from "vue";
import {
  useDebounceFn,
  tryOnUnmounted,
  useTimeoutFn,
  useEventListener,
} from "@vueuse/core";
import echarts from "./install";
import { useColorSchemeMode } from "../theme";

function useECharts(
  elRef: Ref<HTMLDivElement>,
  theme?: "light" | "dark" | "default"
) {
  const systemColorScheme = useColorSchemeMode();
  const getDarkMode = computed(() => {
    return theme || systemColorScheme.colorSchemeMode.value;
  });
  let chartInstance: echarts.ECharts | null = null;
  let resizeFn: Function = resize;
  const cacheOptions = ref({}) as Ref<EChartsOption>;
  let removeResizeFn: Function = () => {};

  resizeFn = useDebounceFn(resize, 200);

  const getOptions = computed(() => {
    if (getDarkMode.value !== "dark") {
      return cacheOptions.value as EChartsOption;
    }
    return {
      backgroundColor: "transparent",
      ...cacheOptions.value,
    } as EChartsOption;
  });

  function initCharts(t = theme) {
    const el = unref(elRef);
    if (!el || !unref(el)) {
      return;
    }

    chartInstance = echarts.init(el, t);
    const removeEvent = useEventListener(window, "resize", () => {
      resizeFn();
    });
    removeResizeFn = removeEvent;
  }

  function setOptions(options: EChartsOption, clear = true) {
    cacheOptions.value = options;
    if (unref(elRef)?.offsetHeight === 0) {
      useTimeoutFn(() => {
        setOptions(unref(getOptions));
      }, 30);
      return;
    }
    nextTick(() => {
      useTimeoutFn(() => {
        if (!chartInstance) {
          initCharts(getDarkMode.value as "default");

          if (!chartInstance) return;
        }
        clear && chartInstance?.clear();

        chartInstance?.setOption(unref(getOptions));
      }, 30);
    });
  }

  function resize() {
    chartInstance?.resize({
      animation: {
        duration: 300,
        easing: "quadraticIn",
      },
    });
  }

  watch(
    () => getDarkMode.value,
    (theme) => {
      if (chartInstance) {
        chartInstance.dispose();
        initCharts(theme as "default");
        setOptions(cacheOptions.value);
      }
    }
  );

  tryOnUnmounted(() => {
    if (!chartInstance) return;
    removeResizeFn();
    chartInstance.dispose();
    chartInstance = null;
  });

  function getInstance(): echarts.ECharts | null {
    if (!chartInstance) {
      initCharts(getDarkMode.value as "default");
    }
    return chartInstance;
  }

  return {
    setOptions,
    resize,
    echarts,
    getInstance,
  };
}

export { useECharts };
