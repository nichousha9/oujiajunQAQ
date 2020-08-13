import request from '@/utils/request';

// 检验阿里接口开关是否开启，是的话返回true
export async function qryAttrValue(params) {
  return request('/system/attrSpecController/qryAttrValue', {
    method: 'POST',
    body: params,
  });
}

// 获取节点选择的决策分组
export async function qryIreGroupsRels(params) {
  return request('/marketmgr/processCreativeInfoRel/qryIreGroupsRels', {
    method: 'POST',
    body: params,
  });
}

// 获取商品内容
export async function qryOfferRels(params) {
  return request('/marketmgr/processOfferRel/qryOfferRels', {
    method: 'POST',
    body: params,
  });
}

// 获取推荐规则
export async function qryRcmdRulesRels(params) {
  return request('/marketmgr/processRcmdRulesRel/qryRcmdRulesRels', {
    method: 'POST',
    body: params,
  });
}

// 运营位接口
export async function qryAdviceChannel(params) {
  return request('/dodmgr/MccChannelOperationController/qryAdviceChannel', {
    method: 'POST',
    body: params,
  });
}

// 查询模板目录接口
export async function qryMessageFolder(params) {
  return request('/advice/MccAdviceFolder/qryMessageFolder', {
    method: 'POST',
    body: params,
  });
}

// 查询创意接口
export async function qryCreativeInfoList(params) {
  return request('/advice/MccAdviceInfo/qryAdviceInfoList', {
    method: 'POST',
    body: params,
  });
}

// 查询创意接口
export async function qryAdviceInfo(params) {
  return request('/advice/MccAdviceInfo/qryAdviceInfo', {
    method: 'POST',
    body: params,
  });
}

// 获取规则集接口
export async function qryOptRuleset(params) {
  return request('/FlowChartProcess/pop/qryOptRuleset', {
    method: 'POST',
    body: params,
  });
}

// 查询规则组中的规则详情接口
export async function qryOptRuleOfRuleset(params) {
  return request('/FlowChartProcess/pop/qryOptRuleOfRuleset', {
    method: 'POST',
    body: params,
  });
}

// 决策分组接口
export async function qryDecisionGroups(params) {
  return request('/FlowChartProcess/Ire/qryDecisionGroups', {
    method: 'POST',
    body: params,
  });
}

// 查询分群列表接口
export async function qryMccSegmentInfo(params) {
  return request('/FlowChartProcess/qryMccSegmentInfo', {
    method: 'POST',
    body: params,
  });
}

// 查询环节数据接口
export async function qryPreProcessInfos(params) {
  return request('/marketmgr/inputCellController/qryPreProcessInfos', {
    method: 'POST',
    body: params,
  });
}

// 输出
export async function qryOutputCells(params) {
  return request('/marketmgr/processOutputcell/qryOutputCells', {
    method: 'POST',
    body: params,
  });
}

// 获取序列
export async function getSeqList(params) {
  return request('/FlowChartProcess/pop/getSeqList', {
    method: 'POST',
    body: params,
  });
}

// 查询输出元素设置弹出框的目标客户群接口
export async function qryCampCellByFlowchartId(params) {
  return request('/FlowChartProcess/pop/qryCampCellByFlowchartId', {
    method: 'POST',
    body: params,
  });
}

// 新增app接口
export async function addProcess(params) {
  return request('/FlowChartProcess/contactMgr/addProcess', {
    method: 'POST',
    body: params,
  });
}

// 修改app
export async function modProcess(params) {
  return request('/campaign/MccProcessChannelController/updateCamChannelNode', {
    method: 'POST',
    body: params,
  });
}

// 获取节点数据
export async function qryProcess(params) {
  return request('/campaign/MccProcessChannelController/qryCamChannelNode', {
    method: 'POST',
    body: params,
  });
}

// 获取之前保存输入数据
export async function qryProcessCellInfo(params) {
  return request('/FlowChartProcess/pop/qryProcessCellInfo', {
    method: 'POST',
    body: params,
  });
}

// 获取之前保存运营位数据
export async function qryAdviceChannelRel(params) {
  return request('/marketmgr/processAdviceChannelRel/qryAdviceChannelRel', {
    method: 'POST',
    body: params,
  });
}

// 获取之前保存名单数据
export async function qryMccProcessSegmentRel(params) {
  return request('/marketmgr/MccProcessSegmentRelController/qryRedBlackWhiteSegs', {
    method: 'POST',
    body: params,
  });
}

// 获取之前保存规则数据
export async function qryProcessOptimize(params) {
  return request('/marketmgr/processOptimize/qryProcessOptimize', {
    method: 'POST',
    body: params,
  });
}

// 获取之前保存创意数据
export async function qryCreativeInfoRels(params) {
  return request('/marketmgr/processCreativeInfoRel/qryCreativeInfoRels', {
    method: 'POST',
    body: params,
  });
}

// 获取之前保存的回复模板(接触反溃)
export async function qryResponseTemps(params) {
  return request('/marketmgr/processResponseTempRel/qryResponseTemps', {
    method: 'POST',
    body: params,
  });
}

// 获取Source号码下拉框数据
export async function getBfmParamValue(params) {
  return request('/FlowChartProcess/pop/getBfmParamValue', {
    method: 'POST',
    body: params,
  });
}

// 获取回复类型下拉框数据
export async function qryResponseType(params) {
  return request('/FlowChartProcess/pop/qryResponseType', {
    method: 'POST',
    body: params,
  });
}

// 获取有效期初始值
export async function qryProcessEffDateRel(params) {
  return request('/marketmgr/processEffDateRel/qryProcessEffDateRel', {
    method: 'POST',
    body: params,
  });
}

// 获取测试群组初始值
export async function qryTestContactSeg(params) {
  return request('/marketmgr/MccProcessSegmentRelController/qryTestContactSeg', {
    method: 'POST',
    body: params,
  });
}

// 获取模板列表
export async function qryOrderModelList(params) {
  return request('/dmt/MccOrderModelController/qryOrderModelList', {
    method: 'POST',
    body: params,
  });
}

export async function qryProcessModelRel(params) {
  return request('/dmt/processModelRelController/qryProcessModelRel', {
    method: 'POST',
    body: params,
  });
}
