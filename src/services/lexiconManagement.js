// 获取知识分类
import request from "../utils/request";

// 专有和通用名词查询
export async function getPageList(params) {
  return request('/smartim/scene/noun/sortList', {
    method: 'POST',
    body: params,
  })
}

// 名词分类查询
export async function sortMemList(params) {
  return request('/smartim/scene/noun/sortMemList', {
    method: 'POST',
    body: params,
  })
}

// 名词分类查询
export async function uploadmyExcel(params) {
  return request('/smartim/scene/noun/excel', {
    method: 'POST',
    body: params,
  })
}

export async function searchPageList(params) {
  return request('/smartim/scene/noun/queryList', {
    method: 'POST',
    body: params,
  }
  
  )
}

export async function updateStandardNoun(params) {
  return request('/smartim/scene/noun/updateStandardNoun', {
    method: 'POST',
    body: params,
  })
}

export async function saveStandardNoun(params) {
  return request('/smartim/scene/noun/saveStandardNoun', {
    method: 'POST',
    body: params,
  })
}

export async function memDelete(params) {
  return request('/smartim/scene/noun/memDelete', {
    method: 'POST',
    body: params,
  },true)
}

export async function deleteRegularNoun(params) {
  return request('/smartim/scene/noun/deleteRegularNoun', {
    method: 'POST',
    body: params,
  })
}

export async function deleteStandardNoun(params) {
  return request('/smartim/scene/noun/deleteStandardNoun', {
    method: 'POST',
    body: params,
  })
}

export async function uploadProcessData(params) {
  const url = `/smartim/scene/noun/excelRate?fileId=${params.fileId}`;
  return request(url, {
    method: 'GET',
  },false,true)
}

 
 export async function updateRegularNoun(params) {
   return request('/smartim/scene/noun/updateRegularNoun', {
     method: 'POST',
     body: params,
   })
 }

 

 export async function saveRegularNoun(params) {
   return request('/smartim/scene/noun/saveRegularNoun', {
     method: 'POST',
     body: params,
   })
 }

 // 机器人对话
 export async function testRobotChat(params) {
  return request('/smartim/scene/botscene/testRobotChat', {
    method: 'POST',
    body: params,
  })
}