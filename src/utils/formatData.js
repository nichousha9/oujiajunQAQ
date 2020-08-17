// 处理树结构数据(铺开数据类型的)
// 以parentId判断是否是一级以及父子关系
const formatTree = (data, parentId = 'parentId', idName = 'id', labelName = 'name') => {
  const treeObj = {};
  const newArr = [];
  function findChild(arr) {
    arr.forEach(item => {
      const current = item;
      const children = treeObj[item[idName]] || [];
      current.children = children;
      if (children && children.length > 0) {
        findChild(children);
      }
    });
  }
  if (data && data.length > 0) {
    data.forEach(item => {
      const itemObj = {
        key: item[idName],
        title: item[labelName],
        ...item,
      };
      if (!item[parentId]) {
        // 目录菜单
        newArr.push(itemObj);
      } else if (treeObj[item[parentId]]) {
        treeObj[item[parentId]].push(itemObj);
      } else {
        treeObj[item[parentId]] = [itemObj];
      }
    });
  }
  findChild(newArr);

  return newArr;
};

/*
 * JSON数组去重
 * @param: [array] json Array
 * @param: [string] 唯一的key名，根据此键名进行去重
 */
const uniqueArray = (array, key) => {
  let result = [];
  if (array && array.length === 1) {
    return array;
  }
  for (let i = 1; i < array.length; i += 1) {
    result = [array[0]];
    const item = array[i];
    let repeat = false;
    for (let j = 0; j < result.length; j += 1) {
      if (item[key] == result[j][key]) {
        repeat = true;
        break;
      }
    }
    if (!repeat) {
      result.push(item);
    }
  }
  return result;
};

export { formatTree, uniqueArray };
