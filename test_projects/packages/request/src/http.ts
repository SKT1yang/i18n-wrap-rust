/* 类型文件 */
import type { AxiosResponse } from 'axios';
import type { RequestOptions, RequestResult } from '@guolisec/types';
import type { AxiosTransform, CreateAxiosOptions } from './axiosTransform';
/* 第三方模块 */
import { message as toastMessage } from '@guolisec/toast';
import {
  isString,
  isFunction,
  clone,
  deepMerge,
  appendUrlParams,
  stringify,
  blobToJson,
} from '@guolisec/utils';
/* 本地模块 */
import { t } from './languages';
import { VAxios } from './Axios';
import { checkStatus } from './checkStatus';
import { RequestEnum, ResultEnum, ContentTypeEnum } from './constants';
import {
  joinTimestamp,
  formatRequestDate,
  getToken,
  getDefaultApiUrl,
  setRemoteIp,
} from './helper';

/**
 * @description: 数据处理，方便区分多种处理方式
 */
const transform: AxiosTransform = {
  /**
   * @description: 处理请求返回的数据。如果数据不是预期格式，可直接抛出错误
   */
  transformRequestHook: (
    res: AxiosResponse<RequestResult>,
    options: RequestOptions
  ) => {
    const { isTransformResponse, isReturnNativeResponse } = options;

    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    if (isReturnNativeResponse) {
      return res;
    }

    // axios去包后的data值
    const axiosResponseData = res.data;

    // todo 1. 处理返回blob 文件类型数据 2. 兼容blob数据返回失败，返回标准msg json消息
    // console.log(res.data.constructor, 'constructor')

    // 不进行任何处理，直接返回
    if (!isTransformResponse) {
      return axiosResponseData;
    }

    // http没有返回任何数据(AxiosResponse.data不存在);
    if (axiosResponseData === undefined && axiosResponseData === null) {
      throw new Error(t('请求出错，请稍候重试'));
    }

    const { success, data, errCode, errMessage, message, errMsg } =
      axiosResponseData;

    let timeoutMsg = message || '';

    // http成功
    const hasSuccess =
      res.status === ResultEnum.SUCCESS ||
      res.status === ResultEnum.SUCCESS204 ||
      res.status === ResultEnum.SUCCESS201;

    /**
     * response标准结构返回
     */
    if (hasSuccess && success === true) {
      // 兼容返回true/false的data
      return data === undefined ? axiosResponseData : data;
    }

    /**
     * response非标准结构返回
     */
    if (hasSuccess && success === undefined) {
      return axiosResponseData;
    }

    if (success === false) {
      switch (Number(errCode)) {
        case ResultEnum.TIMEOUT:
          timeoutMsg = t('登录超时，请重新登录');
          break;
        default:
          timeoutMsg = errMessage || errMsg || '';
      }
    }

    toastMessage.error(timeoutMsg);

    throw new Error(timeoutMsg || t('请求出错，请稍候重试'));
  },

  // 请求之前处理config
  beforeRequestHook: (config, options) => {
    const { apiUrl, joinParamsToUrl, formatDate, joinTime = true } = options;

    if (apiUrl) {
      const _apuUrl = isString(apiUrl)
        ? apiUrl
        : isFunction(apiUrl)
        ? apiUrl?.(config.url)
        : '';
      config.url = `${_apuUrl}${config.url}`;
    }
    const params = config.params || {};
    const data = config.data || false;
    formatDate && data && !isString(data) && formatRequestDate(data);
    if (config.method?.toUpperCase() === RequestEnum.GET) {
      if (!isString(params)) {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(
          params || {},
          joinTimestamp(joinTime, false)
        );
      } else {
        // 兼容restful风格
        config.url = config.url + params + `${joinTimestamp(joinTime, true)}`;
        config.params = undefined;
      }
    } else {
      if (!isString(params)) {
        formatDate && formatRequestDate(params);
        if (
          Reflect.has(config, 'data') &&
          config.data &&
          Object.keys(config.data).length > 0
        ) {
          config.data = data;
          config.params = params;
        }
        if (joinParamsToUrl) {
          config.url = appendUrlParams(
            config.url as string,
            Object.assign({}, config.params, config.data)
          );
        }
      } else {
        // 兼容restful风格
        config.url = config.url + params;
        config.params = undefined;
      }
    }
    return config;
  },

  /**
   * @description: 请求拦截器处理
   */
  requestInterceptors: (config, options) => {
    // 1. 处理 token
    const token = getToken();
    if (
      token &&
      (config as Record<string, any>)?.requestOptions?.withToken !== false
    ) {
      (config as Record<string, any>).headers.Authorization =
        options.authenticationScheme
          ? `${options.authenticationScheme} ${token}`
          : token;
    }
    // 2. 处理 remoteip
    setRemoteIp(config);
    return config;
  },

  /**
   * @description: 响应拦截器处理
   */
  responseInterceptors: (res: AxiosResponse<any>) => {
    return res;
  },

  /**
   * @description: 响应错误处理
   */
  responseInterceptorsCatch: async (axiosInstance, error) => {
    console.log('responseInterceptorsCatch', error.config?.requestOptions);
    const { skipFilterRequestMessage = false } =
      error.config?.requestOptions || {};
    const { response, code, message } = error || {};
    let data = response?.data;
    // @ts-ignore todo
    if (data && data.type === 'application/json' && data instanceof Blob) {
      // @ts-ignore todo
      data = await blobToJson(data);
    }
    const msg: string =
      (data?.errMsg || data?.message || data?.error?.message) ?? '';
    const err: string = error?.toString?.() ?? '';
    let errMessage = '';

    try {
      if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
        errMessage = t('网络超时，请刷新页面重试');
      }
      if (err?.includes('Network Error')) {
        errMessage = t('网络异常，请检查您的网络连接是否正常');
      }

      if (errMessage) {
        toastMessage.info(errMessage, 3, () => {}, true);
        return Promise.reject(error);
      }
    } catch (error) {
      console.warn('@guolisec/request responseInterceptorsCatch error');
      throw new Error(error as unknown as string);
    }
    // 没有response，直接返回error
    if (!error.response) {
      return Promise.reject(error);
    }
    const checkStatusResponse = await checkStatus(error.response?.status, msg, {
      axiosInstance,
      error,
      skipFilterRequestMessage,
    });
    if (
      typeof checkStatusResponse === 'object' &&
      checkStatusResponse.type === 'success' &&
      checkStatusResponse.data !== void 0
    ) {
      return Promise.resolve(checkStatusResponse.data);
    } else {
      return Promise.reject(error);
    }
  },
};

