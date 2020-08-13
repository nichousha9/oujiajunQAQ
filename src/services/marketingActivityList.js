import request from '@/utils/request';

// 获取所有目录
export async function getMccFolderList(params) {
  return request('/campaign/MccBusiTypeController/qryCamBusiTypeTree', {
    method: 'POST',
    body: params,
  });
}

// 添加目录
export async function addMccFolder(params) {
  return request('/mccm/marketmgr/mccfolder/MccFolderController/addMccFolder', {
    method: 'POST',
    body: params,
  });
}

// 编辑目录
export async function updateMccFolder(params) {
  return request('/mccm/marketmgr/mccfolder/MccFolderController/updateMccFolder', {
    method: 'POST',
    body: params,
  });
}

// 删除目录
export async function delMccFolder(params) {
  return request('/mccm/marketmgr/mccfolder/MccFolderController/delMccFolder', {
    method: 'POST',
    body: params,
  });
}

// 获取活动列表
export async function getCampaignList(params) {
  return request('/campaign/MccCampaignController/qryCampaignPage', {
    method: 'POST',
    body: params,
  });
}

// 获取活动详情
export async function getCampaignparticulars(params) {
  return request('/campaign/MccCampaignController/qryCampaignBasic', {
    method: 'POST',
    body: params,
  });
}

// 删除活动接口
export async function delCampaign(params) {
  return request('/mccm/marketmgr/campaign/CampaignController/delCampaign', {
    method: 'POST',
    body: params,
  });
}

// 终止活动接口
export async function terminateCampaign(params) {
  return request('/mccm/marketmgr/campaign/CampaignController/terminateCampaign', {
    method: 'POST',
    body: params,
  });
}

// 暂停活动接口
export async function suspendCampaign(params) {
  return request('/campaign/MccCampaignController/updateCampaignState', {
    method: 'POST',
    body: params,
  });
}

// 还原活动接口
export async function resumeCampaign(params) {
  return request('/mccm/marketmgr/campaign/CampaignController/resumeCampaign', {
    method: 'POST',
    body: params,
  });
}

// 转为初始
export async function changeCampaignStateToEditing(params) {
  return request('/campaign/MccCampaignController/updateCampaignState', {
    method: 'POST',
    body: params,
  });
}

// 查询我批准的活动接口
export async function qryApprovalProcessedList(params) {
  return request('/mccm/marketmgr/campaign/CampaignController/qryApprovalProcessedList', {
    method: 'POST',
    body: params,
  });
}

// 查询活动状态
export async function qryAttrValueByCode(params) {
  return request('/system/attrSpecController/qryAttrValueByCode', {
    method: 'POST',
    body: params,
  });
}

// 一键发布活动接口
export async function toPubCamp(params) {
  return request('/campaign/MccCampaignController/updateCampaignState', {
    method: 'POST',
    body: params,
  });
}

// 活动发布不需要审核接口
export async function publishCampaignWithoutApproval(params) {
  return request('/mccm/marketmgr/campaign/CampaignController/publishCampaignWithoutApproval', {
    method: 'POST',
    body: params,
  });
}

// 判断是否需要审核接口
export async function judgeCampaignFromSms(params) {
  return request('/mccm/dmt/ApprovalRecordController/judgeCampaignFromSms', {
    method: 'POST',
    body: params,
  });
}

// 交接用户群查询接口
export async function qryHandoverUserList(params) {
  return request('/mccm/marketmgr/MccCampaignController/qryHandoverUserList', {
    method: 'POST',
    body: params,
  });
}

// 活动交接接口
export async function handoverCampaign(params) {
  return request('/mccm/marketmgr/MccCampaignController/handoverCampaign', {
    method: 'POST',
    body: params,
  });
}

//  活动复制
export async function copyCampaignInfo(params) {
  return request('/campaign/MccCampaignController/copyCampaignInfo', {
    method: 'POST',
    body: params,
  });
}

//  活动暂停
export async function shutdownJobByCamId(params) {
  return request('/firekylin-job/campaign/JobController/shutdownJobByCamId', {
    method: 'POST',
    body: params,
    pathPrefix: false,
  });
}

//  收回工单
export async function updContactArchiveByCamId(params) {
  return request('/campaign/MccCampaignController/updContactArchiveByCamId', {
    method: 'POST',
    body: params,
  });
}
