/*
 * @name: Do not edit
 * @description: Do not edit
 */
/* 类型文件 */
import type { LoginFormData, LoginModel } from '../types/login';
import type { RouteRecordRaw } from 'vue-router';
/* 第三方模块 */
import { http } from '@guolisec/request';
import { message } from '@guolisec/toast';
import { useRouter, go } from '@guolisec/routerable';
import { isString, isInIframe, ls } from '@guolisec/utils';
/* 本地共享模块 */
import { t } from '@/languages';
/* 业务模块 */
import { usePermissionStoreWithOut } from '../model/store';
import {
  getLoginInfo,
  getLoginTime,
  getPasswordTime,
  getPublicKey,
  getVerifyCodeInfo,
} from '../model/login';
import { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN__KEY } from '../types/enum';
import { buildRoutes, resetRouter } from './route';

/**
 * @description: 1. 登录
 */
async function login(params: LoginFormData) {
  const { access_token, refresh_token } = await http.post<LoginModel>({
    url: '/oauth/getToken',
    data: params,
  });
  switchLoginState(access_token, refresh_token);
}

/**
 * @description: 2. 切换登录态
 */
async function switchLoginState(token: string, refreshToken: string) {
  const permissionStore = usePermissionStoreWithOut();
  permissionStore.setToken(token);
  permissionStore.setRefreshToken(refreshToken);
  afterLoginAction(true, true, 'switchLoginState');
}

/**
 * @description: 3. 登录后动作
 */
async function afterLoginAction(
  goHome = false,
  showMessage = false,
  bugger: string = 'default'
) {
  const permissionStore = usePermissionStoreWithOut();
  // 缓存数据
  const { userInfo, systemInfo, permissionInfo } = await getLoginInfo(bugger);
  permissionStore.setUserInfo(userInfo);
  permissionStore.setSystemInfo(systemInfo);
  permissionStore.setPermissionInfo(permissionInfo);
  // 构建路由
  const routes = await buildRoutes(permissionInfo);
  try {
    const router = useRouter();
    routes.forEach((route) => {
      router.addRoute(route as unknown as RouteRecordRaw);
    });
  } catch (error) {
    console.error(`[@guolisec/permission 构建路由错误]:`, error);
  }

  permissionStore.setIsDynamicAddedRoute(true);
  goHome &&
    go({
      path: systemInfo?.homePageUrl || '/',
      replace: true,
    });
  showMessage &&
    userInfo?.username &&
    message.success(`${t('你好')}!${userInfo?.username}`);
}

/**
 * @description: 4. 刷新登录态
 */
async function refreshLoginState() {
  try {
    const permissionStore = usePermissionStoreWithOut();
    const tokenInfo = await http.post<LoginModel>({
      url: '/oauth/token',
      params: {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: ls.get(REFRESH_TOKEN__KEY),
      },
    });
    permissionStore.setToken(tokenInfo.access_token);
    permissionStore.setRefreshToken(tokenInfo.refresh_token);
    return true;
  } catch (error) {
    console.warn(`[service refreshLoginState失败]:${error}`);
    return false;
  }
}

/**
 * @description: 5. 登出
 * @param msg 登出后消息
 * @param deleteRemoteToken 是否删除后端token，默认删除
 */
async function logout(msg?: string, deleteRemoteToken = true) {
  const permissionStore = usePermissionStoreWithOut();
  // todo 不够优雅 缓存token后删除登录信息， 否则/oauth/token包含
  const token = permissionStore.getToken;
  if (deleteRemoteToken && token) {
    try {
      const res = await http.delete<{ code: number; msg: string }>(
        {
          url: `/oauth/token?access_token=${token}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
        },
        {
          withToken: false,
        }
      );
      if (msg === undefined && res.msg) {
        msg = res.msg;
      }
    } catch (error) {
      console.warn(`[service deleteRemoteToken失败]:${error}`);
    }
  }
  clearLoginState();
  goLoginPage();
  isString(msg) && message.success(msg);
}

/**
 * @description: 6. 清除登录态
 */
function clearLoginState() {
  const permissionStore = usePermissionStoreWithOut();
  permissionStore.setToken('');
  permissionStore.setRefreshToken('');
  permissionStore.setSystemInfo(null);
  permissionStore.setUserInfo(null);
  permissionStore.setPermissionInfo([]);
  permissionStore.setMenuList([]);
  permissionStore.setIsDynamicAddedRoute(false);
  permissionStore.setLicenseStatus(false);
  resetRouter();
}

/**
 * @description: 7. 返回登录页
 */
function goLoginPage() {
  // 被嵌套时，不进行页面跳转
  if (isInIframe()) {
    console.warn(
      'goLoginPage, 并且被嵌套时，不进行页面跳转， 并通知父页面退出'
    );
    // 通知父页面退出登录
    window.parent.postMessage({
      type: 'logout',
      data: {},
    });
    return;
  }
  const router = useRouter();
  // 返回登录页，已在登录页不返回
  router?.currentRoute?.value.name !== 'Login' &&
    go({
      name: 'Login',
    });
}

/**
 * 修改token有效时长
 * @param params
 * @returns
 */
async function modifyLoginTime(params: { time: number }) {
  return http.post({
    url: '/api/user/modifyLoginTime',
    params,
  });
}

/**
 * 修改密码周期，单位为：月
 * @param data
 * @returns
 */
async function modifyPasswordTime(data: { interval: number }) {
  return http.post({
    url: '/api/user/modifyPwdInterval',
    data,
  });
}

/**
 * 提交授权码
 */
async function submitLicenseCode(data: {
  licenseCode: string;
  machineCode: string;
}) {
  return http.post<{ success: boolean; errMessage?: string }>({
    url: '/api/isep/submitLicenseCode',
    data,
  });
}

export {
  login,
  switchLoginState,
  afterLoginAction,
  refreshLoginState,
  logout,
  clearLoginState,
  modifyLoginTime,
  modifyPasswordTime,
  getLoginInfo,
  getLoginTime,
  getPasswordTime,
  getPublicKey,
  getVerifyCodeInfo,
  submitLicenseCode,
};
