/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import moment from 'moment';
import { extend } from 'umi-request';
import { notification } from 'antd';
import router from 'umi/router';

const SERVER_PATH = '/firekylin-service';
// const SERVER_PATH = '/system-web';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
/**
 * 异常处理程序
 */

const errorHandler = error => {
  const { response } = error;

  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  }
};
/**
 * 配置request请求时的默认参数
 */

const request = extend({
  errorHandler,
  // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  }, // 请求头
});

/*
添加请求的拦截器
noTopCont:请求中是否需要携带topCont参数，默认携带
pathPrefix: 是否加上 SERVER_PATH 路径前缀
 */
request.interceptors.request.use((url, options) => {
  const { body = {}, noTopCont = false, pathPrefix = true } = options;
  const { otherTopCont, ...params } = body;
  return {
    url: pathPrefix ? `${SERVER_PATH}${url}` : url,
    options: {
      ...options,
      data: noTopCont
        ? params
        : {
            topCont: {
              appChl: '',
              reqTime: moment().format('YYYY-MM-DD HH:mm:ss'),
              appSecret: '',
              version: 'V1.0',
              svcCode: '',
              ...otherTopCont
            },
            svcCont: {
              ...params,
            },
          },
    },
  };
});

// 添加响应的拦截器
request.interceptors.response.use(async response => {
  const data = await response.clone().json();
  // const { url } = response;
  // if (data && data.topCont && data.topCont.resultCode != 0) {
  //   notification.error({
  //     message: `请求错误${url}`,
  //     description: data.topCont.remark,
  //   });

  //   return false;
  // }
  if (data && data.topCont && data.topCont.resultCode == '-2') {
    if(window.isSso) {
      notification.error({
        message: '登录超时',
        description: '请重新登录',
      });
      window.parent.postMessage("{action:'toLogin'}", '*');
    }
    else {
      router.push({
        pathname: '/login',
      });
    }
  }
  return response;
});

export default request;
