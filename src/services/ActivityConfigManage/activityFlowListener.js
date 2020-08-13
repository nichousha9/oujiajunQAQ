import request from '@/utils/request';

// 营销
export async function qryEventInputs(params) {
  return request('/mccm/dmt/EvtCatalogController/qryEventInputs', {
    method: 'POST',
    body: params,
  });
}

// 营销
export async function qryEvtEventInfos(params) {
  return request('/mccm/dmt/EvtCatalogController/qryEvtEventInfos', {
    method: 'POST',
    body: params,
  });
}

// 新增节点
export async function addProcess(params) {
  return request('/mccm/FlowChartProcess/Listener/addProcess', {
    method: 'POST',
    body: params,
  });
}

// 编辑节点
export async function modProcess(params) {
  return request('/mccm/FlowChartProcess/Listener/mod', {
    method: 'POST',
    body: params,
  });
}

// 查询监听页面的数据
export async function qryMccListener(params) {
  return request('/mccm/FlowChartProcess/Listener/qryMccListener', {
    method: 'POST',
    body: params,
  });
}