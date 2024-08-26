/*
 * @name: local storage constant key
 * @description: app 浏览器缓存的key
 */

// token
const TOKEN_KEY = 'TOKEN__';

// refresh token
const REFRESH_TOKEN__KEY = 'REFRESH_TOKEN__';

// 用户信息缓存
const USER_INFO_KEY = `USER__INFO__${getAppShortName()}`;

// 系统信息缓存
const SYSTEM__INFO__KEY = `SYSTEM__INFO__${getAppShortName()}`;

// 系统权限缓存
const PERMISSION__INFO__KEY = `PERMISSION__INFO__${getAppShortName()}`;

const CLIENT_ID = 'client';

const CLIENT_SECRET = 'secret';

function getAppShortName() {
  const appShortName =
    globalThis?.__APP_GLOBAL_BUILD_INFO__?.VITE_GLOB_APP_SHORT_NAME;
  if (appShortName && typeof appShortName === 'string') {
    return appShortName.toUpperCase();
  } else {
    return '';
  }
}

export {
  TOKEN_KEY,
  REFRESH_TOKEN__KEY,
  USER_INFO_KEY,
  SYSTEM__INFO__KEY,
  PERMISSION__INFO__KEY,
  CLIENT_ID,
  CLIENT_SECRET,
};
