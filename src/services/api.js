import { stringify } from 'qs';
import request from '../utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

/* 真实接口 */
// 登录
export async function accountLogin(params) {
  return request('/smartim/cs/login', {
    method: 'POST',
    body: params,
  });
}
// 登出
export async function accountLogout(params) {
  return request('/smartim/cs/logout', {
    method: 'POST',
    body: params,
  });
}
// 注册
export async function accountRegister(params) {
  return request('/smartim/cs/register', {
    method: 'POST',
    body: params,
  });
}
// 创建企业
export async function orgCreater(params) {
  return request('/smartim/system/organ/create', {
    method: 'POST',
    body: params,
  });
}
// 获取企业创建类型
export async function getOrgStaticCode(params) {
  return request('/smartim/sysDict/getSonDicsByPcode', {
    method: 'POST',
    body: params,
  });
}
// 获取首页数据
export async function getHomePageDate(params) {
  return request('/smartim/agent/workSummary', {
    method: 'POST',
    body: params,
  });
}
// 获取客服列表
export async function getAllAgentList(params) {
  return request('/smartim/agent/allAgent', {
    method: 'POST',
    body: params,
  });
}
// 管理-主页-更改坐席状态
export async function agentstatusUpdate(params) {
  return request('/smartim/agent/agentstatus/update', {
    method: 'POST',
    body: params,
  });
}
// 获取客户信息
export async function agentuser(params) {
  return request('/imclient/agent/agentuser', {
    method: 'POST',
    body: params,
  });
}
// 更新客户信息
export async function agentuserUpdate(params) {
  return request('/imclient/agent/updateAgentUser', {
    method: 'POST',
    body: params,
  });
}
// 获取客户跟进备注列表
export async function getAgentRemarks(params) {
  return request('/imclient/agent/remarks', {
    method: 'POST',
    body: params,
  });
}
// 新增跟进备注
export async function addAgentRemark(params) {
  return request('/imclient/agent/remarks/add', {
    method: 'POST',
    body: params,
  });
}
// 坐席-获取对话列表
export async function agentusers(params) {
  return request('/smartim/agent/getSessionList', {
    method: 'POST',
    body: params,
  });
}
// 坐席-获取对话列表 包括讨论组
export async function agentUsersAndGroup(params) {
  return request('/smartim/agent/getSessionList', {
    method: 'POST',
    body: params,
  });
}
// 坐席 - 获取历史消息记录
export async function chatmessages(params) {
  return request('/imclient/agent/chatmessagesDesc', {
    method: 'POST',
    body: params,
  });
}
// fetchGetChatMessages
export async function chatmessagesDesc(params) {
  return request('/imclient/agent/chatmessagesDesc', {
    method: 'POST',
    body: params,
  });
}
// 快速回复列表
export async function getQuickreplys(params) {
  return request('/smartim/agent/quickreplys', {
    method: 'POST',
    body: params,
  });
}
// 快速回复分类列表
export async function getQuickTypes(params) {
  return request('/smartim/agent/quickreplys/types', {
    method: 'POST',
    body: params,
  });
}
// 新增分类
export async function addQuickType(params) {
  return request('/smartim/agent/quickreplys/types/save', {
    method: 'POST',
    body: params,
  });
}
export async function deleteQuickType(params) {
  return request('/smartim/agent/quickreplys/types/delete', {
    method: 'POST',
    body: params,
  });
}
export async function editQuickType(params) {
  return request('/smartim/agent/quickreplys/types/update', {
    method: 'POST',
    body: params,
  });
}
// 新增快速回复
export async function addQuickReply(params) {
  return request('/smartim/agent/quickreplys/save', {
    method: 'POST',
    body: params,
  });
}
export async function deleteQuickReply(params) {
  return request('/smartim/agent/quickreplys/delete', {
    method: 'POST',
    body: params,
  });
}
export async function editQuickReply(params) {
  return request('/smartim/agent/quickreplys/update', {
    method: 'POST',
    body: params,
  });
}
// 查询网站列表
export async function listSnsaccount(params) {
  return request('/smartim/snsaccount/list', {
    method: 'POST',
    body: params,
  });
}
// 新增网站列表
export async function addSnsaccount(params) {
  return request('/smartim/snsaccount/save', {
    method: 'POST',
    body: params,
  });
}
// 获取公钥
export async function getSnsaccountPk(params) {
  return request('/smartim/snsaccount/getpk', {
    method: 'POST',
    body: params,
  });
}
// 重置公钥
export async function resetSnsaccountPk(params) {
  return request('/smartim/snsaccount/resetpk', {
    method: 'POST',
    body: params,
  });
}
// 编辑网站列表
export async function updateSnsaccount(params) {
  return request('/smartim/snsaccount/update', {
    method: 'POST',
    body: params,
  });
}
// 删除网站列表
export async function deleteSnsaccount(params) {
  return request('/smartim/snsaccount/delete', {
    method: 'POST',
    body: params,
  });
}
// 查询工单列表
export async function listWorkorder(params) {
  return request('/smartim/workorder/listByTenentid', {
    method: 'POST',
    body: params,
  });
}
// 查询工单列表
export async function listWorkorderByUserid(params) {
  return request('/smartim/workorder/listByUserid', {
    method: 'POST',
    body: params,
  });
}
// 获取工单配置列表
export async function listWorkorderConfig(params) {
  return request('/smartim/workorder/config/list', {
    method: 'POST',
    body: params,
  });
}
// 新增工单配置列表
export async function addWorkorderConfig(params) {
  return request('/smartim/workorder/config/add', {
    method: 'POST',
    body: params,
  });
}
// 修改工单配置列表
export async function modifyWorkorderConfig(params) {
  return request('/smartim/workorder/config/modify', {
    method: 'POST',
    body: params,
  });
}
// 删除工单配置列表
export async function deleteWorkorderConfig(params) {
  return request('/smartim/workorder/config/delete', {
    method: 'POST',
    body: params,
  });
}
// 获取字典列表
export async function getSonDicsByPcode(params) {
  return request('/smartim/sysDict/getSonDicsByPcode', {
    method: 'POST',
    body: params,
  });
}
// 获取文件信息
export async function getFileByFileids(params) {
  return request('/smartim/common/attachment/getByFileids', {
    method: 'POST',
    body: params,
  });
}
// 获取字典列表
export async function getPDicts(params) {
  return request('/smartim/sysDict/getPDics', {
    method: 'POST',
    body: params,
  });
}
// 获取历史会话
export async function getChatmessages(params) {
  return request('/imclient/agent/chatmessagesDesc', {
    method: 'POST',
    body: params,
  });
}
// 获取相关问题列表
export async function getRelateQues(params) {
  return request('/smartim/knowledge/findKdbQuestionLike', {
    method: 'POST',
    body: params,
  });
}
// 获取 知识树
// 获取 知识库的列表
export async function getcateList(params) {
  return request('/smartim/kdb/cate/list', {
    method: 'POST',
    body: params,
  });
}
// 获取同义词列表
export async function getStandardWordList(params) {
  return request('/smartim/kdb/standardWord/list', {
    method: 'POST',
    body: params,
  });
}
// 知识目录根据登陆人出现的部门
export async function getOrganByUser(params) {
  return request('/smartim/knowledge/cate/organ', {
    method: 'POST',
    body: params,
  });
}
// 新增知识库节点，或者修改
export async function saveCate(params) {
  return request('/smartim/knowledge/cate/save', {
    method: 'POST',
    body: params,
  });
}
// 删除知识库节点，或者修改
export async function deleteCate(params) {
  return request('/smartim/knowledge/cate/delete', {
    method: 'POST',
    body: params,
  });
}
// 标准问题保存
export async function standardQuesSave(params) {
  return request('/smartim/knowledge/standardQues/save', {
    method: 'POST',
    body: params,
  });
}
// 获取标准问题保存
export async function getStandardQuesDetail(params) {
  return request('/smartim/knowledge/standardQues/detail', {
    method: 'POST',
    body: params,
  });
}
// 标准问题删除
export async function standardQuesDelete(params) {
  return request('/smartim/knowledge/standardQues/delete', {
    method: 'POST',
    body: params,
  });
}
// 知识点删除
export async function knowledgeDelete(params) {
  return request('/smartim/kdb/knowledge/delete', {
    method: 'POST',
    body: params,
  });
}
// 标准问题启用
export async function standardQuesSetAble(params) {
  return request('/smartim/knowledge/standardQues/setAble', {
    method: 'POST',
    body: params,
  });
}
// 知识点启用和停用
export async function knowledgeSetAble(params) {
  return request('/smartim/kdb/knowledge/setAble', {
    method: 'POST',
    body: params,
  });
}
// 知识点列表
export async function getKnowledgeList(params) {
  return request('/smartim/kdb/knowledge/list', {
    method: 'POST',
    body: params,
  });
}
//  排除标准问题的列表
export async function getFilterIdsQuesList(params) {
  return request('/smartim/kdb/standardQues/filterIdsList', {
    method: 'POST',
    body: params,
  });
}
//  排除知识点的列表
export async function getFilterKnowledgeList(params) {
  return request('/smartim/kdb/knowledge/filterIdsList', {
    method: 'POST',
    body: params,
  });
}
// 标准问题列表
export async function getStandardQuesList(params) {
  return request('/smartim/knowledge/standardQues/list', {
    method: 'POST',
    body: params,
  });
}

