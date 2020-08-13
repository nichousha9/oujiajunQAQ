import request from '@/utils/request';

// 模板管理列表
export async function qryCamTempList(params) {
  return request('/campaign/MccCampaignController/qryCamTempList', {
    method: 'POST',
    body: params,
  });
}

// 模板状态管理
export async function updateCampaignState(params) {
  return request('/campaign/MccCampaignController/updateCampaignState', {
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
