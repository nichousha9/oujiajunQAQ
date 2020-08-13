import { message } from 'antd';
import {
  qryAttrSpecAllInCache,
  delKeyFromCache,
  qryCachePage,
} from '@/services/CacheManage/cacheManage'

const models = {
  namespace: 'cacheManage',
  state : {
    cacheList: [],
    pageInfo: {
      pageNum: 1,
      pageSize: 10,
      total: 0,
    }
  },
  
  effects : {
    *qryCachePage({ payload }, { call, put, select }) {
      try {
        const { pageNum, pageSize } = yield select(state => state.cacheManage.pageInfo);
        const pageInfo = { pageNum, pageSize };
        const params = { ...payload, pageInfo };
        const result = yield call(qryCachePage, params);
        if(result && result.topCont && result.topCont.resultCode === 0) {
          yield put({
            type: 'getCacheList',
            payload: result.svcCont.data,
          });
          const { pageNum: servePageNum, pageSize: servePageSize, total } = result.svcCont.pageInfo;
          yield put({
            type: 'getCachePageInfo',
            payload: {
              pageNum: servePageNum || 1,
              pageSize: servePageSize || pageInfo.pageSize,
              total,
            }
          });
        } else {
          message.error(result&&result.topCont&&result.topCont.remark);
        }

      } catch(err) {
        message.error(err);
      }
    },

    *qryAttrSpecAllInCache({ payload, callback }, { call }) {
      const result = yield call(qryAttrSpecAllInCache, payload);
      if(result && result.topCont) {
        if(result.topCont.resultCode === 0) {
          message.success(result.topCont.remark);
          callback(result.svcCont);
        } else if (result.topCont.resultCode === -1) {
          message.error(result.topCont.remark);
        }
      }
    },

    *delKeyFromCache({ payload, callback }, { call }){
      const result = yield call(delKeyFromCache, payload);
      if(result && result.topCont) {
        if(result.topCont.resultCode === 0) {
          message.success(result.topCont.remark);
          callback(result.svcCont);
        } else if (result.topCont.resultCode === -1) {
          message.error(result.topCont.remark);
        }
      }
    },

  },
  reducers: {
    getCacheList(state, { payload: currentCacheList }) {
      return Object.assign({}, state, { cacheList: [...currentCacheList] });
    },

    getCachePageInfo(state, { payload: pageInfo }) {
      return Object.assign({}, state, { pageInfo }); 
    }
  },
}

export default models;