// 清空知识库
export async function deleteAll(params) {
  return request('/smartim/knowledge/standardQues/deleteAll', {
    method: 'POST',
    body: params,
  });
}

// 获取技能组列表
export async function getSkillList(params) {
  return request('/smartim/agent/skills', {
    method: 'POST',
    body: params || {},
  });
}
// 获取分级技能组列表
export async function getClassifySkillList(params) {
  return request('/smartim/agent/skillsWithGroup', {
    method: 'POST',
    body: params || {},
  });
}
// 获取在线用户列表
export async function getOnlineUsers(params) {
  return request('/smartim/agent/onlineUsers', {
    method: 'POST',
    body: params,
  });
}
// 转接坐席
export async function transferAgent(params) {
  return request('/smartim/agent/transfer', {
    method: 'POST',
    body: params,
  });
}
// 转接到技能组
export async function transferAgent2Group(params) {
  return request('/smartim/agent/transfer2group', {
    method: 'POST',
    body: params,
  });
}
// 结束会话
export async function endService(params) {
  return request('/smartim/agent/endService', {
    method: 'POST',
    body: params,
  });
}
// 获取历史记录列表
export async function getHistoryList(params) {
  return request('/smartim/history/statistical/agentMsglist', {
    method: 'POST',
    body: params,
  });
}
// 获取历史记录列表
export async function getHistoryGroupList(params) {
  return request('/smartim/history/statistical/groupList', {
    method: 'POST',
    body: params,
  });
}

