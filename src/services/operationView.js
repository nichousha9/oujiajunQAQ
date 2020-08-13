import request from '../utils/request';

// 累计问答
export async function dialogCountTotal(params) {
  return request('/smartim/DialogStatistics/dialogCountTotal',  {
    method: 'POST',
    body: params,
  },true);
}

// 本月问答
export async function dialogCountCurrMonth(params) {
  return request('/smartim/DialogStatistics/dialogCountCurrMonth', {
    method: 'POST',
    body: params,
  },true);
}

// 本周问答统计
export async function dialogCountDay(params) {
  return request('/smartim/DialogStatistics/dialogCountDay', {
    method: 'POST',
    body: params,
  },true);
}

// 半年内问答统计
export async function dialogCountMonth(params) {
  return request('/smartim/DialogStatistics/dialogCountMonth', {
    method: 'POST',
    body: params,
  },true);
}
// 统计机器人下意图数量
export async function intentTotle(params) {
  return request('/smartim/AssetsStatistics/intentTotle', {
    method: 'POST',
    body: params,
  },true);
}

// 按天查询核心词数量
export async function keywordDayCount(params) {
  return request('/smartim/AssetsStatistics/keywordDayCount', {
    method: 'POST',
    body: params,
  },true);
}

// 统计机器人下核心词数量
export async function keywordTotle(params) {
  return request('/smartim/AssetsStatistics/keywordTotle', {
    method: 'POST',
    body: params,
  },true);
}

// 统计机器人知识数量
export async function questionTotle(params) {
  return request('/smartim/AssetsStatistics/questionTotle', {
    method: 'POST',
    body: params,
  },true);
}

// 按天查询知识点数量
export async function questionDayCount(params) {
    return request('/smartim/AssetsStatistics/questionDayCount', {
      method: 'POST',
      body: params,
    },true);
  }

 // 按天统计机器人下意图数量
export async function intentDayCount(params) {
    return request('/smartim/AssetsStatistics/intentDayCount', {
      method: 'POST',
      body: params,
    },true);
  } 

 // 用户数量统计 
 export async function userCount(params) {
  return request('/smartim/UserStatistics/userCount', {
    method: 'POST',
    body: params,
  },true);
} 

// 本周用户数量统计 
export async function userCountDay(params) {
  return request('/smartim/UserStatistics/userCountDay', {
    method: 'POST',
    body: params,
  },true);
} 

// 半年内用户数量统计 
export async function userCountMonth(params) {
  return request('/smartim/UserStatistics/userCountMonth', {
    method: 'POST',
    body: params,
  },true);
} 

// 知识排行榜 
export async function kdbRankingList(params) {
  return request('/smartim/KdbIntentStatistics/kdbRankingList', {
    method: 'POST',
    body: params,
  },true);
} 

// 意图排行榜 
export async function intentRankingList(params) {
  return request('/smartim/KdbIntentStatistics/intentRankingList', {
    method: 'POST',
    body: params,
  },true);
} 