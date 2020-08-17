/*
通用的接口放在这里
 */

import request from '@/utils/request';

// 数字字典接口 attrSpecCode:'CAMPAIGN_BUSI_TYPE'
export async function qryAttrValueByCode(params) {
  return request('/mccm/system/attrSpecController/qryAttrValueByCode', {
    method: 'POST',
    body: params,
  });
}

// 登录
export async function getLogin(params) {
  return request('/mccm/system/LoginController/getLogin', {
    method: 'POST',
    body: params,
    // noTopCont: true,
  });
}

// 获取用户信息
export async function getLoginInfo(params) {
  return request('/mccm/system/LoginController/getLoginInfo', {
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