// 获取机器人消息列表
export async function robotMsgList(params) {
  return request('/smartim/history/statistical/robotMsgList', {
    method: 'POST',
    body: params,
  });
}

// 获取机器人详细聊天记录
export async function getRobotChatList(params) {
  return request(
    '/imclient/getRobotChatList',
    {
      method: 'POST',
      body: params,
    },
    true
  );
}

// 获取客服消息详细聊天记录
export async function getAgentChatList(params) {
  return request(
    '/imclient/getAgentChatList',
    {
      method: 'POST',
      body: params,
    },
    true
  );
}

// 获取群组消息详细聊天记录
export async function getGroupChatList(params) {
  return request(
    '/imclient/getGroupChatList',
    {
      method: 'POST',
      body: params,
    },
    true
  );
}

// 相似问题的保存
export async function questionItemSave(params) {
  return request(
    '/smartim/knowledge/questionItem/save',
    {
      method: 'POST',
      body: params,
    },
    true
  );
}
// 相似问题的删除
export async function questionItemDelete(params) {
  return request('/smartim/kdb/questionItem/delete', {
    method: 'POST',
    body: params,
  });
}
// /smartim/kdbPickup/cate/list
// 获取所有的知识图的节点
export async function getKdbPickUpCateList(params) {
  return request('/smartim/knowledge/pickup/cate/list', {
    method: 'POST',
    body: params,
  });
}

