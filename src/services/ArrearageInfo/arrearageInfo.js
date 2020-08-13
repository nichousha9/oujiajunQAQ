import request from '@/utils/request';

export async function qryArrearageList(params) {
  return request('/api/qryArrearageList', {
    method: 'POST',
    body: params,
  });
}

export async function qryAreaList(params) {
  return request('/api/qryAreaList', {
    method: 'POST',
    body: params,
  });
}

export async function downloadArrearsData(params) { 
  return request('/api/downloadArrearsData', {
    method: 'POST',
    body: params,
  });
}