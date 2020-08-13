/* eslint-disable no-multi-assign */
/* eslint-disable no-useless-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable prefer-rest-params */
/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
/* eslint-disable no-shadow */
/* eslint-disable radix */
import moment from 'moment';
import lodash from 'lodash';
import { Modal } from 'antd';
import { resource } from './resource';
import { getUserInfo } from './userInfo';
import getSubMenuData from '../common/subMenu';

const showConfirm = Modal.confirm;

export const logoutUrl = '';

export const authResource = resource;
// 权限，根据当前按钮，页面的权限判断当前的是否有权限
export function hasResource(resourceValue, resourceArr) {
  // 当前的用户的权限
  let userAuthList = [];
  if (!resourceArr || !resourceArr.length) {
    const roleAuth = resourceArr || getUserInfo().roleAuthMap || {};
    userAuthList = Object.keys(roleAuth) || [];
  } else {
    userAuthList = resourceArr;
  }
  if (userAuthList && userAuthList.length > 0) {
    return userAuthList.filter((item) => item === resourceValue).length > 0;
  }
  return false;
}
// 确认提示框
export function confirm(title, content, okText = '确认', cancelText = '取消') {
  return new Promise((resolve, reject) => {
    showConfirm({
      title,
      content,
      okText,
      cancelText,
      onOk() {
        resolve();
      },
      onCancel() {
        reject();
      },
    });
  });
}
export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}
export function getHourByMills(mills) {
  const h = moment(mills).format('HH:mm');
  return h;
}
export function getDayByMills(mills, split = '/') {
  const date = moment(mills).format('MM-DD').split('-');
  const m = date[0];
  const d = date[1];
  const isStartZero = (time = '') => {
    if (time.indexOf('0') === 0) return time.substring(1);
    return time;
  };
  return `${isStartZero(m)}${split}${isStartZero(d)}`;
}
export function formatDatetime(mills) {
  if (!mills) return '_';
  return moment(mills).format('YYYY-MM-DD HH:mm:ss');
}
export function getMonmentByms(mills) {
  if (!mills) return moment();
  return moment(formatDatetime(mills));
}
export function formatTime(mills) {
  return moment(mills).format('HH:mm');
}
export function emptyAttr(obj = {}) {
  if (!obj) return {};
  const keyArr = Object.keys(obj) || [];
  keyArr.forEach((item) => {
    if (!obj[item]) obj[item] = '';
  });
  return obj;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  if (type === 'year') {
    const year = now.getFullYear();

    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
  }
}

