import request from '@/utils/request';

export async function qryProcessCellNameList(params) {
  return request('/mccm/FlowChartProcess/pop/qryProcessCellName', {
    method: 'POST',
    body: params,
  });
}

export async function qryTarGrpLebalRels(params) {
  return request('/mccm/marketmgr/mccTarGrp/qryTarGrpLebalRels', {
    method: 'POST',
    body: params,
  });
}

export async function qryTarGrp(params) {
  return request('/mccm/FlowChartProcess/setMgr/qryTarGrp', {
    method: 'POST',
    body: params,
  });
}

export async function addProcess(params) {
  return request('/mccm/FlowChartProcess/addProcess', {
    method: 'POST',
    body: params,
  });
}

export async function modProcess(params) {
  return request('/mccm/FlowChartProcess/modProcess', {
    method: 'POST',
    body: params,
  });
}
