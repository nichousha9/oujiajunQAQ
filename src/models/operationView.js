import {
  dialogCountTotal,
  dialogCountCurrMonth,
  dialogCountDay,
  dialogCountMonth,
  intentTotle,
  keywordTotle,
  questionTotle,
  keywordDayCount,
  questionDayCount,
  intentDayCount,
  userCount,
  userCountDay,
  userCountMonth,
  kdbRankingList,
  intentRankingList,
} from '../services/operationView';
//   import {filterEmptyChild, getPaginationList} from '../utils/utils';

export default {
  namespace: 'operationView',
  state: {},
  effects: {
    *dialogCountTotal({ payload, callback }, { call }) {
      const response = yield call(dialogCountTotal, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *dialogCountCurrMonth({ payload, callback }, { call }) {
      const response = yield call(dialogCountCurrMonth, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *dialogCountDay({ payload, callback }, { call }) {
      const response = yield call(dialogCountDay, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *dialogCountMonth({ payload, callback }, { call }) {
      const response = yield call(dialogCountMonth, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *intentTotle({ payload, callback }, { call }) {
      const response = yield call(intentTotle, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *keywordTotle({ payload, callback }, { call }) {
      const response = yield call(keywordTotle, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *questionTotle({ payload, callback }, { call }) {
      const response = yield call(questionTotle, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *keywordDayCount({ payload, callback }, { call }) {
      const response = yield call(keywordDayCount, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *questionDayCount({ payload, callback }, { call }) {
      const response = yield call(questionDayCount, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *intentDayCount({ payload, callback }, { call }) {
      const response = yield call(intentDayCount, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *userCount({ payload, callback }, { call }) {
      const response = yield call(userCount, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *userCountDay({ payload, callback }, { call }) {
      const response = yield call(userCountDay, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *userCountMonth({ payload, callback }, { call }) {
      const response = yield call(userCountMonth, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *kdbRankingList({ payload, callback }, { call }) {
      const response = yield call(kdbRankingList, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *intentRankingList({ payload, callback }, { call }) {
      const response = yield call(intentRankingList, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
  },
  reducers: {},
};
