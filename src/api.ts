import axios, { AxiosRequestConfig, Method } from 'axios';
import { each, isArray } from 'lodash-es';
import store from './store';

import { STATUS, STATUS_TEXT } from '@common/constants';

axios.interceptors.request.use(value => {
  if (value.method.toLocaleLowerCase() === 'get') {
    const newParams = {};
    const { params: old } = value;
    each(old, (val, key) => {
      newParams[key] = isArray(val) ? JSON.stringify(val) : val;
    });
    value.params = newParams;
  }
  return value;
}, (_: any) => { });

axios.interceptors.response.use(async response => {
  if (response.status !== 200) {
    console.error(response);
    return Promise.reject(response);
  }
  const { statusEnum, attachMsg } = response.data;
  if (statusEnum !== STATUS.OK) {
    // 其他都是异常
    console.error(response);
    return Promise.reject(`${STATUS_TEXT[statusEnum]}${attachMsg || ''}`);
  }
  // 请求正常
  return Promise.resolve(response.data.data);
}, error => {
  console.error(error);
  return Promise.reject(error);
});

const prefix = 'http://47.92.67.237:9001';

type CreateApi = {
  url: string;
  method?: Method;
  isPathApi?: boolean;
};

const createApi = (_: CreateApi) => <T = any>(data: Array<any> | any): Promise<T> => {
  const { url, method, isPathApi } = _;

  const requestBody: AxiosRequestConfig = {
    url: `${prefix}${url}`,
    method: method || 'get',
  };
  if (!isPathApi) {
    if (method && method.toLowerCase() === 'post') {
      requestBody.data = data;
    } else {
      requestBody.params = data;
    }
  } else {
    // data 一定是 string 或 Array<string>
    let queryPath: string = '';
    if (typeof data === 'string') {
      if (data[0] !== '/') {
        queryPath = `/${data}`;
      }
    } else {
      queryPath = `/${data.join('/')}`
    }
    requestBody.url = `${requestBody.url}${queryPath}`;
  }
  const projectStore = store.getState().project;
  if (projectStore.authHeaderKey) {
    requestBody.headers = {
      [projectStore.authHeaderKey]: projectStore.authHeaderValue
    };
  }
  return axios.request(requestBody);
};

export const LOGIN = createApi({ url: '/user/login/in', method: 'post' });
export const LOGOUT = createApi({ url: '/user/login/out', method: 'post' });
export const CHECK_SESSION = createApi({ url: '/user/login/getInfo', method: 'post' });

export const MODIFY_NORMAL_PASSWORD = createApi({ url: '/user/normal/modify', method: 'post' });
export const MODIFY_ADMIN_PASSWORD = createApi({ url: '/user/admin/modify', method: 'post' });

export const ADMIN_CREATE_NORMAL = createApi({ url: '/user/admin/add', method: 'post' });
export const ADMIN_MODIFY_NORMAL = createApi({ url: '/user/admin/modify', method: 'post' });
export const ADMIN_DELETE_NORMAL = createApi({ url: '/user/admin/delete', method: 'post' });

export const QUERY_ALL_USER = createApi({ url: '/user/get/all', isPathApi: true });
export const ADMIN_QUERY_SOME_USER = createApi({ url: '/user/get/some', isPathApi: true });

export const QUERY_ALL_ROOM_TYPE = createApi({ url: '/room/detail/all/get', isPathApi: true });

export const QUERY_ALL_ROOM = createApi({ url: '/room/all/get', isPathApi: true });

export const ADD_ROOM_TYPE = createApi({ url: '/room/detail/add', method: 'post' });
export const DELETE_ROOM_TYPE = createApi({ url: '/room/detail/delete', method: 'post' });