import request from '@/utils/request';

// 系统用户登陆日志列表
export async function qrySystemUserLoginLogList(params) {
  return request('/mccm/system/LoginController/qrySystemUserLoginLogList', {
    method: 'POST',
    body: params,
  });
}

// 系统用户历史访问菜单
export async function qrySystemUserHistoryMenuLogList(params) {
  return request('/mccm/system/LoginController/qrySystemUserHisyMenuLogList', {
    method: 'POST',
    body: params,
  });
}
