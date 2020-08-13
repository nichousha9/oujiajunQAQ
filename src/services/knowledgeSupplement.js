
import request from "../utils/request";

// 查询单个新增列表
export async function qrySiKdbInsertErrorSingleList(params) {
  return request('/smartim/kdb/insert/error/qrySiKdbInsertErrorSingleList', {
    method: 'POST',
    body: params,
  },true)
}

// 查询接口新增列表
export async function qryInsertErrorByInterfaceList(params) {
  return request('/smartim/kdbInsertErrorBatch/qryInsertErrorBatchByInterfaceList', {
    method: 'POST',
    body: params,
  },true)
}

// 查询批量数据列表
export async function qryInsertErrorBatchByFileList(params) {
  return request('/smartim/kdbInsertErrorBatch/qryInsertErrorBatchByFileList', {
    method: 'POST',
    body: params,
  },true)
}


// 重新导入
export async function reimport(params) {
  return request('/smartim/kdbInsertErrorBatch/reimport', {
    method: 'POST',
    body: params,
  },true)
}


// 接口和批量重新导入
export async function reimportBatch(params) {
  return request('/smartim/kdbInsertErrorBatch/reimportBatch', {
    method: 'POST',
    body: params,
  },true)
}


// 新增
export async function save(params) {
  return request('/smartim/kdb/insert/error/save', {
    method: 'POST',
    body: params,
  },true)
}

// 弹窗
export async function qryInsertErrorByInterfaceList2(params) {
  return request('/smartim/kdb/insert/error/qryInsertErrorByInterfaceList', {
    method: 'POST',
    body: params,
  },true)
}

// 批量弹窗
export async function qryInsertErrorByFileList(params) {
  return request('/smartim/kdb/insert/error/qryInsertErrorByFileList', {
    method: 'POST',
    body: params,
  },true)
}

// 查询文件列表
export async function qryInsertErrorBatchByWordList(params) {
  return request('/smartim/kdbInsertErrorBatch/qryInsertErrorBatchByWordList', {
    method: 'POST',
    body: params,
  },true)
}

// 解析上传
export async function documentParsing(params) {
  return request('/smartim/knowledge/file/documentParsing', {
    method: 'POST',
    body: params,
  },true)
}

// 文档类型查询
export async function getSonDicsByPcode(params) {
  return request('/smartim/sysDict/getSonDicsByPcode', {
    method: 'POST',
    body: params,
  },false)
}