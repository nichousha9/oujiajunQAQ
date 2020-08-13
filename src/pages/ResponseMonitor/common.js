// 对象数组属性值拼接字符串
export function fieldToStr(array, fieldName, splitChar) {
  const str = array.map(item => {
    return item[fieldName];
  }).join(splitChar);
  
  return str;
}

export const commonColLayout ={
  md: {
    span: 8,
  },
  sm: {
    span: 24
  }
}

export const commonFormItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};