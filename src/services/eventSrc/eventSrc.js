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
export async function qryEventInputPageByCataId(params) {
  return request('/evt-service/evt/eventInput/EvtEventInputController/qryEventInputPageByCataId', {
    method: 'POST',
    body: params,
    pathPrefix: false,
  });
}

// 新增事件源
export async function insertEvtEventInput(params) {
  return request('/evt-service/evt/eventInput/EvtEventInputController/insertEvtEventInput', {
    method: 'POST',
    body: params,
    pathPrefix: false,
  });
}

// 编辑事件源
export async function updateEvtEventInput(params) {
  return request('/evt-service/evt/eventInput/EvtEventInputController/updateEvtEventInput', {
    method: 'POST',
    body: params,
    pathPrefix: false,
  });
}

// 改变事件状态
export async function updateStatusCd(params) {
  return request('/evt-service/evt/eventInput/EvtEventInputController/updateStatusCd', {
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

// 获取输入属性列表数据
export async function qryEvtInputAttrPageByInputId(params) {
  return request(
    '/evt-service/evt/eventInput/EvtInputAttrController/qryEvtInputAttrPageByInputId',
    {
      method: 'POST',
      body: params,
      pathPrefix: false,
    },
  );
}

// 验证输入属性名称是否重复
export async function qryEvtInputAttrByName(params) {
  return request('/evt-service/evt/eventInput/EvtInputAttrController/qryEvtInputAttrList', {
    method: 'POST',
    body: params,
    pathPrefix: false,
  });
}

// 新增输入属性项
export async function insertEvtInputAttr(params) {
  return request('/evt-service/evt/eventInput/EvtInputAttrController/insertEvtInputAttr', {
    method: 'POST',
    body: params,
    pathPrefix: false,
  });
}

// 修改输入属性项 updateEvtInputAttr
export async function updateEvtInputAttr(params) {
  return request('/evt-service/evt/eventInput/EvtInputAttrController/updateEvtInputAttr', {
    method: 'POST',
    body: params,
    pathPrefix: false,
  });
}

// 删除输入属性项
export async function deleteInputAttr(params) {
  return request('/evt-service/evt/eventInput/EvtEventInputController/deleteEvtEventInput', {
    method: 'POST',
    body: params,
    pathPrefix: false,
  });
}

// 获取日志列表数据
export async function qryEvtFileInputLogPage(params) {
  return request('/evt-service/evt/fileLog/EvtFileInputLogController/qryEvtFileInputLogPage', {
    method: 'POST',
    body: params,
    pathPrefix: false,
  });
}

// 查询中心对象
export async function qryEvtCenterInputRel(params) {
  return request(
    '/evt-service/evt/evtCenterObject/EvtCenterInputRelController/qryEvtCenterInputRel',
    {
      method: 'POST',
      body: params,
      pathPrefix: false,
    },
  );
}

// 获取中心对象下拉框列表
export async function qryEventInputList(params) {
  return request('/evt-service/evt/eventInput/EvtEventInputController/qryEventInputList', {
    method: 'POST',
    body: params,
    pathPrefix: false,
  });
}

// 新增中心对象
export async function insertEvtCenterInputRel(params) {
  return request(
    '/evt-service/evt/evtCenterObject/EvtCenterInputRelController/insertEvtCenterInputRel',
    {
      method: 'POST',
      body: params,
      pathPrefix: false,
    },
  );
}

// 修改中心对象
export async function updateEvtCenterInputRel(params) {
  return request(
    '/evt-service/evt/evtCenterObject/EvtCenterInputRelController/updateEvtCenterInputRel',
    {
      method: 'POST',
      body: params,
      pathPrefix: false,
    },
  );
}
