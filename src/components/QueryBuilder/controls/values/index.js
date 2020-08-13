/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/react-in-jsx-scope */
import TextEditor from './TextEditor';
import NumEditor from './NumEditor';
import TimeEditor from './TimeEditor';
import SelectEditor from './SelectEditor';
import DateTimeEditor from './DateTimeEditor';
import MonthEditor from './MonthEditor';
import PercentEditor from './PercentEditor';

const getEditor = props => {
  const { showShape } = props;
  let component = null;

  switch (showShape) {
    // 下拉框
    case 'combobox':
      component = <SelectEditor {...props} />;
      break;
    // 数字选择器
    case 'data-check':
      component = <NumEditor {...props} />;
      break;
    // 时间选择器
    case 'time-check':
      component = <TimeEditor {...props} />;
      break;
    // 日期选择器
    case 'date-check':
      component = <DateTimeEditor {...props} />;
      break;
    // 月份选择器
    case 'month-check':
      component = <MonthEditor {...props} />;
      break;
    // 百分比
    case 'percentage':
      component = <PercentEditor {...props} />;
      break;
    // 省份选择器
    case 'prov-select':
      component = <DateTimeEditor {...props} />;
      break;
    // 省份选择器
    case '城市选择器':
      component = <DateTimeEditor {...props} />;
      break;

    default:
      component = <TextEditor {...props} />;
      break;
  }

  return component;
};

export default getEditor;
