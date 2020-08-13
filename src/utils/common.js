/**
 * 将字符串转化为小驼峰
 * @param {*} str
 */
function strToLowerCase(str) {
  const lowerStr = str === str.toUpperCase() ? str.toLowerCase() : str;
  return lowerStr.replace(/_(\w)/g, (all, letter) => {
    return letter.toUpperCase();
  });
}
/**
 * 将对象/数组转化为小驼峰
 * @param {*} obj
 */
function objToLowerCase(obj) {
  let newObj;
  if (obj instanceof Array) {
    newObj = [];
    obj.forEach(item => {
      const arrChild = objToLowerCase(item);
      newObj.push(arrChild);
    });
    return newObj || [];
  }
  if (obj instanceof Object) {
    newObj = {};
    Object.keys(obj).forEach(item => {
      const objChild = objToLowerCase(obj[item]);
      newObj[strToLowerCase(item)] = objChild;
    });
    return newObj || {};
  }
  newObj = obj;
  return newObj;
}

// 驼峰转换下划线
function toLine(name, type) {
  if(type === 'upper') {
    return name.replace(/([A-Z])/g,"_$1").toUpperCase();
  }
  return name.replace(/([A-Z])/g,"_$1").toLowerCase();
}

/**
 * 将对象/数组转化为下划线
 * @param {*} obj
 * type为大小写
 */
function objToLineCase(obj, type = 'lower') {
  let newObj;
  if (obj instanceof Array) {
    newObj = [];
    obj.forEach(item => {
      const arrChild = objToLineCase(item, type);
      newObj.push(arrChild);
    });
    return newObj || [];
  }
  if (obj instanceof Object) {
    newObj = {};
    Object.keys(obj).forEach(item => {
      const objChild = objToLineCase(obj[item], type);
      newObj[toLine(item, type)] = objChild;
    });
    return newObj || {};
  }
  newObj = obj;
  return newObj;
}

// 获取字符串与utf-8编码比较字符大小
const getStrUtf8Length = (inputStr) => {
  if (inputStr.length < 17) {
    return true;
  }
  let totalLength = 0;
  /* 计算utf-8编码情况下的字符串长度 */
  for (let i = 0; i < inputStr.length; i += 1) {
    if (inputStr.charCodeAt(i) <= 0x7F) {
      totalLength += 1;
    }
    else if (inputStr.charCodeAt(i) <= 0x7FF) {
      totalLength += 2;
    }
    else if (inputStr.charCodeAt(i) <= 0xFFFF) {
      totalLength += 3;
    }
    else if (inputStr.charCodeAt(i) <= 0x1FFFFF) {
      totalLength += 4;
    }
    else if (inputStr.charCodeAt(i) <= 0x3FFFFFF) {
      totalLength += 5;
    }
    else {
      totalLength += 6;
    }
  }

  return totalLength
}

// 获取字符串与utf-8编码比较字符大小按大小转为字母
const strToUtf8Char = (inputStr) => {
  let totalLength = '';
  /* 计算utf-8编码情况下的字符串长度 */
  for (let i = 0; i < inputStr.length; i += 1) {
    if (inputStr.charCodeAt(i) <= 0x7F) {
      totalLength += 'a'; // 1个字符
    }
    else if (inputStr.charCodeAt(i) <= 0x7FF) {
      totalLength += 'bb'; // 2个字符
    }
    else if (inputStr.charCodeAt(i) <= 0xFFFF) {
      totalLength += 'ccc'; // 3个字符
    }
    else if (inputStr.charCodeAt(i) <= 0x1FFFFF) {
      totalLength += 'dddd'; // 4个字符
    }
    else if (inputStr.charCodeAt(i) <= 0x3FFFFFF) {
      totalLength += 'eeeee'; // 5个字符
    }
    else {
      totalLength += 'ffffff'; // 6个字符
    }
  }
  return totalLength
}

function setCookie(NameOfCookie, value, expiredays) {
  const ExpireDate = new Date();
  ExpireDate.setTime(ExpireDate.getTime() + (expiredays * 24 * 3600 * 1000));

  const myExpiredays = (expiredays == null) ? "" : `; expires=${ExpireDate.toGMTString()}`;
  document.cookie = `${NameOfCookie}=${escape(value)}${myExpiredays};Path=/`;
}

// 获取cookie值
function getCookie(NameOfCookie) {
  if (document.cookie.length > 0) {
    let begin = document.cookie.indexOf(`${NameOfCookie}=`);
    if (begin != -1) {
      // 说明存在我们的cookie.
      begin += NameOfCookie.length + 1;// cookie值的初始位置
      let end = document.cookie.indexOf(";", begin);// 结束位置
      if (end == -1) end = document.cookie.length;// 没有;则end为字符串结束位置
      return unescape(document.cookie.substring(begin, end));
    }
  }

  // cookie不存在返回null
  return null;
}

export { objToLowerCase, objToLineCase, getStrUtf8Length, strToUtf8Char, setCookie, getCookie };
