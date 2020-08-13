import request from '@/utils/request';

// 查询算法目录
export async function qryAlgoFoldList(params) {
  return request('/mccm/marketmgr/campaign/AlgoModuleController/qryAlgoFoldList', {
    method: 'POST',
    body: params,
  });
}

// 查询算法列表
export async function qryAlgoModuleList(params) {
  return request('/mccm/marketmgr/campaign/AlgoModuleController/qryAlgoModuleList', {
    method: 'POST',
    body: params,
  });
}

// 获取干预规则配置
export async function qryMccIdeInterveneConf(params) {
  return request('/mccm/marketmgr/MccInterveneController/qryMccIdeInterveneConf', {
    method: 'POST',
    body: params,
  });
}

// 获取干预规则配置详情
export async function qryMccInterveneRule(params) {
  return request('/mccm/marketmgr/MccInterveneController/qryMccInterveneRule', {
    method: 'POST',
    body: params,
  });
}

// 添加节点
export async function addProcess(params) {
  return request('/mccm/FlowChartProcess/Ire/addProcess', {
    method: 'POST',
    body: params,
  });
}

// 编辑节点
export async function modProcess(params) {
  return request('/mccm/FlowChartProcess/Ire/modProcess', {
    method: 'POST',
    body: params,
  });
}

// 编辑节点
export async function qryMccAppAllInfo(params) {
  return request('/mccm/FlowChartProcess/Ire/qryMccAppAllInfo', {
    method: 'POST',
    body: params,
  });
}