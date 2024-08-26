/*
 * @Name: Do not edit
 * @Description: Do not edit
 * @Author: ygd
 * @Date: 2022-03-17 16:02:25
 * @LastEditTime: 2023-05-15 14:14:40
 * @LastEditors: Please set LastEditors
 */
import type { RouteRecordRaw } from 'vue-router';
import { treeMap } from '../utils/treeHelper';
import { cloneDeep, isUrl } from '@guolisec/utils';

// 路径处理
function joinParentPath(menus: any[], parentPath = '') {
  for (let index = 0; index < menus.length; index++) {
    const menu = menus[index];
    // https://next.router.vuejs.org/guide/essentials/nested-routes.html
    // Note that nested paths that start with / will be treated as a root path.
    // 请注意，以 / 开头的嵌套路径将被视为根路径。
    // This allows you to leverage the component nesting without having to use a nested URL.
    // 这允许你利用组件嵌套，而无需使用嵌套 URL。
    if (!(menu.path.startsWith('/') || isUrl(menu.path))) {
      // path doesn't start with /, nor is it a url, join parent path
      // 路径不以 / 开头，也不是 url，加入父路径
      menu.path = `${parentPath}/${menu.path}`;
    }
    if (menu?.children?.length) {
      joinParentPath(
        menu.children,
        menu.meta?.hidePathForChildren ? parentPath : menu.path
      );
    }
  }
}

// 将路由转换成菜单
export function transformRouteToMenu(routeModList: RouteRecordRaw[]) {
  const cloneRouteModList = cloneDeep(routeModList);
  const routeList: RouteRecordRaw[] = [];

  // 对路由项进行修改
  cloneRouteModList.forEach((item) => {
    if (
      item.meta &&
      item.meta.hideChildrenInMenu &&
      typeof item.redirect === 'string'
    ) {
      item.path = item.redirect;
    }
    if (item.meta?.single) {
      const realItem = item?.children?.[0];
      realItem && routeList.push(realItem);
    } else {
      routeList.push(item);
    }
  });
  // 提取树指定结构
  const list = treeMap(routeList, {
    conversion: (node: RouteRecordRaw) => {
      const { meta: { title, hideMenu = false } = {} } = node;

      return {
        ...(node.meta || {}),
        meta: node.meta,
        name: title,
        routeName: node.name,
        hideMenu,
        path: node.path,
        ...(node.redirect ? { redirect: node.redirect } : {}),
      };
    },
  });
  // 路径处理
  joinParentPath(list);
  return cloneDeep(list);
}
