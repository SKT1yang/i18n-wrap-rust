/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-02-03 10:26:21
 * @path: \feature-vue\platform\front\types\src\request.ts
 */
import { MessageMode } from "./constant";

export interface RequestOptions {
  // Splicing request parameters to url
  joinParamsToUrl?: boolean;
  // Format request parameter time
  formatDate?: boolean;
  // Whether to process the request result
  isTransformResponse?: boolean;
  // Whether to return native response headers
  // For example: use this attribute when you need to get the response headers
  isReturnNativeResponse?: boolean;
  // Interface address, use the default apiUrl if you leave it blank
  apiUrl?: string | (() => string);
  // Error message prompt type
  errorMessageMode?: MessageMode;
  // Whether to add a timestamp
  joinTime?: boolean;
  ignoreCancelToken?: boolean;
  // Whether to send token in header
  withToken?: boolean;
  retryRequest?: {
    isOpenRetry: boolean;
    count: number;
    waitTime: number;
  };
  //是否过滤后端消息（checkStatus，错误消息大于20且中文占比小于50%自动过滤不显示）
  skipFilterRequestMessage?: boolean;
}

export interface RequestResult<T = any> {
  success: boolean;
  data?: T;
  errCode?: number;
  errMessage?: string;
  // 非标准结构但是包含消息，做特殊处理
  message?: string;
  errMsg?: string;
  error?: {
    message: string;
  };
}

// 分页表格统一返回字段
export interface DataListResult<T = any> {
  content: T[];
  totalElements: number;
  numberOfElements?: number;
  totalPages?: number
}
