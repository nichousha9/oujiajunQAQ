import fetch from 'dva/fetch';
import { notification } from 'antd';
import { routerRedux } from 'dva/router';
import store from '../index';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  302: '登录超时，请重新登录',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '系统错误，请求失败',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
function obj2String(obj, arr = [], idx = 0) {
  for(const item in obj) {
    arr[idx++] = [item, obj[item]]
  }
  return new URLSearchParams(arr).toString()
}
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  if(response.status!==302){
      // notification.error({
      //   message: errortext,
      //   description: `请求错误 ${response.status}`,
      // });
   }

  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options,isJson) {
    // 这里方便测试

    if(!options.noTop){
      url = global.req_url + url;
    }
    // url = global.req_url + url;

  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    if (!(newOptions.body instanceof FormData)) {
      if (!isJson) {
        newOptions.headers = {
          // Accept: 'application/json',
          // 'Content-Type': 'application/json; charset=utf-8',
          ...newOptions.headers,
        };
        // 由于后台要求form参数，这里转成表单提交
        const formdata = new FormData();
        const body = newOptions.body
        for(const key in body){
            formdata.append(key, body[key]);
        }
        // 添加平台参数，区分新老版本
        formdata.append('platform', 'react');
        newOptions.body = formdata;
      } else {
        newOptions.headers = {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
          ...newOptions.headers,
        };
        newOptions.body = JSON.stringify(newOptions.body);
      }
      
    }else{
      // newOptions.body is FormData
      newOptions.headers = {
        // Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  } else if(newOptions.method === 'GET'){
    // get情况特殊处理
    const searchStr = obj2String(options.body);
    if (searchStr) {
      url += url.indexOf("?") > 0 ? searchStr: `?${searchStr}`;
    }
  }
  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => {
      if (newOptions.fetchType === 'file' || newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      const json = response.json()
      json.data = json.data || []// 设置默认值，防止报错
      return json;
    })
    .catch(e => {
      const { dispatch } = store;
      const status = e.name;
      
      const obj = { status: 'FAIL', msg: 'error', data: [] }// 空的返回
      if(status === 500){
        notification.error({
          message: codeMessage[status],
          description: `请求失败`,
        })
        return obj;
      }
      if (status === 401) {
        dispatch({
          type: 'login/logout',
        });
        return obj;
      }
      if (status === 302) {
        dispatch(routerRedux.push({
          pathname:'/user/login',
          query:{
            reloadCallBack: () => {
                // notification.error({
                //   message: codeMessage[status],
                //   description: `请求错误 ${status}`,
                // }) 
          },
          },
        }))
        return obj;
      }
      // if (status === 403) {
      //   dispatch(routerRedux.push('/exception/403'));
      //   return obj;
      // }
      // if ((status <= 504 && status >= 500) || status === 'TypeError') {
      //   dispatch(routerRedux.push('/exception/500'));
      //   return obj;
      // }
      // if (status >= 404 && status < 422) {
      //   dispatch(routerRedux.push('/exception/404'));
      // }
      return  obj;
    });
}
