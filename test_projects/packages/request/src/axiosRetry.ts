/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-02-17 10:24:30
 * @path: \request\src\axiosRetry.ts
 */
import { AxiosError, AxiosInstance } from 'axios';
import { emit } from '@guolisec/scheduler';
import { RetryOption } from './types';
/**
 *  请求重试机制
 */

class AxiosRetry {
  /**
   * 重试
   */
  retry(axiosInstance: AxiosInstance, error: AxiosError) {
    const { config } = error.response;
    const { waitTime, count } = config?.requestOptions?.retryRequest;
    config.__retryCount = config.__retryCount || 0;
    if (config.__retryCount >= count) {
      return Promise.reject(error);
    }
    config.__retryCount += 1;
    //请求返回后config的header不正确造成重试请求失败,删除返回headers采用默认headers
    delete config.headers;
    config.headers = {
      Retry: 'retry',
    };
    return this.delay(waitTime).then(() => axiosInstance(config));
  }

  /**
   * 延迟
   */
  private delay(waitTime: number) {
    return new Promise((resolve) => setTimeout(resolve, waitTime));
  }
}

// 必须是公共临时变量，解决多包多版本等问题，只处理自己包的逻辑
let request401Count = 0;

declare global {
  // undefined: 初始状态;
  // 0：刷新失败；
  // 1：正在刷新；
  // 2：刷新成功；
  export var refreshStatus: undefined | 0 | 1 | 2;
}

type RetryRequestHanlderResponse =
  | {
      type: 'fail' | 'success';
      data?: any;
    }
  | undefined;

type ExecutorCallback = (
  value: RetryRequestHanlderResponse | PromiseLike<RetryRequestHanlderResponse>
) => void;

/**
 * 第一次401会尝试刷新所有token（包括access_token和refresh_token）并重试接口，如果失败就退出并跳转到登录页面
 * @param opt 重试接口配置
 * @param timeout 轮询频率
 */
async function retryRequestHanlder(
  opt: RetryOption,
  timeout = 500
): Promise<RetryRequestHanlderResponse> {
  try {
    request401Count += 1;
    return new Promise((resolve, reject) => {
      if (globalThis.refreshStatus === void 0) {
        // 第一个401请求，调用refreshLoginState接口尝试刷新token
        globalThis.refreshStatus = 1; // 切换状态到刷新中
        // 调用refreshLoginState
        refresh(resolve, reject, opt);
      } else if (globalThis.refreshStatus === 0) {
        // token刷新失败，啥也不干
        rejectFail(reject);
      } else if (globalThis.refreshStatus === 1) {
        // 还在刷新token中，轮询等待
        let countLimit = Math.floor(10000 / timeout); // 10s中内轮询次数最大值计算
        let count = 0;
        let timer = setInterval(() => {
          count += 1;
          // 优化：尝试10秒钟后，终止轮询
          if (count > countLimit) {
            finish();
          }
          if (globalThis.refreshStatus === undefined) {
            finish();
          }
          if (globalThis.refreshStatus === 0) {
            finish();
          }
          if (globalThis.refreshStatus === 2) {
            clearInterval(timer);
            retry(resolve, reject, opt);
          }
          function finish() {
            clearInterval(timer);
            rejectFail(reject);
          }
        }, timeout);
      } else if (globalThis.refreshStatus === 2) {
        // token刷新成功，直接重试接口
        retry(resolve, reject, opt);
      }
    });
  } catch (error) {
    console.error(`[@guolisec/request retryRequestHanlder 错误]:${error}`);
    tryInit();
    return {
      type: 'fail',
      data: error,
    };
  }
}

/**
 * 第一次刷新token动作
 * @param resolve
 * @param reject
 * @param opt
 */
function refresh(
  resolve: ExecutorCallback,
  reject: ExecutorCallback,
  opt: RetryOption
) {
  emit('refreshLoginState')
    .then(([isSuccess]) => {
      // 刷新成功
      if (isSuccess === true) {
        globalThis.refreshStatus = 2; // 切换状态到刷新成功
        retry(resolve, reject, opt);
      }
      // 刷新失败
      if (isSuccess === false) {
        globalThis.refreshStatus = 0; // 切换状态到刷新失败
        emit('logout', {
          data: undefined,
        }).finally(() => {
          globalThis.refreshStatus = void 0;
          rejectFail(reject);
        });
      }
      // 未获取到刷新结果
      if (isSuccess === void 0) {
        console.warn(`接口401,emit refreshLoginState失败,返回undefined`);
        globalThis.refreshStatus = 0; // 切换到初始状态
        rejectFail(reject);
      }
    })
    .catch((error) => {
      // 刷新token失败，直接退出
      console.error(`[request包,refreshLoginState刷新失败]:${error}`);
      globalThis.refreshStatus = 0; // 切换状态到刷新失败
      emit('logout', {
        data: undefined,
      }).finally(() => {
        globalThis.refreshStatus = void 0;
        rejectFail(reject);
      });
    });
}

/**
 * 接口重试
 * @param resolve
 * @param reject
 * @param opt
 * @param needInit
 */
async function retry(
  resolve: ExecutorCallback,
  reject: ExecutorCallback,
  opt: RetryOption,
  needInit = true
) {
  const retryRequest = new AxiosRetry();
  retryRequest
    .retry(opt.axiosInstance, opt.error)
    .then((response: any) => {
      resolve({
        type: 'success',
        data: response,
      });
    })
    .catch((error) => {
      if (error?.response?.status === 401) {
        globalThis.refreshStatus = void 0;
        emit('logout', {
          data: undefined,
        }).then(() => {
          return reject({
            type: 'fail',
          });
        });
      }
    })
    .finally(() => {
      needInit && tryInit();
    });
}

/**
 * 失败回调
 * @param reject
 */
function rejectFail(reject: ExecutorCallback) {
  reject({
    type: 'fail',
  });
  tryInit();
}

function tryInit() {
  request401Count += -1;
  if (request401Count === 0) {
    init();
  }
}

function init() {
  globalThis.refreshStatus = void 0;
  request401Count = 0;
}

export { AxiosRetry, retryRequestHanlder };
