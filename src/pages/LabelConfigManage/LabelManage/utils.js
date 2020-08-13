// 获取pathCode
export function getPathCode(key, rawLabelCatalogData) {
  const { data = [] } = rawLabelCatalogData;
  const len = data.length;
  let tempPathCode = '';
  for (let i = 0; i < len; i += 1) {
    if (String(data[i].grpId) === String(key)) {
      tempPathCode = data[i].pathCode;
      break;
    }
  }
  return tempPathCode;
}
