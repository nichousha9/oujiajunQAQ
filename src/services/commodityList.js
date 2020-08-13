import request from '@/utils/request';

// 获取所有目录
export async function getMccFolderList(params) {
  return request('/prod/MccProdController/qryAllMccProdFolder', {
    method: 'POST',
    body: params,
  });
}

// 添加目录
export async function addMccFolder(params) {
  return request('/mccm/marketmgr/OfferListController/addMccFolder', {
    method: 'POST',
    body: params,
  });
}

// 编辑目录
export async function updateMccFolder(params) {
  return request('/mccm/marketmgr/OfferListController/updateMccFolder', {
    method: 'POST',
    body: params,
  });
}

// 判断是否可以删除目录
export async function CanIDelFolder(params) {
  return request('/mccm/marketmgr/OfferListController/getOfferListByFold', {
    method: 'POST',
    body: params,
  });
}

// 删除目录
export async function delMccFolder(params) {
  return request('/mccm/marketmgr/OfferListController/delMccFolder', {
    method: 'POST',
    body: params,
  });
}

// 查询根目录
export async function qryRootNode(params) {
  return request('/prod/MccProdController/qryAllMccProdFolder', {
    method: 'POST',
    body: params,
  });
}

// 查询活动状态
export async function qryAttrValueByCode(params) {
  return request('/system/attrSpecController/qryAttrValueByCode', {
    method: 'POST',
    body: params,
  });
}

// 查询商品列表
export async function qryOffersInfo(params) {
  return request('/prod/MccProdController/qryListMccProd', {
    method: 'POST',
    body: params,
  });
}

// 查询标签列表
export async function getLabelInfoList(params) {
  return request('/marketmgr/labelMgr/MccLabelController/getLabelInfoList', {
    method: 'POST',
    body: params,
  });
}

// 查询标签详情
export async function queryLabelInfoById(params) {
  return request('/mccm/marketmgr/labelMgr/MccLabelController/queryLabelInfoById', {
    method: 'POST',
    body: params,
  });
}

// 新增商品
export async function addOffer(params) {
  return request('/mccm/marketmgr/OfferListController/addOffer', {
    method: 'POST',
    body: params,
  });
}

// 修改商品
export async function updataOffer(params) {
  return request('/mccm/marketmgr/OfferListController/updataOffer', {
    method: 'POST',
    body: params,
  });
}

// 删除商品
export async function delOffer(params) {
  return request('/mccm/marketmgr/OfferListController/delOffer', {
    method: 'POST',
    body: params,
  });
}

// 修改商品状态
export async function modOfferState(params) {
  return request('/mccm/marketmgr/OfferListController/modOfferState', {
    method: 'POST',
    body: params,
  });
}

// 拷贝商品
export async function copyOffer(params) {
  return request('/mccm/marketmgr/OfferListController/copyOffer', {
    method: 'POST',
    body: params,
  });
}

// 查询商品的标签信息
export async function qryProLabelRelData(params) {
  return request('/mccm/marketmgr/labelMgr/MccLabelController/qryProLabelRelData', {
    method: 'POST',
    body: params,
  });
}

// --------------------------- 获取商品详细信息 ------------------ modified：sol
export async function qryOffersExtendInfo(params) {
  return request('/prod/MccProdController/qryMccProd', {
    method: 'POST',
    body: params,
  });
}
// ----------------------------- 获取商品详细信息 ------------------
