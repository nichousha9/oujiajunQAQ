import request from '@/utils/request';

// 根据渠道 ID 查询运营位列表
export async function qryChannelOperationById(params) {
  return request('/mccm/dodmgr/MccChannelOperationController/qryChannelOperationByCondition', {
    method: 'POST',
    body: params,
  });
}

// 新增运营位项
export async function addChannelOperation(params) {
  return request('/mccm/dodmgr/MccChannelOperationController/addChannelOperation', {
    method: 'POST',
    body: params,
  });
}

// 修改运营位项详情
export async function updateChannelOperation(params) {
  return request('/mccm/dodmgr/MccChannelOperationController/updateChannelOperation', {
    method: 'POST',
    body: params,
  });
}

// 获取运营位详情
export async function qryChannelOperationDetail(params) {
  return request('/mccm/dodmgr/MccChannelOperationController/qryChannelOperationDetail', {
    method: 'POST',
    body: params,
  });
}

// 删除运营位
export async function deleteOperationBit(params) {
  return request('/mccm/dodmgr/MccChannelOperationController/deleteChannelOperation', {
    method: 'POST',
    body: params,
  });
}
