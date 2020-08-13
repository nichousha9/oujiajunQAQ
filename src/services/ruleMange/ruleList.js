import request from '@/utils/request';

// 获取规则组列表数据
export async function queryRuleListsSource(params) {
  return request('/mccm/marketmgr/MccRulesGroupController/qryMccRulesGroupList', {
    method: 'POST',
    body: params,
  });
}

// 获取子规则列表数据
export async function queryChildRuleSource(params) {
  return request('/mccm/marketmgr/MccRulesGroupRelController/qryMccRulesGroupRelList', {
    method: 'POST',
    body: params,
  });
}

// 新增规则组
export async function addMccRulesGroup(params) {
  return request('/mccm/marketmgr/MccRulesGroupController/addMccRulesGroup', {
    method: 'POST',
    body: params,
  });
}

// 删除规则组
export async function delMccRulesGroup(params) {
  return request('/mccm/marketmgr/MccRulesGroupController/delMccRulesGroup', {
    method: 'POST',
    body: params,
  });
}

// 更新规则组
export async function updateRuleList(params) {
  return request('/mccm/marketmgr/MccRulesGroupController/editMccRulesGroup', {
    method: 'POST',
    body: params,
  });
}

// 新增子规则
export async function addMccRulesGroupRel(params) {
  return request('/mccm/marketmgr/MccRulesGroupRelController/addMccRulesGroupRel', {
    method: 'POST',
    body: params,
  });
}

// 删除子规则
export async function delMccRulesGroupRel(params) {
  return request('/mccm/marketmgr/MccRulesGroupRelController/delMccRulesGroupRel', {
    method: 'POST',
    body: params,
  });
}

// 更新子规则组
export async function updateChildRuleList(params) {
  return request('/mccm/marketmgr/MccRulesGroupRelController/editMccRulesGroupRel', {
    method: 'POST',
    body: params,
  });
}
