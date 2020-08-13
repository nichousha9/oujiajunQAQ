import request from '@/utils/request';

export async function getSegmentGrp(params) {
  return request('/mccm/FlowChartProcess/SegmentProcess/getSegmentGrp', {
    method: 'POST',
    body: params
  });
}


export async function getProcessCellNameList(params) {
  return request('/mccm/FlowChartProcess/pop/qryProcessCellName', {
    method: 'POST',
    body: params
  });
}

export async function validateSql(params) {
  return request('/mccm/FlowChartProcess/SegmentProcess/validateSql', {
    method: 'POST',
    body: params,
  });
}

// 添加节点
export async function addProcess(params) {
  return request('/mccm/FlowChartProcess/addProcess', {
    method: 'POST',
    body: params,
  });
}

// 编辑节点
export async function modProcess(params) {
  return request('/mccm/FlowChartProcess/modProcess', {
    method: 'POST',
    body: params,
  });
}