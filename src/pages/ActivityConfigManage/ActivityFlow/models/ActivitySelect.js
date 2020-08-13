import { message } from 'antd';
import {
  qryMccSegmentInfo,
  getSeqWithProcess,
  checkSmartWebSwitchIsOn,
  qryCustListByProcessId,
  lockFlowChart,
  runProcess,
  checkInCampCyclePeriod,
  delProcess,
  modProcess,
  addProcess,
  validateSql,
  qryProcess,
  qrySegList,
  getTarGrpInfos,
  getDimList,
  getLabelValueList,
  expandTreeNodes,
  qrySelectLimit,
} from '@/services/ActivityConfigManage/ActivitySelect';

const ActivitySelect = {
  namespace: 'activitySelect',
  state: {
    // 已选客户群分组，赋值为数组格式
    selectSegment: '',
  },
  effects: {
    *getSeqWithProcess({ payload, callback }, { call }) {
      const res = yield call(getSeqWithProcess, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        if (callback) callback(res.svcCont);
      } else message.error(res.topCont.remark || '获取序列值失败');
    },
    *checkSmartWebSwitchIsOn({ payload, callback }, { call }) {
      const res = yield call(checkSmartWebSwitchIsOn, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        if (callback) callback(res.svcCont);
      } else message.error(res.topCont.remark || '获取开启信息失败');
    },
    *getDimList({ payload, callback }, { call }) {
      const res = yield call(getDimList, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        if (callback) callback(res.svcCont);
      } else message.error(res.topCont.remark || '获取标签树列表失败');
    },
    *qryMccSegmentInfo({ payload, callback }, { call }) {
      const res = yield call(qryMccSegmentInfo, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        if (callback) callback(res.svcCont);
      } else message.error(res.topCont.remark || '获取分群列表失败');
    },
    *getTarGrpInfos({ payload, callback }, { call }) {
      const res = yield call(getTarGrpInfos, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        if (callback) callback(res.svcCont);
      } else message.error(res.topCont.remark || '获取节点信息失败');
    },
    *qrySegList({ payload, callback }, { call }) {
      const res = yield call(qrySegList, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        if (callback) callback(res.svcCont);
      } else message.error(res.topCont.remark || '获取节点关联分群信息失败');
    },
    *qryProcess({ payload, callback }, { call }) {
      const res = yield call(qryProcess, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        if (callback) callback(res.svcCont);
      } else message.error(res.topCont.remark || '获取环节信息失败');
    },
    *validateSql({ payload, callback }, { call }) {
      const res = yield call(validateSql, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        if (callback) callback(res.svcCont);
        // if (res.svcCont && res.svcCont.data && res.svcCont.data.error === '') {
        //   if (callback) callback(res.svcCont);
        // } else message.error(res.svcCont.data.error || '校验sql错误');
      } else message.error(res.topCont.remark || '校验sql失败');
    },
    *addProcess({ payload, callback }, { call }) {
      const res = yield call(addProcess, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        if (callback) callback(res.svcCont);
      } else message.error(res.topCont.remark || '保存select节点失败');
    },
    *modProcess({ payload, callback }, { call }) {
      const res = yield call(modProcess, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        if (callback) callback(res.svcCont);
      } else message.error(res.topCont.remark || '修改select节点失败');
    },
    *delProcess({ payload, callback }, { call }) {
      const res = yield call(delProcess, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        if (callback) callback(res.svcCont);
      } else message.error(res.topCont.remark || '删除select节点失败');
    },
    *checkInCampCyclePeriod({ payload, callback }, { call }) {
      const res = yield call(checkInCampCyclePeriod, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        if (callback) callback(res.svcCont);
      } else message.error(res.topCont.remark || '检查活动周期失败');
    },
    *runProcess({ payload, callback }, { call }) {
      const res = yield call(runProcess, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        if (callback) callback(res.svcCont);
      } else message.error(res.topCont.remark || '运行select节点失败');
    },
    *lockFlowChart({ payload, callback }, { call }) {
      const res = yield call(lockFlowChart, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        if (callback) callback(res.svcCont);
      } else message.error(res.topCont.remark || '锁定select节点失败');
    },
    *qryCustListByProcessId({ payload, callback }, { call }) {
      const res = yield call(qryCustListByProcessId, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        if (callback) callback(res.svcCont);
      } else message.error(res.topCont.remark || '获取节点人员清单列表失败');
    },
    *getLabelValueList({ payload, callback }, { call }) {
      const res = yield call(getLabelValueList, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        if (callback) callback(res.svcCont);
      } else message.error(res.topCont.remark || '获取标签选项值失败');
    },
    *expandTreeNodes({ payload, callback }, { call }) {
      const res = yield call(expandTreeNodes, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        if (callback) callback(res.svcCont);
      } else message.error(res.topCont.remark || '搜索标签树失败');
    },
    *qrySelectLimit({ payload, callback }, { call }) {
      const res = yield call(qrySelectLimit, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        if (callback) callback(res.svcCont);
      } else message.error(res.topCont.remark || '获取数据来源类型失败');
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
export default ActivitySelect;
