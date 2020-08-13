
// 获取上几月
const getPrevMonth = (n) => {
  if(Number.isNaN(n)) {
    return ''
  }
  const date = new Date();
  date.setMonth(date.getMonth()-n);
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  month = (month < 10 ? `0${month}`:month);
  const sDate = (`${year.toString()}${month.toString()}`);
  return sDate
}

// 获取近三个月
const getNearThreeMonth = () => {
  const monthList = [];
  const eDate = getPrevMonth(0);
  monthList.push(eDate, getPrevMonth(1), getPrevMonth(2));
  return { monthList, monthNum: eDate }
}

export { getPrevMonth, getNearThreeMonth }