import {
  getMccLabelCatalogList,
  addMccLabelCatalogInfo,
  updateMccLabelCatalogInfo,
  delMccLabelCatalogInfo,
  getLabelInfoList,
  getLabelTableCodeField,
  addLabel,
  updateLabel,
  queryLabelInfoById,
  batchMoveLabel,
  delLabel,
  batchDelLabel,
  modifyLabelStatusCd,
  batchModifyLabelStatusCd,
} from '@/services/labelConfigManage/labelManage';

export default {
  namespace: 'labelManage',
  state: {
    rawLabelCatalogData: {}, // 原始标签目录树的数据
    labelCatalogData: {}, // 处理后的标签目录树的数据
    labelListData: {}, // 标签列表的数据 {data:[{...}{...}...]}
    currentLabelData: {}, // 当前选中的标签的详细信息：{...}
    labelCodeData: {}, // 当前宽表对应的“标签对应字段”：{data:[{...}{...}...]}
    labelValueList: [], // 当前显示的标签值规格列表
    currentCatalogId: '', // 当前选择的目录的ID
    currentCatalogName: '',// 当前选择的目录的名字
  },
  effects: {
    // 获取标签目录树的数据
    *getMccLabelCatalogList({ payload }, { call, put }) {
      const response = yield call(getMccLabelCatalogList, payload);
      yield put({
        type: 'getMccLabelCatalogListReducer',
        payload: response.svcCont,
      });
      yield put({
        type: 'handleCatalogData',
        payload: {},
      });
      return response;
    },

    // 新增标签目录
    *addMccLabelCatalogInfo({ payload }, { call }) {
      const response = yield call(addMccLabelCatalogInfo, payload);
      return response;
    },

    // 修改标签目录
    *updateMccLabelCatalogInfo({ payload }, { call }) {
      const response = yield call(updateMccLabelCatalogInfo, payload);
      return response;
    },

    // 删除标签目录
    *delMccLabelCatalogInfo({ payload }, { call }) {
      const response = yield call(delMccLabelCatalogInfo, payload);
      return response;
    },

    // 获取标签信息列表
    *getLabelInfoList({ payload }, { call, put }) {
      const response = yield call(getLabelInfoList, payload);
      yield put({
        type: 'getLabelInfoListReducer',
        payload: response.svcCont,
      });
      return response;
    },

    // 获取标签详细信息
    *queryLabelInfoById({ payload }, { call, put }) {
      const response = yield call(queryLabelInfoById, payload);
      yield put({
        type: 'queryLabelInfoByIdReducer',
        payload: response.svcCont,
      });
    },

    // 获取输入的宽表对应的“标签对应字段”
    *getLabelTableCodeField({ payload }, { call, put }) {
      const response = yield call(getLabelTableCodeField, payload);
      yield put({
        type: 'getLabelTableCodeFieldReducer',
        payload: response.svcCont,
      });
    },

    // 新建标签
    *addLabel({ payload }, { call }) {
      const response = yield call(addLabel, payload);
      return response;
    },

    // 编辑更新标签
    *updateLabel({ payload }, { call }) {
      const response = yield call(updateLabel, payload);
      return response;
    },

    // 删除标签
    *delLabel({ payload }, { call }) {
      const response = yield call(delLabel, payload);
      return response;
    },

    // 上架或下架标签
    *modifyLabelStatusCd({ payload }, { call }) {
      const response = yield call(modifyLabelStatusCd, payload);
      return response;
    },

    // 批量删除标签
    *batchDelLabel({ payload }, { call }) {
      const response = yield call(batchDelLabel, payload);
      return response;
    },

    // 批量下架标签
    *batchModifyLabelStatusCd({ payload }, { call }) {
      const response = yield call(batchModifyLabelStatusCd, payload);
      return response;
    },

    // 批量移动标签
    *batchMoveLabel({ payload }, { call }) {
      const response = yield call(batchMoveLabel, payload);
      return response;
    },
  },
  reducers: {
    // 保存标签目录树的数据
    getMccLabelCatalogListReducer(state, { payload: rawLabelCatalogData }) {
      return {
        ...state,
        rawLabelCatalogData,
      };
    },

    // 处理返回的目录数组
    handleCatalogData(state) {
      const { data } = state.rawLabelCatalogData;
      const len = data.length;
      const treeArr = data.map(item => ({
        title: item.grpName, // 目录的名称
        key: item.grpId, // 目录的ID
        comments: item.grpDesc, // 目录的描述
        pathCode: item.pathCode,
        pathCodeLen: item.pathCode.split('.').length,
        parentKey: item.parentGrpId, // 父目录的ID
        children: [],
        used: false,
        statusCd: item.statusCd, // 目录的状态
        curItem: {}, // 当前选择的目录
        labelType: item.labelType,
      }));
      const newArr = [];
      const getChild = (node, index) => {
        // 拿到当前节点的子节点
        if (index === len - 1) {
          return;
        }
        for (let i = 0; i < len; i += 1) {
          // 如果当前节点的路径长度大于 node 且 parentKey = node.key 那么它就是 node 的子元素
          if (
            treeArr[i].pathCodeLen > node.pathCodeLen &&
            treeArr[i].parentKey === node.key &&
            !treeArr[i].used
          ) {
            node.children.push(treeArr[i]);
            treeArr[i].used = true;
            getChild(treeArr[i], i);
          }
        }
      };
      for (let i = 0; i < len; i += 1) {
        if (treeArr[i].pathCodeLen === 1) {
          newArr.push(treeArr[i]);
          treeArr[i].used = true;
          getChild(treeArr[i], i);
        }
      }
      return {
        ...state,
        labelCatalogData: { data: newArr },
      };
    },

    // 保存标签信息列表
    getLabelInfoListReducer(state, { payload: labelListData }) {
      return {
        ...state,
        labelListData,
      };
    },

    // 保存当前获取到的标签详细信息
    queryLabelInfoByIdReducer(state, { payload: currentLabelData }) {
      return {
        ...state,
        currentLabelData,
      };
    },

    // 清除当前保存的标签详细信息
    resetLabelInfoData(state) {
      return {
        ...state,
        currentLabelData: {},
      };
    },

    // 保存当前获取到的“标签对应字段”
    getLabelTableCodeFieldReducer(state, { payload: labelCodeData }) {
      return {
        ...state,
        labelCodeData,
      };
    },

    // 清除之前记录的“标签对应字段”
    resetlabelCodeData(state) {
      return {
        ...state,
        labelCodeData: {},
      };
    },

    // 更新当前显示的标签值规格列表
    setLabelValueList(state, { payload: labelValueList }) {
      return {
        ...state,
        labelValueList,
      };
    },

    // 设置当前选择的目录的Id
    setCurrentCatalogId(state, { payload: { key: currentCatalogId, catalogName } }) {
      return {
        ...state,
        currentCatalogId,
        currentCatalogName: catalogName,
      };
    },
  },
};
