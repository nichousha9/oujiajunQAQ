import request from '@/utils/request';

// 工单列表
export async function qryContactList(params) {
  return request('/cammgr/contact/MccContactController/qryContactList', {
    method: 'POST',
    body: params,
  });
}

// 活动列表

export async function qryCampaignPage(params) {
  return request('/campaign/MccCampaignController/qryCampaignPage', {
    method: 'POST',
    body: params,
  });
}

// 工单类型
export async function qryCamBusiTypeTree(params) {
  return request('/campaign/MccBusiTypeController/qryCamBusiTypeTree', {
    method: 'POST',
    body: params,
  });
}

// 工单详情
export async function qryContactDetail(params) {
  return request('/cammgr/contact/MccContactController/qryContactDetail', {
    method: 'POST',
    body: params,
  });
}
