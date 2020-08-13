/*
通用的接口放在这里
 */

import request from '@/utils/request';

// 数字字典接口 attrSpecCode:'CAMPAIGN_BUSI_TYPE'
export async function qryAttrValueByCode(params, systemType = 'default') {
  // 不同系统走不同的静态数据接口
  const typeToUrl = {
    default: '/firekylin-service/system/attrSpecController/qryAttrValueByCode',
    event: '/evt-service/evt/system/attrSpecController/qryAttrValueByCode',
  };

  return request(typeToUrl[systemType], {
    method: 'POST',
    body: params,
    pathPrefix: false,
  });
}

// 登录
export async function getLogin(params) {
  return request('/system/LoginController/getLogin', {
    method: 'POST',
    body: params,
    // noTopCont: true,
  });
}

// 获取用户信息
export async function getLoginInfo(params) {
  return request('/system/LoginController/getLoginInfo', {
    method: 'POST',
    body: params,
    noTopCont: true,
  });
}

// 退出登录
export async function getLogout(params) {
  return request('/mccm/system/LoginController/getLogout', {
    method: 'POST',
    body: params,
  });
}

// 获取活动目录
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

export async function updateSession(params) {
  return request('/system/LoginController/updateSaasSession', {
    method: 'POST',
    body: params,
  });
}
