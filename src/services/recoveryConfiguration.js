import request from '../utils/request';

// 保存
export async function saveFunctionExample(params) {
  return request('/smartim/functionExample/saveFunctionExample', {
    method: 'POST',
    body: params,
  },true);
}
// 查询意图下配置信息
export async function getFunctionExampleByIntentId(params) {
  return request('/smartim/functionExample/getFunctionExampleByIntentId', {
    method: 'POST',
    body: params,
  });
}
// 删除意图下回复配置
export async function deleteFunctionExampleByIntentId(params) {
  return request('/smartim/functionExample/deleteFunctionExampleByIntentId', {
    method: 'POST',
    body: params,
  },true);
}

// 获取用户下的回复配置查询类型和共用的回复配置查询类型
export async function getFunctionType(params) {
  return request('/smartim/functionType/getFunctionType', {
    method: 'POST',
    body: params,
  },true);
}
// 测试数据库连接
export async function testConnectDB(params) {
  return request('/smartim/DBSearchConf/testConnectDB', {
    method: 'POST',
    body: params,
  },true);
}
// 获取所有表
export async function getTables(params) {
  return request('/smartim/DBSearchConf/getTables', {
    method: 'POST',
    body: params,
  },true);
}
// 获取表所有字段
export async function getTableColumns(params) {
  return request('/smartim/DBSearchConf/getTableColumns', {
    method: 'POST',
    body: params,
  },true);
}

// 获取图谱列表
export async function getKgList(params) {
  return request('/smartim/kg/getKgList', {
    method: 'POST',
    body: params,
  },true);
}

// 获取概念列表
export async function getConceptList(params) {
  return request('/smartim/kg/getConceptList', {
    method: 'POST',
    body: params,
  },true);
}

// 获取属性列表
export async function getAttrList(params) {
  return request('/smartim/kg/getAttrList', {
    method: 'POST',
    body: params,
  },true);
}

// 获取实体列表
export async function getEntityList(params) {
  return request('/smartim/kg/getEntityList', {
    method: 'POST',
    body: params,
  },true);
}

// 接口查询测试连接
export async function interfaceTest(params) {
  return request('/smartim/interCall/interfaceTest', {
    method: 'POST',
    body: params,
  });
}

export async function getSonDicsByPcode(params) {
  return request('/smartim/sysDict/getSonDicsByPcode', {
    method: 'POST',
    body: params,
  });
}