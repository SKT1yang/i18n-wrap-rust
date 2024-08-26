/*
 * @name: Do not edit
 * @description: Do not edit
 */
import { type ComponentModule } from '../../types';
import type {
  Router,
  RouteRecordNormalized,
  RouteRecordRaw,
  RouteRecordName,
} from 'vue-router';
import { omit, cloneDeep, isInIframe, getUrlQuery } from '@guolisec/utils';
import { emit } from '@guolisec/scheduler';
import { createRouter, createWebHashHistory } from 'vue-router';
import { getLayoutMap, getParentLayout } from '../../views/layout/index';

/**
 * Convert multi-level routing to level 2 routing
 */
function flatMultiLevelRoutes(routeModules) {
  const modules = cloneDeep(routeModules);
  for (let index = 0; index < modules.length; index++) {
    const routeModule = modules[index];
    if (!isMultipleRoute(routeModule)) {
      continue;
    }
    promoteRouteLevel(routeModule);
  }
  return modules;
}

// Routing level upgrade
function promoteRouteLevel(routeModule: RouteRecordRaw) {
  // Use vue-router to splice menus
  let router: Router | null = createRouter({
    routes: [routeModule as unknown as RouteRecordNormalized],
    history: createWebHashHistory(),
  });

  const routes = router.getRoutes();
  addToChildren(routes, routeModule.children || [], routeModule);
  router = null;
  routeModule.children = routeModule.children?.map((item): any =>
    omit(item, 'children')
  );
}

// Add all sub-routes to the secondary route
function addToChildren(
  routes: RouteRecordNormalized[],
  children: RouteRecordRaw[],
  routeModule: RouteRecordRaw
) {
  for (let index = 0; index < children.length; index++) {
    const child = children[index];
    const route = routes.find((item) => item.name === child.name);
    if (!route) {
      continue;
    }
    routeModule.children = routeModule.children || [];
    if (!routeModule.children.find((item) => item.name === route.name)) {
      routeModule.children?.push(route as unknown as RouteRecordRaw);
    }
    if (child.children?.length) {
      addToChildren(routes, child.children, routeModule);
    }
  }
}

// Determine whether the level exceeds 2 levels
function isMultipleRoute(routeModule: RouteRecordRaw) {
  if (
    !routeModule ||
    !Reflect.has(routeModule, 'children') ||
    !routeModule.children?.length
  ) {
    return false;
  }

  const children = routeModule.children;

  let flag = false;
  for (let index = 0; index < children.length; index++) {
    const child = children[index];
    if (child.children?.length) {
      flag = true;
      break;
    }
  }
  return flag;
}

/**
 * 过滤路由，处理route.meta.ignoreRoute字段逻辑
 * @param route
 * @returns
 */
function routeRemoveIgnoreFilter(route: RouteRecordRaw) {
  const { meta } = route;
  // ignoreRoute 为true 则路由仅用于菜单生成，不会在实际的路由表中出现
  const { ignoreRoute } = meta || {};
  // arr.filter 返回 true 表示该元素通过测试
  return !ignoreRoute;
}

/**
 * 处理一级路由：将后端路由数据变成真实路由对象(处理component字段)
 * @param routeList
 */
async function transformObjToRoute<T = RouteRecordRaw>(
  routeList: RouteRecordRaw[]
): Promise<T[]> {
  for (let index = 0; index < routeList.length; index++) {
    const route = routeList[index];
    await transformTopRouteItem(route);
    route.children && (await asyncImportRoute(route.children));
  }
  return routeList as unknown as T[];
}

let pageModules: ComponentModule = {};

/**
 * Dynamic introduction：处理二级及以下路由配置
 * @param routes 非一级路由
 */
