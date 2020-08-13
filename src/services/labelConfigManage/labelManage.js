/* 
标签树的请求
标签列表的请求
 */

import request from '@/utils/request';

// 获取所有标签目录
export async function getMccLabelCatalogList(params) {
  return request('/marketmgr/labelMgr/MccLabelGrpController/getMccLabelCatalogList', {
    method: 'POST',
    body: params,
  });
}

// 新增标签目录
export async function addMccLabelCatalogInfo(params) {
  return request('/marketmgr/labelMgr/MccLabelGrpController/addMccLabelCatalogInfo', {
    method: 'POST',
    body: params,
  });
}

// 修改标签目录
export async function updateMccLabelCatalogInfo(params) {
  return request('/marketmgr/labelMgr/MccLabelGrpController/updateMccLabelCatalogInfo', {
    method: 'POST',
    body: params,
  });
}

// 删除标签目录
export async function delMccLabelCatalogInfo(params) {
  return request('/marketmgr/labelMgr/MccLabelGrpController/delMccLabelCatalogInfo', {
    method: 'POST',
    body: params,
  });
}

// 获取所有标签的列表
export async function getLabelInfoList(params) {
  return request('/marketmgr/labelMgr/MccLabelController/getLabelInfoList', {
    method: 'POST',
    body: params,
  });
}

// 获取标签宽表字段，根据宽表返回标签对应字段
export async function getLabelTableCodeField(params) {
  return request('/marketmgr/labelMgr/MccLabelController/getLabelTabelCodeField', {
    method: 'POST',
    body: params,
  });
}

// 新增标签
export async function addLabel(params) {
  return request('/marketmgr/labelMgr/MccLabelController/addLabel', {
    method: 'POST',
    body: params,
  });
}

// 更新标签
export async function updateLabel(params) {
  return request('/marketmgr/labelMgr/MccLabelController/updateLabel', {
    method: 'POST',
    body: params,
  });
}

// 获取标签详情
export async function queryLabelInfoById(params) {
  return request('/marketmgr/labelMgr/MccLabelController/queryLabelInfoById', {
    method: 'POST',
    body: params,
  });
}

// 移动标签在目录中的位置（批量移动也使用这个）
export async function batchMoveLabel(params) {
  return request('/marketmgr/labelMgr/MccLabelController/batchMoveLabel', {
    method: 'POST',
    body: params,
  });
}

// 删除标签
export async function delLabel(params) {
  return request('/marketmgr/labelMgr/MccLabelController/delLabel', {
    method: 'POST',
    body: params,
  });
}

// 批量删除标签
export async function batchDelLabel(params) {
  return request('/marketmgr/labelMgr/MccLabelController/batchDelLabel', {
    method: 'POST',
    body: params,
  });
}

// 修改标签的状态（上线/下线）
export async function modifyLabelStatusCd(params) {
  return request('/marketmgr/labelMgr/MccLabelController/modifyLabelStatusCd', {
    method: 'POST',
    body: params,
  });
}

// 批量下线标签
export async function batchModifyLabelStatusCd(params) {
  return request('/marketmgr/labelMgr/MccLabelController/batchModifyLabelStatusCd', {
    method: 'POST',
    body: params,
  });
}
