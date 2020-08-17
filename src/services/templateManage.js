import request from '@/utils/request';

export async function getAllTemplate(params) {
  return request('/template/getAllTemplate', {
    method: 'POST',
    body: params,
  });
}
