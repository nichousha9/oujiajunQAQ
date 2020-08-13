import { message } from 'antd';
import { 
  getSegmentGrp, 
  getProcessCellNameList,
  addProcess,
  modProcess,
  validateSql,
} from '@/services/ActivityConfigManage/activitySegment';

const models = {
  namespace: 'activitySegment',
  state: {
    subsetList: [],
  },
  effects: {
  // svcCont: { processId: me.processID, id :  me.processID }
    *getSegmentGrpEffect({ payload }, { call }) {  
      let result;
      try {
        result = yield call(getSegmentGrp, payload);
      } catch (err) {
        message.error('请求失败');
      }
      return result;
    },

    *getProcessCellNameListEffect({ payload }, { call }) {  
      let result;
      try {
        result = yield call(getProcessCellNameList, payload);
      } catch (err) {
        message.error('请求失败');
      }
      return result;
    },

    *addProcess({ payload }, { call }) {
      let result;
      try {
        result = yield call(addProcess, payload);
      } catch (err) {
        message.error('请求失败');
      }
      return result;
    },

    *modProcess({ payload }, { call }) {
      let result;
      try {
        result = yield call(modProcess, payload);
      } catch (err) {
        message.error('请求失败');
      }
      return result;
    },

    *validateSql({ payload }, { call }) {
      let result;
      try {
        result = yield call(validateSql, payload);
      } catch (err) {
        message.error('请求失败');
      }
      return result;
    },

  },
  reducers: {
    // getSegmentGrp(state, { payload: subsetList }) {
    //   return Object.assign({}, state, { subsetList: [...subsetList] });
    // },
  }
}

export default models;