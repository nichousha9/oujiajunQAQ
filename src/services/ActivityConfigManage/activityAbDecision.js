import request from '@/utils/request';

// 获取输出数据
export async function qryProcessCellName(params) {
  return request('/mccm/FlowChartProcess/pop/qryProcessCellName', {
    method: 'POST',
    body: params,
  });
}

// 获取上次保存数据
export async function getAbDetatil(params) {
  return request('/mccm/FlowChartProcess/AbDecisions/selectabDecisionContactDetatil', {
    method: 'POST',
    body: params,
  });
}

export async function getSeqList(params) {
  return request('/mccm/FlowChartProcess/AbDecisions/getSeqList', {
    method: 'POST',
    body: params,
  });
}

// 添加节点
export async function addProcess(params) {
  return request('/mccm/FlowChartProcess/AbDecisions/addProcess', {
    method: 'POST',
    body: params,
  });
}

// 编辑节点
export async function modProcess(params) {
  return request('/mccm/FlowChartProcess/AbDecisions/modProcess', {
    method: 'POST',
    body: params,
  });
}