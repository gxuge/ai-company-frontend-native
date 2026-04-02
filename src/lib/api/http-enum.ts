export enum ResultEnum {
  SUCCESS = 0,
  HTTP_SUCCESS = 200,
  TIMEOUT = 401,
}

export enum RequestEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

export enum ContentTypeEnum {
  JSON = 'application/json;charset=UTF-8',
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
}

export enum ConfigEnum {
  TOKEN = 'X-Access-Token',
  VERSION = 'X-Version',
}
