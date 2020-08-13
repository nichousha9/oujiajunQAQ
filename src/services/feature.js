import request from '@/utils/request';

// 查询特征视图列表
export async function qryFeatureViewList(params) {
  return request('/mccm/marketmgr/campaign/UserFeatureController/qryFeatureViewList', {
    method: 'POST',
    body: params,
  });
}

// 新增特征视图
export async function addFeatureView(params) {
  return request('/mccm/marketmgr/campaign/UserFeatureController/addFeatureView', {
    method: 'POST',
    body: params,
  });
}

// 修改特征视图
export async function updateFeatureView(params) {
  return request('/mccm/marketmgr/campaign/UserFeatureController/updateFeatureView', {
    method: 'POST',
    body: params,
  });
}

// 生效特征视图
export async function effictiveFeatureView(params) {
  return request('/mccm/marketmgr/campaign/UserFeatureController/effictiveFeatureView', {
    method: 'POST',
    body: params,
  });
}

// 删除特征视图
export async function delFeatureView(params) {
  return request('/mccm/marketmgr/campaign/UserFeatureController/delFeatureView', {
    method: 'POST',
    body: params,
  });
}

// 根据id查询特征视图详情
export async function queryFeatureViewInfoById(params) {
  return request('/mccm/marketmgr/campaign/UserFeatureController/queryFeatureViewInfoById', {
    method: 'POST',
    body: params,
  });
}