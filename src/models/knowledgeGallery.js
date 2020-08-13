/* eslint-disable no-unused-vars */
import {
  addKdb,
  editKdb,
  deleteKdb,
  getKdbPageList,
  standardQues,
  standardQuesDteail,
  checkKeyword,
  checkSynonym,
  setAble,
  getKeywordList,
  standardQuesDelete,
  questionSave,
  saveQues,
  getKdbHealth,
  passQuestions,
  noPassQuestions,
  uploadFile,
  setAiStatus,
  kdbUpdate,
  qryCheckHealthList,
  detail,
  noProcess,
  useSimilarProblem,
  usePrimalProblem,
  updateQues,
  getSonDicsByPcode,
  getSonDicsBystate,
  cancelShareKdb,
  shareKdb,
  getKdbPagenoPublicList,
  getKdbPagePublicList,
  qryInfluenceCount,
  passQuestionsAll,
} from '../services/knowledgeGallery';

export default {
  namespace: 'knowledgeGallery',
  state: {
    kdbList: [{ id: 0 }], // 知识库
    quesList: {},
    quesDetail: {},
    heathList: {},
    symbol: [],
    savestate: [],
    influenceCount: '',
  },
  effects: {
    *fetchKdbList({ payload }, { call, put }) {
      // console.log('payload',payload)
      const response = yield call(getKdbPageList, payload);
      if (response && response.status === 'OK') {
        yield put({
          type: 'saveKdbList',
          payload: response.data,
        });
      }
    },

    *getKdbPagenoPublicList({ payload }, { call, put }) {
      // console.log('payload',payload)
      const response = yield call(getKdbPagenoPublicList, payload);
      if (response && response.status === 'OK') {
        yield put({
          type: 'saveKdbList',
          payload: response.data,
        });
      }
    },

    *getKdbPagePublicList({ payload }, { call, put }) {
      // console.log('payload',payload)
      const response = yield call(getKdbPagePublicList, payload);
      if (response && response.status === 'OK') {
        yield put({
          type: 'saveKdbList',
          payload: response.data,
        });
      }
    },

    *passQuestionsAll({ payload }, { call }) {
      const response = yield call(passQuestionsAll, payload);
      return response;
    },

    *qryInfluenceCount({ payload }, { call, put }) {
      // console.log('payload',payload)
      const response = yield call(qryInfluenceCount, payload);
      if (response && response.status === 'OK') {
        yield put({
          type: 'saveInfluenceCount',
          payload: response.data,
        });
      }
    },

    *deleteKdb({ payload }, { call }) {
      const response = yield call(deleteKdb, payload);
      return response;
    },
    *editKdb({ payload }, { call }) {
      const response = yield call(editKdb, payload);
      return response;
    },
    *addKdb({ payload }, { call }) {
      const response = yield call(addKdb, payload);
      return response;
    },

    *cancelShareKdb({ payload }, { call }) {
      const response = yield call(cancelShareKdb, payload);
      return response;
    },
    *shareKdb({ payload }, { call }) {
      const response = yield call(shareKdb, payload);
      return response;
    },

    *qryQesList({ payload }, { call, put }) {
      // console.log('payload',payload)
      const response = yield call(standardQues, payload);
      if (response && response.status === 'OK') {
        yield put({
          type: 'saveQuesList',
          payload: response.data.pageInfo,
        });
      }
    },
    *changeAble({ payload }, { call, put }) {
      // console.log('payload',payload)
      const response = yield call(setAble, payload);
      return response;
    },
    *deleteReq({ payload }, { call, put }) {
      // console.log('payload',payload)
      const response = yield call(standardQuesDelete, payload);
      return response;
    },
    *getStandardQuesDteail({ payload }, { call, put }) {
      // console.log('payload',payload)
      const response = yield call(standardQuesDteail, payload);
      if (response && response.status === 'OK') {
        yield put({
          type: 'saveQuesDteail',
          payload: response.data,
        });
      }
    },
    *saveSameQuertion({ payload, callback }, { call, put }) {
      const response = yield call(questionSave, payload);
      if (callback) callback(response);
      return response;
    },
    *checkKey({ payload }, { call, put }) {
      const response = yield call(checkKeyword, payload);
      return response;
    },
    *getSonDicsByPcode({ payload, callback }, { call, put }) {
      const response = yield call(getSonDicsByPcode, payload);
      if (callback) callback(response.data);
      return response;
    },
    *checkSame({ payload }, { call, put }) {
      const response = yield call(checkSynonym, payload);
      return response;
    },
    *saveQuetions({ payload }, { call, put }) {
      const response = yield call(saveQues, payload);
      return response;
    },
    *updateQues({ payload }, { call, put }) {
      const response = yield call(updateQues, payload);
      return response;
    },

    *upload({ payload }, { call, put }) {
      const response = yield call(uploadFile, payload);
      return response;
    },
    *kdbUpdate({ payload }, { call, put }) {
      const response = yield call(kdbUpdate, payload);
      return response;
    },
    *clearDetail({ payload }, { call, put }) {
      yield put({
        type: 'clear',
      });
    },
    *setAiStatus({ payload }, { call, put }) {
      const response = yield call(setAiStatus, payload);
      return response;
    },

    *getWordList({ payload }, { call, put }) {
      const response = yield call(getKeywordList, payload);
      return response;
    },

    *getHeath({ payload, callback }, { call, put }) {
      const response = yield call(getKdbHealth, payload);
      return response;
    },
    *passQuestion({ payload }, { call, put }) {
      const response = yield call(passQuestions, payload);
      return response;
    },

    *unPassQuestion({ payload }, { call, put }) {
      const response = yield call(noPassQuestions, payload);
      return response;
    },

    *clearList({ payload }, { call, put }) {
      yield put({
        type: 'clearKdbList',
      });
    },
    *qryCheckHealthList({ payload, callback }, { call, put }) {
      const response = yield call(qryCheckHealthList, payload);
      if (response && response.status === 'OK') {
        yield put({
          type: 'saveHeathList',
          payload: response.data,
        });
      }
      if (callback) {
        callback();
      }
    },
    *qryDetail({ payload }, { call, put }) {
      const response = yield call(detail, payload);
      return response;
    },
    *noProcess({ payload }, { call, put }) {
      const response = yield call(noProcess, payload);
      return response;
    },
    *useSimilarProblem({ payload }, { call, put }) {
      const response = yield call(useSimilarProblem, payload);
      return response;
    },
    *usePrimalProblem({ payload }, { call, put }) {
      const response = yield call(usePrimalProblem, payload);
      return response;
    },
  },

  reducers: {
    saveKdbList(state, { payload }) {
      const { kdbList } = state;
      return {
        ...state,
        kdbList: payload ? kdbList.concat(payload) : kdbList,
        // kdbList:payload,
      };
    },
    clearKdbList(state) {
      return {
        ...state,
        kdbList: [{ id: 0 }],
      };
    },
    saveQuesList(state, { payload }) {
      return {
        ...state,
        quesList: payload,
        // kdbList:payload,
      };
    },
    saveQuesDteail(state, { payload }) {
      return {
        ...state,
        quesDetail: payload,
        // kdbList:payload,
      };
    },
    saveHeathList(state, { payload }) {
      return {
        ...state,
        heathList: payload,
        // kdbList:payload,
      };
    },
    savesymbol(state, { payload }) {
      return {
        ...state,
        symbol: payload,
        // kdbList:payload,
      };
    },

    saveInfluenceCount(state, { payload }) {
      return {
        ...state,
        influenceCount: payload,
      };
    },

    clear(state) {
      return {
        ...state,
        quesDetail: {},
      };
    },
  },
};
