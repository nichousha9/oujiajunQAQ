import { message } from 'antd';
import {
  qryTimingObject,
  qryScheduleList,
  qryAllTimingInstance,
  qryAlreadyRunningTimingInstance,
  qryWaitingTimingInstance,
  delTimingInstance,
  getSystemUserList,
  getSystemRoleList,
} from '@/services/scheduleMonitor/scheduleMonitor';

/**
 * 将对象/数组转化为小写
 * @param {*} obj
 */
function objToLowerCase(obj) {
  let newObj;
  if (obj instanceof Array) {
    newObj = [];
    obj.forEach(item => {
      const arrChild = objToLowerCase(item);
      newObj.push(arrChild);
    });
    return newObj || [];
  }
  if (obj instanceof Object) {
    newObj = {};
    Object.keys(obj).forEach(item => {
      const objChild = objToLowerCase(obj[item]);
      newObj[item.toLowerCase()] = objChild;
    });
    return newObj || {};
  }
  newObj = obj;
  return newObj;
}

const models = {
  namespace: 'scheduleMonitor',
  state: {
    timingObjectList: [], //   dataTextField: 'attrValueName',  dataValueField: 'attrValueCode',
    filterCondition: {
      extName: null,
      timingObject: null,
      userId: null,
      createUser: null,
      cycleStartDate: null,
      cycleEndDate: null,
    },
    scheduleList: [],
    scheduleDetailList: [],
    userModalVisible: false,
    userList: [],
    user: {}, // 被选择的用户
    pageInfo: { pageNum: 1, pageSize: 5, total: 0 },
    scheduleDetailPageInfo: { pageNum: 1, pageSize: 10, total: 0 },
    // timingId: 0,
    roleList: [], // 岗位角色列表
    userPageInfo: { pageNum: 1, pageSize: 10, total: 0 },
  },

  effects: {
    *getTimingObjectListEffect(_, { call, put }) {
      try {
        const result = yield call(qryTimingObject, {});
        if (result && result.topCont) {
          if (result.topCont.resultCode === 0) {
            yield put({
              type: 'getTimingObjectList',
              payload: result.svcCont.data,
            });
          }
          if (result.topCont.resultCode === -1) {
            message.error(result.topCont.remark);
          }
        }
      } catch (err) {
        message.error('请求失败');
      }
    },

    *getScheduleListEffect(_, { call, put, select }) {
      try {
        const filterCondition = yield select(state => state.scheduleMonitor.filterCondition);
        const { pageNum = 1, pageSize = 5 } = yield select(state => state.scheduleMonitor.pageInfo);
        // const loginInfo = yield select(state => state.user.userInfo);
        // const { postId } = loginInfo;
        // const otherTopCont = { loginInfo, postId };
        const pageInfo = {
          pageSize,
          pageNum,
        };
        const params = { ...filterCondition, pageInfo };

        const result = yield call(qryScheduleList, params);
        if (result && result.topCont) {
          if (result.topCont.resultCode === 0) {
            yield put({
              type: 'getScheduleList',
              payload: result.svcCont.data,
            });
            yield put({
              type: 'getPageInfo',
              payload: result.svcCont.pageInfo,
            });
          }
          if (result.topCont.resultCode === -1) {
            message.error(result.topCont.remark);
          }
        }
      } catch (err) {
        message.error('请求失败');
      }
    },

    *getAllScheduleDetailListEffect({ payload }, { call, put, select }) {
      try {
        // const timingId = yield select(state => state.scheduleMonitor.timingId);
        const timingId = payload;
        const { pageNum = 1, pageSize = 10 } = yield select(
          state => state.scheduleMonitor.scheduleDetailPageInfo,
        );
        const pageInfo = { pageNum, pageSize };
        const params = { pageInfo, timingId };
        const result = yield call(qryAllTimingInstance, params);

        if (result && result.topCont) {
          if (result.topCont.resultCode === 0) {
            yield put({
              type: 'getScheduleDetailList',
              payload: result.svcCont.data,
            });
            yield put({
              type: 'getScheduleDetailPageInfo',
              payload: result.svcCont.pageInfo,
            });
          }
          if (result.topCont.resultCode === -1) {
            message.error(result.topCont.remark);
          }
        }
      } catch (err) {
        message.error('请求失败');
      }
    },

    *getAlreadyRunningScheduleDetailListEffect({ payload }, { call, put, select }) {
      try {
        // const timingId = yield select(state => state.scheduleMonitor.timingId);
        const timingId = payload;
        const { pageNum = 1, pageSize = 10 } = yield select(
          state => state.scheduleMonitor.scheduleDetailPageInfo,
        );
        const pageInfo = { pageNum, pageSize };
        const params = { pageInfo, timingId };
        const result = yield call(qryAlreadyRunningTimingInstance, params);
        if (result && result.topCont) {
          if (result.topCont.resultCode === 0) {
            yield put({
              type: 'getScheduleDetailList',
              payload: result.svcCont.data,
            });
            yield put({
              type: 'getScheduleDetailPageInfo',
              payload: result.svcCont.pageInfo,
            });
          }
          if (result.topCont.resultCode === -1) {
            message.error(result.topCont.remark);
          }
        }
      } catch (err) {
        message.error('请求失败');
      }
    },

    *getWaitingScheduleDetailListEffect({ payload }, { call, put, select }) {
      try {
        // const timingId = yield select(state => state.scheduleMonitor.timingId);
        const timingId = payload;
        const { pageNum = 1, pageSize = 10 } = yield select(
          state => state.scheduleMonitor.scheduleDetailPageInfo,
        );
        const pageInfo = { pageNum, pageSize };
        const params = { pageInfo, timingId };
        const result = yield call(qryWaitingTimingInstance, params);
        if (result && result.topCont) {
          if (result.topCont.resultCode === 0) {
            yield put({
              type: 'getScheduleDetailList',
              payload: result.svcCont.data,
            });
            yield put({
              type: 'getScheduleDetailPageInfo',
              payload: result.svcCont.pageInfo,
            });
          }
          if (result.topCont.resultCode === -1) {
            message.error(result.topCont.remark);
          }
        }
      } catch (err) {
        message.error('请求失败');
      }
    },

    *delTimingInstance({ payload }, { call }) {
      let result;
      try {
        result = yield call(delTimingInstance, payload);
      } catch (err) {
        message.error('请求失败');
      }
      return result;
    },

    *getSystemUserListEffect({ payload }, { call, put, select }) {
      try {
        const { pageNum = 1, pageSize = 10 } = yield select(
          state => state.scheduleMonitor.userPageInfo,
        );
        const pageInfo = { pageNum, pageSize };
        const result = yield call(getSystemUserList, { ...payload, pageInfo });
        if (result && result.topCont) {
          if (result.topCont.resultCode === 0) {
            yield put({
              type: 'getUserList',
              payload: result.svcCont.data,
            });
            yield put({
              type: 'getUserPageInfo',
              payload: result.svcCont.pageInfo,
            });
          }
          if (result.topCont.resultCode === -1) {
            message.error(result.topCont.remark);
          }
        }
      } catch (err) {
        message.error('请求失败');
      }
    },

    *getSystemRoleListEffect({ payload }, { call, put }) {
      try {
        const result = yield call(getSystemRoleList, { ...payload });
        if (result && result.topCont) {
          if (result.topCont.resultCode === 0) {
            yield put({
              type: 'getRoleList',
              payload: result.svcCont.data,
            });
          }
          if (result.topCont.resultCode === -1) {
            message.error(result.topCont.remark);
          }
        }
      } catch (err) {
        message.error('请求失败');
      }
    },
  },

  reducers: {
    handleUserModal(state, { payload: userModalVisible }) {
      return Object.assign({}, state, { userModalVisible });
    },

    getTimingObjectList(state, { payload: currentTimingObject }) {
      return Object.assign({}, state, { timingObjectList: [...currentTimingObject] });
    },

    getFilterCondition(state, { payload: currentCondition }) {
      return Object.assign({}, state, {
        filterCondition: { ...state.filterCondition, ...currentCondition },
      });
    },

    getScheduleList(state, { payload: scheduleList }) {
      const formated = objToLowerCase(scheduleList);
      return Object.assign({}, state, { scheduleList: [...formated] });
    },

    getPageInfo(state, { payload: pageInfo }) {
      return Object.assign({}, state, { pageInfo });
    },

    getScheduleDetailList(state, { payload: currentScheduleDetailList }) {
      return Object.assign({}, state, { scheduleDetailList: [...currentScheduleDetailList] });
    },

    getScheduleDetailPageInfo(state, { payload: scheduleDetailPageInfo }) {
      return Object.assign({}, state, { scheduleDetailPageInfo });
    },

    // getSelectedTimingId(state, { payload: timingId }) {
    //   return Object.assign({}, state, { timingId });
    // },

    getUserList(state, { payload: currentUserList }) {
      return Object.assign({}, state, { userList: [...currentUserList] });
    },

    getRoleList(state, { payload: currentRoleList }) {
      return Object.assign({}, state, { roleList: [...currentRoleList] });
    },

    getSelectedUser(state, { payload: currentUser }) {
      return Object.assign({}, state, {
        user: { ...currentUser },
      });
    },

    getUserPageInfo(state, { payload: userPageInfo }) {
      return Object.assign({}, state, { userPageInfo });
    },
  },
};

export default models;
