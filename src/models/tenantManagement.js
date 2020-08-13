import { message } from 'antd';
import { addNewHirer, qryHirerList, deleteHirer, qryHirerDetail, updateHirer } from '../services/tenantManagement';

export default {
  namespace: 'tenantManagement',

  state: {
    hirerList: [],
  },

  effects: {
    // 新增租户
    *addNewHirer({ payload, callback }, { call, put }) {
      const response = yield call(addNewHirer, payload);
      if (response.data === 'success') {
        yield put({
          type: 'save',
          payload: response,
        });
        if (callback && typeof callback === 'function') {
          callback(response.data); // 返回结果
        }
      } else {
        message.error(response.msg);
      }
    },

    // 查询租户列表
    *qryHirerList({ payload, callback }, { call, put }) {
      const response = yield call(qryHirerList, payload);
      if (response.status === 'OK') {
        yield put({
          type: 'save',
          payload: {
            hirerList: response.data.list,
          },
        });
        if (callback && typeof callback === 'function') {
          callback(response.data); // 返回结果
        }
      } else {
        message.error(response.msg);
      }
    },

    // 删除租户
    *deleteHirer({ payload, callback }, { call, put }) {
      const response = yield call(deleteHirer, payload);
      if (response.status === 'OK') {
        yield put({
          type: 'save',
          payload: response,
        });
        if (callback && typeof callback === 'function') {
          callback(response.data); // 返回结果
        }
      } else {
        message.error(response.msg);
      }
    },

     // 查询租户详情
     *qryHirerDetail({ payload, callback }, { call, put }) {
      const response = yield call(qryHirerDetail, payload);
      if (response.status === 'OK') {
        yield put({
          type: 'save',
          payload: response,
        });
        if (callback && typeof callback === 'function') {
          callback(response.data); // 返回结果
        }
      } else {
        message.error(response.msg);
      }
    },

     // 编辑租户信息
     *updateHirer({ payload, callback }, { call, put }) {
      const response = yield call(updateHirer, payload);
      if (response.status === 'OK') {
        yield put({
          type: 'save',
          payload: response,
        });
        if (callback && typeof callback === 'function') {
          callback(response.data); // 返回结果
        }
      } else {
        message.error(response.msg);
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return Object.assign({}, state, {...payload});
    },
  },
}
