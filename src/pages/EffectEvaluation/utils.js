import moment from 'moment';

/**
 * 获取昨天日期
 *
 * @param date 传入今天的日期
 * @return {string} 返回昨天的日期，格式： YYYY-MM-DD
 */
function getYesterday(date) {
  return moment(date)
    .subtract(1, 'd')
    .format('YYYY-MM-DD');
}

/**
 * 获取一周的日期
 *
 * @param startDate 开始的日期
 * @return {[string]} 七天日期的字符串数组
 */
export function getWeekDate(startDate) {
  // 对开始日期格式化
  let nowDate = moment(startDate).format('YYYY-MM-DD');
  const arr = [nowDate];
  for (let i = 0; i < 3; i += 1) {
    nowDate = getYesterday(nowDate);
    arr.push(nowDate);
  }
  return arr;
}

/**
 * 生成某一范围内的随机数
 *
 * @param start 生成的最小值
 * @param end 生成的最大值
 * @return {number} 随机数
 */
export function createRandomNumber(start, end) {
  return parseInt(Math.random() * (end - start + 1) + start, 10);
}

/**
 * 获取占比率
 *
 * @param num 数量
 * @param total 总额
 * @param isSign 是否携带百分号,默认不携带
 * @return {string|number} 占比
 */
export function getRate(num, total, isSign = false) {
  const result = Math.round((num / total) * 100);
  return isSign ? `${result}%` : result;
}

export default {
  getWeekDate,
};
