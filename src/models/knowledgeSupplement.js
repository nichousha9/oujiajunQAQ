import {
  qrySiKdbInsertErrorSingleList,
  qryInsertErrorByInterfaceList,
  qryInsertErrorBatchByFileList,
  reimport,
  save,
  qryInsertErrorByInterfaceList2,
  qryInsertErrorByFileList,
  reimportBatch,
  qryInsertErrorBatchByWordList,
  documentParsing,
  getSonDicsByPcode,
} from '../services/knowledgeSupplement';


export default {
  namespace: 'knowledgeSupplement',
  state: {
    singleList:{},
    interfaceList:{},
    fileList:{},
    faceList2:{},
    errorFileList:{},
    fileList3:{},
  },
  effects: {
    *qrySiKdbInsertErrorSingleList({ payload }, { call, put }) {
      // console.log('payload',payload)
      const response = yield call(qrySiKdbInsertErrorSingleList, payload);
      if (response && response.status === 'OK') {
        yield put({
          type: 'saveSingleList',
          payload: response.data,
        });
      }
    },

    *qryInsertErrorByInterfaceList({ payload }, { call, put }) {
      // console.log('payload',payload)
      const response = yield call(qryInsertErrorByInterfaceList, payload);
      if (response && response.status === 'OK') {
        yield put({
          type: 'saveInterfaceList',
          payload: response.data,
        });
      }
    },

    *qryInsertErrorBatchByFileList({ payload }, { call, put }) {
      // console.log('payload',payload)
      const response = yield call(qryInsertErrorBatchByFileList, payload);
      if (response && response.status === 'OK') {
        yield put({
          type: 'saveFileList',
          payload: response.data,
        });
      }
    },
    *qryInsertErrorBatchByWordList({ payload }, { call, put }) {
      // console.log('payload',payload)
      const response = yield call(qryInsertErrorBatchByWordList, payload);
      if (response && response.status === 'OK') {
        yield put({
          type: 'saveFileList3',
          payload: response.data,
        });
      }
    },
    *DocumentParsing({ payload }, { call }) {
      // console.log('payload',payload)
      const response = yield call(documentParsing, payload);
      return response
    },
    *reimport({ payload }, { call }) {
      // console.log('payload',payload)
      const response = yield call(reimport, payload);
      return response
    },
    *save({ payload }, { call }) {
      const response = yield call(save, payload);
      return response
    },
    *qryInsertErrorByInterfaceList2({ payload }, { call, put }) {
      // console.log('payload',payload)
      const response = yield call(qryInsertErrorByInterfaceList2, payload);
      if (response && response.status === 'OK') {
        yield put({
          type: 'saveFaceList2',
          payload: response.data,
        });
      }
    },
    *qryInsertErrorByFileList({ payload }, { call, put }) {
      // console.log('payload',payload)
      const response = yield call(qryInsertErrorByFileList, payload);
      if (response && response.status === 'OK') {
        yield put({
          type: 'saveErrorFileList',
          payload: response.data,
        });
      }
    },
    *reimportBatch({ payload }, { call }) {
      // console.log('payload',payload)
      const response = yield call(reimportBatch, payload);
      return response
    },
    *getSonDicsByPcode({ payload }, { call }) {
      // console.log('payload',payload)
      const response = yield call(getSonDicsByPcode, payload);
      return response
    },
   
  },

  reducers: {

    saveSingleList(state, { payload }) {
      // const {singleList } = state
      return {
        ...state,
        singleList:payload ,
        // kdbList:payload,
      };
    },

    saveInterfaceList(state, { payload }) {
      // const {singleList } = state
      return {
        ...state,
        interfaceList:payload ,
        // kdbList:payload,
      };
    },

    saveFileList(state, { payload }) {
      // const {singleList } = state
      return {
        ...state,
        fileList:payload ,
        // kdbList:payload,
      };
    },
    saveFaceList2(state, { payload }) {
      // const {singleList } = state
      return {
        ...state,
        faceList2:payload ,
        // kdbList:payload,
      };
    },
    saveFileList3(state, { payload }) {
      // const {singleList } = state
      return {
        ...state,
        fileList3:payload ,
        // kdbList:payload,
      };
    },
    saveErrorFileList(state, { payload }) {
      // const {singleList } = state
      return {
        ...state,
        errorFileList:payload ,
        // kdbList:payload,
      };
    },
  },
};
