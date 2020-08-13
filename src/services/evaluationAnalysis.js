import request from '@/utils/request';

// 活动类别下拉
export async function qryCamType(params) {
  return request('/mccm/marketmgr/mccfolder/MccFolderController/qryCamType', {
    method: 'POST',
    body: params,
  });
}

// 活动列表
export async function getCampaignList(params) {
  return request('/campaign/MccCampaignController/getCampaignList', {
    method: 'POST',
    body: params,
  });
}

// 头部统计数据
export async function qryStateNum(params) {
  return request('/campaign/MccCampaignController/qryStateNum', {
    method: 'POST',
    body: params,
  });
}

// 活动对比
export async function qryCamCompartion(params) {
  return request('/campaign/MccCampaignController/qryCamCompartion', {
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

export async function qryMccJobPlanList(params) {
  return request('/job/mccJobPlanController/qryMccJobPlanList', {
    method: 'POST',
    body: params,
  });
}

export async function qryMccJobPlanDetail(params) {
  return request('/job/mccJobPlanController/qryMccJobPlanDetail', {
    method: 'POST',
    body: params,
  });
}

