import {
  getCateAllList,
  getStandardQuesDetail,
  getFilterIdsQuesList,
  questionItemSave,
  getFilterKnowledgeList,
  standardQuesSave,
  checkSynonym,
  checkKeyword,
  getKeywordList,
} from '../services/api';
import { getPaginationList } from '../utils/utils';

export default {
  namespace: 'addStandardQuestion',
  state: {
    knowledgeList: {
      list: [],
      pagination: {
        pageSize: 10,
        total: 0,
      },
    }, // 知识点列表
    standardQuesList: {
      list: [],
      pagination: {
        pageSize: 10,
        total: 0,
      },
    }, // 标准问题
    questionItemSave: [], // 相似问题
    questionList: [{}], // 相似问题,
    relQuestionList: [], // 相关
    relKnowledgeList: [], // 相关
    cateAllList: [],
    curQuestionInfo: {}, // 当前修改的问题的信息;
  },
  effects: {
    *getStandardQuesDetail({ payload }, { call, put }) {
      const response = yield call(getStandardQuesDetail, payload);
      if (response.status === 'OK') {
        yield put({
          type: 'saveInfoQuestion',
          payload: response.data,
        });
      }
    },
    *fetchstandardQuesSave({ payload }, { call }) {
      const res = yield call(standardQuesSave, payload);
      return res;
    },
    *fetchStandardQuesList({ payload }, { call, put }) {
      const response = yield call(getFilterIdsQuesList, payload);
      if (response.status === 'OK') {
        const obj = getPaginationList(response);
        yield put({
          type: 'getStandardQuesList',
          payload: obj,
        });
      }
    },
    *fetchKnowledgeList({ payload }, { call, put }) {
      const response = yield call(getFilterKnowledgeList, payload);
      if (response.status === 'OK') {
        const obj = getPaginationList(response);
        yield put({
          type: 'getKnowledgeList',
          payload: obj,
        });
      }
    },
    *fetchGetCateAllList({ payload }, { call, put }) {
      const response = yield call(getCateAllList, payload);
      if (response.status === 'OK') {
        yield put({
          type: 'getCateAllList',
          payload: response.data,
        });
      }
    },
    *fetchQuestionItemSave({ payload }, { call, put }) {
      const response = yield call(questionItemSave, payload);
      if (response.status === 'OK') {
        yield put({
          type: 'questionItemSave',
          payload: response.data.data,
        });
      }
    },
    *checkSynonym({ payload }, { call, put }) {
      const response = yield call(checkSynonym, payload);
      return response;
    },
    *checkKeyword({ payload }, { call, put }) {
      const response = yield call(checkKeyword, payload);
      return response;
    },
    *getKeywordList({ payload }, { call, put }) {
      const response = yield call(getKeywordList, payload);
      return response;
    },
  },

  reducers: {
    saveInfoQuestion(state, { payload }) {
      // 根据用户存的信息;
      const { questionItemList = [], relKnowledgeList = [], relQuestionList = [] } = payload;
      return {
        ...state,
        curQuestionInfo: payload,
        questionList: questionItemList,
        relQuestionList,
        relKnowledgeList,
      };
    },
    getKnowledgeList(state, { payload }) {
      return {
        ...state,
        knowledgeList: payload,
      };
    },
    getStandardQuesList(state, { payload }) {
      return {
        ...state,
        standardQuesList: payload,
      };
    },
    getCateAllList(state, { payload }) {
      return {
        ...state,
        cateAllList: payload,
      };
    },
    questionItemSave(state, { payload }) {
      const { questionList } = state;
      let flag = false;
      const newQuestionList = questionList.map(question => {
        if (!question.id && !flag) {
          flag = true;
          return payload;
        }
        return question;
      });
      return {
        ...state,
        questionList: newQuestionList,
      };
    },
    addEmptyQuestion(state) {
      const { questionList } = state;
      questionList.push({});
      return {
        ...state,
        questionList,
      };
    },
    saveRelQuestionList(state, { payload = [] }) {
      const { relQuestionList = [] } = state;
      return {
        ...state,
        relQuestionList: [...relQuestionList, ...payload],
      };
    },
    deleteRelQuestionList(state, payload) {
      const { relQuestionList } = state;
      return {
        ...state,
        relQuestionList: relQuestionList.filter(question => {
          return question.id !== payload.payload;
        }),
      };
    },
    saveRelKnowledgeList(state, { payload }) {
      const { relKnowledgeList } = state;
      return {
        ...state,
        relKnowledgeList: [...relKnowledgeList, ...payload],
      };
    },
    deleteRelKnowledgeList(state, payload) {
      const { relKnowledgeList } = state;
      return {
        ...state,
        relKnowledgeList: relKnowledgeList.filter(question => {
          return question.id !== payload.payload;
        }),
      };
    },
    deleteQuestionList(state, { payload }) {
      const { questionList } = state;
      return {
        ...state,
        questionList: questionList.filter(question => {
          return question.id !== payload;
        }),
      };
    },
    clearState(state) {
      return {
        ...state,
        curQuestionInfo: {}, // 当前修改的标准问题的信息清空
        questionList: [{}], // 相似问题,
        relQuestionList: [], // 相关
        relKnowledgeList: [], // 相关
      };
    },
  },
};
