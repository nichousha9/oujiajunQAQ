import request from "../utils/request";

// 机器人统计接口
export async function robotStatistical(params) {
  return request('/smartim/total/statistical/robot', {
    method: 'POST',
    body: params,
  });
}
// 机器人统计接口
export async function agentStatistical(params) {
  return request('/smartim/total/statistical/agentFindByStatisticalTime', {
    method: 'POST',
    body: params,
  });
}

// 访客的统计
export async function agentuserStatistical(params) {
  return request('/smartim/total/statistical/agentuserFindByStatisticalTime', {
    method: 'POST',
    body: params,
  });
}
// 访客标签统计
export async function agentLabelStatistical(params) {
  return request('/smartim/statistical/userlabel', {
    method: 'POST',
    body: params,
  });
}
// 访客城市统计
export async function agentRegionStatistical(params) {
  return request('/smartim/total/statistical/agentuserByOrgan', {
    method: 'POST',
    body: params,
  });
}
// 通讯统计-概况-子部门明细
export async function comChildOrgDetail(params) {
  return request('/smartim/total/statistical/sonOrganSummary', {
    method: 'POST',
    body: params,
  });
}
// 通讯统计-概况-折线图数据
export async function comGraphicSummary(params) {
  return request('/smartim/total/statistical/organ/summaryDetail', {
    method: 'POST',
    body: params,
  });
}
// 通讯统计-概况-部门数据
export async function comOrganSummary(params) {
  return request('/smartim/total/statistical/currOrganSummary', {
    method: 'POST',
    body: params,
  });
}
// 通讯统计-用户情况-明细
export async function comUserSummary(params) {
  return request('/smartim/total/statistical/getUserInfo', {
    method: 'POST',
    body: params,
  });
}
