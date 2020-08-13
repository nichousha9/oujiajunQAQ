import request from '@/utils/request';

// 查询列表
export async function qryApprovalRecordList(params) {
  return request('/mccm/dmt/ApprovalRecordController/qryApprovalRecordList', {
    method: 'POST',
    body: params,
  });
}

// 选择审核模板接口
export async function insertApprovalRecord(params) {
  return request('/mccm/dmt/ApprovalRecordController/insertApprovalRecord', {
    method: 'POST',
    body: params,
  });
}

// 审批流程步骤
export async function qryApprovalRecordListByCampaign(params) {
  return request('/mccm/dmt/ApprovalRecordController/qryApprovalRecordListByCampaign', {
    method: 'POST',
    body: params,
  });
}

// 获取角色审核模板
export async function qryFlowchartByRecordId(params) {
  return request('/mccm/dmt/ApprovalRecordController/qryFlowchartByRecordId', {
    method: 'POST',
    body: params,
  });
}

// 获取定时任务周期id和开始结束时间
export async function qryProcessTimingByCampaignId(params) {
  return request('/mccm/FlowChartProcess/Schedule/qryProcessTimingByCampaignId', {
    method: 'POST',
    body: params,
  });
}
