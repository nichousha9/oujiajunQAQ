import request from '../utils/request';

// /smartim/agent/getOnlineUsers
export async function getOnlineUserByKeyWord(params) {
  return request('/smartim/agent/getOnlineUsers', {
    method: 'POST',
    body: params,
  });
}
export async function getSkillGroupUserByKeyWord(params) {
  return request('/smartim/system/organ/skillGroup/user', {
    method: 'POST',
    body: params,
  });
}
// 修改讨论组
export async function modifyGroup(params) {
  return request('/smartim/group/modify', {
    method: 'POST',
    body: params,
  });
}

// 新建讨论组
export async function addNewGroup(params) {
  return request('/smartim/group/create', {
    method: 'POST',
    body: params,
  });
}
// 获取用户的讨论组
export async function getUserGroup(params) {
  return request('/smartim/group/getMyGroup', {
    method: 'POST',
    body: params,
  });
}
// 获取组织下的用户 待定
export async function getSkillGroupUser(params) {
  return request('/smartim/organization/organ', {
    method: 'POST',
    body: params,
  });
}
// 获取已知讨论组的成员
export async function getGroupMember(params) {
  return request('/smartim/group/getGroupMember', {
    method: 'POST',
    body: params,
  });
}
// 获取所有公聊区
export async function getPublicGroup(params) {
  return request('/smartim/group/getPublicGroup', {
    method: 'POST',
    body: params,
  });
}
// 获取讨论组下用户（分页）
export async function getGroupMemberPage(params) {
  return request('/smartim/group/getGroupMemberPage', {
    method: 'POST',
    body: params,
  });
}
// 删除讨论组
export async function deleteGroup(params) {
  return request('/smartim/group/delete', {
    method: 'POST',
    body: params,
  });
}
