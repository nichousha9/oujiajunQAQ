import { message } from 'antd';
import {
  qryEvtEventInputSameName,
  insertEvtEventInfo,
  updateEvtEventInfo,
} from '@/services/eventManage/eventManage';

export default {
  namespace: 'eventManageComm',
  state: {
    isShowDetailForm: null, // 详情表单显示类型 "edit" "readonly" "add" null
    itemDetail: {}, // 当前显示的项的详情
  },
  effects: {
    // 新增事件
    *saveEventDetailsEffect({ payload, method }, { call, put }) {
      let url;
      if (method == 'add') {
        url = insertEvtEventInfo;
      } else if (method == 'edit') {
        url = updateEvtEventInfo;
      }
      const result = yield call(url, payload);
      if (result && result.topCont && result.topCont.resultCode == 0) {
        message.success(result.topCont.remark || '操作成功');
        yield put({
          type: 'showDetailForm',
          payload: 'readonly',
        });
      } else {
        message.error((result && result.topCont && result.topCont.remark) || '未知错误');
      }
    },

    // 验证新增的名称是否重复
    *validateNameEffect({ payload }, { call }) {
      const result = yield call(qryEvtEventInputSameName, payload);
      return result;
    },
  },
  reducers: {
    // 处理详情表单的显示类型(新建add / 编辑edit / 查看readonly / null)
    showDetailForm(state, { payload }) {
      const { type: isShowDetailForm, item: itemDetail } = payload;
      return { ...state, isShowDetailForm, itemDetail };
    },
  },
};
