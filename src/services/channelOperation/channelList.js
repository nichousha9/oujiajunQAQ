import request from '@/utils/request';

// 查询渠道列表
export async function qryChannelByCondition(params) {
  return request('/channel/MccChannelController/qryListMccChannel', {
    method: 'POST',
    body: params,
  });
}

// 查询渠道项详情
export async function qryChannelDetailsById(params) {
  return request('/channel/MccChannelController/qryMccChannel', {
    method: 'POST',
    body: params,
  });
}

// 新增渠道项
export async function addChannel(params) {
  return request('/channel/MccChannelController/addMccChannel', {
    method: 'POST',
    body: params,
  });
}

// 修改渠道
export async function updateChannel(params) {
  return request('/channel/MccChannelController/updateMccChannel', {
    method: 'POST',
    body: params,
  });
}

// 删除渠道
export async function deleteChannel(params) {
  return request('/channel/MccChannelController/delMccChannel', {
    method: 'POST',
    body: params,
  });
}
