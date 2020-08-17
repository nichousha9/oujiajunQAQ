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
  if (obj instanceof Object) {
    newObj = {};
    Object.keys(obj).forEach(item => {
      const objChild = objToLowerCase(obj[item]);
      newObj[strToLowerCase(item)] = objChild;
    });
    return newObj || {};
  }
  if (obj instanceof Array) {
    newObj = [];
    obj.forEach(item => {
      const arrChild = objToLowerCase(item);
      newObj.push(arrChild);
    });
    return newObj || [];
  }
  newObj = obj;
  return newObj;
}

export { objToLowerCase };
