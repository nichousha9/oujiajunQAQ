import request from '../utils/request';

// 新增租户
export async function addNewHirer(params) {
  return request('/smartim/tenant/save', {
    method: 'POST',
    body: params,
  }, true);
}

// 租户管理租户列表查询
export async function qryHirerList(params) {
  return request('/smartim/tenant/list', {
    method: 'POST',
    body: params,
  }, true);
}

// 删除租户
export async function deleteHirer(params) {
  return request('/smartim/tenant/delete', {
    method: 'POST',
    body: params,
  }, true);
}

// 查询租户详情
export async function qryHirerDetail(params) {
  return request('/smartim/tenant/detail', {
    method: 'POST',
    body: params,
  }, true);
}

// 修改租户
export async function updateHirer(params) {
  return request('/smartim/tenant/update', {
    method: 'POST',
    body: params,
  }, true);
}