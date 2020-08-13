
import {
  getPageList,
  searchPageList,
  updateStandardNoun,
  saveStandardNoun,
  deleteRegularNoun,
  deleteStandardNoun,
  saveRegularNoun,
  updateRegularNoun,
  memDelete,
} from '../services/lexiconManagement';

export default {
  namespace: 'lexiconManagement',
  state: {
  },
  effects: {
    * getPageList({ payload },{ call }){
      const response = yield call(getPageList, payload);
      return response;
    },
    * searchPageList({ payload },{ call }){
      const response = yield call(searchPageList, payload);
      return response;
    },
    * updateStandardNoun({ payload },{ call }){
      const response = yield call(updateStandardNoun, payload);
      return response;
    },
    * saveStandardNoun({ payload },{ call }){
      const response = yield call(saveStandardNoun, payload);
      return response;
    },
    * deleteRegularNoun({ payload },{ call }){
      const response = yield call(deleteRegularNoun, payload);
      return response;
    },
    * deleteStandardNoun({ payload },{ call }){
      const response = yield call(deleteStandardNoun, payload);
      return response;
    },
    * updateRegularNoun({ payload },{ call }){
      const response = yield call(updateRegularNoun, payload);
      return response;
    },
    * saveRegularNoun({ payload },{ call }){
      const response = yield call(saveRegularNoun, payload);
      return response;
    },
    * memDelete({ payload },{ call }){
      const response = yield call(memDelete, payload);
      return response;
    },
    
  },

  reducers: {
    
  },
}