export function getTimeForFmortat(type, timeArr, format = 'YYYY-MM-DD HH:mm:ss') {
  const now = new Date();
  const nowtime = now.getTime();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now).format(format), moment(nowtime).format(format)];
  }
  if (type === 'yesterday') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    const yesStart = moment(new Date(now).getTime() - 1 * oneDay).format(format);
    now.setHours(23);
    now.setMinutes(59);
    now.setSeconds(59);
    const yesEnd = moment(new Date(now).getTime() - 1 * oneDay).format(format);
    return [yesStart, yesEnd];
  }
  if (type === 'pastWeek') {
    // 过去七天
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [
      moment(new Date(now).getTime() - 7 * oneDay).format(format),
      moment(nowtime).format(format),
    ];
  }
  if (type === 'pastMonth') {
    // 过去30
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [
      moment(new Date(now).getTime() - 30 * oneDay).format(format),
      moment(nowtime).format(format),
    ];
  }
  if (type === 'custom') {
    const begin = new Date(timeArr[0]);
    const end = new Date(timeArr[1]);
    begin.setHours(0);
    begin.setMinutes(0);
    begin.setSeconds(0);
    end.setHours(23);
    end.setMinutes(59);
    end.setSeconds(59);
    return [
      moment(new Date(begin).getTime()).format(format),
      moment(new Date(end).getTime()).format(format),
    ];
  }
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach((node) => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟'],
  ];
  let num = Math.abs(n);
  let s = '';
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(num * 10 * 10 ** index) % 10] + item).replace(/零./, '');
  });
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return s
    .replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整');
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  } else if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    let isAdd = false;
    // 是否包含
    isAdd = renderArr.every((item) => getRelation(item, routes[i]) === 3);
    // 去重
    renderArr = renderArr.filter((item) => getRelation(item, routes[i]) !== 1);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    (routePath) => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map((item) => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map((item) => {
    const exact = !routes.some((route) => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;

export function isUrl(path) {
  return reg.test(path);
}

// 把时间戳转换成 hh:mm:ss格式
export function getTimeFormat(time) {
  let avgHour;
  const hour = parseInt(time / (1000 * 60 * 60));
  if (hour === 0 || hour < 10) {
    avgHour = `0${hour}`;
  } else {
    avgHour = hour;
  }
  let avgMinu;
  const minu = parseInt((time % (1000 * 60 * 60)) / (1000 * 60));
  if (minu === 0 || minu < 10) {
    avgMinu = `0${minu}`;
  } else {
    avgMinu = minu;
  }
  let avgSec;
  const sec = parseInt((time % (1000 * 60)) / 1000);
  if (sec === 0 || sec < 10) {
    avgSec = `0${sec}`;
  } else {
    avgSec = sec;
  }
  return `${avgHour}:${avgMinu}:${avgSec}`;
}
// 把时间戳转换成 XX小时XX分钟XX秒
export function getTimeStr(time) {
  let avgHour = '';
  const hour = parseInt(time / (1000 * 60 * 60));
  if (hour !== 0) {
    avgHour = `${hour}小时`;
  }
  let avgMinu = '';
  const minu = parseInt((time % (1000 * 60 * 60)) / (1000 * 60));
  if (minu !== 0) {
    avgMinu = `${minu}分钟`;
  }
  let avgSec;
  const sec = parseInt((time % (1000 * 60)) / 1000);
  if (sec !== 0) {
    avgSec = `${sec}秒`;
  } else {
    avgSec = '0';
  }
  return `${avgHour}:${avgMinu}:${avgSec}`;
}
// 与当前时间比较，过去了多久
export function getTimePass(date) {
  const now = new Date();
  let pass = now.getTime() - date;
  pass /= 1000;
  let unit = '秒';
  if (pass > 60) {
    pass /= 60;
    unit = '分';

    if (pass > 60) {
      pass /= 60;
      unit = '时';

      if (pass > 24) {
        pass /= 24;
        unit = '天';
      }
    }
  }

  pass = Math.abs(pass);
  return parseInt(pass) + unit;
}

// 文件下载的公用方法
export function createFileDown(content, fileName = 'file', fileType = 'xls') {
  const fileBlob = new Blob([content], { type: 'application/vnd.ms-excel' }); // 创建一个Blob对象
  const a = document.createElement('a');
  a.download = `${fileName}.${fileType}`;
  a.href = URL.createObjectURL(fileBlob);
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  a.remove();
}
// 街区字符串
export function commonSubString(stringData = '', index = 15) {
  return `${stringData.trim().substring(0, index)}...`;
}
// 根据当前的状态，获取相反转台
export function getSetAbleValueByIsenable(value) {
  // return value === 'enable' ? 'unable' : 'enable';
  return value === '1' ? '0' : '1';
}
// 获取当前状态
export function getBoolStatus(value) {
  // 当前是 '1' '0';
  if (value === '1') return true;
  return false;
}

// 将数组转成树
export function arrayToTree(array, id = 'id', pid = 'pid', children = 'children') {
  const data = lodash.cloneDeep(array) || [];
  const result = [];
  const hash = {};
  data.forEach((item, index) => {
    hash[data[index][id]] = data[index];
  });
  data.forEach((item) => {
    const hashVP = hash[item[pid]];
    if (hashVP) {
      // !hashVP[children] && (hashVP[children] = []);
      if (!hashVP[children]) {
        hashVP[children] = [];
      }
      hashVP[children].push(item);
    } else {
      result.push(item);
    }
  });
  return result;
}

// 分页查询数据处理
export function getPaginationList(response, payload = {}) {
  if (!response || !response.data) return {};
  return {
    list: Array.isArray(response.data.list) ? response.data.list.filter((n) => n) : [],
    pagination: {
      pageSize: payload.ps || response.data.pageSize || 10,
      current: response.data.pageNum,
      totalPages: response.data.pages,
      total: response.data.total,
    },
  };
}
// 默认图片
export function getDefaultUserLogo() {
  return 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
}
// 获取树节点所有父节点
export function getParentIdArr(id, arr = []) {
  if (!id) return null;
  const tmpObj = {};
  const loop = (curArr, parId) => {
    curArr.forEach((item) => {
      const { children, ...others } = item;
      tmpObj[item.id] = {
        arr: (parId ? tmpObj[parId].arr : []).concat([item.id]),
        ...others,
      };
      if (children) {
        loop(children, item.id);
      }
    });
  };

  loop(arr);
  return (tmpObj[id] || {}).arr || [];
}
// 获取树节点的所有子节点
export function getChildIdArr(id, arr = []) {
  if (!id) return null;
  const res = [];
  const curData = [];
  const loop = (id, arr) => {
    arr.forEach((item) => {
      if (item.id === id) {
        curData.push(item);
        return;
      }
      if (item.children) {
        loop(id, item.children);
      }
    });
  };
  loop(id, arr);
  const loopRes = (arr) => {
    arr.forEach((item) => {
      const { children } = item;
      if (item.id !== id) res.push(item.id);
      if (children) {
        loopRes(children);
      }
    });
  };
  loopRes(curData);
  return res;
}
// 设置树的禁用
export function setTreeDisabled(arr = [], disId) {
  const curData = [];
  const loop = (arr, disId) => {
    arr.forEach((item) => {
      if (disId.indexOf(item.id) !== -1) {
        item.disabled = true;
      } else {
        item.disabled = false;
      }
      if (item.children) {
        loop(item.children, disId);
      }
    });
  };
  loop(arr, disId);
  return curData;
}
// 获取树节点的一级父节点是否只有他一个子节点
export function oneChildChecked(id, arr, checked) {
  let curData = {};
  const loop = (id, arr) => {
    arr.forEach((item) => {
      if (item.children && item.children.length > 0) {
        const is = item.children.some((child) => {
          if (child.id === id) {
            curData = item;
          }
          return child.id === id;
        });
        if (!is) {
          loop(id, item.children);
        }
      }
    });
  };
  loop(id, arr);
  const { children } = curData;
  if (curData.id && children.length) {
    const checkedChild = children.filter((child) => {
      return checked.indexOf(child.id) > -1;
    });
    return !checkedChild.length ? curData.id : false;
  }
  return false;
}

export function getAllNodeOnlyOneChild(id, arr, checked) {
  const checkNode = [];
  const loop = (cur, treeData, checkedArr) => {
    const curParent = oneChildChecked(cur, treeData, checkedArr);
    if (curParent) {
      checkNode.push(curParent);
      loop(curParent, treeData, removSubArr(checkedArr, [curParent]));
    }
  };
  loop(id, arr, checked);
  return checkNode;
}

// 去除父数组里面的子数组
export function removSubArr(pArr, subArr) {
  if (pArr.length === 0) return [];
  if (subArr.length === 0) return pArr;
  return pArr.filter((item) => {
    return subArr.indexOf(item) < 0;
  });
}
// 数组去重
export function arrayDeweight(arr) {
  if (!arr || !arr.length) return [];
  return Array.from(new Set(arr));
}

// 给每一个有孩子的节点添加一个是自己的孩子（地区）
export function addNodeToChild(treeData) {
  if (!treeData || !treeData.length) return [];
  const loop = (tree) => {
    return tree.map((item) => {
      const { children } = item;
      if (!children || !children.length) {
        return { ...item, value: item.id, label: item.name };
      }
      const child = {
        value: item.id,
        label: '全部',
      };
      return {
        ...item,
        value: item.id,
        label: item.name,
        children: [child, ...loop(children)],
      };
    });
  };
  return loop(treeData);
}
// 过滤菜单的没有权限的
export function filterMenu(menuArr, auth = 'authId', roleAuthMap) {
  // 获取缓存中用户的信息
  const roleAuth = roleAuthMap || getUserInfo().roleAuthMap || {};
  const userAuthList = Object.keys(roleAuth) || [];
  return menuArr.filter((item) => {
    return userAuthList.indexOf(item[auth] || '') > -1;
  });
}

export function isSubMenu(pathname, newMenuArr, roleAuthMap) {
  const subMenuData = getSubMenuData('/system/summary');
  const subKeys = [];
  if (subMenuData) {
    subMenuData.forEach((v) => {
      if (v.children) {
        v.children.forEach((val) => {
          subKeys.push(val.key);
        });
      }
    });
  }
  let subMenu = false;
  newMenuArr.forEach((v) => {
    if (v.path === '/system/summary' && roleAuthMap[v.authId] && subKeys.indexOf(pathname) !== -1) {
      subMenu = true;
    }
  });
  return subMenu;
}

export function getOnlineMenu(menus) {
  const onLineMenus = menus.map((menu) => {
    if (menu.children.length) {
      Object.assign(menu, { children: getOnlineMenu(menu.children) });
    }
    const myMenu = {
      id: menu.id,
      name: menu.name,
      icon: menu.iconstr,
      path: menu.url,
      authId: menu.code,
      children: menu.children,
    };
    if (menu.url === '/system/summary') {
      Object.assign(myMenu, { className: 'menueFixedBottom' });
    }
    return myMenu;
  });
  return onLineMenus;
}

// 删除掉数组中空的
export function filterEmptyChild(treeData) {
  if (!treeData || !treeData.length) return [];
  const loop = function (Arr) {
    return Arr.map((item) => {
      if (!item.children) return item;
      if (!item.children.length) {
        delete item.children;
        return item;
      }
      item.children = loop(item.children);
      return item;
    });
  };

  return loop(treeData);
}
// 根据毫秒获取分钟
export function getMintByMs(ms) {
  if (!ms) return 0;
  return window.Number.parseInt(ms / 1000 / 60);
}
// 拿到今天的开始结束时间
export function getTodayStartEndTime() {
  const time = getTimeForFmortat('today');
  const starttime = new Date(time[0]).getTime() || '1527091200000';
  const endtime = new Date(time[1]).getTime() || '1527145200000';
  return {
    starttime,
    endtime,
    status: 0,
  };
}

export function getStatusClassName(status) {
  if (status === 'ready') return ['online', '在线'];
  if (status === 'notready') return ['offline', '离线'];
  return ['busy', '托管'];
}
export function getLayoutHeight(cutHeight = 400) {
  let clientHeight =
    window.innerHeight ||
    window.document.documentElement.clientHeight ||
    window.document.body.clientHeight;
  clientHeight -= cutHeight;
  clientHeight = Math.min(clientHeight, 680);
  return clientHeight;
}
/**
 * 对form装饰者进行通用配置
 * @param {*form组件传过来} getFieldDecorator
 * @param {*name} name
 * @param {*options} options
 */
export function getCommonFieldDecorator(getFieldDecorator, name, options) {
  return getFieldDecorator(name, {
    normalize: (value) => {
      return value && typeof value === 'string' ? value.trim() : value;
    },
    ...options,
  });
}
/**
 * 获取当前的屏幕高度
 */
export function getClientHeight() {
  const clientHeight =
    window.innerHeight || window.document.documentElement.clientHeight || window.document.body;
  return clientHeight;
}

// 防止头东的方法
export function debounce(fn, delay) {
  // 维护一个 timer
  let timer = null;

  return () => {
    // 通过 ‘this’ 和 ‘arguments’ 获取函数的作用域和变量
    const context = this;
    const args = arguments;

    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
}

// 获取第一个子元素
export function getTheFirstChild(data = [], child = 'list') {
  let firstChild = '';
  data.forEach((item) => {
    if (item[child] && !!item[child].length && !firstChild) {
      firstChild = item.list[0];
    }
    if (firstChild) return;
  });
  return firstChild;
}

// 生成uid
export function uuid(len, radix = 10) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  const uuidArr = [];
  let i;
  const newRadix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i += 1) uuidArr[i] = chars[0 | (Math.random() * newRadix)];
  } else {
    // rfc4122, version 4 form
    let r;

    // rfc4122 requires these characters
    uuidArr[8] = uuidArr[13] = uuidArr[18] = uuidArr[23] = '-';
    uuidArr[14] = '4';

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i += 1) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuidArr[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuidArr.join('');
}
