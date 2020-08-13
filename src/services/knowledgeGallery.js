// 获取知识分类
import request from '../utils/request';

// 知识库列表
export async function getKdbPageList(params) {
  return request(
    '/smartim/kdb/orgi/list',
    {
      method: 'POST',
      body: params,
    },
    true
  );
}

// 知识库新增
export async function addKdb(params) {
  return request(
    '/smartim/kdb/add',
    {
      method: 'POST',
      body: params,
    },
    true
  );
}

// 知识库修改
export async function editKdb(params) {
  return request(
    '/smartim/kdb/update',
    {
      method: 'POST',
      body: params,
    },
    true
  );
}

// 知识库删除
export async function deleteKdb(params) {
  return request(
    '/smartim/kdb/delete',
    {
      method: 'POST',
      body: params,
    },
    true
  );
}

// 健康检测列表
export async function getKdbHealth(params) {
  return request(
    '/smartim/kdb/health/checkHealth',
    {
      method: 'POST',
      body: params,
    },
    true
  );
}

// 知识点审核通过
export async function passQuestions(params) {
  return request(
    '/smartim/knowledge/pickup/passQuestions',
    {
      method: 'POST',
      body: params,
    },
    true
  );
}

// 知识点审核不通过
export async function noPassQuestions(params) {
  return request(
    '/smartim/knowledge/pickup/noPassQuestions',
    {
      method: 'POST',
      body: params,
    },
    true
  );
}

// 知识点列表
export async function standardQues(params) {
  return request(
    '/smartim/standardQues/list',
    {
      method: 'POST',
      body: params,
    },
    true
  );
}

// 知识点详情
export async function standardQuesDteail(params) {
  return request(
    '/smartim/standardQues/detail',
    {
      method: 'POST',
      body: params,
    },
    true
  );
}

// 新增修改时校验核心词
export async function checkKeyword(params) {
  return request(
    '/smartim/standardQues/checkKeyword',
    {
      method: 'POST',
      body: params,
    },
    true
  );
}

// 校验同义词
export async function checkSynonym(params) {
  return request(
    '/smartim/standardQues/checkSynonym',
    {
      method: 'POST',
      body: params,
    },
    true
  );
}

// 启用停用
export async function setAble(params) {
  return request(
    '/smartim/standardQues/setAble',
    {
      method: 'POST',
      body: params,
    },
    true
  );
}

// 查询备选核心词
export async function getKeywordList(params) {
  return request(
    '/smartim/standardQues/getKeywordList',
    {
      method: 'POST',
      body: params,
    },
    true
  );
}

// 删除知识点
export async function standardQuesDelete(params) {
  return request(
    '/smartim/standardQues/delete',
    {
      method: 'POST',
      body: params,
    },
    true
  );
}

// 相似问题报存
export async function questionSave(params) {
  return request(
    '/smartim/questionItem/save',
    {
      method: 'POST',
      body: params,
    },
    true
  );
}

// 新增知识点
export async function saveQues(params) {
  return request(
    '/smartim/standardQues/save',
    {
      method: 'POST',
      body: params,
    },
    true
  );
}

// 修改知识点
export async function updateQues(params) {
  return request(
    '/smartim/standardQues/update',
    {
      method: 'POST',
      body: params,
    },
    true
  );
}

// 下载模版
export async function kdbTempletDown(params) {
  return request('/smartim/kdbImport/templet', {
    method: 'POST',
    body: params,
    fetchType: 'file',
  });
}

// 上传数据集
export async function uploadFile(params) {
  return request(
    '/smartim/knowledge/file/parse',
    {
      method: 'POST',
      body: params,
    },
    true
  );
}

//  更新aiStatus
export async function setAiStatus(params) {
  return request(
    '/smartim/knowledge/pickup/setAiStatus',
    {
      method: 'POST',
      body: params,
    },
    true
  );
}

// 同步数据
export async function kdbUpdate(params) {
  return request(
    '/smartim/kdbUpdate',
    {
      method: 'POST',
      body: params,
    },
    true
  );
}

// 获取知识库下拉框内容
export async function kdbList(params) {
  return request(
    '/smartim/kdb/kdbList',
    {
      method: 'POST',
      body: {
        ...params,
      },
    },
    true
  );
}

// 清空知識庫
export async function deleteAll(params) {
  return request(
    '/smartim/standardQues/deleteAll',
    {
      method: 'POST',
      body: {
        ...params,
      },
    },
    true
  );
}

// 獲取進度條
export async function uploadProcessData(params) {
  const url = `/smartim/knowledge/file/rate?fileId=${params.fileId}`;
  return request(
    url,
    {
      method: 'GET',
    },
    false,
    true
  );
}

// 新增问题核心词
export async function getAddKeywordList(params) {
  return request(
    '/smartim/standardQues/getKeywordList',
    {
      method: 'POST',
      body: {
        ...params,
      },
    },
    true
  );
}

// 健康检查列表
export async function qryCheckHealthList(params) {
  return request(
    '/smartim/kdb/health/qryCheckHealthList',
    {
      method: 'POST',
      body: {
        ...params,
      },
    },
    true
  );
}

// 查询问题详情
export async function detail(params) {
  return request(
    '/smartim/kdb/health/detail',
    {
      method: 'POST',
      body: {
        ...params,
      },
    },
    true
  );
}

// 不作处理
export async function noProcess(params) {
  return request(
    '/smartim/kdb/health/noProcess',
    {
      method: 'POST',
      body: {
        ...params,
      },
    },
    true
  );
}

// 启用对比
export async function useSimilarProblem(params) {
  return request(
    '/smartim/kdb/health/useSimilarProblem',
    {
      method: 'POST',
      body: {
        ...params,
      },
    },
    true
  );
}

// 启用原问题
export async function usePrimalProblem(params) {
  return request(
    '/smartim/kdb/health/usePrimalProblem',
    {
      method: 'POST',
      body: {
        ...params,
      },
    },
    true
  );
}

export async function getSonDicsByPcode(params) {
  return request('/smartim/sysDict/getSonDicsByPcode', {
    method: 'POST',
    body: params,
  });
}

export async function getSonDicsBystate(params) {
  return request('/smartim/sysDict/getSonDicsByPcode', {
    method: 'POST',
    body: params,
  });
}

export async function shareKdb(params) {
  return request(
    '/smartim/kdb/shareKdb',
    {
      method: 'POST',
      body: params,
    },
    true
  );
}

export async function cancelShareKdb(params) {
  return request(
    '/smartim/kdb/cancelShareKdb',
    {
      method: 'POST',
      body: params,
    },
    true
  );
}

// 知识库列表(普通管理员私有)
export async function getKdbPagenoPublicList(params) {
  return request(
    '/smartim/kdb/admin/noPublic/list',
    {
      method: 'POST',
      body: params,
    },
    true
  );
}

// 知识库列表(普通管理员共享)
export async function getKdbPagePublicList(params) {
  return request(
    '/smartim/kdb/admin/public/list',
    {
      method: 'POST',
      body: params,
    },
    true
  );
}

// 一键审核获取受影响的知识点
export async function qryInfluenceCount(params) {
  return request(
    '/smartim/standardQues/count',
    {
      method: 'POST',
      body: params,
    },
    true
  );
}

// 一键审核提交
export async function passQuestionsAll(params) {
  return request(
    '/smartim/knowledge/pickup/passQuestionsAll',
    {
      method: 'POST',
      body: params,
    },
    true
  );
}
