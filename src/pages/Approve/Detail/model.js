import { message } from 'antd';
import {
  addApprovalFlowchart,
  modApprovalFlowchart,
  dealApprovalFlowchart,
  qryApprovalFlowchartDtl,
  qryRegions,
  qryZqythOrganization,
  qryZqythRoles,
  qryZqythUser,
  qryApprovalChannel,
  addApprovalProcess,
  modApprovalProcess,
  delApprovalProcess,
  qryApprovalProcess,
  modApprovalFlowchartContent,
  addApprovalLine,
  modApprovalLine,
  qryApprovalLine,
  delApprovalLine,
} from '@/services/approve';

export default {
  namespace: 'approveDetail',
  state: {},
  effects: {
    *addApprovalFlowchart({ payload, success }, { call }) {
      const res = yield call(addApprovalFlowchart, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error((res.topCont && res.topCont.remark) || '新增流程建模失败');
      }
    },
    *modApprovalFlowchart({ payload, success }, { call }) {
      const res = yield call(modApprovalFlowchart, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error((res.topCont && res.topCont.remark) || '编辑流程建模失败');
      }
    },
    *dealApprovalFlowchart({ payload, success }, { call }) {
      const res = yield call(dealApprovalFlowchart, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        message.success('发布流程建模成功');
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error((res.topCont && res.topCont.remark) || '发布流程建模失败');
      }
    },
    *qryApprovalFlowchartDtl({ payload, success }, { call }) {
      const res = yield call(qryApprovalFlowchartDtl, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error((res.topCont && res.topCont.remark) || '查询流程详情失败');
      }
    },
    *qryRegions({ payload, success }, { call }) {
      const res = yield call(qryRegions, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error((res.topCont && res.topCont.remark) || '查询区域失败');
      }
    },
    *qryZqythOrganization({ payload, success }, { call }) {
      const res = yield call(qryZqythOrganization, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error((res.topCont && res.topCont.remark) || '查询组织失败');
      }
    },
    *qryZqythRoles({ payload, success }, { call }) {
      const res = yield call(qryZqythRoles, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error((res.topCont && res.topCont.remark) || '查询角色失败');
      }
    },
    *qryZqythUser({ payload, success }, { call }) {
      const res = yield call(qryZqythUser, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error((res.topCont && res.topCont.remark) || '查询账号失败');
      }
    },
    *qryApprovalChannel({ payload, success }, { call }) {
      const res = yield call(qryApprovalChannel, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error((res.topCont && res.topCont.remark) || '查询节点渠道失败');
      }
    },
    *addApprovalProcess({ payload, success }, { call }) {
      const res = yield call(addApprovalProcess, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error((res.topCont && res.topCont.remark) || '增加节点失败');
      }
    },
    *modApprovalProcess({ payload, success }, { call }) {
      const res = yield call(modApprovalProcess, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error((res.topCont && res.topCont.remark) || '修改节点失败');
      }
    },
    *delApprovalProcess({ payload, success }, { call }) {
      const res = yield call(delApprovalProcess, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error((res.topCont && res.topCont.remark) || '删除节点失败');
      }
    },
    *qryApprovalProcess({ payload, success }, { call }) {
      const res = yield call(qryApprovalProcess, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error((res.topCont && res.topCont.remark) || '查询节点失败');
      }
    },
    *modApprovalFlowchartContent({ payload, success }, { call }) {
      const res = yield call(modApprovalFlowchartContent, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error((res.topCont && res.topCont.remark) || '更新流程图失败');
      }
    },
    *addApprovalLine({ payload, success }, { call }) {
      const res = yield call(addApprovalLine, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error((res.topCont && res.topCont.remark) || '保存路由属性失败');
      }
    },
    *modApprovalLine({ payload, success }, { call }) {
      const res = yield call(modApprovalLine, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error((res.topCont && res.topCont.remark) || '修改路由属性失败');
      }
    },
    *qryApprovalLine({ payload, success }, { call }) {
      const res = yield call(qryApprovalLine, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error((res.topCont && res.topCont.remark) || '查询路由属性失败');
      }
    },
    *delApprovalLine({ payload, success }, { call }) {
      const res = yield call(delApprovalLine, payload);
      if (res && res.topCont && res.topCont.resultCode == 0) {
        const { svcCont } = res;
        if (typeof success === 'function') {
          success(svcCont);
        }
      } else if (res) {
        message.error((res.topCont && res.topCont.remark) || '删除连线失败');
      }
    },
  },
  reducers: {},
  subscriptions: {},
};
