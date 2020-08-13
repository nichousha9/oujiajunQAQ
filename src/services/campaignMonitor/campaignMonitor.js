import request from '@/utils/request';

// 获取商品推荐监控列表查询
export async function qryFeedBackDataLog(params) {
  return request('/mccm/FeedBackDataLogController/qryFeedBackDataLog', {
    method: 'POST',
    body: params,
  });
}

// 返回数量列表
export async function qryFeedBackDataLogDtl(params) {
  return request('/mccm/FeedBackDataLogController/qryFeedBackDataLogDtl', {
    method: 'POST',
    body: params,
  });
}

// 获取运营位列表数据
export async function qryChannelOperationList(params) {
  return request('/mccm/dodmgr/MccChannelOperationController/qryChannelOperationByCondition', {
    method: 'POST',
    body: params,
  });
}

// 获取规则组列表数据
export async function qryMccRulesGroupList(params) {
  return request('/mccm/marketmgr/MccRulesGroupController/qryMccRulesGroupList', {
    method: 'POST',
    body: params,
  });
}

// 获取活动目录 所有目录
export async function getMccFolderList(params) {
  return request('/campaign/MccBusiTypeController/qryCamBusiTypeTree', {
    method: 'POST',
    body: params,
  });
}

// 获取活动列表数据
export async function getCampaignList(params) {
  return request('/campaign/MccCampaignController/getCampaignList', {
    method: 'POST',
    body: params,
  });
}