// 获取所有的知识图的节点
export async function getCateAllList(params) {
  return request('/smartim/knowledge/cate/alllist', {
    method: 'POST',
    body: params,
  });
}
// 知识点保存
export async function knowledgeSave(params) {
  return request('http://10.45.47.16:9004/smartim/kdbImport/templet', {
    method: 'POST',
    body: params,
    noTop: true,
  });
}
// 知识库文件导入
export async function kdbImportFile(params) {
  return request('/smartim/kdb/importfile', {
    method: 'POST',
    body: params,
  });
}
// 知识库文件模板下载
export async function kdbTempletDown(params) {
  return request(
    `${global.req_url}/smartim/knowledge/file/templet?importtype=kdb_standard_ques_import`,
    {
      method: 'POST',
      body: params,
      fetchType: 'file',
      noTop: true,
    }
  );
}
// 知识库导入
export async function kdbfileParse(params) {
  return request('/smartim/knowledge/file/parse', {
    method: 'POST',
    body: params,
  });
}
// 获取标准词删除
export async function standardWordDelete(params) {
  return request('/smartim/kdb/standardWord/delete', {
    method: 'POST',
    body: params,
  });
}
// 获取标准词启用/停用
export async function standardWordSetAble(params) {
  return request('/smartim/kdb/standardWord/setAble', {
    method: 'POST',
    body: params,
  });
}
// 获取标准词保存
export async function standardWordSave(params) {
  return request('/smartim/kdb/standardWord/save', {
    method: 'POST',
    body: params,
  });
}
// 获取标准词保存
export async function getStandardWordDetail(params) {
  return request('/smartim/kdb/standardWord/detail', {
    method: 'POST',
    body: params,
  });
}
// 文件上传，返回文件路径
export async function uploadFile(params) {
  return request('/smartim/agent/upload', {
    method: 'POST',
    body: params,
  });
}
// 发送短信
export async function sendMsg(params) {
  return request('/smartim/validate/sendValidate', {
    method: 'POST',
    body: params,
  });
}
// 手机验证码登录
export async function loginbyPhone(params) {
  return request('/smartim/cs/mobileLogin', {
    method: 'POST',
    body: params,
  });
}
// 上传图片
export async function importImg(params) {
  return request('/smartim/system/attachment/upload', {
    method: 'POST',
    body: params,
  });
}
// 获取当前租户的机器人列表 smartim/kdb/list
export async function getUserKdbList(params) {
  return request('/smartim/knowledge/kdb/list', {
    method: 'POST',
    body: params,
  });
}
// 上传文件删除 attachmentids
export async function uopladFileDelete(params) {
  return request('/smartim/common/attachment/delete', {
    method: 'POST',
    body: params,
  });
}
// 首页按时间获取概要
export async function getSummeryByTime(params) {
  return request('/smartim/home/statistical/findByTime', {
    method: 'POST',
    body: params,
  });
}
// 首页按时间获取当前在线用户列表
export async function getOnlineUserList(params) {
  return request('/smartim/home/statistical/onlineUserList', {
    method: 'POST',
    body: params,
  });
}
// 获取首页的客服列表
export async function getAgentList(params) {
  return request('/smartim/history/statistical/agentList', {
    method: 'POST',
    body: params,
  });
}
// 按用户的权限过滤的客服
export async function getAgentAtuhList(params) {
  return request('/smartim/total/statistical/getAllAgentUser', {
    method: 'POST',
    body: params,
  });
}
// 获取技能分组的列表 organskills
export async function getOrganskills(params) {
  return request('/smartim/total/statistical/organskills', {
    method: 'POST',
    body: params,
  });
}
// 获取首页的热门解决方案
export async function getMostUsedQuestion(params) {
  return request('/smartim/kdb/standardQues/getMostUsedQuestion', {
    method: 'POST',
    body: params,
  });
}
// 获取首页的未解决问题
export async function getUnsolvedQuestion(params) {
  return request('/smartim/kdb/standardQues/getUnsolvedQuestion', {
    method: 'POST',
    body: params,
  });
}
/*  知识库场景模块接口 */

