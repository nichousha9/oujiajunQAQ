import request from '../utils/request';


/*
-----------------------实体-----------------------
 */

// 编辑意图对话时抽取实体
// sceneid，sentence
export async function pickupEntity(params) {
  return request('/smartim/botscene/botutterance/pickupEntity', {
    method: 'POST',
    body: params,
  });
}


// 获取实体列表接口
// sceneid
export async function getEntityList(params) {
  return request('/smartim/botscene/botentity/list', {
    method: 'POST',
    body: params,
  });
}

// 获取系统实体列表接口
export async function getSysEntityList() {
  return request('/smartim/botscene/sysEntity/list', {
    method: 'POST',
  });
}

// 保存场景实体
// sceneid ,entityid
export async function saveEntity(params) {
  return request('/smartim/botscene/botentity/save', {
    method: 'POST',
    body: params,
  });
}


// 删除实体
// sceneid ,entityid
export async function deleteEntity(params) {
  return request('/smartim/botscene/botentity/delete', {
    method: 'POST',
    body: params,
  });
}

/*
 -----------------------意图-----------------------
 */

// 获取意图接口列表
// sceneid
export async function getIntentionList(params) {
  return request('/smartim/scene/intent/all', {
    method: 'POST',
    body: params,
  });
}

// 获取意图明细
// id
export async function getIntentionInfo(params) {
  return request('/smartim/botscene/botintent/detail', {
    method: 'POST',
    body: params,
  });
}

// 新增或修改意图
// 【id,sceneId，name，code，isBuiltin：是否内建，isTrigger：是否触发场景，isEnable：是否启用，status：''】
export async function saveIntentionInfo(params) {
  return request('/smartim/scene/intent/save', {
    method: 'POST',
    body: params,
  });
}

// 删除意图
// 【id】
export async function deleteIntentionInfo(params) {
  return request('/smartim/scene/intent/delete', {
    method: 'POST',
    body: params,
  });
}

// 启用以及不启用意图
// id,ablevalue:1启用，0不启用
export async function setIntentionAble(params) {
  return request('/smartim/botscene/botintent/setAble', {
    method: 'POST',
    body: params,
  });
}

// 获取意图对话列表
// sceneid,intent
export async function getIntentionDialogList(params) {
  return request('/smartim/scene/utterance/all', {
    method: 'POST',
    body: params,
  });
}

// 删除意图对话样本
// id
export async function deleteIntentionDialog(params) {
  return request('/smartim/scene/utterance/delete', {
    method: 'POST',
    body: params,
  });
}

// 获取意图对话样本明细
// id
export async function getIntentionDialogInfo(params) {
  return request('/smartim/botscene/botutterance/detail', {
    method: 'POST',
    body: params,
  });
}

// 新增或者修改对话样本
// 【sceneId,sentence,intent]
// 【intentPrediction:预测意图编码，annotations:注解，annotationsPrediction:预测注解】
export async function saveIntentionDialogSample(params) {
  return request('/smartim/scene/utterance/save', {
    method: 'POST',
    body: params,
  });
}

// 新增或保存快速回复
// 【sceneId,intent,answerJsonString	]
export async function saveIntentionDialogReply(params) {
  return request('/smartim/botscene/botintentAnswer/save', {
    method: 'POST',
    body: params,
  });
}

// 删除快速回复
// 【id	]
export async function deleteIntentionDialogReply(params) {
  return request('/smartim/botscene/botintentAnswer/delete', {
    method: 'POST',
    body: params,
  });
}

// 获取场景意图对话样本列表
// 【sceneid,intent,p,ps]
export async function getIntentionDialogSampleList(params) {
  return request('/smartim/scene/utterance/selectUtteranceByIntentId', {
    method: 'POST',
    body: params,
  });
}

// 获取场景意图快速回复列表
// 【intent：意图编码]
export async function getIntentionDialogReplyList(params) {
  return request('/smartim/botscene/botintentAnswer/list', {
    method: 'POST',
    body: params,
  });
}

// 通过意图id获取对话样本列表

export async function getByIntentId(params) {
  return request('/smartim/scene/intentSlot/getByIntentId', {
    method: 'POST',
    body: params,
  });
}

// 停启用意图

export async function isEnableIntent(params) {
  return request('/smartim/scene/intent/isEnableIntent', {
    method: 'POST',
    body: params,
  });
}

// 更新意图短语

export async function updateIntentSlots(params) {
  return request('/smartim/scene/intentSlot/updateIntentSlots', {
    method: 'POST',
    body: params,
  });
}

// 删除意图短语

export async function deleteIntentSlots(params) {
  return request('/smartim/scene/intentSlot/delete', {
    method: 'POST',
    body: params,
  });
}
// 获取意图词槽
// 【sceneid,intent]
export async function getIntentionSlotList(params) {
  return request('/smartim/scene/intentSlot/getByUtteranceId', {
    method: 'POST',
    body: params,
  });
}
// 获取意图短语


// 获取系统操作符
export async function getIntentionOperatorList(params) {
  return request('/smartim/scene/sceneConfig/getOperationalChar', {
    method: 'POST',
    body: params,
  });
}
// 场景意图的下拉列表
export async function getSimpleSceneList(params) {
  return request('/smartim/botscene/simpleScene/list', {
    method: 'POST',
    body: params,
  });
}
// 场景意图测试
export async function getSceneIntentionTest(params) {
  return request('/smartim/botscene/botintent/analyse', {
    method: 'POST',
    body: params,
  });
}
// 直接获取场景的名词
export async function getSceneSlots(params) {
  return request('/smartim/botscene/getSceneSlots', {
    method: 'POST',
    body: params,
  });
}
// 场景训练
export async function botsceneTrain(params) {
  return request('/smartim/robot/fresh', {
    method: 'POST',
    body: params,
  });
}

export async function selectAllList(params) {
  return request('/smartim/featureNoun/selectAllList', {
    method: 'POST',
    body: params,
  });
}
export async function addFeatureNoun(params) {
  return request('/smartim/featureNoun/addFeatureNoun', {
    method: 'POST',
    body: params,
  });
}
export async function modFeatureNoun(params) {
  return request('/smartim/featureNoun/modFeatureNoun', {
    method: 'POST',
    body: params,
  });
}
export async function enableFeatureNoun(params) {
  return request('/smartim/featureNoun/enableFeatureNoun', {
    method: 'POST',
    body: params,
  });
}
export async function delFeatureNoun(params) {
  return request('/smartim/featureNoun/delFeatureNoun', {
    method: 'POST',
    body: params,
  });
}
