/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-02-13 20:01:23
 * @path: \permission\src\model\login.ts
 */

/* 类型文件 */
import { AfterLoginInfoModel } from '../types/login';
/* 第三方模块 */
import { http } from '@guolisec/request';
/* 本地共享模块 */

/* 业务模块 */

export async function getPublicKey(): Promise<string> {
  return http.get({
    url: '/api/validate/getPublicKey',
  });
}

export async function getVerifyCodeInfo(): Promise<{
  uuid: string;
  img: string;
}> {
  try {
    const result = await http.get<{
      data: string;
      headers: {
        validatecodeuuid: string;
      };
    }>(
      { url: '/api/validate/getValidateCode' },
      { isReturnNativeResponse: true }
    );
    return {
      uuid: result.headers.validatecodeuuid,
      img: result.data,
    };
  } catch (err) {
    console.warn('@guolisec/permission getVerifyCodeInfo', err);
    return {
      uuid: '',
      img: '',
    };
  }
}

export async function getLoginInfo(bugger) {
  console.warn('bugger:', bugger);
  const { user, dynamicSystem, permission } =
    await http.get<AfterLoginInfoModel>({
      url: '/api/permission/getCurrentPermission',
      // 权限退出时间缩短，让用户尽快看到返回的错误结果，
      timeout: 10000,
    });
  return {
    userInfo: user,
    systemInfo: dynamicSystem,
    permissionInfo: permission,
  };
}

export async function getLoginTime() {
  return http.post<number>({
    url: '/api/user/getLoginTime',
  });
}

export async function getPasswordTime() {
  return http.get<number>({
    url: '/api/user/getPwdInterval',
  });
}

/**
 * 查询授权状态
 */
export async function getLicenseStatus() {
  return http.get<{ success: boolean; errorMsg?: string }>({
    url: '/api/isep/getLicenseStatus',
  });
}

/**
 * 获取机器码
 */
export async function getMachineCode() {
  return http.get<string>({
    url: '/api/isep/getMachineCode',
  });
}
