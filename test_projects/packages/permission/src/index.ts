import 'uno.css';
// 权限
import Login from './views/Login/index.vue';
import LicenseLogin from './views/Login/LicenseLogin.vue';
import LoginTimeout from './views/Login/LoginTimeout.vue';
import PasswordTimeout from './views/Login/PasswordTimeout.vue';
import Account from './views/Account.vue';
import Role from './views/Role/index.vue';
import User from './views/User/index.vue';
import Permission from './views/Permission/index.vue';
import System from './views/System/index.vue';
import Route from './views/Route/index.vue';
import Exception from './views/Exception/index.vue';
import IframeError from './views/Exception/IframeError.vue';
// 布局
import BigSur from './views/layout/design/BigSur/index.vue';
import Sonoma from './views/layout/design/Sonoma/index.vue';
import Iframe from './views/layout/design/Iframe/index.vue';
import OnePiece from './views/layout/design/OnePiece/index.vue';
import MarginPageWrapper from './views/layout/components/MarginPageWrapper.vue';
import HorizontalMenu from './views/menu/HorizontalMenu.vue';
import VerticalMenu from './views/menu/VerticalMenu.vue';
import Page from './views/layout/components/Page.vue';

// 函数
import { usePermissionStoreWithOut as usePermissionStore } from './model/store';
import { logout, refreshLoginState, getLoginInfo } from './service/login';
import { createPermissionGuard } from './service/route/guard';
import { getUserList } from './model/user';
import { useMonitor } from './controller/usePermission';
import { provideLoginContext } from './controller/useContext'; // 登录依赖注入上下文

export {
  // 常规登录
  Login,
  // License登录
  LicenseLogin,
  // 登录超时配置
  LoginTimeout,
  // 密码超时配置
  PasswordTimeout,
  // 账号管理
  Account,
  // 角色管理
  Role,
  // 用户管理
  User,
  // 权限管理
  Permission,
  // 系统管理
  System,
  // 路由管理
  Route,
  // 异常页面
  Exception,
  // 嵌套异常
  IframeError,
  // 顶部header型布局组件
  BigSur,
  // 混合布局组件
  Sonoma,
  // 带边框的页面容器
  MarginPageWrapper,
  // iframe布局容器
  Iframe,
  // 动态布局组件
  OnePiece,
  // 水平菜单
  HorizontalMenu,
  // 垂直菜单
  VerticalMenu,
  // 页面内容容器
  Page,
  // 获取登录依赖注入的上下文
  provideLoginContext,
  // 注销登录方法
  logout,
  // 获取用户方法
  getUserList,
  // 获取权限相关状态
  usePermissionStore,
  // 刷新登录方法
  refreshLoginState,
  // 权限路由守卫
  createPermissionGuard,
  // 获取登录信息
  getLoginInfo,
  // 用户行为监测
  useMonitor,
};
export * from './types/enum';
