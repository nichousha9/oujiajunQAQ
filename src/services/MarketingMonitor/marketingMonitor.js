import request from '@/utils/request';

// 营销活动批次列表
export async function queryBatchDetailInfo(params) { 
  // return request('/api/qryBatchDetailInfo', {
  return request('/campaign/MccCampaignController/campaignListener', {
    method: 'POST',
    body: params
  });
}

export async function qryProcessTypeByContact(params) { 
  return request('/mccm/system/CampaignMonitorController/qryProcessTypeByContact', {
    method: 'POST',
    body: params
  });
}

export async function qryBatchCellDetailInfo(params) {
  // return request('/api/qryBatchCellDetailInfo', {
  return request('/mccm/system/CampaignMonitorController/qryBatchCellDetailInfo', {
    method: 'POST',
    body: params
  });
}

// 查询联系详情 SysUtilAction.getTopCont()
export async function qryMccContactInfo(params) { 
  // return request('/api/qryContactInfo', {
  return request('/mccm/system/CampaignMonitorController/qryMccContactInfo', {
    method: 'POST',
    body: params
  });
}

// 查询赠送详情 SysUtilAction.getTopCont()
// export async function qryMccGiftInfo(params) { 
//   return request('/mccm/system/CampaignMonitorController/qryMccGiftInfo', {
//     method: 'POST',
//     body: params
//   });
// }

// 查询推送消息 SysUtilAction.getTopCont(); 错误信息
export async function qryMessageInfo(params) { 
  //  return request('/api/qryMessageInfo', {
  return request('/mccm/system/CampaignMonitorController/qryMessageInfo', {
    method: 'POST',
    body: params
  });
}

// 查询批次创意和商品 SysUtilAction.getTopCont()
export async function qryCreativeAndOffer(params) {
  // return request('/api/qryOffer', {
  return request('/mccm/system/CampaignMonitorController/qryCreativeAndOffer', {
    method: 'POST',
    body: params
  });
}

// 查询用户标签 无数据
export async function qrySubExtendList(params) {
  // return request('/api/qrySubExtendList', {
  return request('/mccm/marketmgr/SubExtendController/getSubExtendList', {
    method: 'POST',
    body: params
  });
}

// 查询测试的批次对象表数据 SysUtilAction.getTopCont()
export async function qryMemberTableInfoByTest(params) {
  // return request('/api/qryMemberList', {
  return request('/mccm/system/CampaignMonitorController/qryMemberTableInfoByTest', {
    method: 'POST',
    body: params
  });
}

// 查询批次对象表数据
export async function qryMemberTableInfo(params) {
  // return request('/api/qryMemberList', {
  return request('/mccm/system/CampaignMonitorController/qryMemberTableInfo', {
    method: 'POST',
    body: params
  });
}

export async function qryAdviceChannel(params) {
  return request('/mccm/dmt/AdviceTypeController/qryAdviceChannel', {
    method: 'POST',
    body: params
  });
}

