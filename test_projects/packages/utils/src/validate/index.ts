/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-02-16 10:59:22
 * @path: \utils\src\validate\index.ts
 */
import { resolve, reject } from "./helper.ts";
import {
  isIp,
  isMac,
  isPhone,
  isPwStrong,
  isMask,
  isPort,
  hasChinese,
  isMail,
  isWithoutSpacialChar
} from "../is.ts";

interface Opt {
  allowCallback?: boolean;
  allowEmpty?: boolean;
  emptyMsg?: string;
  errorMsg?: string;
}

/**
 * 验证IP,IP不可为空
 * @params {allowCallback} 是否需要传参回调
 * @params {allowEmpty} 是否允许为空
 */
function ipValidate(opt?: Opt) {
  const {
    allowCallback = false,
    allowEmpty = false,
    emptyMsg = "请输入IP地址",
    errorMsg = "IP地址不正确",
  } = opt || {};
  return (_rule: Record<string, any>, value: string, callback: Function) => {
    if (allowEmpty && !value) {
      return resolve(callback, allowCallback);
    }
    // 必填
    if (!allowEmpty && !value) {
      return reject(emptyMsg, callback, allowCallback);
    }
    if (value && !isIp(String(value))) {
      return reject(errorMsg, callback, allowCallback);
    }
    return resolve(callback, allowCallback);
  };
}

/**
 * 验证mac
 * @params {allowCallback} 是否需要传参回调
 * @params {allowEmpty} 是否允许为空
 */
function macValidate(opt?: Opt) {
  const {
    allowCallback = false,
    allowEmpty = false,
    emptyMsg = "请输入mac地址",
    errorMsg = "请输入正确的mac地址",
  } = opt || {};
  return (_rule: Record<string, any>, value: string, callback: Function) => {
    if (allowEmpty && !value) {
      return resolve(callback, allowCallback);
    }
    // 必填
    if (!allowEmpty && !value) {
      return reject(emptyMsg, callback, allowCallback);
    }
    if (value && !isMac(String(value))) {
      return reject(errorMsg, callback, allowCallback);
    }
    return resolve(callback, allowCallback);
  };
}

// 密码校验
function passwordValidate(opt?: Opt) {
  const {
    allowCallback = false,
    allowEmpty = false,
    emptyMsg = "请输入密码",
  } = opt || {};
  return (_rule: Record<string, any>, value: string, callback: Function) => {
    if (allowEmpty && !value) {
      return resolve(callback, allowCallback);
    }
    // 必填
    if (!allowEmpty && !value) {
      return reject(emptyMsg, callback, allowCallback);
    }
    // 中文
    if (hasChinese(value)) {
      return reject("密码不能包含中文", callback, allowCallback);
    }
    // 密码强度
    if (value && !isPwStrong(value)) {
      return reject(
        "密码需8-16位且至少包含数字、大小写字母、特殊字符等两种",
        callback,
        allowCallback
      );
    }
    return resolve(callback, allowCallback);
  };
}

// 手机号校验
function phoneValidate(opt?: Opt) {
  const {
    allowCallback = false,
    allowEmpty = false,
    emptyMsg = "请输入手机号",
    errorMsg = "手机号格式错误",
  } = opt || {};
  return (_rule: Record<string, any>, value: string, callback: Function) => {
    if (allowEmpty && !value) {
      return resolve(callback, allowCallback);
    }
    // 必填
    if (!allowEmpty && !value) {
      return reject(emptyMsg, callback, allowCallback);
    }
    if (value && !isPhone(value)) {
      return reject(errorMsg, callback, allowCallback);
    }
    return resolve(callback, allowCallback);
  };
}
// 子网掩码校验
function maskValidate(opt?: Opt) {
  const {
    allowCallback = false,
    allowEmpty = false,
    emptyMsg = "请输入子网掩码",
    errorMsg = "子网掩码格式错误",
  } = opt || {};
  return (_rule: Record<string, any>, value: string, callback: Function) => {
    if (allowEmpty && !value) {
      return resolve(callback, allowCallback);
    }
    // 必填
    if (!allowEmpty && !value) {
      return reject(emptyMsg, callback, allowCallback);
    }
    if (value && !isMask(value)) {
      return reject(errorMsg, callback, allowCallback);
    }
    return resolve(callback, allowCallback);
  };
}

