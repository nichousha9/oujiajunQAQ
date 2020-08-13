import request from '@/utils/request';

// 查询是否有根目录
export async function qryHasFold(params) {
  return request('/mccm/marketmgr/campaign/AlgoModuleController/qryHasFold', {
    method: 'POST',
    body: params
  });
}

// 查询算法目录
export async function qryAlgorithmFoldList(params) {
  return request('/mccm/marketmgr/campaign/AlgoModuleController/qryAlgoFoldList', {
    method: 'POST',
    body: params
  });
}

// 新增算法目录
export async function addAlgorithmFold(params) {
  return request('/mccm/marketmgr/campaign/AlgoModuleController/addAlgoFold', {
    method: 'POST',
    body: params
  });
}

// 修改算法目录
export async function updateAlgorithmFold(params) {
  return request('/mccm/marketmgr/campaign/AlgoModuleController/updateAlgoFold', {
    method: 'POST',
    body: params
  });
}

// 删除算法目录
export async function deleteAlgorithmFold(params) {
  return request('/mccm/marketmgr/campaign/AlgoModuleController/deleteAlgoFold', {
    method: 'POST',
    body: params
  });
}

// 判断算法目录是否可删除
export async function judgeCanCatalogDelete(params) {
  return request('/mccm/marketmgr/campaign/AlgoModuleController/judgeCanDelete', {
    method: 'POST',
    body: params
  });
}

// 算法列表
export async function qryAlgorithmModuleList(params) {
  return request('/mccm/marketmgr/campaign/AlgoModuleController/qryAlgoModuleList', {
    method: 'POST',
    body: params
  });
}

// 算法操作
export async function addAlgorithmModule(params) {
  return request('/mccm/marketmgr/campaign/AlgoModuleController/addAlgoModule', {
    method: 'POST',
    body: params
  });
}

export async function updateAlgorithmModule(params) {
  return request('/mccm/marketmgr/campaign/AlgoModuleController/updateAlgoModule', {
    method: 'POST',
    body: params
  });
}

export async function deleteAlgorithmModule(params) {
  return request('/mccm/marketmgr/campaign/AlgoModuleController/delAlgoModule', {
    method: 'POST',
    body: params
  });
}

// 生效
export async function effectiveAlgorithmModule(params) {
  return request('/mccm/marketmgr/campaign/AlgoModuleController/effictiveAlgoModule', {
    method: 'POST',
    body: params
  });
}

// 查询算法详情
export async function qryAlgorithmById(params) {
  return request('/mccm/marketmgr/campaign/AlgoModuleController/queryAlgoModuleInfoById', {
    method: 'POST',
    body: params
  });
}
