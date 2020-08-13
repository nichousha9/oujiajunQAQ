
import {
  saveFunctionExample,
  getFunctionExampleByIntentId,
  deleteFunctionExampleByIntentId,
  getFunctionType,
  testConnectDB,
  getTables,
  getTableColumns,
  getKgList,
  getConceptList,
  getAttrList,
  getEntityList,
  interfaceTest,
  getSonDicsByPcode,
} from '../services/recoveryConfiguration';

export default {
  namespace: 'recoveryConfiguration',
  state: {
  },
  effects: {
    * saveFunctionExample({ payload },{ call }){
      const response = yield call(saveFunctionExample, payload);
      return response;
    },
    * getFunctionExampleByIntentId({ payload },{ call }){
      const response = yield call(getFunctionExampleByIntentId, payload);
      return response;
    },
    * deleteFunctionExampleByIntentId({ payload },{ call }){
      const response = yield call(deleteFunctionExampleByIntentId, payload);
      return response;
    },
    * getFunctionType({ payload },{ call }){
      const response = yield call(getFunctionType, payload);
      return response;
    },
    * testConnectDB({ payload },{ call }){
      const response = yield call(testConnectDB, payload);
      return response;
    },
    * getTables({ payload },{ call }){
      const response = yield call(getTables, payload);
      return response;
    },
    * getTableColumns({ payload },{ call }){
      const response = yield call(getTableColumns, payload);
      return response;
    },
    * getKgList({ payload },{ call }){
      const response = yield call(getKgList, payload);
      return response;
    },
    * getConceptList({ payload },{ call }){
      const response = yield call(getConceptList, payload);
      return response;
    },
    * getAttrList({ payload },{ call }){
      const response = yield call(getAttrList, payload);
      return response;
    },
    * getEntityList({ payload },{ call }){
      const response = yield call(getEntityList, payload);
      return response;
    },
    * interfaceTest({ payload },{ call }){
      const response = yield call(interfaceTest, payload);
      return response;
    },
    * getSonDicsByPcode({ payload }, { call }) {
      const response = yield call(getSonDicsByPcode, payload);
      return response;
    },
  },

  reducers: {
    
  },
}
