import { message } from 'antd';
import {
  queryRecommendRuleSource,
  qryRecoRuleDropListData,
  addRcmdRule,
  editRcmdRule,
  queryMccFolderList,
  qryOffersInfo,
  IfCanDelFolder,
  delMccFolder,
  addMccFolder,
  updateMccFolder,
  modifyRulesGoods,
  getRuleClickList,
  delRulesGoods,
  delRules,
  addRulesGoods,
  getSubExtendAndSusbsList,
  getFailResult,
  getTempRulesGoodsList,
  qryAlgorithm,
  qryBrandName,
} from '@/services/ruleMange/recommendList';

export default {
  namespace: 'recoRuleManage',
  state: {
    // 推荐规则管理列表数据
    recoRuleSource: [],
    // 是否展示新增规则
    showRecoRuleModal: false,
    // 推荐规则类型下拉列表
    recoRuleDropListData: [],
    // 数据来源方式 0:自定义 1:算法获取 2:标签关联获取
    dataSourceMethod: '',
    // 算法名称
    algorithmData: '',
    // 禁用选择框,在新增时操作了新增和导入后禁用
    forbidSelect: false,
    // 禁用返回按钮,在编辑操作时如果操作了新增和导入后禁用
    forbidBackBtn: false,
    // 禁用新增功能按钮
    forbidAddBtn: false,
    // 禁用批量导入功能按钮
    forbidAddMoreBtn: false,
    // 弹窗类型 add添加，edit编辑
    newModalType: '',
    // 商品列表点击的item项
    listClickItem: {},
    // 商品列表点击的item项的index值
    listClickIndex: 0,
    // 首页当前页数
    currentPage: 1,
    // 首页列表每页条数
    currentPageSize: 10,
    // 首页规则列表数据总条数
    ruleListTotal: 0,
    // 新增商品弹窗是否显示
    showNewGoodModal: false,
    // 选择商品弹窗
    showNewGoodChooseModal: false,
    // 会员选择弹窗
    showMemberModal: false,
    // 商品选择弹窗-产品列表选中项
    selectedGoodItem: [],
    // 会员选择弹窗-会员列表选中项
    selectedMemberItem: [],
    // 商品选择弹窗-相似商品选中项
    selectedSimilarItem: [],
    // 批量导入弹窗是否可见
    ifShowBatchImportModal: false,
    // 顶部搜索框搜索的值
    searchValue: '',
    // 商品列表搜索框的值
    goodListSearchValue: '',
    // 商品列表搜索框搜索出来的值
    goodListSearchList: [],
    // 选择商品弹窗-产品目录数据
    chooseTreeList: [],
    // 选择商品弹窗-产品列表数据
    chooseGoodList: [],
    // 选择商品弹窗-产品列表当前页
    chooseGoodListCurPage: 1,
    // 选择商品弹窗-产品列表当前页显示条数
    chooseGoodListCurPageSize: 5,
    // 选择商品弹窗-产品列表列表数
    chooseGoodListTotal: 0,
    // 会员列表弹窗-会员列表信息
    memberListData: [],
    // 会员列表弹窗-会员列表信息当前页数
    memberListDataCurPage: 1,
    // 会员列表弹窗-会员列表信息当前页显示条数
    memberListDataCurPageSize: 5,
    // 会员列表弹窗-会员列表信息列表数
    memberListDataTotal: 0,
    // 会员选择弹窗搜索值
    memberModalSearchValue: '',
    // 推荐规则（热卖）商品列表
    recoRuleHotSaleList: [],
    // 推荐规则（个人喜欢）商品列表
    recoRuleFavorList: [],
    // 推荐规则（相似商品）商品列表
    recoRuleSimilarList: [],
    // 推荐规则列表数据
    recoListCurPage: 1,
    // 推荐规则列表数据当前页显示条数
    recoListCurPageSize: 5,
    // 推荐规则列表数据列表数
    recoListTotal: 0,
    // 目录树点击的目录的id
    clickTreeFolder: '',
    // 推荐管理页面列表数据的操作方式 addRule 新增 edit 编辑
    recoListType: 'addRule',
    // 推荐管理首页列表数据当前点击项
    recoListClickItem: {},
  },
  effects: {
    // 获取推荐规则管理列表数据
    *getRecommendRuleSource({ payload }, { call, put }) {
      const response = yield call(queryRecommendRuleSource, payload);
      if (response && response.svcCont && response.svcCont.data) {
        yield put({
          type: 'saveRecommendRuleSource',
          payload: response,
        });
      }
    },
    // 获取推荐规则类型下拉列表
    *getRecoRuleDropListData({ payload }, { call, put }) {
      const response = yield call(qryRecoRuleDropListData, payload);
      if (response && response.topCont && response.topCont.resultCode == 0) {
        yield put({
          type: 'savaRecoRuleDropListData',
          payload: response,
        });
      }
    },
    // 新增推荐规则
    *addRcmdRule({ payload }, { call }) {
      const response = yield call(addRcmdRule, payload);
      if (response && response.topCont && response.topCont.resultCode == 0) {
        if (response.topCont.resultCode == 0) {
          message.success('新增成功');
        }
      }
      return response;
    },
    // 编辑推荐规则
    *editRcmdRule({ payload }, { call }) {
      const response = yield call(editRcmdRule, payload);
      if (response && response.topCont && response.topCont.resultCode == 0) {
        message.success('操作成功');
      } else {
        message.error(response.topCont.remark);
      }
    },
    // 删除推荐规则
    *delRcmdRule({ payload }, { call }) {
      const response = yield call(delRules, payload);
      if (response && response.topCont && response.topCont.resultCode == 0) {
        message.success('删除成功');
      } else {
        message.error(response.topCont.remark);
      }
    },
    // 获取选择商品产品目录树数据
    *getChooseTreeList({ payload }, { call, put }) {
      const response = yield call(queryMccFolderList, payload);
      if (response && response.svcCont && response.svcCont.data) {
        yield put({
          type: 'saveChooseTreeList',
          payload: response,
        });
      }
    },
    // 获取选择商品产品目录数据
    *getChooseGoodList({ payload }, { call, put }) {
      const response = yield call(qryOffersInfo, payload);
      if (response && response.svcCont && response.svcCont.data) {
        yield put({
          type: 'saveChooseGoodList',
          payload: response,
        });
      }
    },
    // 判断是否可以商品目录是否可以删除
    *IfCanDelFolder({ payload }, { call }) {
      const response = yield call(IfCanDelFolder, payload);
      if (response && response.svcCont && response.svcCont.data.length == 0) {
        // 如果有数据证明不能删除
        yield call(delMccFolder, payload);
      }
      return response;
    },
    // 删除目录
    *delMccFolder({ payload }, { call }) {
      const response = yield call(delMccFolder, payload);
      return response;
    },
    // 添加目录
    *addMccFolder({ payload }, { call }) {
      const response = yield call(addMccFolder, payload);
      return response;
    },
    // 编辑目录
    *updateMccFolder({ payload }, { call }) {
      const response = yield call(updateMccFolder, payload);
      return response;
    },
    // 查询推荐规则的关联商品列表（通用）
    *getRuleClickList({ payload }, { call, put }) {
      const response = yield call(getRuleClickList, payload);
      let saveRuleListName = '';
      if (response && response.svcCont && response.svcCont.data && response.svcCont.pageInfo) {
        switch (payload.typeCode) {
          case 'MCC_RULES_IMPLEMENTS_HOTSALE':
            saveRuleListName = 'changeRecoRuleHotSaleList';
            break;
          case 'MCC_RULES_IMPLEMENTS_FAVOR':
            saveRuleListName = 'changeRecoRuleFavorList';
            break;
          case 'MCC_RULES_IMPLEMENTS_SIMILAR':
            saveRuleListName = 'changeRecoRuleSimilarList';
            break;
          default:
        }
        yield put({
          type: saveRuleListName,
          payload: response.svcCont,
        });
      }
      return response;
    },
    // 推荐规则-修改关联商品（通用）
    *modifyRulesGoods({ payload }, { call }) {
      const response = yield call(modifyRulesGoods, payload);
      if (response && response.topCont && response.topCont.resultCode == 0) {
        message.success('操作成功');
      } else {
        message.error(response.topCont.remark);
      }
      return response;
    },
    // 推荐规则-删除关联商品（通用）
    *delRulesGoods({ payload }, { call }) {
      const response = yield call(delRulesGoods, payload);
      if (response && response.topCont && response.topCont.resultCode == 0) {
        message.success('删除成功');
      } else {
        message.error(response.topCont.remark);
      }
      return response;
    },
    // 推荐规则-新增关联商品 （通用）
    *addRulesGoods({ payload }, { call }) {
      const response = yield call(addRulesGoods, payload);
      if (response && response.topCont && response.topCont.resultCode == 0) {
        message.success('添加成功');
      } else {
        message.error(response.topCont.remark);
      }
      return response;
    },
    // 个人喜欢--会员选择弹窗--获取会员信息
    *getSubsBasicList({ payload }, { call, put }) {
      const response = yield call(getSubExtendAndSusbsList, payload);
      if (response && response.svcCont && response.svcCont.data) {
        yield put({
          type: 'saveMemberListData',
          payload: response,
        });
      }
    },
    // 导出失败结果
    *getFailResult({ payload }, { call }) {
      const response = yield call(getFailResult, payload);
      return response;
    },
    // 获取导入成功的数据
    *getTempRulesGoodsList({ payload }, { call }) {
      const response = yield call(getTempRulesGoodsList, payload);
      return response;
    },
    // 查询算法
    *qryAlgorithm({ payload }, { call, put }) {
      const response = yield call(qryAlgorithm, payload);
      if (response && response.topCont && response.topCont.resultCode == '0') {
        yield put({
          type: 'saveAlgorithmData',
          payload: response.svcCont.data,
        });
      }
      return response;
    },
    // 获取商品品牌
    *getBrandNameEffect(_, { call }) {
      const result = yield call(qryBrandName);
      return result;
    },
  },
  reducers: {
    // 保存推荐规则管理列表数据
    saveRecommendRuleSource(state, { payload: recoRuleSource }) {
      return Object.assign({}, state, {
        recoRuleSource: recoRuleSource.svcCont.data,
        ruleListTotal: recoRuleSource.svcCont.pageInfo.total,
      });
    },
    // 展示规则弹窗
    showRecoRuleModal(state) {
      return Object.assign({}, state, { showRecoRuleModal: true });
    },
    // 关闭规则弹窗
    hiddenRecoRuleModal(state) {
      return Object.assign({}, state, { showRecoRuleModal: false });
    },
    // 保存推荐规则类型下拉列表数据
    savaRecoRuleDropListData(state, { payload }) {
      return Object.assign({}, state, { recoRuleDropListData: payload.svcCont.data });
    },
    // 改变数据来源方式
    changeDataSourceMethod(state, { payload: dataSourceMethod }) {
      return Object.assign({}, state, { dataSourceMethod });
    },
    // 改变数据来源方式
    saveAlgorithmData(state, { payload }) {
      return Object.assign({}, state, { algorithmData: payload[0] });
    },
    // 修改新增推荐规则下拉框的禁止状态
    changeAddSelectType(state, { payload: forbidSelect }) {
      return Object.assign({}, state, { forbidSelect });
    },
    // 修改新增推荐规则下拉框的禁止状态
    changeEditBackBtnType(state, { payload: forbidBackBtn }) {
      return Object.assign({}, state, { forbidBackBtn });
    },
    // 修改新增状态下新增按钮的状态
    changeAddBtnType(state, { payload: forbidAddBtn }) {
      return Object.assign({}, state, { forbidAddBtn });
    },
    // 修改新增状态下批量导入按钮的状态
    changeAddMoreType(state, { payload: forbidAddMoreBtn }) {
      return Object.assign({}, state, { forbidAddMoreBtn });
    },
    // 修改弹窗的类型
    changeNewModalType(state, { payload: newModalType }) {
      return Object.assign({}, state, { newModalType });
    },
    // 修改商品列表点击的item项
    changeListClickItem(state, { payload: listClickItem }) {
      return Object.assign({}, state, { listClickItem });
    },
    // 修改商品列表点击的item项的index值
    changeListClickIndex(state, { payload: listClickIndex }) {
      return Object.assign({}, state, { listClickIndex });
    },
    // 修改当前页数
    changeCurrentPage(state, { payload: currentPage }) {
      return Object.assign({}, state, { currentPage });
    },
    // 修改每页展示数据
    changeCurrentPageSize(state, { payload: currentPageSize }) {
      return Object.assign({}, state, { currentPageSize });
    },
    // 修改商品弹窗当前页数
    changeChooseGoodListCurPage(state, { payload: chooseGoodListCurPage }) {
      return Object.assign({}, state, { chooseGoodListCurPage });
    },
    // 修改商品弹窗当前页展示条数
    changeChooseGoodListCurPageSize(state, { payload: chooseGoodListCurPageSize }) {
      return Object.assign({}, state, { chooseGoodListCurPageSize });
    },
    // 修改商品弹窗当前页数
    changeChooseMemberCurPage(state, { payload: memberListDataCurPage }) {
      return Object.assign({}, state, { memberListDataCurPage });
    },
    // 修改商品弹窗当前页展示条数
    changeChooseGoodMemberPageSize(state, { payload: memberListDataCurPageSize }) {
      return Object.assign({}, state, { memberListDataCurPageSize });
    },
    // 修改商品弹窗当前页展示条数
    changeMemberModalSearchValue(state, { payload: memberModalSearchValue }) {
      return Object.assign({}, state, { memberModalSearchValue });
    },
    // 修改推荐规则列表数据页数
    changeRecoListCurPage(state, { payload: recoListCurPage }) {
      return Object.assign({}, state, { recoListCurPage });
    },
    // 修改推荐规则列表数据展示条数
    changeRecoListCurPageSize(state, { payload: recoListCurPageSize }) {
      return Object.assign({}, state, { recoListCurPageSize });
    },
    // 新增推荐规则
    saveNewRecoRule(state) {
      return Object.assign({}, state);
    },
    // 展示新增商品弹窗
    showNewGoodModal(state) {
      return Object.assign({}, state, { showNewGoodModal: true });
    },
    // 关闭新增商品弹窗
    hiddenNewGoodModal(state) {
      return Object.assign({}, state, { showNewGoodModal: false });
    },
    // 展示选择商品弹窗
    showNewGoodChooseModal(state) {
      return Object.assign({}, state, { showNewGoodChooseModal: true });
    },
    // 关闭选择商品弹窗
    hiddenNewGoodChooseModal(state) {
      return Object.assign({}, state, { showNewGoodChooseModal: false });
    },
    // 展示选择商品弹窗
    openMemberModal(state) {
      return Object.assign({}, state, { showMemberModal: true });
    },
    // 关闭选择商品弹窗
    hiddenMemberModal(state) {
      return Object.assign({}, state, { showMemberModal: false });
    },
    // 热卖-商品选择弹窗-保存当前点击商品项
    saveCurrentSelectedGoodItem(state, { payload: selectedGoodItem }) {
      return Object.assign({}, state, { selectedGoodItem });
    },
    // 个人喜欢-会员选择弹窗-保存当前点击会员项
    saveCurrentSelectedMemberItem(state, { payload: selectedMemberItem }) {
      return Object.assign({}, state, { selectedMemberItem });
    },
    // 相似商品-商品选择弹窗-保存当前点击会员项
    saveCurrentSelectedSimilarItem(state, { payload: selectedSimilarItem }) {
      return Object.assign({}, state, { selectedSimilarItem });
    },
    // 展示选择商品弹窗
    openBatchImportModal(state) {
      return Object.assign({}, state, { ifShowBatchImportModal: true });
    },
    // 关闭选择商品弹窗
    hiddenBatchImportModal(state) {
      return Object.assign({}, state, { ifShowBatchImportModal: false });
    },
    // 修改搜索框的值
    changeSearchValue(state, { payload: searchValue }) {
      return Object.assign({}, state, { searchValue });
    },
    // 修改商品列表搜索框的值
    changeListSearchValue(state, { payload: goodListSearchValue }) {
      return Object.assign({}, state, { goodListSearchValue });
    },
    // 修改商品列表搜索框的值
    changeListSearchList(state, { payload: goodListSearchList }) {
      return Object.assign({}, state, { goodListSearchList });
    },
    // 保存选择商品产品目录数据
    saveChooseTreeList(state, { payload }) {
      return Object.assign({}, state, { chooseTreeList: payload.svcCont.data });
    },
    // 保存选择商品产品列表数据
    saveChooseGoodList(state, { payload }) {
      return Object.assign({}, state, {
        chooseGoodList: payload.svcCont.data,
        chooseGoodListTotal: payload.svcCont.pageInfo.total,
      });
    },
    // 修改推荐规则（热卖）商品列表
    changeRecoRuleHotSaleList(state, { payload }) {
      return Object.assign({}, state, {
        recoRuleHotSaleList: payload.data,
        recoListTotal: payload.pageInfo.total,
      });
    },

    // 修改推荐规则（个人喜欢）商品列表
    changeRecoRuleFavorList(state, { payload }) {
      return Object.assign({}, state, {
        recoRuleFavorList: payload.data,
        recoListTotal: payload.pageInfo.total,
      });
    },
    // 修改推荐规则（相似商品）商品列表
    changeRecoRuleSimilarList(state, { payload }) {
      return Object.assign({}, state, {
        recoRuleSimilarList: payload.data,
        recoListTotal: payload.pageInfo.total,
      });
    },

    // 修改商品列表总条数
    changeListPage(state, { payload: recoListTotal }) {
      return Object.assign({}, state, {
        recoListTotal,
      });
    },
    // 修改目录树点击项
    changeClickTreeFolder(state, { payload: clickTreeFolder }) {
      return Object.assign({}, state, { clickTreeFolder });
    },
    // 修改推荐规则管理页面列表数据的操作方式和保存当前点击项
    clickRecoListItem(state, { payload: recoListClickItem }) {
      return Object.assign({}, state, {
        recoListClickItem,
      });
    },
    // 修改当前的操作方式
    changeRecoListType(state, { payload: recoListType }) {
      return Object.assign({}, state, { recoListType });
    },
    // 保存会员列表信息
    saveMemberListData(state, { payload: memberListData }) {
      return Object.assign({}, state, {
        memberListData: memberListData.svcCont.data,
        memberListDataTotal: memberListData.svcCont.pageInfo.total,
      });
    },
  },
};
