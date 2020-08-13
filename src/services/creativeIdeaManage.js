import request from '@/utils/request';

// 目录树查询接口
export async function qryMessageFolder(params) {
  return request('/advice/MccAdviceFolder/qryMessageFolder', {
    method: 'POST',
    body: params,
  });
}

// 目录新增接口
export async function addAdviceTypeSort(params) {
  return request('/advice/MccAdviceFolder/addAdviceTypeSort', {
    method: 'POST',
    body: params,
  });
}

// 目录修改接口
export async function modAdviceTypeSort(params) {
  return request('/advice/MccAdviceFolder/modAdviceTypeSort', {
    method: 'POST',
    body: params,
  });
}

// 目录删除接口
export async function delAdviceTypeSort(params) {
  return request('/advice/MccAdviceFolder/delAdviceTypeSort', {
    method: 'POST',
    body: params,
  });
}

// 创意列表查询接口
export async function qryCreativeInfoList(params) {
  return request('/advice/MccAdviceInfo/qryAdviceInfoList', {
    method: 'POST',
    body: params,
  });
}

// 创意详情查询接口
export async function qryMccAdviceType(params) {
  return request('/dmt/AdviceTypeController/qryMccAdviceType', {
    method: 'POST',
    body: params,
  });
}

// 创意新增
export async function operatorAdviceType(params) {
  return request('/advice/MccAdviceInfo/addAdviceInfo', {
    method: 'POST',
    body: params,
  });
}

// 编辑创意
export async function operatorAdviceTypeEdit(params) {
  return request('/advice/MccAdviceInfo/modAdviceInfo', {
    method: 'POST',
    body: params,
  });
}

// 创意删除接口
export async function delCreativeInfo(params) {
  return request('/advice/MccAdviceInfo/delAdviceInfo', {
    method: 'POST',
    body: params,
  });
}

// 渠道列表查询
export async function qryTargetChannel(params) {
  return request('/channel/MccChannelController/qryListMccChannel', {
    method: 'POST',
    body: params,
  });
}

// 创意模板列表查询 || 查询标签列表
export async function getLabelInfoList(params) {
  return request('/marketmgr/labelMgr/MccLabelController/getLabelInfoList', {
    method: 'POST',
    body: params,
  });
}

// 创意关联商品列表查询 || 未关联创意商品列表查询
export async function qryOffersInfo(params) {
  return request('/mccm/marketmgr/OfferListController/qryOffersInfo', {
    method: 'POST',
    body: params,
  });
}

// 保存创意关联商品
export async function addOfferCreative(params) {
  return request('/mccm/marketmgr/MccOfferCreativeController/addOfferCreative', {
    method: 'POST',
    body: params,
  });
}

// 删除创意关联商品
export async function delOfferCreative(params) {
  return request('/mccm/marketmgr/MccOfferCreativeController/delOfferCreative', {
    method: 'POST',
    body: params,
  });
}

// 商品目录树查询
export async function queryMccFolderList(params) {
  return request('/mccm/marketmgr/OfferListController/queryMccFolderList', {
    method: 'POST',
    body: params,
  });
}

// 获取宏列表
export async function qryMacroList(params) {
  return request('/advice/AdviceMacroController/qryMacroList', {
    method: 'POST',
    body: params,
  });
}

// 复制创意 templateInfoType !==1
export async function copyAdviceType(params) {
  return request('/mccm/dmt/AdviceTypeController/copyAdviceType', {
    method: 'POST',
    body: params,
  });
}

// 复制创意 templateInfoType ===1
export async function addCopyCreativeInfo(params) {
  return request('/advice/MccAdviceInfo/addCopyAdviceInfo', {
    method: 'POST',
    body: params,
  });
}

// 移动创意 templateInfoType !==1
export async function changeAdviceType(params) {
  return request('/mccm/dmt/AdviceTypeController/changeAdviceType', {
    method: 'POST',
    body: params,
  });
}

// 移动创意 templateInfoType ===1
export async function updateMoveCreative(params) {
  return request('/advice/MccAdviceInfo/modAdviceFolder', {
    method: 'POST',
    body: params,
  });
}

// 创意图片新增
export async function addCreativeInfo(params) {
  return request('/mccm/dmt/CreativeInfoController/addCreativeInfo', {
    method: 'POST',
    body: params,
  });
}

// 根据标签ID查询对应下拉框的值
export async function getValidLabelValueByLabelId(params) {
  return request('/mccm/marketmgr/labelMgr/MccLabelController/getValidLabelValueByLabelId', {
    method: 'POST',
    body: params,
  });
}

// 编辑图片创意时查询创意下的标签列表
export async function getLabelDatasByInfo(params) {
  return request('/mccm/dmt/TemplateInfoLabelInstController/getLabelDatasByInfo', {
    method: 'POST',
    body: params,
  });
}

// 更新图片创意
export async function editCreativeInfo(params) {
  return request('/mccm/dmt/CreativeInfoController/editCreativeInfo', {
    method: 'POST',
    body: params,
  });
}

// 图片创意 标签关联属性
export async function qryProLabelRelData(params) {
  return request('/mccm/marketmgr/labelMgr/MccLabelController/qryProLabelRelData', {
    method: 'POST',
    body: params,
  });
}

// 上传创意图片
export async function saveImageFile(params) {
  return request('/mccm/dmt/UploadImageController/saveImageFile', {
    method: 'POST',
    body: params,
    noTopCont: true,
    headers: {
      'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryeXBkJ69c1AI7BZVU',
    },
  });
}
