import { qryAttrValueByCode } from '@/services/common';

const Common = {
  namespace: 'common',
  state: {
    attrSpecCodeList: {
      CAMPAIGN_BUSI_TYPE: '', // 业务类型
      CAMPAIGN_PRIORITY_TYPE: '', // 优先级
      SELECT_TYPE: '', // 选择类型
      TEMPLATE_INFO_TYPE: '', // 创意模板类型
      IS_ENGINE: '', // 是否为创意模板
      DIVID_BUCKET_TYPE: [], // 算法分组分桶类型
      ALGO_TYPE: [], // 算法类型
      ORDER_CREATE_TYPE: [], // 工单生成规则静态数据编码
      EFFICTIVE_STATE: [], // 特征视图状态
      CYCLE_TYPE: '', // 周期类型数据
      CAMPAIGN_STATE_TYPE: [], // 活动状态
      CONTACT_STATUS_CD: [], // 工单状态
      FLOWCHART_STATE_TYPE: [], // 流程适用类型
    }, // 数字字典，key为attrSpecCode
  },
  effects: {
    // @param systemType 静态数据接口系统类型
    *qryAttrValueByCode({ payload, systemType, callback }, { call, put }) {
      const res = yield call(qryAttrValueByCode, payload, systemType);
      if (callback) callback(res.svcCont);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const {
          svcCont: { data },
        } = res;
        yield put({
          type: 'changeAttrSpecCodeList',
          payload: {
            [payload.attrSpecCode]: data,
          },
        });
      }
    },
  },
  reducers: {
    changeAttrSpecCodeList(state, { payload }) {
      return {
        ...state,
        attrSpecCodeList: { ...state.attrSpecCodeList, ...payload },
      };
    },
  },
};
export default Common;
