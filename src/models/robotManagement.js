/* eslint-disable no-console */
// import { message } from 'antd';
import {
  qryRobotList,
  addRobot,
  qryRobotDetail,
  updateRobot,
  delRobot,
  qryKdbNoRelevanceRobotList,
  qrySceneNoRelevanceRobotList,
  qryKdbRelevanceRobotList,
  qrySceneRelevanceRobotList,
  kdbBindingRobot,
  sceneBindingRobot,
  unbindRobot,
} from '../services/robotManagement';

export default {
  namespace: 'robotManagement',

  state: {
    list: [],
    scenelist: [],
    repositorylist: [],
    robotDetail: [],
    pageNum: 1,
    pageSize: 10,
    total: 0,
    listArr: [],
    nopageNum: 1,
    nopageSize: 10,
    nototal: 0,
    nolistArr: [],
    // scenelist: [],
  },

  effects: {
    // 查询机器人列表
    *qryRobotList({ payload, callback }, { call, put }) {
      const res = yield call(qryRobotList, payload);
      if (res.status === 'OK') {
        yield put({
          type: 'save',
          payload: {
            list: res.data.list,
            pageNum: res.data.pageNum,
            pageSize: res.data.pageSize,
            total: res.data.total,
          },
        });
        if (callback && typeof callback === 'function') {
          callback(res.data.list); // 返回结果
        }
      }
    },

    // 机器人未关联知识库列表
    *qryKdbNoRelevanceRobotList({ payload, callback }, { call, put }) {
      const res = yield call(qryKdbNoRelevanceRobotList, payload);
      if (res.status === 'OK') {
        yield put({
          type: 'save',
          payload: {
            nolistArr: res.data.list,
            nopageNum: res.data.pageNum,
            nopageSize: res.data.pageSize,
            nototal: res.data.total,
          },
        });
        if (callback && typeof callback === 'function') {
          callback(res.data.list); // 返回结果
        }
      }
    },

    // 机器人未关联场景列表
    *qrySceneNoRelevanceRobotList({ payload, callback }, { call, put }) {
      const res = yield call(qrySceneNoRelevanceRobotList, payload);
      if (res.status === 'OK') {
        yield put({
          type: 'save',
          payload: {
            nolistArr: res.data.list,
            nopageNum: res.data.pageNum,
            nopageSize: res.data.pageSize,
            nototal: res.data.total,
          },
        });
        if (callback && typeof callback === 'function') {
          callback(res.data.list); // 返回结果
        }
      }
    },

    // 新增机器人
    *addRobot({ payload, callback }, { call }) {
      const res = yield call(addRobot, payload);
      if (callback) callback(res);
    },

    // 删除机器人
    *delRobot({ payload, callback }, { call }) {
      const res = yield call(delRobot, payload);
      if (callback) callback(res);
    },

    // 修改机器人信息
    *updateRobot({ payload, callback }, { call }) {
      const res = yield call(updateRobot, payload);
      if (res.status === 'OK') {
        if (callback) callback(res);
      }
    },

    // 查看机器人详情
    *qryRobotDetail({ payload }, { call, put }) {
      const res = yield call(qryRobotDetail, payload);
      if (res.status === 'OK') {
        yield put({
          type: 'save',
          payload: {
            robotDetail: res.data,
          },
        });
      }
    },

    // 机器人关联知识列表
    *qryKdbRelevanceRobotList({ payload, callback }, { call, put }) {
      const res = yield call(qryKdbRelevanceRobotList, payload);
      if (res.status === 'OK') {
        yield put({
          type: 'save',
          payload: {
            listArr: res.data.list,
            pageNum: res.data.pageNum,
            pageSize: res.data.pageSize,
            total: res.data.total,
          },
        });
        if (callback && typeof callback === 'function') {
          callback(res.data.list); // 返回结果
        }
      }
    },

    // 机器人关联场景列表
    *qrySceneRelevanceRobotList({ payload, callback }, { call, put }) {
      const res = yield call(qrySceneRelevanceRobotList, payload);
      if (res.status === 'OK') {
        yield put({
          type: 'save',
          payload: {
            listArr: res.data.list,
            pageNum: res.data.pageNum,
            pageSize: res.data.pageSize,
            total: res.data.total,
          },
        });
        if (callback && typeof callback === 'function') {
          callback(res.data.list); // 返回结果
        }
      }
    },

    // 绑定知识库
    *kdbBindingRobot({ payload, callback }, { call }) {
      const res = yield call(kdbBindingRobot, payload);
      if (res.status === 'OK') {
        if (callback) callback(res);
      }
    },

    // 绑定场景
    *sceneBindingRobot({ payload, callback }, { call }) {
      const res = yield call(sceneBindingRobot, payload);
      if (res.status === 'OK') {
        if (callback) callback(res);
      }
    },

    // 解除绑定
    *unbindRobot({ payload, callback }, { call }) {
      const res = yield call(unbindRobot, payload);
      if (res) {
        if (callback) callback(res);
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return Object.assign({}, state, { ...payload });
    },
  },
};
