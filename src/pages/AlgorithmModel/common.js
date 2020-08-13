// YYYY-MM-SS hh:mm:ss 转化为‘YYYYMMSShhmmss格式
function formatTime(originTimeStr) {
  return originTimeStr.replace(/(-|:| )/g, '');
}

export function getAlgorithmCode(item) {
  return `${formatTime(item.createTime)}${item.algoId}`;
}