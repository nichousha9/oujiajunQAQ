import request from '../utils/request';

// 上传数据集
export async function upload(params) {
  return request('/smartim/dataSet/upload', {
    method: 'POST',
    body: params,
  });
}
// 上传数据集进度
export async function uploadRate(params) {
  const url = `/smartim/dataSet/uploadRate?fileId=${params.fileId}`;
  return request(url, {
    method: 'GET',
  }, false, true)
}
// 查询数据集
export async function getAllDataSet(params) {
  return request('/smartim/dataSet/all', {
    method: 'POST',
    body: params,
  });
}
// 删除数据集
export async function deleteByIds(params) {
  return request('/smartim/dataSet/deleteByIds', {
    method: 'POST',
    body: params,
  },true);
}

export async function deleteById(params) {
  return request('/smartim/dataSet/deleteById', {
    method: 'POST',
    body: params,
  });
}

// 一键删除当前场景数据集
export async function deleteByScene(params) {
  return request('/smartim/dataSet/deleteByScene', {
    method: 'POST',
    body: params,
  });
}
// 模型列表
export async function getAllModel(params) {
  return request('/smartim/model/all', {
    method: 'POST',
    body: params,
  });
}
// 模型删除
export async function deleteModel(params) {
  return request('/smartim/model/delete', {
    method: 'POST',
    body: params,
  });
}
// 模型训练
export async function trainModel(params) {
  return request('/smartim/model/trainModel', {
    method: 'POST',
    body: params,
  },true);
}
// 模型上下线
export async function line(params) {
  return request('/smartim/model/line', {
    method: 'POST',
    body: params,
  },true);
}
// 模型停止训练
export async function stop(params) {
  return request('/smartim/model/stop', {
    method: 'POST',
    body: params,
  },true);
}
// 更新训练进度
export async function trainRate(params) {
  return request('/smartim/model/trainRate', {
    method: 'POST',
    body: params,
  });
}