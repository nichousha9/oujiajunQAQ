import request from '@/utils/request';

// 输入
export async function qryProcessCellName(params) {
  return request('/mccm/FlowChartProcess/nextStage/qryProcessCellName', {
    method: 'POST',
    body: params,
  });
}

// 接触反馈
export async function qryResponseType(params) {
  return request('/mccm/FlowChartProcess/nextStage/qryResponseType', {
    method: 'POST',
    body: params,
  });
}

// 初始数据
export async function qryNextStageInfo(params) {
  return request('/mccm/FlowChartProcess/nextStage/qryNextStageInfo', {
    method: 'POST',
    body: params,
  });
}

// 新增nextStage流程
export async function addProcess(params) {
  return request('/mccm/FlowChartProcess/nextStage/addProcess', {
    method: 'POST',
    body: params,
  });
}

// 修改nextStage流程
export async function modProcess(params) {
  return request('/mccm/FlowChartProcess/nextStage/modProcess', {
    method: 'POST',
    body: params,
  });
}