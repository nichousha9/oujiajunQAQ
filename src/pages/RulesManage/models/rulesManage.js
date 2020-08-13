import { message } from 'antd';
import {
  queryRuleListsSource,
  queryChildRuleSource,
  addMccRulesGroup,
  delMccRulesGroup,
  updateRuleList,
  addMccRulesGroupRel,
  delMccRulesGroupRel,
  updateChildRuleList,
} from '@/services/ruleMange/ruleList';

export default {
  namespace: 'rulesManage',
  state: {
    // 规则组信息管理数据
    ruleListsSource: [],
    // 子规则展示数据
    childRuleSource: [],
    // 是否显示新增规则组弹窗
    showRuleModal: false,
    // 是否显示新增子规则弹窗
    showChildRuleModal: false,
    // 当前被点击的规则列表项
    visitedListItem: {},
    // 当前被点击的规则列表项ID
    visitedListItemId: null,
    // 当前被点击的子规则列表项
    visitedChildListItem: {},
    // 当前页数
    currentPage: 1,
    // 列表每页条数
    currentPageSize: 10,
    // 规则列表数据总条数
    ruleListTotal: 0,
    // 操作方式 add:新增规则组 edit:编辑规则组 check:查看规则组
    operaType: 'check',
    // 子规则操作方式
    childOperaType: 'check',
    // 推荐规则列表展示
    showRecoList: false,
    // 推荐规则列表中选中的规则
    recoListItem: [],
    // 顶部搜索框搜索的值
    searchValue: '',
    // 推荐规则产品弹窗搜索值
    recoListModalSearchValue: '',
    // 推荐规则产品列表当前页数
    recoListCurrentPage: 1,
    // 推荐规则产品列表每页显示条数
    recoListCurrentPageSize: 5,
    // 子规则列表当前页
    childRuleListCurPage: 1,
    // 子规则列表当前页显示条数
    childRuleListCurPageSize: 5,
    // 子规则列表数据总条数
    childRuleListTotal: 0,
  },
  effects: {
    // 获取规则信息管理列表数据
    *getRuleLists({ payload }, { call, put }) {
      const response = yield call(queryRuleListsSource, payload);
      if (response && response.topCont && response.topCont.resultCode == 0) {
        yield put({
          type: 'saveRuleListsSource',
          payload: response,
        });
      }
    },
    // 获取子规则列表数据
    *getChildRuleSource({ payload }, { call, put }) {
      const response = yield call(queryChildRuleSource, payload);
      yield put({
        type: 'savechildRuleSource',
        payload: response,
      });
      return response;
    },
    // 检查当前选择规则项是否已经存在规则组
    *checkClickItemExit({ payload }, { call }) {
      const response = yield call(queryChildRuleSource, payload);
      return response;
    },
    // 新增规则组
    *addMccRulesGroup({ payload }, { call }) {
      const response = yield call(addMccRulesGroup, payload);
      if (response && response.topCont && response.topCont.resultCode === 0) {
        message.success('新增成功');
      } else {
        message.error(response.topCont.remark);
      }
    },
    // 删除规则组
    *delMccRulesGroup({ payload }, { call }) {
      const response = yield call(delMccRulesGroup, payload);
      if (response && response.topCont && response.topCont.resultCode === 0) {
        message.success('删除成功');
      } else {
        message.error(response.topCont.remark);
      }
    },
    // 更新规则组列表
    *updateRuleList({ payload }, { call }) {
      const response = yield call(updateRuleList, payload);
      if (response && response.topCont && response.topCont.resultCode === 0) {
        message.success('操作成功');
      } else {
        message.error(response.topCont.remark);
      }
    },
    // 新增子规则
    *addMccRulesGroupRel({ payload }, { call }) {
      const response = yield call(addMccRulesGroupRel, payload);
      if (response && response.topCont && response.topCont.resultCode === 0) {
        message.success('添加成功');
      } else {
        message.error(response.topCont.remark);
      }
    },
    // 删除子规则
    *delMccRulesGroupRel({ payload }, { call }) {
      const response = yield call(delMccRulesGroupRel, payload);
      if (response && response.topCont && response.topCont.resultCode === 0) {
        message.success('删除成功');
      } else {
        message.error(response.topCont.remark);
      }
    },
    // 更新子规则组列表
    *updateChildRuleList({ payload }, { call }) {
      const response = yield call(updateChildRuleList, payload);
      if (response && response.topCont && response.topCont.resultCode === 0) {
        message.success('操作成功');
      } else {
        message.error(response.topCont.remark);
      }
    },
  },
  reducers: {
    // 保存规则信息管理数据
    saveRuleListsSource(state, { payload }) {
      return Object.assign({}, state, {
        ruleListsSource: payload.svcCont.data,
        ruleListTotal: payload.svcCont.pageInfo.total,
      });
    },
    // 保存子规则信息列表数据
    savechildRuleSource(state, { payload }) {
      return Object.assign({}, state, {
        childRuleSource: payload.svcCont.data,
        childRuleListTotal: payload.svcCont.pageInfo.total,
      });
    },
    // 保存当前点击的规则列表项
    saveCurrentRuleList(state, { payload: visitedListItem }) {
      return Object.assign({}, state, { visitedListItem });
    },
    // 更改当前被点击项ID
    changeVisitedListItemId(state, { payload: visitedListItemId }) {
      return Object.assign({}, state, { visitedListItemId });
    },
    // 保存当前点击的子规则列表项
    saveCurrentChildRuleList(state, { payload: visitedChildListItem }) {
      return Object.assign({}, state, { visitedChildListItem });
    },
    // 清空子规则信息列表数据
    delCurrentChildList(state) {
      return Object.assign({}, state, { childRuleSource: [] });
    },
    // 显示规则组弹窗并修改操作方式
    showNewRulesModal(state, { payload: operaType }) {
      return Object.assign({}, state, { showRuleModal: true, operaType });
    },
    // 关闭规则组弹窗
    hiddenNewRulesModal(state) {
      return Object.assign({}, state, { showRuleModal: false });
    },
    // 显示子规则弹窗并修改操作方式
    showChildRuleModal(state, { payload: childOperaType }) {
      return Object.assign({}, state, { showChildRuleModal: true, childOperaType });
    },
    // 关闭子规则弹窗
    hideChildRuleModal(state) {
      return Object.assign({}, state, { showChildRuleModal: false });
    },
    // 修改当前页数
    changeCurrentPage(state, { payload: currentPage }) {
      return Object.assign({}, state, { currentPage });
    },
    // 修改每页展示数据
    changeCurrentPageSize(state, { payload: currentPageSize }) {
      return Object.assign({}, state, { currentPageSize });
    },
    // 修改子规则列表当前页数
    changeChildRuleListCurPage(state, { payload: childRuleListCurPage }) {
      return Object.assign({}, state, { childRuleListCurPage });
    },
    // 修改子规则列表每页展示数据
    changeChildRuleListCurPageSize(state, { payload: childRuleListCurPageSize }) {
      return Object.assign({}, state, { childRuleListCurPageSize });
    },
    // 修改推荐规则列表弹窗搜索值
    changeRecoListModalSearchValue(state, { payload: recoListModalSearchValue }) {
      return Object.assign({}, state, { recoListModalSearchValue });
    },
    // 修改推荐规则列表当前页数
    changeRecoListCurPage(state, { payload: recoListCurrentPage }) {
      return Object.assign({}, state, { recoListCurrentPage });
    },

    // 修改推荐规则列表每页展示数据条数
    changeRecoListCurPageSize(state, { payload: recoListCurrentPageSize }) {
      return Object.assign({}, state, { recoListCurrentPageSize });
    },
    // 展示推荐规则列表
    showRecoLists(state) {
      return Object.assign({}, state, { showRecoList: true });
    },
    // 隐藏推荐规则列表
    hiddenRecoLists(state) {
      return Object.assign({}, state, { showRecoList: false });
    },
    // 修改推荐规则列表选择的规则
    changeRecoListItem(state, { payload: recoListItem }) {
      return Object.assign({}, state, { recoListItem });
    },
    // 修改搜索框的值
    changeSearchValue(state, { payload: searchValue }) {
      return Object.assign({}, state, { searchValue });
    },
  },
};
