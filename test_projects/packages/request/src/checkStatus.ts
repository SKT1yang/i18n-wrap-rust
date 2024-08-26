/*
 * @name: Do not edit
 * @description: Do not edit
 */
import { message as toastMessage } from '@guolisec/toast';
import { retryRequestHanlder } from './axiosRetry';
import { emit } from '@guolisec/scheduler';
import { RetryOption } from './types';
import { filterRequestMessage } from './helper';
import { t } from './languages';

export async function checkStatus(
  status: number,
  msg: string,
  opt?: RetryOption
) {
  let errMessage = getHttpStatusMessage(status);

  switch (status) {
    case 400:
      errMessage = `${msg}`;
      break;
    // 第一次401会尝试刷新所有token（包括access_token和refresh_token），如果失败就退出并跳转到登录页面
    case 401:
      if (opt) {
        return await retryRequestHanlder(opt);
      }
      break;
  }

  if (status >= 500) {
    emit('logout', {
      data: getHttpStatusMessage(status),
    });
  }
  const finalMessage = filterRequestMessage(errMessage, {
    skip: Boolean(opt?.skipFilterRequestMessage),
  });
  if (finalMessage) {
    toastMessage.warning(finalMessage, undefined, undefined, true);
  }
}

function getHttpStatusMessage(httpStatus: number) {
  switch (httpStatus) {
    case 400:
      return t('客户端请求异常 400');
    case 401:
      return t('用户权限不足 401');
    case 403:
      return t('用户得到授权，但是访问是被禁止的');
    case 404:
      return t('网络请求错误，未找到该资源');
    case 405:
      return t('网络请求错误，请求方法未允许');
    case 408:
      return t('网络请求超时');
    case 500:
      return t('服务器错误，请联系管理员');
    case 501:
      return t('网络未实现');
    case 502:
      return t('系统重启中，请稍后再试');
    case 503:
      return t('服务不可用，服务器暂时过载或维护');
    case 504:
      return t('网络超时');
    case 505:
      return t('http版本不支持该请求');
    default:
      return '';
  }
}
