/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-02-09 16:12:00
 * @path: \permission\src\views\layout\index.ts
 */
import { type ComponentModule } from '../../types';
import { emit } from '@guolisec/scheduler';
import BigSur from './design/BigSur/index.vue';
import OnePiece from './design/OnePiece/index.vue';
import Sonoma from './design/Sonoma/index.vue';
import DefaultLayout from './design/Default/DefaultLayout.vue';

async function getLayoutMap() {
  const LayoutMap = new Map<string, ComponentModule>();
  LayoutMap.set('BigSur', BigSur);
  LayoutMap.set('OnePiece', OnePiece);
  LayoutMap.set('Sonoma', Sonoma);
  LayoutMap.set('DefaultLayout', DefaultLayout);
  const getLayoutMapDataList = await emit<Map<string, ComponentModule>>(
    'getLayoutMap'
  );
  if (Array.isArray(getLayoutMapDataList) && getLayoutMapDataList.length > 0) {
    let userLayoutMap = getLayoutMapDataList[0] as Map<string, ComponentModule>;
    userLayoutMap.forEach((value, key) => {
      // 同名布局用户优先级更高，会覆盖默认布局
      LayoutMap.set(key, value);
    });
  }
  return LayoutMap;
}

/**
 * @description: parent-layout
 */
function getParentLayout(name?: string) {
  return () =>
    new Promise((resolve) => {
      resolve({
        name: name || 'PageNotFound',
      });
    });
}

export { getLayoutMap, getParentLayout };
