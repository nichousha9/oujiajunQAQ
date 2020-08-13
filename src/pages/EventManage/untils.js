// 获取数字字典
// @params attrSpecCode String || Array[String] 字典请求字段
export function getAttrValueByCode(dispatch, systemType = 'default', attrSpecCode) {
  const ACTION_TYPE = 'common/qryAttrValueByCode';

  if (typeof dispatch !== 'function') {
    return new Error('You should use connect() of dva');
  }
  if (typeof attrSpecCode === 'string') {
    return dispatch({
      type: ACTION_TYPE,
      payload: {
        attrSpecCode,
      },
      systemType,
    });
  }
  if (Array.isArray(attrSpecCode)) {
    return attrSpecCode.map(item => {
      return dispatch({
        type: ACTION_TYPE,
        payload: {
          attrSpecCode: item,
        },
        systemType,
      });
    });
  }

  return new Error(`Expected param: String or Array[String], but not.`);
}
