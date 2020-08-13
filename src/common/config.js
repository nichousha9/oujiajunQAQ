/* eslint-disable no-underscore-dangle */

// 开发环境
global._dev = process.env.NODE_ENV === 'development';

// global.req_url = global._dev ?'http://10.45.54.82:8091':''
// global.req_url = global._dev ? 'http://172.21.64.60:8093' : '';
global.req_url = global._dev ? ' http://172.21.72.161:8018/smartim-service' : '';
// global.req_url = global._dev ? 'http://10.45.47.68:9091' : ''
// global.req_url = global._dev ? 'http://10.45.47.67:8092' : ''
// global.req_url = global._dev ? 'http://10.45.54.223:8091' : ''
// global.req_url = global._dev ? 'http://192.168.2.160:8091' : ''
// global.req_url = global._dev ? 'http://10.45.64.188:8091' : ''
// global.req_url = global._dev ? 'http://134.192.232.89:12392' : ''
// global.req_url = global._dev ? 'http://192.168.155.3:8091' : ''
// global.req_url = global._dev ? 'http://172.27.35.6:8091' : ''
// global.req_url = global._dev ? 'http://10.45.54.233:8091' : ''
// global.req_url = global._dev ? 'http://10.45.47.68:8091' : ''
// global.req_url = global._dev ? 'http://10.45.55.80:8091' : ''
// global.req_url = global._dev?'http://localhost:8091':'';
// global.req_url = global._dev?'http://192.168.2.160:8091':'';
// global.req_url = global._dev?'http://172.22.239.3:8091':'';
// global.req_url = global._dev?'http://10.45.54.31:8091':'';
// global.req_url = global._dev?'https://easy-mock.com/mock/5aec47d92880ac6e857945d3/example':'';
// global.req_url = global._dev ? 'http://localhost:8091':'';
global.im_url = global._dev ? global.req_url : location.origin;

// global.socket_url = global._dev ? 'http://10.45.54.235:9081':''
// global.socket_url = global._dev ? 'http://localhost:9081':''
global.socket_url = global._dev ? 'ws://10.45.47.16:8095' : '';
// global.socket_url = global._dev ? 'http://localhost:9081':''
