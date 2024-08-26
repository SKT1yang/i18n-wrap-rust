/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-02-03 10:26:21
 * @path: \glsec\packages\request\src\constants.ts
 */
/**
 * @description: Request result set
 */
export enum ResultEnum {
  SUCCESS = 200,
  SUCCESS204 = 204,
  SUCCESS201 = 201,
  ERROR = 1,
  TIMEOUT = 401,
  TYPE = 'success',
}

/**
 * @description: request method
 */
export enum RequestEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

/**
 * @description: contentType
 */
export enum ContentTypeEnum {
  // json
  JSON = 'application/json;charset=UTF-8',
  // form-data qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  // form-data  upload
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
}
