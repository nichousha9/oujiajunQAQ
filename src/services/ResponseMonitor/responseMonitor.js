import request from '@/utils/request';

export async function qryAttrValueByCode(params) {
  return request('/system/attrSpecController/qryAttrValueByCode', {
    method: 'POST',
    body: params,
  });
}

export async function qryCellsList(params) {
  return request('/mccm/marketmgr/MccCellsController/qryCellsList', {
    method: 'POST',
    body: params,
  });
}

export async function qryReplyFulFill(params) {
  return request('/mccm/MccOfferFulfillController/qryReplyFulFillList', {
    method: 'POST',
    body: params,
  });
}

export async function qryMccReplyOfferReduControl(params) {
  return request('/mccm/MccOfferFulfillController/qryMccReplyOfferReduControl', {
    method: 'POST',
    body: params,
  });
}

export async function retryFailFulfill(params) {
  return request('/mccm/system/CampaignMonitorController/retryFailFulfill', {
    method: 'POST',
    body: params,
  });
}
