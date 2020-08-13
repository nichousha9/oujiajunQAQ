import request from '@/utils/request';

// 获取新增推荐规则下拉框列表数据
export async function qryRecoRuleDropListData(params) {
  return request('/system/attrSpecController/qryAttrValueByCode', {
    method: 'POST',
    body: params,
  });
}

// 查询算法
export async function qryAlgorithm(params) {
  return request('/mccm/marketmgr/RCMDRulesListController/qryAlgorithm', {
    method: 'POST',
    body: params,
  });
}

// 获取推荐规则列表数据
export async function queryRecommendRuleSource(params) {
  return request('/mccm/marketmgr/RCMDRulesListController/qryRcmdRuleList', {
    method: 'POST',
    body: params,
  });
}

// 新增推荐规则
export async function addRcmdRule(params) {
  return request('/mccm/marketmgr/RCMDRulesListController/addRcmdRule', {
    method: 'POST',
    body: params,
  });
}

// 编辑推荐规则
export async function editRcmdRule(params) {
  return request('/mccm/marketmgr/RCMDRulesListController/editRcmdRule', {
    method: 'POST',
    body: params,
  });
}

// 删除推荐规则
export async function delRules(params) {
  return request('/mccm/marketmgr/RCMDRulesListController/delRules', {
    method: 'POST',
    body: params,
  });
}

// 查询推荐规则的关联商品列表（热卖）
export async function getRuleClickList(params) {
  return request('/mccm/marketmgr/RCMDRulesListController/getRulesGoodsList', {
    method: 'POST',
    body: params,
  });
}

// 推荐规则-修改关联商品（热卖）
export async function modifyRulesGoods(params) {
  return request('/mccm/marketmgr/RCMDRulesListController/modifyRulesGoods', {
    method: 'POST',
    body: params,
  });
}

// 推荐规则-删除关联商品（热卖）
export async function delRulesGoods(params) {
  return request('/mccm/marketmgr/RCMDRulesListController/delRulesGoods', {
    method: 'POST',
    body: params,
  });
}

// 推荐规则-新增关联商品 （热卖）
export async function addRulesGoods(params) {
  return request('/mccm/marketmgr/RCMDRulesListController/addRulesGoods', {
    method: 'POST',
    body: params,
  });
}

// 选择商品目录树接口
// 获取选择商品弹窗产品目录树数据
export async function queryMccFolderList(params) {
  return request('/mccm/marketmgr/OfferListController/queryMccFolderList', {
    method: 'POST',
    body: params,
  });
}

// 获取选择商品弹窗产品列表数据
export async function qryOffersInfo(params) {
  return request('/mccm/marketmgr/OfferListController/qryOffersInfo', {
    method: 'POST',
    body: params,
  });
}

// 选择商品弹窗：判断是否可以删除目录
export async function IfCanDelFolder(params) {
  return request('/mccm/marketmgr/OfferListController/getOfferListByFold', {
    method: 'POST',
    body: params,
  });
}

// 选择商品弹窗：删除目录
export async function delMccFolder(params) {
  return request('/mccm/marketmgr/OfferListController/delMccFolder', {
    method: 'POST',
    body: params,
  });
}

// 选择商品弹窗：添加目录
export async function addMccFolder(params) {
  return request('/mccm/marketmgr/OfferListController/addMccFolder', {
    method: 'POST',
    body: params,
  });
}

// 选择商品弹窗：编辑目录
export async function updateMccFolder(params) {
  return request('/mccm/marketmgr/OfferListController/updateMccFolder', {
    method: 'POST',
    body: params,
  });
}

// 个人喜欢--会员选择弹窗--获取会员信息
export async function getSubExtendAndSusbsList(params) {
  return request('/mccm/marketmgr/SubsBasicController/getSubExtendAndSusbsList', {
    method: 'POST',
    body: params,
  });
}

// 导出失败结果
export async function getFailResult(params) {
  return request('/mccm/marketmgr/RCMDRulesListController/exportFailedRulesGoods', {
    method: 'POST',
    body: params,
  });
}

// 查询导入表数据
export async function getTempRulesGoodsList(params) {
  return request('/mccm/marketmgr/RCMDRulesListController/getTempRulesGoodsList', {
    method: 'POST',
    body: params,
  });
}

// ------------------------------- 获取商家品牌 --------------------------------
export async function qryBrandName() {
  return request('/mccm/marketmgr/OfferListController/qryBrandName', {
    method: 'POST',
  });
}
