/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-05-17 12:58:55
 * @path: \request\src\types\index.ts
 */
import type { AxiosInstance } from "axios";
import { RequestOptions } from "@guolisec/types";

interface RetryOption {
  axiosInstance: AxiosInstance;
  error: any;
  skipFilterRequestMessage: boolean;
}

declare module "axios" {
  interface InternalAxiosRequestConfig {
    requestOptions?: RequestOptions;
  }
}

export { type RetryOption };
