import request from '@/utils/request';

// 查询干预规则组列表
export async function qryInterveneList (params) {
  return request('/mccm/marketmgr/MccInterveneController/qryMccIdeInterveneConf', {
    method: 'POST',
    body: params
  });
}

// 新增干预组
export async function addIntervene (params) {
  return request('/mccm/marketmgr/MccInterveneController/addMccIdeInterveneConf', {
    method: 'POST',
    body: params
  });
}

// 删除干预组
export async function delIntervene (params) {
  return request('/mccm/marketmgr/MccInterveneController/delMccIdeInterveneConf', {
    method: 'POST',
    body: params
  });
}

// 生效干预组
export async function effectiveIntervene (params) {
  return request('/mccm/marketmgr/MccInterveneController/effectiveMccIdeInterveneConf', {
    method: 'POST',
    body: params
  });
}

// 更新干预组
export async function updateIntervene (params) {
  return request('/mccm/marketmgr/MccInterveneController/updateMccIdeInterveneConf', {
    method: 'POST',
    body: params
  });
}

// 获取规则详情
export async function qryInterveneRule (params) {
  return request('/mccm/marketmgr/MccInterveneController/qryMccInterveneRule', {
    method: 'POST',
    body: params
  });
}

// 增加规则详情
export async function addInterveneRule (params) {
  return request('/mccm/marketmgr/MccInterveneController/addMccInterveneRule', {
    method: 'POST',
    body: params
  });
}

// 删除规则详情
export async function delInterveneRule (params) {
  return request('/mccm/marketmgr/MccInterveneController/delMccInterveneRule', {
    method: 'POST',
    body: params
  });
}

// 更新规则详情
export async function updateInterveneRule (params) {
  return request('/mccm/marketmgr/MccInterveneController/updateMccInterveneRule', {
    method: 'POST',
    body: params
  });
}