import { message } from 'antd';
import {
  qryEvtCatalogList,
  qryEvtEventInfoList,
  insertEvtCatalog,
  updateEvtCatalog,
  deleteEvtCatalog,
  updateStatusCd,
  deleteEvtEventInput,
} from '@/services/eventManage/eventManage';

export default {
  namespace: 'eventManage',
  state: {
    forceGetEventsList: true, // 是否需要重新获取列表数据
    isShowDetailForm: 'readonly', // 详情表单显示类型 "edit" "readonly" "add"
    pathCode: '-1', // 当前被选中的目录树项 pathCode
    eventListData: [], // 事件列表数据
    eventSearchVal: {
      // 事件列表筛选搜索值
      searchName: '',
    },
    pageInfo: {
      pageNum: 1,
      pageSize: 10,
      total: 0,
    },
  },
  effects: {
    // 获取目录树数据
    *getTreeList({ payload }, { call }) {
      const result = yield call(qryEvtCatalogList, payload);
      return result;
    },
    // 增加目录树项
    *addMccFolder({ payload }, { call }) {
      const result = yield call(insertEvtCatalog, payload);
      return result;
    },
    // 修改目录树项
    *updateMccFolder({ payload }, { call }) {
      const result = yield call(updateEvtCatalog, payload);
      return result;
    },
    // 删除目录树项
    *delMccFolder({ payload }, { call }) {
      const result = yield call(deleteEvtCatalog, payload);
      return result;
    },
    // 获取事件列表数据
    *getEventsList({ payload }, { call, put }) {
      const result = yield call(qryEvtEventInfoList, payload);
      if (result && result.topCont && result.topCont.resultCode == 0) {
        yield put({
          type: 'saveEventsData',
          payload: result.svcCont,
        });
      } else {
        message.error((result && result.topCont && result.topCont.remark) || '未知错误');
      }
    },
    // 改变事件状态（生效、失效）
    *changeEventItemState({ payload }, { call }) {
      const result = yield call(updateStatusCd, payload);
      return result;
    },
    // 删除事件源
    *handelDeleteEvent({ payload }, { call }) {
      const result = yield call(deleteEvtEventInput, payload);
      return result;
    },
  },
  reducers: {
    // 处理详情表单的显示类型(新建add / 编辑edit / 查看readonly)
    showDetailForm(state, { payload: isShowDetailForm }) {
      return { ...state, isShowDetailForm };
    },
    // 保存事件列表数据
    saveEventsData(state, { payload = {} }) {
      const { data: eventListData, pageInfo } = payload;
      return { ...state, eventListData, pageInfo };
    },
    // 改变被选中的目录树项 pathCode
    changePathCode(state, { payload: pathCode }) {
      return { ...state, pathCode };
    },
    // 修改分页信息
    changePageInfo(state, { payload }) {
      return { ...state, pageInfo: { ...state.pageInfo, ...payload } };
    },
    // 强制重新获取列表数据
    forceGetEventsList(state) {
      return { ...state, forceGetEventsList: new Date().valueOf() };
    },
    // 改变事件搜索值
    changeEventSearchVal(state, { payload: eventSearchVal }) {
      return { ...state, eventSearchVal };
    },
  },
};
