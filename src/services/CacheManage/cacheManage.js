import request from '@/utils/request';

// 根据attrSpecCode和type模糊查询缓存数据（分页）
export async function qryCachePage(params) {
  return request('/system/attrSpecController/qryCachePage', {
    method: 'POST',
    body: params,
  });
}

// 根据attrSpecCode和type删除缓存数据
export async function delKeyFromCache(params) {
  return request('/system/attrSpecController/delKeyFromCache', {
    method: 'POST',
    body: params,
  });
}

// 根据attrSpecType全量更新缓存数据
export async function qryAttrSpecAllInCache(params) {
  return request('/system/attrSpecController/qryAttrSpecAllInCache', {
    method: 'POST',
    body: params,
  });
}
