import request from '../utils/request';

// 添加资源权限菜单
export async function addMenu(params) {
  return request('/smartim/system/roles/auth/save', {
    method: 'POST',
    body: params,
  });
}

// 修改菜单信息
export async function updateMenu(params) {
  return request('/smartim/system/roles/auth/update', {
    method: 'POST',
    body: params,
  });
}

// 删除菜单项(逻辑删除)
export async function deleteMenu(params) {
  return request('/smartim/system/roles/auth/delete', {
    method: 'POST',
    body: params,
  });
}