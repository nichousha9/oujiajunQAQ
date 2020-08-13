import request from '@/utils/request';

export async function qryGroupArrearageList(params) { 
  // return request('/geekUnion/ZqythWidCustProdInfoMController/qryCustOweList', {
  return request('/api/qryCustOweList', {
    method: 'POST',
    body: params,
  });
}


export async function qryOweInfo(params) { 
  // return request('/geekUnion/ZqythWidCustProdInfoMController/qryCustOweView', {
  return request('/api/qryCustOweView', {
    method: 'POST',
    body: params,
  });
}
