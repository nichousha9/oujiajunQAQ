import request from '@/utils/request';

// 查询列表
export async function selectDispatchRules(params) {
  return request('/mccm/MccDispatchRulesController/selectDispatchRules', {
    method: 'POST',
    body: params,
  });
}
// 查看详情
export async function qryDispatchRules(params) {
  return request('/mccm/MccDispatchRulesController/qryDispatchRules', {
    method: 'POST',
    body: params,
  });
}

// 新增规则
export async function addDispatchRules(params) {
  return request('/mccm/MccDispatchRulesController/addDispatchRules', {
    method: 'POST',
    body: params,
  });
}

// 修改规则
export async function modDispatchRules(params) {
  return request('/mccm/MccDispatchRulesController/modDispatchRules', {
    method: 'POST',
    body: params,
  });
}

// 删除规则
export async function delDispatchRules(params) {
  return request('/mccm/MccDispatchRulesController/delDispatchRules', {
    method: 'POST',
    body: params,
  });
}