// 场景列表
export async function getSceneList(params) {
  return request('/smartim/scene/botscene/list', {
    method: 'POST',
    body: params,
  });
}

// 保存场景
export async function saveScene(params) {
  return request('/smartim/scene/botscene/save', {
    method: 'POST',
    body: params,
  });
}
// 启用或者停用场景
export async function setAbleScene(params) {
  return request('/smartim/scene/botscene/setAble', {
    method: 'POST',
    body: params,
  });
}
// 场景的删除
export async function deleteScene(params) {
  return request('/smartim/scene/botscene/delete', {
    method: 'POST',
    body: params,
  });
}
// 场景对话新增
export async function saveSceneDialog(params) {
  return request('/smartim/botscene/botchatFlow/save', {
    method: 'POST',
    body: params,
  });
}
// 场景对话删除
export async function deleteSceneDialog(params) {
  return request('/smartim/botscene/botchatFlow/delete', {
    method: 'POST',
    body: params,
  });
}
// 场景对话的开启或关闭
export async function setAbleSceneDialog(params) {
  return request('/smartim/botscene/botchatFlow/setAble', {
    method: 'POST',
    body: params,
  });
}
// 场景对话列表
export async function getSceneDialogList(params) {
  return request('/smartim/botscene/botchatFlow/list', {
    method: 'POST',
    body: params,
  });
}
// 场景对话的设置节点列表
export async function getSysChatTypeList(params) {
  return request('/smartim/scene/sceneConfig/getSysChatType', {
    method: 'POST',
    body: params,
  });
}
// /smartim/statistical/solutionQuestion
// 获取首页的未解决问题
export async function getUnsolvedQuestionTop(params) {
  return request('/smartim/kdb/standardQues/getMostUnsolvedQuestion', {
    method: 'POST',
    body: params,
  });
}
// 导出未解决问题
export async function exportUnsolvedQuestion(params) {
  let url = `${global.req_url}/smartim/statistical/exportUnsolvedQuestion?`;
  for (const key in params) {
    url += `${key}=${params[key]}&`;
  }
  window.open(url, '_blank');
  return;

  return request('/smartim/statistical/exportUnsolvedQuestion', {
    method: 'POST',
    body: params,
  });
}

// 动态添加对话设置函数节点的id
export async function getFunctionNodeId(params) {
  return request('/smartim/codes/save', {
    method: 'POST',
    body: params,
  });
}

// 动态添加触发节点的id
export async function getNodeSetting(params) {
  return request('/smartim/scene/sceneConfig/saveTrigger', {
    method: 'POST',
    body: params,
  });
}

// 修改触发节点的设置
export async function updateNodeSetting(params) {
  return request('/smartim/scene/sceneConfig/updateTrigger', {
    method: 'POST',
    body: params,
  });
}

// 修改触发节点的设置
export async function deleteNodeSetting(params) {
  return request('/smartim/scene/sceneConfig/deleteTrigger', {
    method: 'POST',
    body: params,
  });
}

// 动态新增回复节点
export async function insertAnswer(params) {
  return request('/smartim/scene/sceneConfig/insertAnswer', {
    method: 'POST',
    body: params,
  });
}

// 修改回复节点的设置
export async function updateAnswerTrigger(params) {
  return request('/smartim/scene/sceneConfig/updateAnswer', {
    method: 'POST',
    body: params,
  });
}

// 获取回复节点的详情
export async function getAnswerDetail(params) {
  return request('/smartim/scene/sceneConfig/getAnswerDetail', {
    method: 'POST',
    body: params,
  });
}

// 1、	新增填槽节点
export async function insertSlot(params) {
  return request('/smartim/scene/sceneConfig/insertSlot', {
    method: 'POST',
    body: params,
  });
}

