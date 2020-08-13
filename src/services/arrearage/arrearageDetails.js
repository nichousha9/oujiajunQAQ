import request from '@/utils/request';

// 1. 查看详情
export async function qryDetailsList(params) {
  return request('/geekUnion/ZqythWidCustProdInfoMController/qryDetailsList', {
    method: 'POST',
    body: params,
  });
}

// 2. 查询地市下拉
export async function qryOrganizationLevel2(params) {
  return request('/geekUnion/ZqythWidCustProdInfoMController/qryOrganizationLevel2', {
    method: 'POST',
    body: params,
  });
}
