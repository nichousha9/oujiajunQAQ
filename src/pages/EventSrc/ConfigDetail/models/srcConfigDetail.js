import { message } from 'antd';
import {
  qryEvtInputAttrPageByInputId,
  qryEvtFileInputLogPage,
  qryEvtInputAttrByName,
  insertEvtInputAttr,
  updateEvtInputAttr,
  deleteInputAttr,
  qryEvtCenterInputRel,
  qryEventInputList,
  insertEvtCenterInputRel,
  updateEvtCenterInputRel,
} from '@/services/eventSrc/eventSrc';

const model = {
  namespace: 'srcConfigDetail',
  state: {
    // 事件项详情
    eventDetails: null,
    // 中心对象可编辑
    centerObjEditable: false,
    // 输入属性详情表单显示形式 'readonly' 'add' 'edit' 'null'
    isShowInputAttrForm: null,
    // 输入属性分页信息
    inputAttrPageInfo: {
      pageNum: 1,
      pageSize: 10,
    },
    // 输入属性列表数据
    inputAttrListData: [],
    // 当前输入属性项详情
    currentInputAttrItem: {},
    // 输入属性搜索值
    inputAttrSearchVal: '',
    // 强制获取输入属性列表数据
    forceGetInputAttrList: true,
    // 日志分页信息
    logPageInfo: {
      pageNum: 1,
      pageSize: 10,
    },
    // 日志列表数据
    logListData: [],
    // 日志搜索值
    logSearchVal: '',
    // 中心对象信息：三个下拉框默认值
    centerObjectInfo: [],
    // 中心对象下拉框列表
    centerObjList: [],
    // 时间输入节点列表数据（即输入属性的列表数据）
    timeInputNodeList: [],
    // 输入节点列表分页信息
    timeInputNodePageInfo: {
      pageNum: 1,
      pageSize: 100,
    },
  },
  effects: {
    // 获取输入属性列表数据
    *getInputAttrListEffect({ payload }, { call, put }) {
      const result = yield call(qryEvtInputAttrPageByInputId, payload);
      if (result && result.topCont && result.topCont.resultCode == 0) {
        yield put({
          type: 'saveInputAttrList',
          payload: result.svcCont,
        });
      } else {
        message.error((result && result.topCont && result.topCont.remark) || '未知错误');
      }
      return result;
    },
    // 保存输入属性列表项（新增、编辑）
    *saveInputAttr({ payload, method }, { call, put }) {
      let url;
      if (method === 'edit') {
        url = updateEvtInputAttr;
      } else if (method === 'add') {
        url = insertEvtInputAttr;
      }
      const result = yield call(url, payload);
      if (result && result.topCont && result.topCont.resultCode == 0) {
        message.success(result.topCont.remark || '操作成功');

        if (method === 'add') {
          yield put({
            type: 'handleShowInputAtrrForm',
            payload: null,
          });
        }
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
    // 获取日志列表数据
    *getLogListEffect({ payload }, { call, put }) {
      const result = yield call(qryEvtFileInputLogPage, payload);
      if (result && result.topCont && result.topCont.resultCode == 0) {
        yield put({
          type: 'saveLogList',
          payload: result.svcCont,
        });
      } else {
        message.error((result && result.topCont && result.topCont.remark) || '未知错误');
      }
    },
    // 校验输入属性名称是否有重复
    *validateInputAttrName({ payload }, { call }) {
      const result = yield call(qryEvtInputAttrByName, payload);
      return result;
    },
    // 获取中心对象
    *getCenterObject({ payload }, { call, put }) {
      const result = yield call(qryEvtCenterInputRel, payload);
      if (result && result.topCont && result.topCont.resultCode == 0) {
        yield put({
          type: 'saveCenterObjectInfo',
          payload: result.svcCont,
        });
      } else {
        message.error((result && result.topCont && result.topCont.remark) || '未知错误');
      }
    },
    // 获取中间对象下拉框列表
    *getCenterObjList({ payload }, { call, put }) {
      const result = yield call(qryEventInputList, payload);
      if (result && result.topCont && result.topCont.resultCode == 0) {
        yield put({
          type: 'saveCenterObjList',
          payload: result.svcCont,
        });
      } else {
        message.error((result && result.topCont && result.topCont.remark) || '未知错误');
      }
    },
    // 时间输入节点列表
    *getTimeInputNodeList({ payload }, { call, put }) {
      const result = yield call(qryEvtInputAttrPageByInputId, payload);
      if (result && result.topCont && result.topCont.resultCode == 0) {
        yield put({
          type: 'saveTimeInputNodeList',
          payload: result.svcCont,
        });
      } else {
        message.error((result && result.topCont && result.topCont.remark) || '未知错误');
      }
    },
    // 新增中心对象
    *insertCenterObj({ payload }, { call }) {
      const result = yield call(insertEvtCenterInputRel, payload);
      if (result && result.topCont && result.topCont.resultCode == 0) {
        message.success(result.topCont.remark || '操作成功');
      } else {
        message.error((result && result.topCont && result.topCont.remark) || '未知错误');
      }
    },
    // 修改中心对象
    *updateCenterObj({ payload }, { call }) {
      const result = yield call(updateEvtCenterInputRel, payload);
      if (result && result.topCont && result.topCont.resultCode == 0) {
        message.success(result.topCont.remark || '操作成功');
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
    // 处理中心对象可编辑性
    hanleCenterObjEditable(state, { payload: centerObjEditable }) {
      return { ...state, centerObjEditable };
    },
    // 处理是否显示输入属性详情表单
    handleShowInputAtrrForm(state, { payload: isShowInputAttrForm }) {
      return { ...state, isShowInputAttrForm };
    },
    // 保存输入属性列表数据
    saveInputAttrList(state, { payload }) {
      const { data } = payload;
      const { list: inputAttrListData, pageNum, pageSize, total } = data;
      return { ...state, inputAttrListData, inputAttrPageInfo: { pageNum, pageSize, total } };
    },
    // 改变输入属性列表页码信息
    changeInputAttrPageInfo(state, { payload: inputAttrPageInfo }) {
      return { ...state, inputAttrPageInfo };
    },
    // 改变输入属性搜索值
    changeInputAttrSearchVal(state, { payload: inputAttrSearchVal }) {
      return { ...state, inputAttrSearchVal };
    },
    // 强制更新输入属性列表
    forceGetInputAttrList(state) {
      return { ...state, forceGetInputAttrList: new Date().valueOf() };
    },
    // 保存当前编辑输入属性项
    saveInputAttrItemDetail(state, { payload: currentInputAttrItem }) {
      return { ...state, currentInputAttrItem };
    },
    // 保存日志列表数据
    saveLogList(state, { payload }) {
      const { data: logListData, pageInfo: LogPageInfo } = payload;
      return { ...state, logListData, LogPageInfo };
    },
    // 改变日志列表页码信息
    changeLogPageInfo(state, { payload: logPageInfo }) {
      return { ...state, logPageInfo };
    },
    // 改变日志搜索值
    changeLogSearchVal(state, { payload: logSearchVal }) {
      return { ...state, logSearchVal };
    },
    // 保存中心对象 tabs 信息
    saveCenterObjectInfo(state, { payload }) {
      const { data: centerObjectInfo } = payload;
      return { ...state, centerObjectInfo };
    },
    // 保存中心对象下拉框列表值
    saveCenterObjList(state, { payload }) {
      const { data: centerObjList } = payload;
      return { ...state, centerObjList };
    },
    // 保存时间输入节点列表
    saveTimeInputNodeList(state, { payload }) {
      const { data } = payload;
      const { list: timeInputNodeList, pageNum, pageSize, total } = data;
      return { ...state, timeInputNodeList, timeInputNodePageInfo: { pageNum, pageSize, total } };
    },
  },
};

export default model;
