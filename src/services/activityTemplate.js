import request from '@/utils/request';

// 模板管理列表
export async function qryOrderModelList(params) {
  return request('/mccm/dmt/MccOrderModelController/qryOrderModelList', {
    method: 'POST',
    body: params,
  });
}

// 删除活动模板
export async function delOrderModel(params) {
  return request('/mccm/dmt/MccOrderModelController/delOrderModel', {
    method: 'POST',
    body: params,
  });
}

// 启动活动模板
export async function startOrderModel(params) {
  return request('/mccm/dmt/MccOrderModelController/startOrderModel', {
    method: 'POST',
    body: params,
  });
}

// 新增活动模板
export async function addOrderModel(params) {
  return request('/mccm/dmt/MccOrderModelController/addOrderModel', {
    method: 'POST',
    body: params,
  });
}

// 更新活动模板
export async function modifyOrderModel(params) {
  return request('/mccm/dmt/MccOrderModelController/modifyOrderModel', {
    method: 'POST',
    body: params,
  });
}

// 查询模板详情
export async function qryMccModelColRel(params) {
  return request('/mccm/dmt/MccOrderModelController/qryMccModelColRel', {
    method: 'POST',
    body: params,
  });
}

// 要素列表
export async function qryColsGroupByCamType(params) {
  return request('/geekUnion/MccOrderColumnController/qryColsGroupByCamType', {
    method: 'POST',
    body: params,
  });
}