// 端口校验
function portValidate(opt?: Opt) {
  const {
    allowCallback = false,
    allowEmpty = false,
    emptyMsg = "请输入端口",
    errorMsg = "请输入正确端口",
  } = opt || {};
  return (_rule: Record<string, any>, value: string, callback: Function) => {
    if (allowEmpty && !value) {
      return resolve(callback, allowCallback);
    }
    // 必填
    if (!allowEmpty && !value) {
      return reject(emptyMsg, callback, allowCallback);
    }
    if (value && !isPort(String(value))) {
      return reject(errorMsg, callback, allowCallback);
    }
    return resolve(callback, allowCallback);
  };
}

/**
 * 验证邮箱
 * @params {allowCallback} 是否需要传参回调
 * @params {allowEmpty} 是否允许为空
 */
function mailValidate(opt?: Opt) {
  const {
    allowCallback = false,
    allowEmpty = false,
    emptyMsg = "请输入邮箱",
    errorMsg = "邮箱格式错误",
  } = opt || {};
  return (_rule: Record<string, any>, value: string, callback: Function) => {
    if (allowEmpty && !value) {
      return resolve(callback, allowCallback);
    }
    // 必填
    if (!allowEmpty && !value) {
      return reject(emptyMsg, callback, allowCallback);
    }
    if (value && !isMail(String(value))) {
      return reject(errorMsg, callback, allowCallback);
    }
    return resolve(callback, allowCallback);
  };
}

/**
 * 验证账号名称 不允许出现中文
 * @params {allowCallback} 是否需要传参回调
 * @params {allowEmpty} 是否允许为空
 */
function usernameValidate(opt?: Opt) {
  const {
    allowCallback = false,
    allowEmpty = false,
    emptyMsg = "请输入账号名称",
    errorMsg = "账号名称不能包含中文",
  } = opt || {};
  return (_rule: Record<string, any>, value: string, callback: Function) => {
    if (allowEmpty && !value) {
      return resolve(callback, allowCallback);
    }
    // 必填
    if (!allowEmpty && !value) {
      return reject(emptyMsg, callback, allowCallback);
    }
    const isOk = /^[a-zA-Z0-9]+$/.test(value);
    if (!allowEmpty && !isOk) {
      return reject("账号名称只能包含字母和数字", callback, allowCallback);
    }

    // 中文
    if (value && hasChinese(value)) {
      return reject(errorMsg, callback, allowCallback);
    }
    return resolve(callback, allowCallback);
  };
}

// 非特殊字符校验：中英文、数字、英文点. 、英文下划线_和连字符-
function withoutSpacialCharValidate(opt?: Opt) {
  const {
    allowCallback = false,
    allowEmpty = false,
    emptyMsg = "请输入名称",
    errorMsg = "请输入中英文、数字、英文点 . 、英文下划线 _ 和连字符 -",
  } = opt || {};
  return (_rule: Record<string, any>, value: string, callback: Function) => {
    if (allowEmpty && !value) {
      return resolve(callback, allowCallback);
    }
    // 必填
    if (!allowEmpty && !value) {
      return reject(emptyMsg, callback, allowCallback);
    }
    if (value && !isWithoutSpacialChar(value)) {
      return reject(errorMsg, callback, allowCallback);
    }
    return resolve(callback, allowCallback);
  };
}

export {
  ipValidate,
  macValidate,
  passwordValidate,
  phoneValidate,
  maskValidate,
  portValidate,
  mailValidate,
  usernameValidate,
  withoutSpacialCharValidate
};
