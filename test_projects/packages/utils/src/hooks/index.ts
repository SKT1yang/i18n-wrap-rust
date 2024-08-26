/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-02-06 15:37:25
 * @path: \utils\src\hooks\index.ts
 */

import { nextTick, getCurrentInstance, onActivated, onDeactivated } from 'vue';
import { tryOnMounted, tryOnUnmounted } from '@vueuse/core';
import { useWindowSizeFn } from './useWindowSizeFn';
import { useDocumentTitle } from './useDocumentTitle';
import { provideContext, injectContext } from './useContext';
import { useBehaviorMonitor } from './useBehaviorMonitor';

function onMountedOrActivated(fn: () => void) {
  let mounted: boolean;

  tryOnMounted(() => {
    fn();
    nextTick(() => {
      mounted = true;
    });
  });

  tryOnActivated(() => {
    if (mounted) {
      fn();
    }
  });
}

function onUnMountedOrDeactivated(fn: () => void) {
  let unmounted: boolean;

  tryOnUnmounted(() => {
    fn();
    nextTick(() => {
      unmounted = true;
    });
  });

  tryOnDeactivated(() => {
    if (unmounted) {
      fn();
    }
  });
}

/**
 * 安全的调用 onActivated，如果不在一个组件声明周期内，什么也不做
 * @param fn
 */
function tryOnActivated(fn: () => void) {
  if (getCurrentInstance()) {
    onActivated(fn);
  }
}

/**
 * 安全的调用 onDeactivated，如果不在一个组件声明周期内，什么也不做
 * @param fn
 */
function tryOnDeactivated(fn: () => void) {
  if (getCurrentInstance()) {
    onDeactivated(fn);
  }
}

export {
  useWindowSizeFn,
  onMountedOrActivated,
  onUnMountedOrDeactivated,
  tryOnActivated,
  tryOnDeactivated,
  useDocumentTitle,
  provideContext,
  injectContext,
  useBehaviorMonitor,
};
export { useEmitter, useEmitterAsync } from './useEmitter';
