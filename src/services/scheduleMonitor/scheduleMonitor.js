import request from '@/utils/request';


// 查询定时对象
export async function qryTimingObject(params) {

  return request('/mccm/marketmgr/SchedulerController/qryTimingObjectByParams', {
  // return request('/api/timingObject', {
    method: 'POST',
    body: params
  });
}

// 查询定时任务 mock
export async function qryScheduleList(params) { 
  return request('/mccm/marketmgr/SchedulerController/qrySchedule', {
  // return request('/api/scheduleList', {
    method: 'POST',
    body: params
  });
}

// 查询所有定时实例
export async function qryAllTimingInstance(params) {
  return request('/mccm/marketmgr/SchedulerController/qryAllTimingInstance', {
  // return request('/api/allScheduleDetailList', {
    method: 'POST',
    body: params
  });
}

// 查询已经运行实例
export async function qryAlreadyRunningTimingInstance(params) { 
  return request('/mccm/marketmgr/SchedulerController/qryTimingInstance', {
  // return request('/api/timingInstance', {
    method: 'POST',
    body: params
  });
}


// 查询等待运行实例
export async function qryWaitingTimingInstance(params) { 
  return request('/mccm/marketmgr/SchedulerController/qryTimingOverInstance', {
  // return request('/api/timingOverInstance', {
    method: 'POST',
    body: params
  });
}

export async function delTimingInstance(params) { 
  return request('/mccm/marketmgr/SchedulerController/delMccTimingList', {
  // return request('/api/delTimingInstance', {
    method: 'POST',
    body: params
  });
}

export async function getSystemUserList(params) {  
  // return request('/api/userList', {
  return request('/mccm/system/SystemUserController/qrySystemUserList', {
    method: 'POST',
    body: params
  });
}

export async function getSystemRoleList(params) { 
  // return request('/api/role', {
    return request('/mccm/system/SystemUserController/qrySystemRolesGrid', {
      method: 'POST',
      body: params
    });
}