async function asyncImportRoute(routes: RouteRecordRaw[] | undefined) {
  // 只获取一次，减少性能损耗
  if (Object.keys(pageModules).length === 0) {
    const temp = await emit<ComponentModule>('pageModules');
    if (Array.isArray(temp) && temp.length > 0) {
      pageModules = temp[0] as ComponentModule;
    }
  }
  const dynamicViewsModules = pageModules;
  if (!routes) return;
  const layoutMap = await getLayoutMap();

  for (let index = 0; index < routes.length; index++) {
    const route = routes[index];
    if (!route.component && route.meta?.frameSrc) {
      route.component = layoutMap.get('Iframe');
    }
    const { component, name } = route;
    const { children } = route;
    if (component) {
      const layoutFound = layoutMap.get(component as unknown as string);
      if (layoutFound) {
        route.component = layoutFound;
      } else {
        if (dynamicViewsModules) {
          route.component = dynamicImport(
            dynamicViewsModules,
            component as unknown as string
          );
        }
      }
    } else if (name) {
      route.component = getParentLayout();
    }
    children && (await asyncImportRoute(children));
  }
}

function dynamicImport(
  dynamicViewsModules: ComponentModule,
  component: string
) {
  const keys = Object.keys(dynamicViewsModules);
  const matchKeys = keys.filter((key) => {
    const k = key.replace('../../../pages', '');
    const startFlag = component.startsWith('/');
    const endFlag = component.endsWith('.vue') || component.endsWith('.tsx');
    const startIndex = startFlag ? 0 : 1;
    const lastIndex = endFlag ? k.length : k.lastIndexOf('.');
    return k.substring(startIndex, lastIndex) === component;
  });
  if (matchKeys?.length === 1) {
    const matchKey = matchKeys[0];
    return dynamicViewsModules[matchKey].default;
  } else if (matchKeys?.length > 1) {
    console.warn(
      'Please do not create `.vue` and `.TSX` files with the same file name in the same hierarchical directory under the views folder. This will cause dynamic introduction failure'
    );
    return;
  } else {
    console.warn(
      '在src/pages/下找不到`' +
        component +
        '.vue` 或 `' +
        component +
        '.tsx`, 请自行创建!'
    );
    return () => import('../../views/Exception/index.vue');
  }
}

/**
 * 递归获取路由配置的所有name
 * @param array
 * @param names
 */
function getRouteNames(routes: RouteRecordRaw[]) {
  const flatten = (routes: RouteRecordRaw[], names: RouteRecordName[]) => {
    routes.forEach((item) => {
      item.name && names.push(item.name);
      flatten(item.children || [], names);
    });
  };
  const result: RouteRecordName[] = [];
  flatten(routes, result);
  return result;
}

/**
 * 顶级路由项处理
 * @param route 顶层路由（动态路由原始配置）
 */
async function transformTopRouteItem(route: RouteRecordRaw) {
  // 获取组件初始配置（字符串，类似: "Sonoma" 或 "/AssetPage.vue"）
  const component = route.component as unknown as string;
  if (component) {
    // 获取布局组件map
    const layoutMap = await getLayoutMap();
    const layoutFound = layoutMap.get(component);
    // 监测当前页面是否被嵌套到iframe
    // 非配置布局组件或被被嵌套到iframe，使用占位布局
    if (!layoutFound || isHiddenLayout()) {
      route.children = [cloneDeep(route)];
      route.component = layoutMap.get('DefaultLayout');
      route.name = `${String(route?.name)}Parent`;
      route.path = '';
    } else {
      route.component = layoutFound;
    }
  } else {
    console.error(
      '[permission package error]:请正确配置顶层路由：' +
        String(route?.name) +
        '的component属性'
    );
  }
}

// 页面被iframe嵌套并且路径配置layout=false，布局隐藏
function isHiddenLayout() {
  const query = getUrlQuery();
  return isInIframe() && query !== undefined && query.layout === 'false';
}

export {
  flatMultiLevelRoutes,
  routeRemoveIgnoreFilter,
  transformObjToRoute,
  getRouteNames,
};
