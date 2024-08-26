/*
 * @Name: 权限全局状态
 * @Description: Do not edit
 */
import type { UserInfo, SystemInfo, PermissionInfo } from '@guolisec/types';
import { ref, computed } from 'vue';
import { useStore } from '@guolisec/storable';
import { defineStore } from 'pinia';
import { ls } from '@guolisec/utils';
import {
  TOKEN_KEY,
  REFRESH_TOKEN__KEY,
  USER_INFO_KEY,
  SYSTEM__INFO__KEY,
  PERMISSION__INFO__KEY,
} from '../types/enum';

type Nullable<T> = T | null;

const usePermissionStore = defineStore('permission-store', () => {
  // token
  const token = ref(ls.get<string>(TOKEN_KEY) || '');
  const getToken = computed(() => {
    return token.value || ls.get<string>(TOKEN_KEY);
  });
  function setToken(data: string | undefined) {
    token.value = data ? data : '';
    ls.set(TOKEN_KEY, data);
  }

  // refresh token
  const refreshToken = ref('');
  const getRefreshToken = computed(() => {
    return refreshToken.value || ls.get<string>(REFRESH_TOKEN__KEY);
  });
  function setRefreshToken(data: string | undefined) {
    refreshToken.value = data ? data : '';
    ls.set(REFRESH_TOKEN__KEY, data);
  }

  // userInfo
  const userInfo = ref<Nullable<UserInfo>>({
    id: 0,
    name: '',
    username: '',
    password: '',
    phone: '',
    roleId: 0,
    roleName: '',
    privilege: 0,
  });
  const getUserInfo = computed(() => {
    return userInfo.value?.id
      ? userInfo.value
      : ls.get<Nullable<UserInfo>>(USER_INFO_KEY);
  });
  function setUserInfo(data: Nullable<UserInfo>) {
    userInfo.value = data;
    ls.set(USER_INFO_KEY, data);
  }

  // systemInfo
  const systemInfo = ref<Nullable<SystemInfo>>({
    active: false,
    clientId: '',
    description: '',
    id: 0,
    sysName: '',
    // 默认/home
    homePageUrl: '/home',
    model: '',
  });
  const getSystemInfo = computed(() => {
    return systemInfo.value?.id
      ? systemInfo.value
      : ls.get<Nullable<SystemInfo>>(SYSTEM__INFO__KEY);
  });
  function setSystemInfo(data: Nullable<SystemInfo>) {
    systemInfo.value = data;
    ls.set(SYSTEM__INFO__KEY, data);
  }

  // permissionInfo
  const permissionInfo = ref<PermissionInfo>([]);
  const getPermissionInfo = computed(() => {
    return permissionInfo.value
      ? permissionInfo.value
      : ls.get<PermissionInfo>(PERMISSION__INFO__KEY);
  });
  function setPermissionInfo(data: PermissionInfo) {
    permissionInfo.value = data;
    ls.set(PERMISSION__INFO__KEY, data);
  }

  // menuList 菜单数据（数组）
  const menuList = ref<any[]>([]);
  const getMenuList = computed(() => {
    return menuList.value;
  });
  function setMenuList(data: any[]) {
    menuList.value = data;
  }

  // 路由是否已动态添加
  const isDynamicAddedRoute = ref(false);
  const getIsDynamicAddedRoute = computed(() => {
    return isDynamicAddedRoute.value;
  });
  function setIsDynamicAddedRoute(status: boolean) {
    isDynamicAddedRoute.value = status;
  }

  // 授权登录，登录状态
  const licenseStatus = ref(false);
  const getLicenseStatus = computed(() => {
    return licenseStatus.value;
  });
  function setLicenseStatus(status: boolean) {
    licenseStatus.value = status;
  }

  // 初始化所有状态
  function resetState() {
    token.value = '';
    refreshToken.value = '';
    userInfo.value = null;
    systemInfo.value = null;
    permissionInfo.value = [];
    menuList.value = [];
    isDynamicAddedRoute.value = false;
    licenseStatus.value = false;
  }

  return {
    token,
    getToken,
    setToken,

    refreshToken,
    getRefreshToken,
    setRefreshToken,

    userInfo,
    getUserInfo,
    setUserInfo,

    systemInfo,
    getSystemInfo,
    setSystemInfo,

    permissionInfo,
    getPermissionInfo,
    setPermissionInfo,

    menuList,
    getMenuList,
    setMenuList,

    isDynamicAddedRoute,
    getIsDynamicAddedRoute,
    setIsDynamicAddedRoute,

    licenseStatus,
    getLicenseStatus,
    setLicenseStatus,

    resetState,
  };
});

// Need to be used outside the setup
function usePermissionStoreWithOut() {
  const store = useStore();
  return usePermissionStore(store);
}

export { usePermissionStore, usePermissionStoreWithOut };
