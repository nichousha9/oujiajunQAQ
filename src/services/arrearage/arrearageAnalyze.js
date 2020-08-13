import request from '@/utils/request';

// 1. 地市欠费排名
export async function qryCityOweRank(params) {
  return request('/geekUnion/ZqythWidCustProdInfoMController/qryCityOweRank', {
    method: 'POST',
    body: params,
  });
}

// 2.欠费趋势
export async function qryOweTrend(params) {
  return request('/geekUnion/ZqythWidCustProdInfoMController/qryOweTrend', {
    method: 'POST',
    body: params,
  });
}

// 3. 大额欠费占比
export async function qryLargeOwePer(params) {
  return request('/geekUnion/ZqythWidCustProdInfoMController/qryLargeOwePer', {
    method: 'POST',
    body: params,
  });
}

// 4.行业产品分析
export async function qryProdTypeCompose(params) {
  return request('/geekUnion/ZqythWidCustProdInfoMController/qryProdTypeCompose', {
    method: 'POST',
    body: params,
  });
}

// 5.客户来源渠道分析
export async function qryProdChannelCompose(params) {
  return request('/geekUnion/ZqythWidCustProdInfoMController/qryProdChannelCompose', {
    method: 'POST',
    body: params,
  });
}

// 6. 欠费原因分析
export async function qryOweReasonCompose(params) {
  return request('/geekUnion/ZqythWidCustProdInfoMController/qryOweReasonCompose', {
    method: 'POST',
    body: params,
  });
}

// 7. 分析详情查询
export async function qryDetailsList(params) {
  return request('/geekUnion/ZqythWidCustProdInfoMController/qryDetailsList', {
    method: 'POST',
    body: params,
  });
}

// 7. 地图查询
export async function qryMap(params) {
  return request('/geekUnion/ZqythWidCustProdInfoMController/qryMap', {
    method: 'POST',
    body: params,
  });
}
