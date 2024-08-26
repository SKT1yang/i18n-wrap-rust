/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-02-16 11:04:59
 * @path: \utils\src\is.ts
 */

/**
 * IP地址
 * @param {*} s
 */
function isIp(s: string) {
  return /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(
    s
  );
}

/**
 * Mac校验
 * @param {*} s
 */
export function isMac(s: string) {
  const reg =
    /[a-f|A-F|\d]{2}:[a-f|A-F|\d]{2}:[a-f|A-F|\d]{2}:[a-f|A-F|\d]{2}:[a-f|A-F|\d]{2}:[a-f|A-F|\d]{2}/;

  return reg.test(s) && s.replace(reg, "") === "";
}

/**
 * 手机号
 * @param {*} s
 */
function isPhone(s: string) {
  const reg = /^1[3-9]\d{9}$/;
  return s.replace(reg, "") === "";
}

/**
 * 密码强度
 * @param {*} s
 */
function isPwStrong(s: string) {
  // 最短6，最长16
  if (s.length < 8 || s.length > 16) {
    return false;
  } else {
    let lvl = 0; //默认等级是0
    // 判断数字
    if (/[0-9]/.test(s)) {
      lvl++;
    }
    // 判断有没有字母
    if (/[a-zA-Z]/.test(s)) {
      lvl++;
    }
    // 判断有没有特殊符号
    if (/[^0-9a-zA-A_]/.test(s)) {
      lvl++;
    }
    if (lvl >= 2) {
      return true;
    } else {
      return false;
    }
  }
}

/**
 * 子网掩码
 * @param {*} s
 */
function isMask(s: string) {
  return (
    s &&
    s.replace(
      /^(255|254|252|248|240|224|192|128|0)\.0\.0\.0|255\.(255|254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(255|254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(255|254|252|248|240|224|192|128|0)$/,
      ""
    ) === ""
  );
}

function isJson(str: string) {
  if (typeof str === "string") {
    try {
      const obj = JSON.parse(str);
      return typeof obj === "object" && obj;
    } catch (e) {
      return false;
    }
  }
}

/**
 * 严格空值判断
 * @constructor
 * @param value
 */
function isEmptyValue(value: any) {
  const isEmptyObj = typeof value === "object" && String(value) === "{}";
  const isEmptyArray = Array.isArray(value) && value.length === 0;
  // eslint-disable-next-line no-self-compare
  return (
    value === undefined ||
    value === null ||
    value !== value ||
    value === "" ||
    isEmptyObj ||
    isEmptyArray
  );
}

/**
 * 端口校验
 * @param {*} s
 */
function isPort(s: string | number) {
  const isNumber = s.toString().replace(/^[1-9]\d*|0$/, "") === "";
  return isNumber && Number(s) >= 0 && Number(s) <= 65535 && s !== "";
}

/**
 * 邮箱
 * @param {*} s
 */
function isMail(s: string) {
  // const reg = /^([a-zA-Z0-9_\-\.])+\@([a-zA-Z0-9_\-\.])+\.([a-zA-Z0-9_-]{2,4})$/; // 方式一
  const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/; // 方式二
  return s.replace(reg, "") === "";
}

function isChinese(s: string) {
  const regex = /[\u4E00-\u9FA5]+/g;
  return regex.test(s) && s.replace(/[\u4E00-\u9FA5]+/g, "") === "";
}

function hasChinese(s: string) {
  return /[\u4E00-\u9FA5]+/g.test(s);
}

/**
 * 用户配置接口网关时，其地址需要包含在接口的网段内（需要结合填写的ip地址、子网掩码计算），例如：
 * 用户配置ip为192.168.2.160，子网掩码为255.255.252.0，则网关地址需要在192.168.0.1~192.168.3.254内
 * @returns {Boolean}
 * @param ip 配置ip
 * @param mask 子网掩码
 * @param value 判断值
 */
function isNetworkSegment(ip: string, mask: string, value: string) {
  const arrIP = ip.split(".").map((i) => Number(i));
  const arrSM = mask.split(".").map((i) => Number(i));
  const arrGW = value.split(".").map((i) => Number(i));

  /* Check IP Address  isn't on loopback or 255*/
  if (arrIP[0] === 255 || arrIP[0] === 127) {
    return false;
  }

  /* Calculate Broadcast, Network Address */
  const arrNetwork = [
    arrIP[0] & arrSM[0],
    arrIP[1] & arrSM[1],
    arrIP[2] & arrSM[2],
    arrIP[3] & arrSM[3],
  ];
  const arrWildcard = [
    arrSM[0] ^ 255,
    arrSM[1] ^ 255,
    arrSM[2] ^ 255,
    arrSM[3] ^ 255,
  ];
  const arrBroadcast = [
    arrNetwork[0] + arrWildcard[0],
    arrNetwork[1] + arrWildcard[1],
    arrNetwork[2] + arrWildcard[2],
    arrNetwork[3] + arrWildcard[3],
  ];

  /* make sure IP doesn't equal broadcast or network */
  if (
    arrIP[0] === arrNetwork[0] &&
    arrIP[1] === arrNetwork[1] &&
    arrIP[2] === arrNetwork[2] &&
    arrIP[3] === arrNetwork[3]
  ) {
    return false;
  }

  if (
    arrIP[0] === arrBroadcast[0] &&
    arrIP[1] === arrBroadcast[1] &&
    arrIP[2] === arrBroadcast[2] &&
    arrIP[3] === arrBroadcast[3]
  ) {
    return false;
  }

  /* make sure gateway isn't the broadcast or network address */
  if (
    arrGW[0] === arrNetwork[0] &&
    arrGW[1] === arrNetwork[1] &&
    arrGW[2] === arrNetwork[2] &&
    arrGW[3] === arrNetwork[3]
  ) {
    return false;
  }
  if (
    arrGW[0] === arrBroadcast[0] &&
    arrGW[1] === arrBroadcast[1] &&
    arrGW[2] === arrBroadcast[2] &&
    arrGW[3] === arrBroadcast[3]
  ) {
    return false;
  }

  /* make sure gateway isn't the broadcast or network address  and is in the networks range*/

  const GatewayLong =
    ((+arrGW[0] * 256 + +arrGW[1]) * 256 + +arrGW[2]) * 256 + +arrGW[3];
  const NetworkLong =
    ((+arrNetwork[0] * 256 + +arrNetwork[1]) * 256 + +arrNetwork[2]) * 256 +
    +arrNetwork[3];
  const BroadcastLong =
    ((+arrBroadcast[0] * 256 + +arrBroadcast[1]) * 256 + +arrBroadcast[2]) *
      256 +
    +arrBroadcast[3];
  if (GatewayLong <= NetworkLong || GatewayLong >= BroadcastLong) {
    return false;
  }

  return true;
}

const isServer = typeof window === "undefined";

// 设备相关名称：中英文、数字、英文点. 、英文下划线_和连字符-
function isWithoutSpacialChar(s: string) {
  const regex = /^[\u4e00-\u9fa5a-zA-Z0-9._-]+$/;
  return regex.test(s) && s.replace(regex, "") === "";
}

export {
  isServer,
  isIp,
  isPhone,
  isPwStrong,
  isMask,
  isJson,
  isMail,
  isEmptyValue,
  isPort,
  isChinese,
  hasChinese,
  isNetworkSegment,
  isWithoutSpacialChar
};
