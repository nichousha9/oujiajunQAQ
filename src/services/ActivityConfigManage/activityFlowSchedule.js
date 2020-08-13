import request from '@/utils/request';

// 查询活动的结束时间
export async function qryCamSchedulerNode(params) {
  return request('/campaign/MccProcessSchedulerController/qryCamSchedulerNode', {
    method: 'POST',
    body: params,
  });
}

// 查询活动的结束时间
export async function updateCamSchedulerNode(params) {
  return request('/campaign/MccProcessSchedulerController/updateCamSchedulerNode', {
    method: 'POST',
    body: params,
  });
}

// 增加定时器节点
export async function addProcess(params) {
  return request('/mccm/FlowChartProcess/Schedule/AddProcess', {
    method: 'POST',
    body: params,
  });
}

// 编辑定时器节点
export async function modProcess(params) {
  return request('/mccm/FlowChartProcess/Schedule/ModProcess', {
    method: 'POST',
    body: params,
  });
}

// // 获取初始化数据id
// export async function qryTimingByObjectId(params) {
//   return request('/mccm/FlowChartProcess/Schedule/QryTimingByObjectId', {
//     method: 'POST',
//     body: params,
//   });
// }

// 获取初始化数据
export async function qryTiming(params) {
  return request('/mccm/FlowChartProcess/Schedule/QryTimingById', {
    method: 'POST',
    body: params,
  });
}

// 获取Schedule列表类型运行数据
export async function qryTimeListByTimingId(params) {
  return request('/mccm/FlowChartProcess/Schedule/QryTimeListByTimingId', {
    method: 'POST',
    body: params,
  });
}

// 获取日志
export async function qryRunTimeLog(params) {
  return request('/mccm/FlowChartProcess/Schedule/QryRunTimeLog', {
    method: 'POST',
    body: params,
  });
}