// 2、	修改填槽节点
export async function updateSlot(params) {
  return request('/smartim/scene/sceneConfig/updateSlot', {
    method: 'POST',
    body: params,
  });
}

// 3、	删除填槽节点参数
export async function deleteSlotParam(params) {
  return request('/smartim/scene/sceneConfig/deleteSlotParam', {
    method: 'POST',
    body: params,
  });
}

// 4、	删除填槽节点参数反问
export async function deleteSlotAsk(params) {
  return request('/smartim/scene/sceneConfig/deleteSlotAsk', {
    method: 'POST',
    body: params,
  });
}

// 5、	获取填槽节点详情
export async function getSlotDetail(params) {
  return request('/smartim/scene/sceneConfig/getSlotDetail', {
    method: 'POST',
    body: params,
  });
}

// 根据节点id获取当前的节点的详细信息
export async function getNodeDetail(params) {
  return request('/smartim/scene/sceneConfig/getTriggerDetail', {
    method: 'POST',
    body: params,
  });
}
// 保存场景对话设置的流程图
export async function saveBotChatFlowSet(params) {
  return request('/smartim/scene/sceneConfig/saveSceneChatNexusSetting', {
    method: 'POST',
    body: params,
  });
}
// 获取当前场景对话的对话设置
export async function getBotChatFlowSet(params) {
  return request('/smartim/scene/sceneConfig/getSceneChatSetting', {
    method: 'POST',
    body: params,
  });
}

// 保存当前开始和结束节点
export async function saveStartAndEndChatFlow(params) {
  return request('/smartim/scene/sceneConfig/saveStartAndEndChatFlow', {
    method: 'POST',
    body: params,
  });
}

// 场景对话历史对话
export async function getTestMessage(params) {
  return request('/smartim/botscene/botchatFlow/setting/testMessage', {
    method: 'POST',
    body: params,
  });
}
// 获取数据字典的接口
export async function getDataDicByType(params) {
  return request('/smartim/common/getConst', {
    method: 'POST',
    body: params,
  });
}
// 获取知识分类
export async function getKnowledgeType(params) {
  return request('/smartim/knowledge/sort/list', {
    method: 'POST',
    body: params,
  });
}
// 获取离线的At信息
export async function getAtOutlineInfo(params) {
  return request('/im/getMentions', {
    method: 'POST',
    body: params,
  });
}
// 获取客户端~~~~
export async function noFilter(params) {
  return $.post('http://localhost:12354/notifier', params);
}
// 获取下载地址
export async function getDownAdress(params) {
  return request('/smartim/common/open/getStaticParamByCode', {
    method: 'POST',
    body: params,
  });
}

// fabu
export async function reloadBotScene(params) {
  return request('/smartim/botscene/reloadBotScene', {
    method: 'POST',
    body: params,
  });
}

export async function getSonDicsByCode(params) {
  return request(
    '/smartim/sysDict/getSonDicsByCode?code=human.cost',
    {
      method: 'GET',
    },
    false,
    true
  );
}

export async function checkSynonym(params) {
  return request('/smartim/knowledge/standardQues/checkSynonym', {
    method: 'POST',
    body: params,
  });
}

export async function checkKeyword(params) {
  return request('/smartim/knowledge/standardQues/checkKeyword', {
    method: 'POST',
    body: params,
  });
}

export async function getKeywordList(params) {
  return request('/smartim/knowledge/standardQues/getKeywordList', {
    method: 'POST',
    body: params,
  });
}

export async function kdbUpdate(params) {
  return request('/smartim/knowledge/kdbUpdate', {
    method: 'POST',
    body: params,
  });
}

export async function getKdbHealth(params) {
  return request(
    '/smartim/kdb/getKdbHealth',
    {
      method: 'POST',
      body: params,
    },
    true
  );
}

export async function updateKdbQuestion(params) {
  return request(
    '/smartim/kdb/updateKdbQuestion',
    {
      method: 'POST',
      body: params,
    },
    true
  );
}
