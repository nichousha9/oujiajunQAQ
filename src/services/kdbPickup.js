// 获取知识分类
import request from "../utils/request";

// 知识收录保存草稿
export async function knowPickUp(params){
  return request('/smartim/kdbPickup/save',{
    method: 'POST',
    body: params,
  })
}
// 提交审核
export async function knowSubmitToAudit(params){
  return request('/smartim/kdbPickup/submit2Audit',{
    method: 'POST',
    body: params,
  })
}

// 直接提交审核
export async function knowSubmit(params){
  return request('/smartim/kdbPickup/saveAndSubmit2Audit',{
    method: 'POST',
    body: params,
  })
}
// 历史记录知识收录

export async function getKnowPickUpHisList(params){
  return request('/smartim/knowledge/pickup/list',{
    method: 'POST',
    body: params,
  })
}
// 审核接口 /smartim/kdbPickup/audite
export async function knowAudite(params){
  return request('/smartim/knowledge/pickup/audite',{
    method: 'POST',
    body: params,
  })
}
// 提交人查询
export async function getUserBelowOrgan(params){
  return request('/smartim/cs/getUserBelowOrgan',{
    method: 'POST',
    body: params,
  })
}
// 撤回知识收录
export async function cancelAudite(params){
  return request('/smartim/kdbPickup/cancelAudite',{
    method: 'POST',
    body: params,
  })
}
