import { message } from 'antd';
import {
  qryEventInputListByEventId,
  qryEventInputPageByCataId,
  deleteInputAttr,
  insertEvtEventInputRef,
  deleteEvtEventInputRef,
  qryEvtEventOutputDetail,
  insertEvtEventOutput,
  updateEvtEventOutput,
  qryEvtOutputAttrList,
  deleteOutputAttr,
  qryObjectAndInputAttrList,
  insertEvtOutputAttrput,
  updateEvtOutputAttr,
  qryEvtEventPolicyParams,
} from '@/services/eventManage/eventManage';

const model = {
  namespace: 'configDetail',
  state: {
    // 事件项详情, 用来保存 eventMangecomm 下的 itemDetails
    eventDetails: null,
    // 输入源新增 Modal 是否显示
    isShowAddEventModal: false,
    // 输入源新增 Modal 列表数据
    eventSrcList: [],
    // 输入源新增 Modal 列表分页信息
    eventSrcPageInfo: {
      pageNum: 1,
      pageSize: 5,
    },
    // 输入源新增 Modal 列表选中项
    eventSrcSelectedRowKeys: [],
    // 输入源分页信息
    inputSrcPageInfo: {
      pageNum: 1,
      pageSize: 10,
    },
    // 输入源列表数据
    inputSrcListData: [],
    // 强制获取输入源列表数据
    forceGetInputSrcList: true,
    // 输出格式 -> 格式配置详情
    eventOutputDetail: {},
    // 是否显示输出格式 -> 输出属性表单
    isShowOutputAttrForm: false,
    // 输出属性列表分页信息
    outputAttrPageInfo: {
      pageNum: 1,
      pageSize: 10,
      total: 0,
    },
    // 输出属性列表值
    outputAttrListData: [],
    // 当前输出属性项详情
    currentOutputAttrItem: {},
    // 输出属性编码下拉框列表值
    outputAttrCodeFields: [],
    // 强制获取输出属性列表值
    forceGetOutputAttrList: true,
    // 输出属性列表搜索值
    outputAttrSearchVal: '',
    // 活动策略详情
    activePolicyDetail: {},
    // 策略集合
    evtPolicySetDetails: [],
    // 分组字段 / 账期字段下拉框数据
    groupFields: {},
    // 计算策略策略组合
    rules: {
      conditions: {
        con: 'OR',
        orderby: 0,
        parId: null,
        level: 1,
        id: 20011,
        rules: [
          {
            colName1: 20039,
            optRule: '3',
            colName2: '',
            operatorId: '2',
            ruleValue: '55',
            level: 2,
            orderby: 0,
            parId: 20011,
            id: 20012,
          },
          {
            con: 'AND',
            orderby: 1,
            parId: 20011,
            level: 2,
            id: 20013,
            rules: [
              {
                colName1: 20036,
                optRule: '4',
                colName2: 20039,
                operatorId: '5',
                ruleValue: '00',
                level: 3,
                orderby: 0,
                parId: 20013,
                id: 20014,
              },
              {
                colName1: 20036,
                optRule: '7',
                colName2: 20036,
                operatorId: '3',
                ruleValue: '6',
                level: 3,
                orderby: 1,
                parId: 20013,
                id: 20015,
              },
            ],
          },
        ],
      },
    },
  },
  effects: {
    // 获取输入源列表数据
    *getInputSrcListEffect({ payload }, { call, put }) {
      const result = yield call(qryEventInputListByEventId, payload);
      if (result && result.topCont && result.topCont.resultCode == 0) {
        yield put({
          type: 'saveInputSrcList',
          payload: result.svcCont,
        });
      } else {
        message.error((result && result.topCont && result.topCont.remark) || '未知错误');
      }
    },
    // 删除输入属性
    *deleteInputAttr({ payload }, { call }) {
      const result = yield call(deleteInputAttr, payload);
      if (result && result.topCont && result.topCont.resultCode == 0) {
        message.success(result.topCont.remark || '操作成功');
      } else {
        message.error((result && result.topCont && result.topCont.remark) || '未知错误');
      }
    },
    // 获取输入源新增 Modal 列表数据
    *getEventSrcList({ payload }, { call, put }) {
      const result = yield call(qryEventInputPageByCataId, payload);
      if (result && result.topCont && result.topCont.resultCode == 0) {
        yield put({
          type: 'saveEventSrcList',
          payload: result.svcCont,
        });
      } else {
        message.error((result && result.topCont && result.topCont.remark) || '未知错误');
      }
    },
    // 输入源 Tab 新增事件
    *handleInsertEventSrc({ payload }, { call, put }) {
      const result = yield call(insertEvtEventInputRef, payload);
      if (result && result.topCont && result.topCont.resultCode == 0) {
        message.success(result.topCont.remark || '操作成功');
        yield put({
          // 隐藏 Modal
          type: 'handleShowEventModal',
          payload: false,
        });
      } else {
        message.error((result && result.topCont && result.topCont.remark) || '未知错误');
      }
    },
    // 删除输入源项
    *deleteInputSrc({ payload }, { call }) {
      const result = yield call(deleteEvtEventInputRef, payload);
      if (result && result.topCont && result.topCont.resultCode == 0) {
        message.success(result.topCont.remark || '操作成功');
      } else {
        message.error((result && result.topCont && result.topCont.remark) || '未知错误');
      }
    },
    // 获取输出格式-》格式配置详情
    *getEventOutputDetail({ payload }, { call, put }) {
      const result = yield call(qryEvtEventOutputDetail, payload);
      if (result && result.topCont && result.topCont.resultCode == 0) {
        yield put({
          type: 'saveEventOutputDetail',
          payload: result.svcCont.data,
        });
      } else {
        message.error((result && result.topCont && result.topCont.remark) || '未知错误');
      }
    },
    // 编辑配置详情
    *updateEvtEventOutput({ payload }, { call }) {
      const result = yield call(updateEvtEventOutput, payload);
      if (result && result.topCont && result.topCont.resultCode == 0) {
        message.success(result.topCont.remark || '操作成功');
      } else {
        message.error((result && result.topCont && result.topCont.remark) || '未知错误');
      }
    },
    // 新增配置详情
    *insertEvtEventOutput({ payload }, { call }) {
      const result = yield call(insertEvtEventOutput, payload);
      if (result && result.topCont && result.topCont.resultCode == 0) {
        message.success(result.topCont.remark || '操作成功');
      } else {
        message.error((result && result.topCont && result.topCont.remark) || '未知错误');
      }
    },
    // 获取输出属性列表数据
    *getOutputAttrListEffect({ payload }, { call, put }) {
      const result = yield call(qryEvtOutputAttrList, payload);
      if (result && result.topCont && result.topCont.resultCode == 0) {
        yield put({
          type: 'saveOutputAttrList',
          payload: result.svcCont,
        });
      } else {
        message.error((result && result.topCont && result.topCont.remark) || '未知错误');
      }
      return result;
    },
    // 删除输出属性
    *deleteOutputAttr({ payload }, { call }) {
      const result = yield call(deleteOutputAttr, payload);
      if (result && result.topCont && result.topCont.resultCode == 0) {
        message.success(result.topCont.remark || '操作成功');
      } else {
        message.error((result && result.topCont && result.topCont.remark) || '未知错误');
      }
    },
    // 获取输出属性表单编码字段列表值
    *getOutputAttrCodeFields({ payload }, { call, put }) {
      const result = yield call(qryObjectAndInputAttrList, payload);
      if (result && result.topCont && result.topCont.resultCode == 0) {
        yield put({
          type: 'saveOutputAttrCodeFields',
          payload: result.svcCont,
        });
      } else {
        message.error((result && result.topCont && result.topCont.remark) || '未知错误');
      }
      return result;
    },
    // 新增、编辑输出属性
    *saveOutputAttr({ payload, method }, { call, put }) {
      let url;
      if (method === 'edit') {
        url = updateEvtOutputAttr;
      } else if (method === 'add') {
        url = insertEvtOutputAttrput;
      }
      const result = yield call(url, payload);
      if (result && result.topCont && result.topCont.resultCode == 0) {
        message.success(result.topCont.remark || '操作成功');

        if (method === 'add') {
          yield put({
            type: 'handleShowOutputAtrrForm',
            payload: null,
          });
        }
      } else {
        message.error((result && result.topCont && result.topCont.remark) || '未知错误');
      }
    },
    // 获取活动策略详情
    *getActivePolicyDetail({ payload }, { call, put }) {
      const result = yield call(qryEvtEventPolicyParams, payload);
      if (result && result.topCont && result.topCont.resultCode == 0) {
        yield put({
          type: 'saveActivePolicyDetail',
          payload: result.svcCont,
        });
        yield put({
          type: 'saveEvtPolicySetDetails',
          payload: result.svcCont,
        });
      } else {
        message.error((result && result.topCont && result.topCont.remark) || '未知错误');
      }
    },
    // 获取分组字段 / 账期字段 下拉框数据
    *getGroupFields({ payload }, { call, put }) {
      const result = yield call(qryObjectAndInputAttrList, payload);
      if (result && result.topCont && result.topCont.resultCode == 0) {
        yield put({
          type: 'saveGroupFields',
          payload: result.svcCont,
        });
      } else {
        message.error((result && result.topCont && result.topCont.remark) || '未知错误');
      }
    },
  },
  reducers: {
    // 初始化 state
    initState(_, { payload }) {
      return { ...model.state, ...payload };
    },
    // 处理是否显示输入源新增事件 Modal
    handleShowEventModal(state, { payload: isShowAddEventModal }) {
      return { ...state, isShowAddEventModal };
    },
    // 保存输入源列表数据
    saveInputSrcList(state, { payload }) {
      const { data: inputSrcListData, pageInfo: inputSrcPageInfo } = payload;
      return { ...state, inputSrcListData, inputSrcPageInfo };
    },
    // 改变输入源列表页码信息
    changeInputSrcPageInfo(state, { payload: inputSrcPageInfo }) {
      return { ...state, inputSrcPageInfo };
    },
    // 强制更新输入源列表
    forceGetInputSrcList(state) {
      return { ...state, forceGetInputSrcList: new Date().valueOf() };
    },
    // 保存输入源新增 Modal 列表数据
    saveEventSrcList(state, { payload }) {
      const { data: eventSrcList, pageInfo: eventSrcPageInfo } = payload;
      return { ...state, eventSrcList, eventSrcPageInfo };
    },
    // 改变输入源新增 Modal 列表分页信息
    changeEventSrcPageInfo(state, { payload: eventSrcPageInfo }) {
      return { ...state, eventSrcPageInfo };
    },
    // 改变输入源新增 Modal 列表选中项
    setEventSrcSelectedRowKeys(state, { payload: eventSrcSelectedRowKeys }) {
      return { ...state, eventSrcSelectedRowKeys };
    },
    // 保存输出格式 -> 格式配置详情
    saveEventOutputDetail(state, { payload: eventOutputDetail }) {
      return { ...state, eventOutputDetail: eventOutputDetail || {} };
    },
    // 处理输出属性详情表单显示形式
    handleShowOutputAtrrForm(state, { payload: isShowOutputAttrForm }) {
      return { ...state, isShowOutputAttrForm };
    },
    // 保存当前编辑输入属性项
    saveOutputAttrItemDetail(state, { payload: currentOutputAttrItem }) {
      return { ...state, currentOutputAttrItem };
    },
    // 改变输出属性列表页码信息
    changeOutputAttrPageInfo(state, { payload: outputAttrPageInfo }) {
      return { ...state, outputAttrPageInfo };
    },
    // 保存输出属性列表数据
    saveOutputAttrList(state, { payload }) {
      const { data: outputAttrListData, pageInfo: outputAttrPageInfo } = payload;
      return { ...state, outputAttrListData, outputAttrPageInfo };
    },
    forceGetOutputAttrList(state) {
      return { ...state, forceGetOutputAttrList: new Date().valueOf() };
    },
    // 改变输出属性搜索值
    changeOutputAttrSearchVal(state, { payload: outputAttrSearchVal }) {
      return { ...state, outputAttrSearchVal };
    },
    // 保存输出属性表单编码字段列表值
    saveOutputAttrCodeFields(state, { payload }) {
      const { data: outputAttrCodeFields } = payload;
      return { ...state, outputAttrCodeFields };
    },
    // 设置计算策略配置规则表单
    setRules(state, { payload }) {
      return { ...state, ...payload };
    },
    // 保存活动策略详情
    saveActivePolicyDetail(state, { payload }) {
      const { data: activePolicyDetail = {} } = payload;
      return { ...state, activePolicyDetail };
    },
    // 保存策略集合
    saveEvtPolicySetDetails(state, { payload }) {
      const { data = {} } = payload;
      const { evtPolicySetDetails } = data;
      if (evtPolicySetDetails) {
        // 格式化 evtPolicyRuleDetails
        for (let i = 0; i < evtPolicySetDetails.length; i += 1) {
          let newEvtPolicyRuleDetails = {};
          const { evtPolicyRuleDetails } = evtPolicySetDetails[i];
          if (evtPolicyRuleDetails) {
            for (let j = 0; j < evtPolicyRuleDetails.length; j += 1) {
              if (!evtPolicyRuleDetails[j].parId) {
                newEvtPolicyRuleDetails = evtPolicyRuleDetails[j];
                newEvtPolicyRuleDetails.rules = [];
              } else if (evtPolicyRuleDetails[j].con && evtPolicyRuleDetails[j].parId) {
                evtPolicyRuleDetails[j].rules = [];
              }
              for (let k = 0; k < evtPolicyRuleDetails.length; k += 1) {
                if (
                  evtPolicyRuleDetails[k].parId === evtPolicyRuleDetails[j].id &&
                  evtPolicyRuleDetails[j].parId
                ) {
                  evtPolicyRuleDetails[j].rules.push(evtPolicyRuleDetails[k]);
                } else if (
                  evtPolicyRuleDetails[k].parId === evtPolicyRuleDetails[j].id &&
                  !evtPolicyRuleDetails[j].parId
                ) {
                  newEvtPolicyRuleDetails.rules.push(evtPolicyRuleDetails[k]);
                }
              }
            }
          }
          evtPolicySetDetails[i].evtPolicyRuleDetails = newEvtPolicyRuleDetails;
        }
      }
      // 合并同一输入源的策略集
      const helpMap = {};
      const newArr = [];
      for (let i = 0; i < evtPolicySetDetails.length; i += 1) {
        const id = evtPolicySetDetails[i].inputId;
        if (helpMap[id]) {
          helpMap[id].push(evtPolicySetDetails[i]);
        } else {
          helpMap[id] = [evtPolicySetDetails[i]];
        }
      }
      const keys = Object.keys(helpMap);
      for (let i = 0; i < keys.length; i += 1) {
        newArr.push(helpMap[keys[i]]);
      }

      return { ...state, evtPolicySetDetails: newArr };
    },
    // 保存分组字段 / 账期字段下拉框数据
    saveGroupFields(state, { payload }) {
      const { data = [], dateAttr = [] } = payload;
      const newGroupFields = state.groupFields;
      if (data[0] || dateAttr[0]) {
        newGroupFields[data[0].inputId || dateAttr[0].inputId] = {
          data,
          dateAttr,
        };
      }
      return { ...state, groupFields: newGroupFields };
    },
  },
};

export default model;
