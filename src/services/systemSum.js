import request from '../utils/request';

// 用户账号列表
export async function getAllUserList(params) {
  // const url = params.nickName ? '/smartim/system/users/findByNickname' : '/smartim/system/users/allUser'
  const url = '/smartim/system/users/allUser';
  return request(url, {
    method: 'POST',
    body: params,
  });
}

// 修改用户
export async function upDateUser(params) {
  return request('/smartim/system/users/update', {
    method: 'POST',
    body: params,
  });
}
// 新增用户
export async function addUser(params) {
  return request('/smartim/system/users/save', {
    method: 'POST',
    body: params,
  });
}
// 删除用户
export async function deleteUser(params) {
  return request('/smartim/system/users/delete', {
    method: 'POST',
    body: params,
  });
}
// 删除用户
export async function deleteLessUser(params) {
  return request('/smartim/system/users/delete', {
    method: 'POST',
    body: params,
  });
}
// 用户详细信息
export async function detailUser(params) {
  return request('/smartim/system/users/user', {
    method: 'POST',
    body: params,
  });
}
// 所有角色
export async function getAllRoleList(params) {
  return request('/smartim/system/roles/allRole', {
    method: 'POST',
    body: params,
  });
}
// 指定角色的用户的列表
export async function getRoleListByRole(params) {
  return request('/smartim/system/roles/role', {
    method: 'POST',
    body: params,
  });
}
// 删除角色
export async function deleteRole(params) {
  return request('/smartim/system/roles/delete', {
    method: 'POST',
    body: params,
  });
}
// 更新角色
export async function updateRole(params) {
  return request('/smartim/system/roles/update', {
    method: 'POST',
    body: params,
  });
}
// 新增角色
export async function saveRole(params) {
  return request('/smartim/system/roles/save', {
    method: 'POST',
    body: params,
  });
}
// 角色授权列表
export async function allAuthList(params) {
  return request('/smartim/system/roles/auth/allAuth', {
    method: 'POST',
    body: params,
  });
}

// 部门授权列表
export async function organAuthList(params) {
  return request('/smartim/system/roles/getOrganAuthList', {
    method: 'POST',
    body: params,
  });
}
// 角色授权列表
export async function authListByRole(params) {
  return request('/smartim/system/roles/roleAuth', {
    method: 'POST',
    body: params,
  });
}
// 角色授权
export async function authToRole(params) {
  return request('/smartim/system/roles/auth/add', {
    method: 'POST',
    body: params,
  });
}

// 新增权限
export async function roleGetAuth(params) {
  return request('/smartim/system/roles/auth/save', {
    method: 'POST',
    body: params,
  });
}

// 删除用户
export async function deleteRoleUser(params) {
  return request('/smartim/system/roles/user/delete', {
    method: 'POST',
    body: params,
  });
}
// 获取所有的组织架构
export async function getAllOrgan(params) {
  return request('/smartim/system/organ/organTree', {
    method: 'POST',
    body: params,
  });
}
// 当前用户所在部门下的地区
export async function getCurUserArea(params) {
  return request('/smartim/knowledge/kdb/commonRegionList', {
    method: 'POST',
    body: params,
  });
}
// 获取指定组织架构的用户列表
export async function getUserByOrg(params) {
  return request('/smartim/system/organ/organ', {
    method: 'POST',
    body: params,
  });
}
// 部門授权列表
export async function authListByOrg(params) {
  return request('/smartim/system/organ/organAuth', {
    method: 'POST',
    body: params,
  });
}

// 部門授权
export async function authToOrg(params) {
  return request('/smartim/system/organ/auth/save', {
    method: 'POST',
    body: params,
  });
}
// 部门用户列表，添加用户的
export async function userChooseListOrg(params) {
  return request('/smartim/system/organ/seluser', {
    method: 'POST',
    body: params,
  });
}

// 添加用户到部门
export async function addUsersToOrg(params) {
  return request('/smartim/system/organ/saveuser', {
    method: 'POST',
    body: params,
  });
}
// 角色用户列表，添加用户的
export async function userChooseListRole(params) {
  return request('/smartim/system/roles/seluser', {
    method: 'POST',
    body: params,
  });
}
// 添加用户到角色
export async function addUsersToRole(params) {
  return request('/smartim/system/roles/saveuser', {
    method: 'POST',
    body: params,
  });
}
// 地区列表
export async function getAreaList(params) {
  return request('/smartim/system/organ/areaList', {
    method: 'POST',
    body: params,
  });
}
// 新接口
export async function getAllAreaList(params) {
  return request('/smartim/system/getAreaList', {
    method: 'POST',
    body: params,
  });
}
// 获取指定的
export async function getOrgScopeList(params) {
  return request('/smartim/system/organ/service/scope', {
    method: 'POST',
    body: params,
  });
}
// 更新组织
export async function upDateOrganization(params) {
  return request('/smartim/system/organ/service/update', {
    method: 'POST',
    body: params,
  });
}
// 部门修改
export async function orgUpdate(params) {
  return request('/smartim/system/organ/update', {
    method: 'POST',
    body: params,
  });
}
// 部门新建
export async function orgSave(params) {
  return request('/smartim/system/organ/save', {
    method: 'POST',
    body: params,
  });
}
//  删除部门下的用户
export async function deleteUserInOrg(params) {
  return request('/smartim/system/organ/user/delete', {
    method: 'POST',
    body: params,
  });
}

//  删除部门
export async function deleteOrg(params) {
  return request('/smartim/system/organ/delete', {
    method: 'POST',
    body: params,
  });
}
// //  获取组织级别
// export async function getOrgClass(params) {
//   return request('/smartim/system/organ/orgclass/list', {
//     method: 'POST',
//     body: params,
//   });
// }
//  静态数据的添加
export async function saveStaticParam(params) {
  return request('/smartim/system/staticParam/save', {
    method: 'POST',
    body: params,
  });
}
//  静态数据的删除
export async function deleteStaticParam(params) {
  return request('/smartim/system/staticParam/delete', {
    method: 'POST',
    body: params,
  });
}
//  获取静态数据列表
export async function getStaticParamList(params) {
  return request('/smartim/system/staticParam/list', {
    method: 'POST',
    body: params,
  });
}
//  获取详细信息
export async function getStaticParam(params) {
  return request('/smartim/system/staticParam/detail', {
    method: 'POST',
    body: params,
  });
}
// 获取所有的地区
export async function getChildRegions(params) {
  return request('/smartim/system/commonRegion/getChildRegions', {
    method: 'POST',
    body: params,
  });
}
// 获取所有的地区
export async function saveRegion(params) {
  return request('/smartim/system/commonRegion/save', {
    method: 'POST',
    body: params,
  });
}
// 删除地区
export async function deleteRegion(params) {
  return request('/smartim/system/commonRegion/delete', {
    method: 'POST',
    body: params,
  });
}
