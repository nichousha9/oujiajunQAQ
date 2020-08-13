import { message } from 'antd';
import {
  qryAttrValue,
  qryIreGroupsRels,
  qryOfferRels,
  qryRcmdRulesRels,
  qryAdviceChannel,
  qryMessageFolder,
  qryCreativeInfoList,
  qryOptRuleset,
  qryOptRuleOfRuleset,
  qryDecisionGroups,
  qryMccSegmentInfo,
  qryPreProcessInfos,
  qryOutputCells,
  getSeqList,
  qryCampCellByFlowchartId,
  addProcess,
  modProcess,
  qryProcess,
  qryProcessCellInfo,
  qryAdviceChannelRel,
  qryMccProcessSegmentRel,
  qryProcessOptimize,
  qryCreativeInfoRels,
  qryResponseTemps,
  getBfmParamValue,
  qryResponseType,
  qryProcessEffDateRel,
  qryTestContactSeg,
  qryOrderModelList,
  qryProcessModelRel,
  qryAdviceInfo,
} from '@/services/ActivityConfigManage/activityFlowContact';
import { getMccFolderList, qryOffersInfo } from '@/services/commodityList';
import { queryRuleListsSource, queryChildRuleSource } from '@/services/ruleMange/ruleList';

export default {
  namespace: 'activityFlowContact',
  state: {
    inputCellList: [], // 接入数据
    testSegment: {}, // 测试群组
    mccProcessAdviceChannelRel: {}, // 运营位
    creativeInfoRels: [], // 创意
    creativeIreGroups: {}, // 创意决策
    offerRels: [], // 商品列表
    offerIreGroups: null, // 商品分组
    processRcmdRulesRels: [], // 商品推荐规则组
    processOptimize: {}, // 规则信息内容
    // 名单信息
    redList: [], // 红名单
    whiteList: [], // 白名单
    blackList: [], // 黑名单
    testContactList: [], // 测试名单
    outputCellList: [], // 输出
    responseTempList: [], // 回复模板
    processModelRel: {}, // 模板
  },
  effects: {
    *qryAttrValue({ payload, success }, { call }) {
      const res = yield call(qryAttrValue, payload);
      if (res && res.topCont && res.topCont.resultCode === 0) {
        const {
          svcCont: { data = [] },
        } = res;
        if (typeof success === 'function' && data[0]) {
          success(data[0].attrValueCode === 'true');
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },
    *qryIreGroupsRels({ payload, success }, { call }) {
      const res = yield call(qryIreGroupsRels, payload);
      if (res && res.topCont && res.topCont.resultCode === 0) {
        const { svcCont = {} } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },
    *qryOfferRels({ payload, success }, { call }) {
      const res = yield call(qryOfferRels, payload);
      if (res && res.topCont && res.topCont.resultCode === 0) {
        const { svcCont = {} } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },
    *qryRcmdRulesRels({ payload, success }, { call }) {
      const res = yield call(qryRcmdRulesRels, payload);
      if (res && res.topCont && res.topCont.resultCode === 0) {
        const { svcCont = {} } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },
    *qryMccRulesGroupList({ payload, success }, { call }) {
      const res = yield call(queryRuleListsSource, payload);
      if (res && res.topCont && res.topCont.resultCode === 0) {
        const { svcCont = {} } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },
    *queryChildRuleSource({ payload, success }, { call }) {
      const res = yield call(queryChildRuleSource, payload);
      if (res && res.topCont && res.topCont.resultCode === 0) {
        const { svcCont = {} } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },
    *qryAdviceChannel({ payload, success }, { call }) {
      const response = yield call(qryAdviceChannel, payload);
      if (response && response.topCont && response.topCont.resultCode === 0) {
        const { svcCont = {} } = response;
        if (success && typeof success === 'function') {
          success(svcCont);
        }
      } else if (response) {
        message.error(response.topCont && response.topCont.remark);
      }
    },
    *qryMessageFolder({ payload, success }, { call }) {
      const response = yield call(qryMessageFolder, payload);
      if (response && response.topCont && response.topCont.resultCode === 0) {
        const { svcCont = {} } = response;
        if (success && typeof success === 'function') {
          success(svcCont);
        }
      } else if (response) {
        message.error(response.topCont && response.topCont.remark);
      }
    },
    *qryCreativeInfoList({ payload, success }, { call }) {
      const response = yield call(qryCreativeInfoList, payload);
      if (response && response.topCont && response.topCont.resultCode === 0) {
        const { svcCont = {} } = response;
        if (success && typeof success === 'function') {
          success(svcCont);
        }
      } else if (response) {
        message.error(response.topCont && response.topCont.remark);
      }
    },

    *qryAdviceInfo({ payload, success }, { call }) {
      const response = yield call(qryAdviceInfo, payload);
      if (response && response.topCont && response.topCont.resultCode === 0) {
        const { svcCont = {} } = response;
        if (success && typeof success === 'function') {
          success(svcCont);
        }
      } else if (response) {
        message.error(response.topCont && response.topCont.remark);
      }
    },

    *qryOptRuleset({ payload, success }, { call }) {
      const response = yield call(qryOptRuleset, payload);
      if (response && response.topCont && response.topCont.resultCode === 0) {
        const { svcCont = {} } = response;
        if (success && typeof success === 'function') {
          success(svcCont);
        }
      } else if (response) {
        message.error(response.topCont && response.topCont.remark);
      }
    },
    *qryOptRuleOfRuleset({ payload, success }, { call }) {
      const response = yield call(qryOptRuleOfRuleset, payload);
      if (response && response.topCont && response.topCont.resultCode === 0) {
        const { svcCont = {} } = response;
        if (success && typeof success === 'function') {
          success(svcCont);
        }
      } else if (response) {
        message.error(response.topCont && response.topCont.remark);
      }
    },
    *qryDecisionGroups({ payload, success }, { call }) {
      const response = yield call(qryDecisionGroups, payload);
      if (response && response.topCont && response.topCont.resultCode === 0) {
        const { svcCont = {} } = response;
        if (success && typeof success === 'function') {
          success(svcCont);
        }
      } else if (response) {
        message.error(response.topCont && response.topCont.remark);
      }
    },
    *getMccFolderList({ payload, success }, { call }) {
      const response = yield call(getMccFolderList, payload);
      if (response && response.topCont && response.topCont.resultCode === 0) {
        const { svcCont = {} } = response;
        if (success && typeof success === 'function') {
          success(svcCont);
        }
      } else if (response) {
        message.error(response.topCont && response.topCont.remark);
      }
    },
    *qryOffersInfo({ payload, success }, { call }) {
      const response = yield call(qryOffersInfo, payload);
      if (response && response.topCont && response.topCont.resultCode === 0) {
        const { svcCont = {} } = response;
        if (success && typeof success === 'function') {
          success(svcCont);
        }
      } else if (response) {
        message.error(response.topCont && response.topCont.remark);
      }
    },
    *qryMccSegmentInfo({ payload, success }, { call }) {
      const response = yield call(qryMccSegmentInfo, payload);
      if (response && response.topCont && response.topCont.resultCode == 0) {
        const { svcCont = {} } = response;
        if (success && typeof success === 'function') {
          success(svcCont);
        }
      } else if (response) {
        message.error(response.topCont && response.topCont.remark);
      }
    },
    *qryPreProcessInfos({ payload, success }, { call }) {
      const response = yield call(qryPreProcessInfos, payload);
      if (response && response.topCont && response.topCont.resultCode == 0) {
        const { svcCont = {} } = response;
        if (success && typeof success === 'function') {
          success(svcCont);
        }
      } else if (response) {
        message.error(response.topCont && response.topCont.remark);
      }
    },
    *qryOutputCells({ payload, success, error }, { call }) {
      const response = yield call(qryOutputCells, payload);
      if (response && response.topCont && response.topCont.resultCode == 0) {
        const { svcCont = {} } = response;
        if (success && typeof success === 'function') {
          success(svcCont);
        }
      } else if (response) {
        if (success && typeof success === 'function') {
          error();
        }
        message.error(response.topCont && response.topCont.remark);
      }
    },
    *getSeqList({ success }, { call }) {
      const quaryParam = {
        count: '1',
        type: 'PROCESSING_CELL',
        autoCellCode: 'true',
      };
      const response = yield call(getSeqList, { quaryParam });
      if (response && response.topCont && response.topCont.resultCode == 0) {
        const { svcCont = {} } = response;
        if (success && typeof success === 'function') {
          success(svcCont);
        }
      } else if (response) {
        message.error(response.topCont && response.topCont.remark);
      }
    },
    *qryCampCellByFlowchartId({ payload, success }, { call }) {
      const response = yield call(qryCampCellByFlowchartId, payload);
      if (response && response.topCont && response.topCont.resultCode == 0) {
        const { svcCont = {} } = response;
        if (success && typeof success === 'function') {
          success(svcCont);
        }
      } else if (response) {
        message.error(response.topCont && response.topCont.remark);
      }
    },
    *addProcess({ payload, success }, { call }) {
      const response = yield call(addProcess, payload);
      if (response && response.topCont && response.topCont.resultCode == 0) {
        const { svcCont = {} } = response;
        if (success && typeof success === 'function') {
          success(svcCont);
        }
      } else if (response) {
        message.error(response.topCont && response.topCont.remark);
      }
    },
    *modProcess({ payload, success }, { call }) {
      const response = yield call(modProcess, payload);
      if (response && response.topCont && response.topCont.resultCode == 0) {
        const { svcCont = {} } = response;
        if (success && typeof success === 'function') {
          success(svcCont);
        }
      } else if (response) {
        message.error(response.topCont && response.topCont.remark);
      }
    },
    *qryProcess({ payload, success }, { call }) {
      const response = yield call(qryProcess, payload);
      if (response && response.topCont && response.topCont.resultCode == 0) {
        const { svcCont = {} } = response;
        if (success && typeof success === 'function') {
          success(svcCont);
        }
      } else if (response) {
        message.error(response.topCont && response.topCont.remark);
      }
    },
    *qryProcessCellInfo({ payload, success }, { call }) {
      const response = yield call(qryProcessCellInfo, payload);
      if (response && response.topCont && response.topCont.resultCode == 0) {
        const { svcCont = {} } = response;
        if (success && typeof success === 'function') {
          success(svcCont);
        }
      } else if (response) {
        message.error(response.topCont && response.topCont.remark);
      }
    },
    *qryAdviceChannelRel({ payload, success }, { call }) {
      const response = yield call(qryAdviceChannelRel, payload);
      if (response && response.topCont && response.topCont.resultCode == 0) {
        const { svcCont = {} } = response;
        if (success && typeof success === 'function') {
          success(svcCont);
        }
      } else if (response) {
        message.error(response.topCont && response.topCont.remark);
      }
    },
    *qryMccProcessSegmentRel({ payload }, { call, put }) {
      const response = yield call(qryMccProcessSegmentRel, payload);
      if (response && response.topCont && response.topCont.resultCode == 0) {
        const { svcCont = {} } = response;
        const { data = {} } = svcCont;
        const { redList, blackList, whiteList, testContactList } = data;
        yield put({
          type: 'save',
          payload: {
            redList,
            blackList,
            whiteList,
            testContactList,
          },
        });
      } else if (response) {
        message.error(response.topCont && response.topCont.remark);
      }
    },
    *qryProcessOptimize({ payload }, { call, put }) {
      const response = yield call(qryProcessOptimize, payload);
      if (response && response.topCont && response.topCont.resultCode == 0) {
        const { svcCont = {} } = response;
        const { data = {} } = svcCont;
        yield put({
          type: 'save',
          payload: {
            processOptimize: data,
          },
        });
      } else if (response) {
        message.error(response.topCont && response.topCont.remark);
      }
    },
    *qryCreativeInfoRels({ payload, success }, { call }) {
      const response = yield call(qryCreativeInfoRels, payload);
      if (response && response.topCont && response.topCont.resultCode == 0) {
        const { svcCont = {} } = response;
        if (success && typeof success === 'function') {
          // console.log('res',response)
          success(svcCont);
        }
      } else if (response) {
        message.error(response.topCont && response.topCont.remark);
      }
    },
    *qryResponseTemps({ payload, success }, { call, put }) {
      const response = yield call(qryResponseTemps, payload);
      if (response && response.topCont && response.topCont.resultCode == 0) {
        const { svcCont } = response;
        const { data = {} } = svcCont;
        if (success && typeof success === 'function') {
          success(svcCont);
          yield put({
            type: 'save',
            payload: {
              responseTempList: (data && data.processResponseTempRels) || [],
            },
          });
        }
      } else if (response) {
        message.error(response.topCont && response.topCont.remark);
      }
    },
    *getBfmParamValue({ payload, success }, { call }) {
      const response = yield call(getBfmParamValue, payload);
      if (response && response.topCont && response.topCont.resultCode == 0) {
        const { svcCont } = response;
        if (success && typeof success === 'function') {
          success(svcCont);
        }
      } else if (response) {
        message.error(response.topCont && response.topCont.remark);
      }
    },
    *qryResponseType({ payload, success }, { call }) {
      const response = yield call(qryResponseType, payload);
      if (response && response.topCont && response.topCont.resultCode == 0) {
        const { svcCont } = response;
        if (success && typeof success === 'function') {
          success(svcCont);
        }
      } else if (response) {
        message.error(response.topCont && response.topCont.remark);
      }
    },
    *qryProcessEffDateRel({ payload, success }, { call }) {
      const response = yield call(qryProcessEffDateRel, payload);
      if (response && response.topCont && response.topCont.resultCode == 0) {
        const { svcCont } = response;
        if (success && typeof success === 'function') {
          success(svcCont);
        }
      } else if (response) {
        message.error(response.topCont && response.topCont.remark);
      }
    },
    *qryTestContactSeg({ payload, success }, { call }) {
      const response = yield call(qryTestContactSeg, payload);
      if (response && response.topCont && response.topCont.resultCode == 0) {
        const { svcCont } = response;
        if (success && typeof success === 'function') {
          success(svcCont);
        }
      } else if (response) {
        message.error(response.topCont && response.topCont.remark);
      }
    },
    // 模板
    *qryTemplateList({ payload, success }, { call }) {
      const response = yield call(qryOrderModelList, payload);
      if (response && response.topCont && response.topCont.resultCode === 0) {
        const { svcCont = {} } = response;
        if (success && typeof success === 'function') {
          success(svcCont);
        }
      } else if (response) {
        message.error(response.topCont && response.topCont.remark);
      }
    },

    *qryProcessModelRel({ payload, success }, { call }) {
      const res = yield call(qryProcessModelRel, payload);
      if (res && res.topCont && res.topCont.resultCode === 0) {
        const { svcCont = {} } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error(res.topCont && res.topCont.remark);
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    reset(state) {
      return {
        ...state,
        inputCellList: [], // 接入数据
        mccProcessAdviceChannelRel: {}, // 运营位
        creativeInfoRels: [], // 创意
        creativeIreGroups: {}, // 创意决策
        offerRels: [], // 商品列表
        offerIreGroups: null, // 商品分组
        processRcmdRulesRels: [], // 商品推荐规则组
        processOptimize: {}, // 规则信息内容
        // 名单信息
        redList: [], // 红名单
        whiteList: [], // 白名单
        blackList: [], // 黑名单
        testContactList: [], // 测试名单
        outputCellList: [], // 输出
        responseTempList: [], // 回复模板
      };
    },
  },
};
