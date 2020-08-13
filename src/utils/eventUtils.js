/**
 * @description 事件绑定，兼容各浏览器
 * @param target 事件触发对象
 * @param type 事件
 * @param func 事件处理函数
 */
export function addEvent(target, type, func) {
  if (target.addEventListener) // 非ie 和ie9
    target.addEventListener(type, func, false);
  else
    target.attachEvent(`on${type}`, func);
}

/**
 * @description 事件移除，兼容各浏览器
 * @param target 事件触发对象
 * @param type 事件
 * @param func 事件处理函数
 */
export function removeEvent(target, type, func){
  if (target.removeEventListener)
    target.removeEventListener(type, func, false);
  else
    target.detachEvent(`on${type}`, func);
}

export function getLayoutHeight(width=300) {
  let clientHeight = window.innerHeight || window.document.documentElement.clientHeight || window.document.body.clientHeight;
  clientHeight -= width;
  clientHeight = Math.min(clientHeight, 680);
  return clientHeight;
}