const createAxios = (opt?: Partial<CreateAxiosOptions>) => {
  // 自定义配置项，下面的选项都可以在独立的接口请求中覆盖
  const requestOptions: Partial<RequestOptions> = {
    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    isReturnNativeResponse: false,
    // 需要对返回数据进行处理
    isTransformResponse: true,
    // post请求的时候添加参数到url
    joinParamsToUrl: false,
    // 格式化提交参数时间
    formatDate: true,
    // 消息提示类型
    errorMessageMode: 'message',
    // 接口地址
    apiUrl: getDefaultApiUrl,
    //  是否加入时间戳
    joinTime: false,
    // 忽略重复请求
    ignoreCancelToken: true,
    // 是否携带token
    withToken: true,
    retryRequest: {
      isOpenRetry: true,
      count: 5,
      waitTime: 100,
    },
    skipFilterRequestMessage: false,
  };
  return new VAxios(
    deepMerge(
      {
        // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
        // authentication schemes，e.g: Bearer
        // authenticationScheme: 'Bearer',
        authenticationScheme: '',
        timeout: 30 * 1000,
        // 基础接口地址
        // baseURL: globSetting.apiUrl,

        headers: { 'Content-Type': ContentTypeEnum.JSON },
        // 如果是form-data格式
        // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
        // 数据处理方式
        transform: clone(transform),
        // 序列化
        paramsSerializer: (params: Record<any, any>) => {
          return stringify(params, {
            arrayFormat: 'repeat',
          });
        },
        requestOptions,
      },
      opt || {}
    )
  );
};

const http = createAxios();

export { http };
