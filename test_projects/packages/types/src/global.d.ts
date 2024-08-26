/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-05-16 10:12:45
 * @path: \types\src\global.d.ts
 */
import "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    orderNo?: number;
    // title
    title: string;
    // dynamic router level.
    dynamicLevel?: number;
    // dynamic router real route path (For performance).
    realPath?: string;
    // Whether to ignore permissions
    ignoreAuth?: boolean;
    // role info
    roles?: string[];
    // Whether not to cache
    ignoreKeepAlive?: boolean;
    // Is it fixed on tab
    affix?: boolean;
    // icon on tab
    icon?: string;
    frameSrc?: string;
    // current page transition
    transitionName?: string;
    // Whether the route has been dynamically added
    hideBreadcrumb?: boolean;
    // Hide submenu
    hideChildrenInMenu?: boolean;
    // Carrying parameters
    carryParam?: boolean;
    // Used internally to mark single-level menus
    single?: boolean;
    // Currently active menu
    currentActiveMenu?: string;
    // Never show in tab
    hideTab?: boolean;
    // Never show in menu
    hideMenu?: boolean;
    isLink?: boolean;
    // only build for Menu
    ignoreRoute?: boolean;
    // Hide path for children
    hidePathForChildren?: boolean;
    // 包含可见子菜单的路由是否支持点击跳转, 并给上跳转的路径，相当于自定义redirect
    hasChildClick?: string;
    // 是否对页面进行行为检测(动态菜单默认监测)，监测开启在layout下的page.vue组件
    monitorBehavior?: boolean;
    // 该路由下的页面是子集菜单，主菜单不显示，例如：主机卫士单设备管理菜单 subNavigator
    subNavigator?: boolean;
  }
}

declare module "*.vue" {
  import { DefineComponent } from "vue";
  const Component: DefineComponent<{}, {}, any>;
  export default Component;
}

interface OemSettings {
  //是否修改过配置(0)
  PRIORITY_TYPE: "0" | "1";
  HTML_TITLE: string; //产品中文名(all)
  HTML_TITLE_EN: string; //产品英文名[issap]
  HTML_MODEL: string; //产品型号(all)
  HTML_COMPANY: string; //公司名称(all)
  HTML_LOGO_PATH: string; //oem图标目录(all)
  HTML_THEME: "light" | "dark"; //oem系统主题[csmp,all]
  HTML_HOME_PATH: string; //oem首页路径[csmp,issap]
}

declare global {
  declare interface Window {
    OEM_SETTINGS: OemSettings;
  }
  // 全局翻译函数
  declare var t: (message: string, ...args: any[]) => string;
}
