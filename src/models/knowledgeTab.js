import { message } from 'antd';
import {
  getcateList,
  getKnowledgeList,
  getStandardQuesList,
  knowledgeSave,
  getOrganByUser,
  knowledgeDelete,
  standardQuesDelete,
  standardQuesSetAble,
  knowledgeSetAble,
  getCateAllList,
  saveCate,
  kdbUpdate,
  deleteAll,
} from '../services/api';
import { getPaginationList } from '../utils/utils';

export default {
  namespace: 'knowledgeTab',
  state: {
    defaultSelectCate: {}, // 默认选中的只是库
    cateList: [], // 知识库
    knowledgeList: [], // 知识点
    standardQuesList: [], // 标准问题,
    cateAllList: [],
    organByUser: [], // 根据登陆人拿到的部门
  },
  effects: {
    *fetchGetOrganByUser({ payload }, { call, put }) {
      const response = yield call(getOrganByUser, payload);
      if (response && response.status === 'OK') {      
        yield put({
          type: 'saveOrganByUser',
          payload: response.data,
        });
      }
    },
    *fetchGetNextOrganByUser({ payload }, { call, put }) {
      const response = yield call(getOrganByUser, payload);
      if (response && response.status === 'OK') {
        return response.data;
      }
    },
    *fetchSaveCate({ payload }, { call }) {
      const response = yield call(saveCate, payload);
      return response;
    },
    *fetchKnowledgeSave({ payload }, { call }) {
      yield call(knowledgeSave, payload);
    },
    *fetchGetCateAllList({ payload }, { call, put }) {
      const response = yield call(getCateAllList, payload);
      if (response && response.status === 'OK') {
        yield put({
          type: 'getCateAllList',
          payload: response.data,
        });
      }
    },
    *fetchCateList({ payload }, { call, put }) {
      const response = yield call(getcateList, payload);
      yield put({
        type: 'getCateList',
        payload: Array.isArray(response.data) ? response.data : [],
      });
    },
    *fetchKnowledgeList({ payload }, { call, put }) {
      const response = yield call(getKnowledgeList, payload);
      if (response.status === 'OK') {
        const obj = getPaginationList(response);
        yield put({
          type: 'getKnowledgeList',
          payload: obj,
        });
      }
    },
    *fetchStandardQuesList({ payload }, { call, put }) {
      const response = yield call(getStandardQuesList, payload);
      if (response.status === 'OK') {
        response.data.pageSize = response.data.pageInfo.pageSize
        response.data.pageNum = response.data.pageInfo.pageNum
        response.data.pages = response.data.pageInfo.pages
        response.data.total = response.data.pageInfo.total        
        response.data.list = response.data.questionList
        // .map((item) => {
        //   item.key=item.id
        //   return item
        // })
        // console.log('response.data.list')
        // console.log(response.data.list)
        const obj = getPaginationList(response);
        yield put({
          type: 'getStandardQuesList',
          payload: obj,
        });
      }
    },
    *fetchKnowledgeDelete({ payload }, { call }) {
      yield call(knowledgeDelete, payload);
    },
    *fetchStandardQuesDelete({ payload }, { call }) {
      yield call(standardQuesDelete, payload);
    },
    *fetchKnowledgeSetAble({ payload }, { call }) {
      yield call(knowledgeSetAble, payload);
    },
    *fetchStandardQuesSetAble({ payload }, { call }) {
      yield call(standardQuesSetAble, payload);
    },
    
    *kdbUpdate({ payload }, { call }) {
      const response = yield call(kdbUpdate, payload);
      return response;
    },

    // 清空知识库
    *deleteAll({ payload, callback }, { call }) {
      try {
        const res = yield call(deleteAll, payload);
        if(res && res.status === 'OK') {
          if(typeof callback === 'function') callback();
        } else {
          message.error(res && res.msg);
        }
      } catch(err) {
        message.error(err);
      }
    },
  },

  reducers: {
    saveOrganByUser(state, { payload }) {
      return {
        ...state,
        organByUser: payload,
      };
    },
    getCateAllList(state, { payload }) {
      const defaultSelectCate = payload && payload[0];
      return {
        ...state,
        defaultSelectCate,
        cateAllList: payload,
      };
    },
    getStandardWordList(state, { payload }) {
      return {
        ...state,
        getStandardWordList: payload,
      };
    },
    getCateList(state, { payload }) {
      const defaultSelectCate = payload[0] && payload[0];
      return {
        ...state,
        cateList: payload,
        defaultSelectCate,
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
    saveCateList(state, { payload }) {
      const defaultSelectCate = payload[0] && payload[0];
      return {
        ...state,
        cateAllList: payload,
      };
    },
  },
};
