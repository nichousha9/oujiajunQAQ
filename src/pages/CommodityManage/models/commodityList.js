import { message } from 'antd';
// import { routerRedux } from 'dva/router';
import {
  getMccFolderList,
  addMccFolder,
  updateMccFolder,
  CanIDelFolder,
  delMccFolder,
  qryOffersInfo,
  getLabelInfoList,
  queryLabelInfoById,
  qryRootNode,
  addOffer,
  delOffer,
  modOfferState,
  copyOffer,
  updataOffer,
  qryProLabelRelData,
  qryOffersExtendInfo
} from '@/services/commodityList';
import { qryAttrValueByCode } from '@/services/common';

const models = {
  namespace: 'commodityList',
  state: {
    // 当前点击的目录
    clickFolder: null,
    // 包成员名
    memberProps: [],
    // 提交的商品信息数据
    submitData: {
      fold: null,
      offerType: 'P', // 商品类型默认为Package
      offerTypeName: 'Package',
      memberIds: [], // 包成员
      relLabelList: [], // 标签
    },
    // 商品列表数据
    cmdInfo: [],
    // 标签Table的数据
    labelTableData: [],
    // 有效期数据
    validityDate: {
      effDate: {
        effDateOffsetUnit: 'H', // 生效时间周期类型 立即:H 相对:{时:H,天:D,月:M} 绝对:H
        effDateType: '0', // 生效时间类型 立即:0 相对:2 绝对:1
        // effDate: '', // 生效时间
        // effDateOffset: '', // 相对时间date
        // effDateOffsetTime: '', // 相对时间time
      },
      expDate: {
        expDateOffsetUnit: 'H', // 失效时间周期类型 相对:D 绝对:H
        expDateType: '2', // 生效时间类型 相对:2 绝对:1
        // expDate: '', // 失效时间
        // expDateOffset: '', // 失效时间date
        // expDateOffsetTime: '', // 失效时间time
      },
    },

    // --------------------- 商品详细信息 ----------------
    goodDetalis: {}
    // --------------------- 商品详细信息 -----------------
  },
  effects: {
    *getMccFolderList({ payload }, { call }) {
      const response = yield call(getMccFolderList, payload);
      return response;
    },
    *addMccFolder({ payload }, { call }) {
      const response = yield call(addMccFolder, payload);
      return response;
    },
    *updateMccFolder({ payload }, { call }) {
      const response = yield call(updateMccFolder, payload);
      return response;
    },
    *delMccFolder({ payload }, { call }) {
      const response = yield call(delMccFolder, payload);
      return response;
    },
    *CanIDelFolder({ payload }, { call }) {
      let response = yield call(CanIDelFolder, payload);
      if (response.svcCont.data.length === 0) {
        // yield put({ type: 'delMccFolder', payload });
        response = yield call(delMccFolder, payload);
      }
      return response;
    },
    *qryAttrValueByCode({ payload }, { call }) {
      const response = yield call(qryAttrValueByCode, payload);
      return response;
    },
    *qryRootNode({ payload }, { call, put }) {
      const response = yield call(qryRootNode, payload);
      if (response && response.topCont && response.topCont.resultCode === 0) {
        const fold = response.svcCont.data.fold.toString();
        yield put({ type: 'changeClickFolder', payload: fold });
      }
    },
    *qryOffersInfo({ payload }, { call }) {
      const response = yield call(qryOffersInfo, payload);
      return response;
    },
    *getLabelInfoList({ payload }, { call }) {
      const response = yield call(getLabelInfoList, payload);
      return response;
    },
    *queryLabelInfoById({ payload }, { call }) {
      const response = yield call(queryLabelInfoById, payload);
      return response;
    },
    *addOffer(dispatch, { call, select }) {
      const validityDate = yield select(state => state.commodityList.validityDate);
      // 判断是否输入标签属性
      let flag = true;
      dispatch.payload.relLabelList.map(item => {
        if (!item.labelValue) {
          message.error('请输入标签属性');
          flag = false;
        }
        return item;
      });
      if (flag) {
        // 商品类型为product时增加validityDate有效期数据
        const newpayload =
          dispatch.payload.offerType === '2'
            ? { ...dispatch.payload, ...validityDate.effDate, ...validityDate.expDate }
            : dispatch.payload;
        // 添加商品
        const response = yield call(addOffer, newpayload);
        return response;
      }
      return {};
    },
    *updataOffer(dispatch, { call, select }) {
      const validityDate = yield select(state => state.commodityList.validityDate);
      // 判断是否输入标签属性
      let flag = true;
      dispatch.payload.relLabelList.map(item => {
        if (!item.labelValue) {
          message.error('请输入标签属性');
          flag = false;
        }
        return item;
      });
      if (flag) {
        // 商品类型为product时增加validityDate有效期数据
        const newpayload =
          dispatch.payload.offerType === '2'
            ? { ...dispatch.payload, ...validityDate.effDate, ...validityDate.expDate }
            : dispatch.payload;
        const response = yield call(updataOffer, newpayload);
        return response;
      }
      return {};
    },
    *delOffer({ payload }, { call }) {
      const response = yield call(delOffer, payload);
      return response;
    },
    *modOfferState({ payload }, { call }) {
      const response = yield call(modOfferState, payload);
      return response;
    },
    *copyOffer({ payload }, { call }) {
      const response = yield call(copyOffer, payload);
      return response;
    },
    *qryProLabelRelData({ payload }, { call }) {
      const response = yield call(qryProLabelRelData, payload);
      return response;
    },

    // ----------------------   获取商品详细信息 --------------------
    *getGoodDetalisEffect({ payload }, { call, put }) {
      try {
        const result = yield call(qryOffersExtendInfo, payload)
        if( result && result.topCont && result.topCont.resultCode === 0 ) {
          yield put({
            type: 'setGoodDetalis',
            payload: result.svcCont || {}
          })
        }
        if( result && result.topCont && result.topCont.resultCode === -1 ) {
          message.error(result.topCont.remark)
        }
      } catch(err) {
        // console.log(err)
        message.error('请求服务器错误')
      }
    }
    // ----------------------   获取商品详细信息 --------------------
  },
  reducers: {
    // 初始化 state
    initState() {
      return models.state
    },

    changeClickFolder(state, { payload }) {
      return {
        ...state,
        clickFolder: payload,
        submitData: { ...state.submitData, fold: payload },
      };
    },
    changeSubmitData(state, { payload }) {
      return {
        ...state,
        submitData: payload,
      };
    },
    changeMemberProps(state, { payload }) {
      const memberIds = payload.map(item => item.tagId);
      const submitData = { ...state.submitData, memberIds };
      return {
        ...state,
        memberProps: payload,
        submitData,
      };
    },
    // 修改有效期数据
    changeValDate(state, { payload }) {
      return {
        ...state,
        validityDate: payload,
        // submitData: { ...state.submitData, ...payload.effDate,...payload.expDate },
      };
    },
    changeLabelTableData(state, { payload }) {
      return {
        ...state,
        labelTableData: payload,
      };
    },
    // 保存商品列表数据
    saveCmdInfo(state, { payload }) {
      return {
        ...state,
        cmdInfo: payload,
      };
    },
    // 重置state中的数据
    resetState(state) {
      const submitData = {
        fold: state.clickFolder,
        offerType: 'P',
        offerTypeName: 'Package',
        memberIds: [],
        relLabelList: [],
      };
      const validityDate = {
        effDate: { effDateOffsetUnit: 'H', effDateType: '0' },
        expDate: { expDateOffsetUnit: 'H', expDateType: '2' },
      };
      return {
        ...state,
        submitData,
        validityDate,
        memberProps: [],
        labelTableData: [],
      };
    },

    // ----------------------------- 设置商品详细信息 ---------------------
    setGoodDetalis(state, { payload }) {
      const { data = {} } = payload
      return {...state, goodDetalis: data }
    }
    // ----------------------------- 设置商品详细信息 ---------------------
  },
  subscriptions: {},
};

export default models