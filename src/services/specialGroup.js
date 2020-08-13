import request from '@/utils/request';

// 获取特殊分群首页的目录树数据
export async function queryMccFolderList(params) {
  return request('/mccm/marketmgr/SegmentController/getFolderList', {
    method: 'POST',
    body: params,
  });
}

// 特殊分群首页的目录树新增接口
export async function addFolder(params) {
  return request('/mccm/marketmgr/SegmentController/addFolder', {
    method: 'POST',
    body: params,
  });
}
// 特殊分群首页的目录树修改接口
export async function updateFolder(params) {
  return request('/mccm/marketmgr/SegmentController/updateFolder', {
    method: 'POST',
    body: params,
  });
}

// 特殊分群首页的目录树删除接口
export async function delMccFolder(params) {
  return request('/mccm/marketmgr/mccfolder/MccFolderController/delMccFolder', {
    method: 'POST',
    body: params,
  });
}

// 特殊分群首页的目录树查询接口
export async function qryRootFolder(params) {
  return request('/mccm/marketmgr/mccfolder/MccFolderController/qryRootFolder', {
    method: 'POST',
    body: params,
  });
}

// 查询分群列表数据
export async function querySegmentDetailInfo(params) {
  return request('/mccm/marketmgr/SegmentController/querySegmentDetailInfo', {
    method: 'POST',
    body: params,
  });
}

// 查询分群成员列表
export async function selectSegmentMembers(params) {
  return request('/mccm/marketmgr/SegmentController/selectSegmentMembers', {
    method: 'POST',
    body: params,
  });
}

// 查询用户列表
export async function qrySubsBasicInfo(params) {
  return request('/mccm/marketmgr/SegmentController/qrySubsBasicInfo', {
    method: 'POST',
    body: params,
  });
}

// 分群列表增删改查
// 新增
export async function insertSegment(params) {
  return request('/mccm/marketmgr/SegmentController/insertSegment', {
    method: 'POST',
    body: params,
  });
}

// 删除
export async function deleteMccSegment(params) {
  return request('/mccm/marketmgr/SegmentController/deleteMccSegment', {
    method: 'POST',
    body: params,
  });
}

// 修改
export async function updateMccSegment(params) {
  return request('/mccm/marketmgr/SegmentController/updateMccSegment', {
    method: 'POST',
    body: params,
  });
}

// 分群列表扩展成员的增删改
// 新增
export async function batchInsertSegMember(params) {
  return request('/mccm/marketmgr/SegmentController/batchInsertSegMember', {
    method: 'POST',
    body: params,
  });
}

// 删除
export async function delSegmentMember(params) {
  return request('/mccm/marketmgr/SegmentController/delSegmentMember', {
    method: 'POST',
    body: params,
  });
}

// 静态数据获取
export async function qryAttrValueByCode(params) {
  return request('/system/attrSpecController/qryAttrValueByCode', {
    method: 'POST',
    body: params,
  });
}

// 获取标签树接口
export async function getDimList(params) {
  return request('/mccm/marketmgr/labelMgr/MccLabelGrpController/getDimList', {
    method: 'POST',
    body: params,
  });
}

// 根据labelId请求选项值
export async function getLabelValueList(params) {
  return request('/mccm/marketmgr/labelMgr/MccLabelGrpController/getLabelValueList', {
    method: 'POST',
    body: params,
  });
}

export async function updateSegmentMember(params) {
  return request('/mccm/marketmgr/SegmentController/updateSegmentCount', {
    method: 'POST',
    body: params,
  });
}

export async function selectSegmentMemberCount(params) {
  return request('/mccm/marketmgr/SegmentController/selectSegmentMemberCount', {
    method: 'POST',
    body: params,
  });
}

export async function impSegMember(params) {
  return request('/mccm/marketmgr/SegmentController/impSegMember', {
    method: 'POST',
    body: params,
  });
}

export async function saveFile(params) {
  return request('/mccm/marketmgr/SegmentController/saveFile', {
    method: 'POST',
    body: params,
  });
}
