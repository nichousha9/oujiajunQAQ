import request from '@/utils/request';

export async function qryWorkOrderTypeList(params) {
  return request('/mccm/marketmgr/mccfolder/MccFolderController/qryCamType', {
    method: 'POST',
    body: params,
  });
}


export async function qryTemplateElementList(params) {
  return request('/geekUnion/MccOrderColumnController/qryColumnList', {
    method: 'POST',
    body: params,
  });
}

export async function addTemplateElement(params) {
  return request('/geekUnion/MccOrderColumnController/addOrderColumn', {
    method: 'POST',
    body: params,
  });
}

export async function updateTemplateElement(params) {
  return request('/geekUnion/MccOrderColumnController/updateOrderColumn', {
    method: 'POST',
    body: params,
  });
}

export async function getLabelTableCodeField(params) {
  return request('/mccm/marketmgr/labelMgr/MccLabelController/getLabelTabelCodeField', {
    method: 'POST',
    body: params,
  });
}

export async function qryIcons(params) {
  return request('/geekUnion/MccOrderColumnController/qryIcons', {
    method: 'POST',
    body: params,
  });
}
