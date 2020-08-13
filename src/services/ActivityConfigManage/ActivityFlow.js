import request from '@/utils/request';

// 活动详情接口
export async function getCampaignList(params) {
  return request('/campaign/MccCampaignController/getCampaignList', {
    method: 'POST',
    body: params,
  });
}

// 新增流程接口
export async function addFlowChart(params) {
  return request('/mccm/FlowChartProcess/addFlowChart', {
    method: 'POST',
    body: params,
  });
}

// 编辑流程接口
export async function modFlowChart(params) {
  return request('/mccm/FlowChartProcess/modFlowChart', {
    method: 'POST',
    body: params,
  });
}

// 编辑流程接口
export async function updateCampaignBasic(params) {
  return request('/campaign/MccCampaignController/updateCampaignBasic', {
    method: 'POST',
    body: params,
  });
}

// 新增流程接口
export async function saveCampaign(params) {
  return request('/campaign/MccCampaignController/addCampaignBasic', {
    method: 'POST',
    body: params,
  });
}

// // 流程接口
// export async function saveCampaign(params) {
//   return request('/campaign/MccCampaignController/addCampaignBasic', {
//     method: 'POST',
//     body: params,
//   });
// }

// 查询活动流程
export async function qryFlowChartByCampaignId(params) {
  return request('/campaign/MccFlowchartController/qryMccFlowChartContentById', {
    method: 'POST',
    body: params,
  });
}

// 查询流程
export async function qryAllProcessTypes(params) {
  return request('/campaign/MccFlowchartController/qryAllProcessTypes', {
    method: 'POST',
    body: params,
  });
}

// 保存流程图
export async function updateFlowChartContent(params) {
  return request('/campaign/MccFlowchartController/updateMccFlowChartContent', {
    method: 'POST',
    body: params,
  });
}

// 查询流程图
export async function qryFlowChartContentById(params) {
  return request('/campaign/MccFlowchartController/qryMccFlowChartContentById', {
    method: 'POST',
    body: params,
  });
}

// 流程状态刷新
export async function getFlowChartProcessState(params) {
  return request('/campaign/MccFlowchartController/getFlowChartProcessState', {
    method: 'POST',
    body: params,
  });
}

// 流程状态刷新
export async function qryProcessState(params) {
  return request('/mccm/FlowChartProcess/qryProcessState', {
    method: 'POST',
    body: params,
  });
}

// 先删除节点对应的数据库记录
export async function delProcess(params) {
  return request('/campaign/MccFlowchartController/delMccProcessNode', {
    method: 'POST',
    body: params,
  });
}

// 查询活动周期
export async function checkInCampCyclePeriod(params) {
  return request('/firekylin-job/campaign/FlowchartController/runFlowchart', {
    method: 'POST',
    body: params,
    pathPrefix: false,
  });
}

// 查询监听节点
export async function checkListenerSegApplyInst(params) {
  return request('/mccm/FlowChartProcess/checkListenerSegApplyInst', {
    method: 'POST',
    body: params,
  });
}

// 查询节点的优化情况
export async function qryProcessOptimize(params) {
  return request('/mccm/FlowChartProcess/qryProcessOptimize', {
    method: 'POST',
    body: params,
  });
}

// 流程节点的运行
export async function runProcess(params) {
  return request('/mccm/FlowChartProcess/runProcess', {
    method: 'POST',
    body: params,
  });
}

// 流程节点的运行
export async function getSeqWithProcess(params) {
  return request('/mccm/FlowChartProcess/getSeqWithProcess', {
    method: 'POST',
    body: params,
  });
}

// 获取getSmartTableCode
export async function getSmartTableCode(params) {
  return request('/mccm/FlowChartProcess/getSmartTableCode', {
    method: 'POST',
    body: params,
  });
}

// 判断该节点是否能够优化
export async function checkProcessCanOptimize(params) {
  return request('/mccm/FlowChartProcess/checkProcessCanOptimize', {
    method: 'POST',
    body: params,
  });
}

// 节点优化
export async function optimizeProcess(params) {
  return request('/mccm/FlowChartProcess/optimizeProcess', {
    method: 'POST',
    body: params,
  });
}

// 查询Listener节点是否能test
export async function qryMccListener(params) {
  return request('/mccm/FlowChartProcess/Listener/qryMccListener', {
    method: 'POST',
    body: params,
  });
}

// 赠送检查-所有受众
export async function checkIsAllAudience(params) {
  return request('/mccm/FlowChartProcess/checkIsAllAudience', {
    method: 'POST',
    body: params,
  });
}

// 查询进程 配置测试群组
export async function qryMccTestContactSeg(params) {
  return request('/mccm/FlowChartProcess/qryMccTestContactSeg', {
    method: 'POST',
    body: params,
  });
}

// 是否可test
export async function qryBatchByProcessId(params) {
  return request('/mccm/FlowChartProcess/qryBatchByProcessId', {
    method: 'POST',
    body: params,
  });
}

// 节点测试
export async function testProcess(params) {
  return request('/mccm/FlowChartProcess/testProcess', {
    method: 'POST',
    body: params,
  });
}

// 流程图运行前检查
export async function checkFlowchartBeforeRun(params) {
  return request('/mccm/FlowChartProcess/checkFlowchartBeforeRun', {
    method: 'POST',
    body: params,
  });
}

// 运行
export async function runFlowChart(params) {
  return request('/mccm/FlowChartProcess/runFlowChart', {
    method: 'POST',
    body: params,
  });
}

// 活动kpi列表
export async function queryCampignKpi(params) {
  return request('/mccm/marketmgr/campaign/CampaignController/queryCampignKpi', {
    method: 'POST',
    body: params,
  });
}

// 锁住流程图
export async function lockFlowChart(params) {
  return request('/campaign/MccFlowchartController/lockFlowChart', {
    method: 'POST',
    body: params,
  });
}

// 解锁流程图
export async function unLockFlowChart(params) {
  return request('/campaign/MccFlowchartController/unLockMccFlowChart', {
    method: 'POST',
    body: params,
  });
}

// 活动统计
export async function qryStateNum(params) {
  return request('/campaign/MccCampaignController/qryStateNum', {
    method: 'POST',
    body: params,
  });
}

// 活动类型
export async function qryCamType(params) {
  return request('/mccm/marketmgr/mccfolder/MccFolderController/qryCamType', {
    method: 'POST',
    body: params,
  });
}

//  拖动左边节点保存节点数据
export async function addMccProcess(params) {
  return request('/campaign/MccFlowchartController/addMccProcess', {
    method: 'POST',
    body: params,
  });
}

// 派发范围下拉查询
// export async function qryAllLan(params) {
//   return request('/mccm/system/SystemCommonRegionController/qryAllLan', {
//     method: 'POST',
//     body: params,
//   });
// }
