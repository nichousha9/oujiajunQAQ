/* 
标签关联度列表的请求
 */

import request from '@/utils/request';

// 获取标签关联度列表
export async function getMccLabelRelsList(params) {
  return request('/mccm/marketmgr/labelMgr/MccLabelRelsController/getMccLabelRelsList', {
    method: 'POST',
    body: params,
  });
}

// 新增标签关联度
export async function addMccLabelRelsInfo(params) {
  return request('/mccm/marketmgr/labelMgr/MccLabelRelsController/addMccLabelRelsInfo', {
    method: 'POST',
    body: params,
  });
}

// 更新标签关联度
export async function updateMccLabelRelsInfo(params) {
  return request('/mccm/marketmgr/labelMgr/MccLabelRelsController/updateMccLabelRelsInfo', {
    method: 'POST',
    body: params,
  });
}

// 获取标签关联度详细信息
export async function queryMccLabelRelsById(params) {
  return request('/mccm/marketmgr/labelMgr/MccLabelRelsController/queryMccLabelRelsById', {
    method: 'POST',
    body: params,
  });
}

// 删除标签关联度
export async function delMccLabelRels(params) {
  return request('/mccm/marketmgr/labelMgr/MccLabelRelsController/delMccLabelRels', {
    method: 'POST',
    body: params,
  });
}

// 获取标签值规格列表
export async function getMccLabelValueList(params) {
  return request('/mccm/marketmgr/labelMgr/MccLabelValueController/getMccLabelValueList', {
    method: 'POST',
    body: params,
  });
}
