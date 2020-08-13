import request from '@/utils/request';

// 查询审批模板
export async function qryApprovalFlowchart(params) {
  return request('/mccm/dmt/ApprovalFlowchartController/qryApprovalFlowchart', {
    method: 'POST',
    body: params,
  });
}

// 新增审批模板
export async function addApprovalFlowchart(params) {
  return request('/mccm/dmt/ApprovalFlowchartController/addApprovalFlowchart', {
    method: 'POST',
    body: params,
  });
}

// 修改审批模板
export async function modApprovalFlowchart(params) {
  return request('/mccm/dmt/ApprovalFlowchartController/modApprovalFlowchart', {
    method: 'POST',
    body: params,
  });
}

// 删除审批模板
export async function delApprovalFlowchart(params) {
  return request('/mccm/dmt/ApprovalFlowchartController/delApprovalFlowchart', {
    method: 'POST',
    body: params,
  });
}

// 发布编辑中审批模板
export async function dealApprovalFlowchart(params) {
  return request('/mccm/dmt/ApprovalFlowchartController/dealApprovalFlowchart', {
    method: 'POST',
    body: params,
  });
}

// 查询流程详情
export async function qryApprovalFlowchartDtl(params) {
  return request('/mccm/dmt/ApprovalFlowchartController/qryApprovalFlowchartDtl', {
    method: 'POST',
    body: params,
  });
}

// 查询区域
export async function qryRegions(params) {
  return request('/geekUnion/ZqythCommonRegionController/qryRegions', {
    method: 'POST',
    body: params,
  });
}

// 查询组织
export async function qryZqythOrganization(params) {
  return request('/geekUnion/ZqythOrganizationController/qryZqythOrganization', {
    method: 'POST',
    body: params,
  });
}

// 查询角色
export async function qryZqythRoles(params) {
  return request('/geekUnion/ZqythRolesController/qryZqythRoles', {
    method: 'POST',
    body: params,
  });
}

// 根据角色查询账号
export async function qryZqythUser(params) {
  return request('/geekUnion/ZqythUserController/qryZqythUser', {
    method: 'POST',
    body: params,
  });
}

// 查询节点渠道
export async function qryApprovalChannel(params) {
  return request('/mccm/dmt/ApprovalTypeController/qryApprovalChannel', {
    method: 'POST',
    body: params,
  });
}

// 新增或者修改节点
export async function addApprovalProcess(params) {
  return request('/mccm/dmt/ApprovalProcessController/addApprovalProcess', {
    method: 'POST',
    body: params,
  });
}

// 新增或者修改节点
export async function modApprovalProcess(params) {
  return request('/mccm/dmt/ApprovalProcessController/modApprovalProcess', {
    method: 'POST',
    body: params,
  });
}

// 删除节点
export async function delApprovalProcess(params) {
  return request('/mccm/dmt/ApprovalProcessController/delApprovalProcess', {
    method: 'POST',
    body: params,
  });
}

// 查询节点
export async function qryApprovalProcess(params) {
  return request('/mccm/dmt/ApprovalProcessController/qryApprovalProcess', {
    method: 'POST',
    body: params,
  });
}

// 更新流程图
export async function modApprovalFlowchartContent(params) {
  return request('/mccm/dmt/ApprovalFlowchartController/modApprovalFlowchartContent', {
    method: 'POST',
    body: params,
  });
}

// 新增或者修改线
export async function addApprovalLine(params) {
  return request('/mccm/dmt/ApprovalProcessController/addApprovalLine', {
    method: 'POST',
    body: params,
  });
}

// 新增或者修改线
export async function modApprovalLine(params) {
  return request('/mccm/dmt/ApprovalProcessController/modApprovalLine', {
    method: 'POST',
    body: params,
  });
}

// 查询线
export async function qryApprovalLine(params) {
  return request('/mccm/dmt/ApprovalProcessController/qryApprovalLine', {
    method: 'POST',
    body: params,
  });
}

// 删除线
export async function delApprovalLine(params) {
  return request('/mccm/dmt/ApprovalProcessController/delApprovalLine', {
    method: 'POST',
    body: params,
  });
}

// 复制
export async function copyApprovalFlowchart(params) {
  return request('mccm/dmt/ApprovalFlowchartController/copyApprovalFlowchart', {
    method: 'POST',
    body: params,
  });
}

// 取消发布状态
export async function updApprovalFlowchartState(params) {
  return request('/mccm/dmt/ApprovalFlowchartController/updApprovalFlowchartState', {
    method: 'POSt',
    body: params,
  });
}
