
import {
  upload,
  uploadRate,
  getAllDataSet,
  deleteByIds,
  deleteByScene,
  getAllModel,
  deleteModel,
  trainModel,
  line,
  stop,
  trainRate,
  deleteById,
} from '../services/modelTraining';

export default {
  namespace: 'modelTraining',
  state: {
  },
  effects: {
    * upload({ payload },{ call }){
      const response = yield call(upload, payload);
      return response;
    },
    * uploadRate({ payload },{ call }){
      const response = yield call(uploadRate, payload);
      return response;
    },
    * getAllDataSet({ payload },{ call }){
      const response = yield call(getAllDataSet, payload);
      return response;
    },
    * deleteById({ payload },{ call }){
      const response = yield call(deleteById, payload);
      return response;
    },
    * deleteByIds({ payload },{ call }){
      const response = yield call(deleteByIds, payload);
      return response;
    },
    * deleteByScene({ payload },{ call }){
      const response = yield call(deleteByScene, payload);
      return response;
    },
    * getAllModel({ payload },{ call}){
      const response = yield call(getAllModel, payload);
      return response;
    },
    * deleteModel({ payload },{ call }){
      const response = yield call(deleteModel, payload);
      return response;
    },
    * trainModel({ payload },{ call }){
      const response = yield call(trainModel, payload);
      return response;
    },
    * line({ payload },{ call }){
      const response = yield call(line, payload);
      return response;
    },
    * stop({ payload },{ call }){
      const response = yield call(stop, payload);
      return response;
    },
    * trainRate({ payload },{ call }){
      const response = yield call(trainRate, payload);
      return response;
    },
    
  },

  reducers: {
    
  },
}
