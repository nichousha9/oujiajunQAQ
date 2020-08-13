import request from '../utils/request';

// 查看机器人详情
export async function qryRobotDetail(params) {
  return request('/smartim/robot/qryRobotDetail',{
      method: 'POST',
      body: params,
    },true);
}

// 修改机器人信息
export async function updateRobot(params) {
  return request('/smartim/robot/updateRobot',{
      method: 'POST',
      body: params,
    },true);
}

// 查询机器人列表
export async function qryRobotList(params) {
  return request('/smartim/robot/qryRobotList',{
      method: 'POST',
      body: params,
    },true);
}

// 新增机器人
export async function addRobot(params) {
  return request('/smartim/robot/addRobot', {
    method: 'POST',
    body: params,
  }, true);
}

// 删除机器人
export async function delRobot(params) {
  return request('/smartim/robot/delRobot', {
    method: 'POST',
    body: params,
  }, true);
}

// 机器人未关联知识列表
export async function qryKdbNoRelevanceRobotList(params) {
  return request('/smartim/robot/qryKdbNoRelevanceRobotList', {
    method: 'POST',
    body: params,
  }, true);
}

// 机器人未关联场景列表
export async function qrySceneNoRelevanceRobotList(params) {
  return request('/smartim/robot/qrySceneNoRelevanceRobotList', {
    method: 'POST',
    body: params,
  }, true);
}

// 机器人关联知识列表
export async function qryKdbRelevanceRobotList(params) {
  return request('/smartim/robot/qryKdbRelevanceRobotList', {
    method: 'POST',
    body: params,
  }, true);
}


// 机器人关联场景列表
export async function qrySceneRelevanceRobotList(params) {
  return request('/smartim/robot/qrySceneRelevanceRobotList', {
    method: 'POST',
    body: params,
  }, true);
}

// 绑定知识库
export async function kdbBindingRobot(params) {
  return request('/smartim/robot/kdbBindingRobot', {
    method: 'POST',
    body: params,
  }, true);
}

// 绑定场景
export async function sceneBindingRobot(params) {
  return request('/smartim/robot/sceneBindingRobot', {
    method: 'POST',
    body: params,
  }, true);
}

// 解除绑定
export async function unbindRobot(params) {
  return request('/smartim/robot/unbindRobot', {
    method: 'POST',
    body: params,
  }, true);
}