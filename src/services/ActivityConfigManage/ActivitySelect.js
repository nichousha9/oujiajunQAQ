import request from '@/utils/request';

// 获取processId序列值接口
export async function getSeqWithProcess(params) {
  return request('/mccm/FlowChartProcess/getSeqWithProcess', {
    method: 'POST',
    body: params,
  });
}

// 流程select节点编辑的如果开启了智慧中心，屏蔽客户群取数接口
export async function checkSmartWebSwitchIsOn(params) {
  return request('/mccm/FlowChartProcess/SelectProcess/checkSmartWebSwitchIsOn', {
    method: 'POST',
    body: params,
  });
}

// 获取标签树接口
export async function getDimList(params) {
  return request('/marketmgr/labelMgr/MccLabelGrpController/getDimList', {
    method: 'POST',
    body: params,
  });
}

// 查询分群列表接口
export async function qryMccSegmentInfo(params) {
  return request('/mccm/FlowChartProcess/qryMccSegmentInfo', {
    method: 'POST',
    body: params,
  });
}

// 节点查询接口
export async function getTarGrpInfos(params) {
  return request('/campaign/MccProcessTarGrpController/qryProcessTarGrpNode', {
    method: 'POST',
    body: params,
  });
}

// 节点关联分群查询接口
export async function qrySegList(params) {
  return request('/mccm/FlowChartProcess/SelectProcess/qrySegList', {
    method: 'POST',
    body: params,
  });
}

// 环节查询接口
export async function qryProcess(params) {
  return request('/mccm/marketmgr/mccProcess/qryProcess', {
    method: 'POST',
    body: params,
  });
}

// select节点保存校验sql接口
export async function validateSql(params) {
  return request('/campaign/MccProcessTarGrpController/validateSql', {
    method: 'POST',
    body: params,
  });
}

// select节点保存接口
export async function addProcess(params) {
  return request('/mccm/FlowChartProcess/addProcess', {
    method: 'POST',
    body: params,
  });
}

// select节点修改接口
export async function modProcess(params) {
  return request('/campaign/MccProcessTarGrpController/updateProcessTarGrpNode', {
    method: 'POST',
    body: params,
  });
}

// select节点删除接口
export async function delProcess(params) {
  return request('/campaign/MccFlowchartController/delMccProcessNode', {
    method: 'POST',
    body: params,
  });
}

// select节点检查流程是否在活动周期内接口
export async function checkInCampCyclePeriod(params) {
  return request('/mccm/FlowChartProcess/checkInCampCyclePeriod', {
    method: 'POST',
    body: params,
  });
}

// select节点运行接口
export async function runProcess(params) {
  return request('/mccm/FlowChartProcess/runProcess', {
    method: 'POST',
    body: params,
  });
}

// select节点锁住流程接口
export async function lockFlowChart(params) {
  return request('/campaign/MccFlowchartController/lockFlowChart', {
    method: 'POST',
    body: params,
  });
}

// select节点根据节点id查询人员清单列表接口
export async function qryCustListByProcessId(params) {
  return request('/cammgr/process/MccProcessSelectController/qryCustList', {
    method: 'POST',
    body: params,
  });
}

// 根据labelId请求选项值
export async function getLabelValueList(params) {
  return request('/marketmgr/labelMgr/MccLabelGrpController/getLabelValueList', {
    method: 'POST',
    body: params,
  });
}

// 搜索标签树
export async function expandTreeNodes(params) {
  return request('/mccm/marketmgr/labelMgr/MccLabelGrpController/expandTreeNodes', {
    method: 'POST',
    body: params,
  });
}

// 抽样
export async function qryTarGrps(params) {
  return request('/mccm/marketmgr/mccTarGrp/qryTarGrps', {
    method: 'POST',
    body: params,
  });
}

// select可选类型
export async function qrySelectLimit(params) {
  return request('/marketmgr/campaign/CampaignController/qrySelectLimit', {
    method: 'POST',
    body: params,
  });
}
