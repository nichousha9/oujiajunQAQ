import request from '@/utils/request';

// 查询目录树
export async function qryEvtCatalogList(params) {
  return request('/evt-service/evt/event/EvtCatalogController/qryEvtCatalogList', {
    method: 'POST',
    body: params,
    pathPrefix: false,
  });
}

// 新增目录树项
export async function insertEvtCatalog(params) {
  return request('/evt-service/evt/event/EvtCatalogController/insertEvtCatalog', {
    method: 'POST',
    body: params,
    pathPrefix: false,
  });
}

// 编辑目录树项
export async function updateEvtCatalog(params) {
  return request('/evt-service/evt/event/EvtCatalogController/updateEvtCatalog', {
    method: 'POST',
    body: params,
    pathPrefix: false,
  });
}

// 删除目录树项
export async function deleteEvtCatalog(params) {
  return request('/evt-service/evt/event/EvtCatalogController/deleteEvtCatalog', {
    method: 'POST',
    body: params,
    pathPrefix: false,
  });
}

// 查询事件列表
export async function qryEvtEventInfoList(params) {
  return request('/evt-service/evt/event/EvtEventInfoController/qryEvtEventInfoList', {
    method: 'POST',
    body: params,
    pathPrefix: false,
  });
}

// 新增事件源
export async function insertEvtEventInfo(params) {
  return request('/evt-service/evt/event/EvtEventInfoController/insertEvtEventInfo', {
    method: 'POST',
    body: params,
    pathPrefix: false,
  });
}

// 编辑事件源
export async function updateEvtEventInfo(params) {
  return request('/evt-service/evt/event/EvtEventInfoController/updateEvtEventInfo', {
    method: 'POST',
    body: params,
    pathPrefix: false,
  });
}

// 改变事件状态
export async function updateStatusCd(params) {
  return request('/evt-service/evt/event/EvtEventInfoController/refreshEvtEventInfo', {
    method: 'POST',
    body: params,
    pathPrefix: false,
  });
}

// 删除事件源
export async function deleteEvtEventInput(params) {
  return request('/evt-service/evt/eventInput/EvtEventInputController/deleteEvtEventInput', {
    method: 'POST',
    body: params,
    pathPrefix: false,
  });
}

// 验证新增事件项名称是否重复
export async function qryEvtEventInputSameName(params) {
  return request('/evt-service/evt/eventInput/EvtEventInputController/qryEvtEventInputSameName', {
    method: 'POST',
    body: params,
    pathPrefix: false,
  });
}

// 获取输入源列表数据
export async function qryEventInputListByEventId(params) {
  return request('/evt-service/evt/eventInput/EvtEventInputController/qryEventInputListByEventId', {
    method: 'POST',
    body: params,
    pathPrefix: false,
  });
}

// 获取输入源新增 Modal 列表数据
export async function qryEventInputPageByCataId(params) {
  return request('/evt-service/evt/eventInput/EvtEventInputController/qryEventInputPageByCataId', {
    method: 'POST',
    body: params,
    pathPrefix: false,
  });
}

// 输入源 tab 新增事件
export async function insertEvtEventInputRef(params) {
  return request('/evt-service/evt/event/EvtEventInputRefController/insertEvtEventInputRef', {
    method: 'POST',
    body: params,
    pathPrefix: false,
  });
}

// 删除输入源项
export async function deleteEvtEventInputRef(params) {
  return request('/evt-service/evt/event/EvtEventInputRefController/deleteEvtEventInputRef', {
    method: 'POST',
    body: params,
    pathPrefix: false,
  });
}

// 获取输出格式-》格式配置详情
export async function qryEvtEventOutputDetail(params) {
  return request('/evt-service/evt/event/EvtEventOutputController/qryEvtEventOutputDetail', {
    method: 'POST',
    body: params,
    pathPrefix: false,
  });
}

// 新增配置详情
export async function insertEvtEventOutput(params) {
  return request('/evt-service/evt/event/EvtEventOutputController/insertEvtEventOutput', {
    method: 'POST',
    body: params,
    pathPrefix: false,
  });
}

// 编辑配置详情
export async function updateEvtEventOutput(params) {
  return request('/evt-service/evt/event/EvtEventOutputController/updateEvtEventOutput', {
    method: 'POST',
    body: params,
    pathPrefix: false,
  });
}

// 获取输出属性列表
export async function qryEvtOutputAttrList(params) {
  return request('/evt-service/evt/event/EvtOutputAttrController/qryEvtOutputAttrList', {
    method: 'POST',
    body: params,
    pathPrefix: false,
  });
}

// 删除输出属性项
export async function deleteOutputAttr(params) {
  return request('/evt-service/evt/event/EvtOutputAttrController/deleteEvtOutputAttr', {
    method: 'POST',
    body: params,
    pathPrefix: false,
  });
}

// 获取输出属性表单编码字段列表值
export async function qryObjectAndInputAttrList(params) {
  return request('/evt-service/evt/eventInput/EvtInputAttrController/qryObjectAndInputAttrList', {
    method: 'POST',
    body: params,
    pathPrefix: false,
  });
}

// 新增输出属性
export async function insertEvtOutputAttrput(params) {
  return request('/evt-service/evt/event/EvtOutputAttrController/insertEvtOutputAttrput', {
    method: 'POST',
    body: params,
    pathPrefix: false,
  });
}

// 修改输入属性
export async function updateEvtOutputAttr(params) {
  return request('/evt-service/evt/event/EvtOutputAttrController/updateEvtOutputAttr', {
    method: 'POST',
    body: params,
    pathPrefix: false,
  });
}

// 获取活动策略详情
export async function qryEvtEventPolicyParams(params) {
  return request('/evt-service/evt/event/EvtEventPolicyController/qryEvtEventPolicyParams', {
    method: 'POST',
    body: params,
    pathPrefix: false,
  });
}
