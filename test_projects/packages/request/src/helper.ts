/*
 * @name: Do not edit
 * @description: Do not edit
 */
import { isObject, isString, isInIframe, getUrlQuery } from '@guolisec/utils';

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

function joinTimestamp<T extends boolean>(
  join: boolean,
  restful: T
): T extends true ? string : object;

function joinTimestamp(join: boolean, restful = false): string | object {
  if (!join) {
    return restful ? '' : {};
  }
  const now = new Date().getTime();
  if (restful) {
    return `?_t=${now}`;
  }
  return { _t: now };
}

/**
 * @description: Format request parameter time
 */
const formatRequestDate = (params: Record<string, any>) => {
  if (!isObject(params)) {
    return;
  }

  for (const key in params) {
    const format = params[key]?.format ?? null;
    if (format && typeof format === 'function') {
      params[key] = params[key].format(DATE_TIME_FORMAT);
    }
    if (isString(key)) {
      const value = params[key];
      if (value) {
        try {
          params[key] = isString(value) ? value.trim() : value;
        } catch (error: any) {
          console.log('@guolisec/request formatRequestDate error');
          throw new Error(error);
        }
      }
    }
    if (isObject(params[key])) {
      formatRequestDate(params[key]);
    }
  }
};

/**
 * 后端提示用户信息统一过滤函数
 * @param message 原始消息
 * @param options
 * @returns 返回处理后的消息
 */
function filterRequestMessage(
  message: string,
  options?: {
    limitPercent?: number;
    skip?: boolean;
  }
) {
  const { limitPercent = 75, skip = false } = options || {};
  const isZh = localStorage.getItem('language') === 'zh';
  // 跳过消息过滤
  if (skip || !isZh) {
    return message;
  }
  const charList = message.split('');
  // 消息长度小于20 属于正常消息，直接返回
  if (charList.length <= 20) {
    return message;
  }
  // 计算英文字母占比
  const englishAlphabetList = charList.filter((char) => {
    return /[a-zA-Z]/.test(char);
  });
  const percent = (englishAlphabetList.length / charList.length) * 100;
  if (percent === 100) {
    return '';
  }
  if (percent > limitPercent) {
    return '';
  }
  return message;
}

/**
 * 优先获取当前文档的oem model token，防止同域多页面local缓存冲突
 */
function getToken() {
  let localToken = localStorage.getItem('TOKEN__');
  return localToken ? `bearer${localToken}` : '';
}

/**
 * 添加接口默认前缀
 */
function getDefaultApiUrl(url?: string) {
  // 2. 处理 remoteip
  const query = getUrlQuery();
  if (isInIframe() && query && isString(query.apiUrl)) {
    let apiUrl =
      query.apiUrl[query.apiUrl.length - 1] === '/'
        ? query.apiUrl.slice(0, query.apiUrl.length - 1)
        : query.apiUrl;
    return (url && url.startsWith('/') ? apiUrl : `${apiUrl}/`) as string;
  } else {
    return '';
  }
}

/**
 * 页面被嵌套并且url配置了remoteip，http header添加自定义remoteip字段（注意小写）
 */
function setRemoteIp(config: Record<string, any>) {
  const query = getUrlQuery();
  if (isInIframe() && query && query.remoteip) {
    config.headers.remoteip = query.remoteip;
  }
}

export {
  joinTimestamp,
  formatRequestDate,
  filterRequestMessage,
  getToken,
  getDefaultApiUrl,
  setRemoteIp,
};
