import request from '@/utils/request';

export async function qryProcess(params) {
  return request('/mccm/marketmgr/mccProcess/qryProcess', {
    method: 'POST',
    body: params,
  });
}

export async function addProcess(params) {
  return request('/mccm/FlowChartProcess/directBonus/addProcess', {
    method: 'POST',
    body: params,
  });
}

export async function modProcess(params) {
  return request('/mccm/FlowChartProcess/directBonus/modProcess', {
    method: 'POST',
    body: params,
  });
}

// 商品数量限制
export async function qryMccListenerInjection(params) {
  return request('/mccm/marketmgr/MccDirectInjectionController/qryMccListenerInjection', {
    method: 'POST',
    body: params,
  });
}
