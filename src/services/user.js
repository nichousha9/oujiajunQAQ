import request from '../utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrentED() {
  return request('/api/currentUser');
}

// 用户在线状态切换
export async function changeStatus(params) {
  return request('/smartim/agent/agentstatus/update', {
    method: 'POST',
    body: params,
  });
}
// 当前用户查询
export async function queryCurrent(params) {
  return request('/smartim/cs/getLoginInfo', {
    method: 'POST',
    body: params,
  });
}
// 获取用户权限菜单
export async function selectStaffMenus(params) {
  return request('/smartim/system/roles/auth/authTree', {
    method: 'POST',
    body: params,
  });
}

// 校验用户密码
export async function validatePassword(params) {
  return request('/smartim/cs/validatePWd', {
    method: 'POST',
    body: params,
  });
}
// 更新密码
export async function editPassword(params) {
  return request('/smartim/cs/updatePWd', {
    method: 'POST',
    body: params,
  });
}
// 查询用户信息
// export async function getCurrentInfo(params) {
//   return request('/smartim/cs/info', {
//     method: 'POST',
//     body: params,
//   });
// }
// 用户信息修改
export async function modifyCurrentInfo(params) {
  return request('/smartim/system/users/updateUserInfo', {
    method: 'POST',
    body: params,
  });
}
// 获取租户列表
export async function getUserOwer(params) {
  return request('/smartim/cs/ower', {
    method: 'POST',
    body: params,
  });
}
// 新增租户
export async function addUserOwer(params) {
  return request('/smartim/tenant/add', {
    method: 'POST',
    body: params,
  });
}
// 修改租户
export async function updateUserOwer(params) {
  return request('/smartim/tenant/update', {
    method: 'POST',
    body: params,
  });
}
// 删除租户
export async function deleteUserOwer(params) {
  return request('/smartim/tenant/delete', {
    method: 'POST',
    body: params,
  });
}
// 获取技能组
export async function getTenantRel(params) {
  return request('/smartim/tenant/getTenantRel', {
    method: 'POST',
    body: params,
  });
}
// 切换租户
export async function switchUserOwer(params) {
  return request('/smartim/tenant/switch', {
    method: 'POST',
    body: params,
  });
}
