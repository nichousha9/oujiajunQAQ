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
