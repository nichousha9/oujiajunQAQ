import React, { Component } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Card, Button, Form, Input, Row, Col, Select, message, Radio } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import RecoForHotSale from './RecoForHotSale';
import RecoForFavor from './RecoForFavor';
import RecoForSimilar from './RecoForSimilar';
import RecoRuleForLabel from './RecoRuleForLabel';
import NewGoodModal from './NewGoodModal';
import BatchImport from './BatchImport';
import styles from './index.less';
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

const formDescLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 22 },
    md: { span: 19 },
  },
};

const formNameAndTypeLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
    md: { span: 14 },
  },
};

const formSourceLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
    md: { span: 14 },
  },
};

const formForCustom = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
  },
};

const formForCus = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 18 },
  },
};

@connect(({ recoRuleManage, loading }) => ({
  loading,
  recoRuleSource: recoRuleManage.recoRuleSource,
  recoRuleDropListData: recoRuleManage.recoRuleDropListData,
  dataSourceMethod: recoRuleManage.dataSourceMethod,
  recoRuleHotSaleList: recoRuleManage.recoRuleHotSaleList,
  recoRuleFavorList: recoRuleManage.recoRuleFavorList,
  recoRuleSimilarList: recoRuleManage.recoRuleSimilarList,
  currentPage: recoRuleManage.currentPage,
  currentPageSize: recoRuleManage.currentPageSize,
  recoListClickItem: recoRuleManage.recoListClickItem,
  recoListType: recoRuleManage.recoListType,
  forbidSelect: recoRuleManage.forbidSelect,
  forbidBackBtn: recoRuleManage.forbidBackBtn,
  newModalType: recoRuleManage.newModalType,
  listClickItem: recoRuleManage.listClickItem,
  listClickIndex: recoRuleManage.listClickIndex,
  showNewGoodModal: recoRuleManage.showNewGoodModal,
  ifShowBatchImportModal: recoRuleManage.ifShowBatchImportModal,
  recoListCurPage: recoRuleManage.recoListCurPage,
  recoListCurPageSize: recoRuleManage.recoListCurPageSize,
  goodListSearchValue: recoRuleManage.goodListSearchValue,
  algorithmData: recoRuleManage.algorithmData,
}))
@Form.create({
  // 当 Form.Item 子节点的值（包括 error）发生改变时触发，
  // 可以把对应的值转存到 Redux store
  onFieldsChange(props, changedFields) {
    const { dispatch, recoListClickItem = {} } = props;
    const newTemplate = {
      ...recoListClickItem,
    };
    Object.values(changedFields).forEach(feild => {
      newTemplate[feild.name] = feild.value;
      newTemplate[`origin_${feild.name}`] = feild; // 这里作用是把错误等带上
    });
    dispatch({
      type: 'recoRuleManage/clickRecoListItem',
      payload: { ...newTemplate },
    });
  },
  mapPropsToFields(props) {
    const { recoListClickItem = {} } = props;
    return {
      rulesName: Form.createFormField({
        ...recoListClickItem.origin_rulesName,
        value: recoListClickItem.rulesName,
      }),
      rulesType: Form.createFormField({
        ...recoListClickItem.origin_rulesType,
        value: recoListClickItem.rulesType,
      }),
      rulesDesc: Form.createFormField({
        ...recoListClickItem.origin_rulesDesc,
        value: recoListClickItem.rulesDesc,
      }),
      sourceType: Form.createFormField({
        ...recoListClickItem.origin_sourceType,
        value: recoListClickItem.sourceType,
      }),
      algorithmName: Form.createFormField({
        ...recoListClickItem.origin_algorithmName,
        value: recoListClickItem.algorithmName,
      }),
    };
  },
})
class RecoRule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '', // 搜索框的值
    };
  }

  componentDidMount() {
    // 获取下拉框的数据
    this.getRecoRuleDropListData();
  }

  componentWillUnmount() {
    // 清理表单数据
    this.clearGoodsList();
  }

  // 获取推荐规则类型下拉列表
  getRecoRuleDropListData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'recoRuleManage/getRecoRuleDropListData',
      payload: {
        attrSpecCode: 'MCC_RULES_TYPE',
        // language: 'en',
      },
    });
  };

  // 保存新增推荐规则
  addNewRecoRule = () => {
    const { recoListClickItem, form } = this.props;
    switch (recoListClickItem.rulesType) {
      // 新增热卖规则
      case 'MCC_RULES_IMPLEMENTS_HOTSALE':
        this.newHotSaleRule();
        break;
      // 新增会员规则
      case 'MCC_RULES_IMPLEMENTS_FAVOR':
        this.newMemberRule();
        break;
      // 新增会员规则
      case 'MCC_RULES_IMPLEMENTS_SIMILAR':
        this.newSimilarRule();
        break;
      default:
        form.validateFields(err => {
          if (!err) {
            // console.log(err)
          }
        });
    }
  };

  // 保存新增热卖规则
  newHotSaleRule = () => {
    const {
      form,
      dispatch,
      recoRuleHotSaleList,
      recoListType,
      recoListClickItem,
      dataSourceMethod,
      algorithmData,
    } = this.props;
    form.validateFields((err, values) => {
      const recoList = recoRuleHotSaleList.map(item => {
        const newData = item;
        newData.rgType = '00';
        newData.goodsObjectCode = '';
        return newData;
      });
      let srcType = '';
      const obj = {
        baseInfo: {
          rulesName: values.rulesName,
          rulesDesc: values.rulesDesc,
          rulesType: values.rulesType,
          sourceType: values.sourceType,
        },
        goodsList: recoList,
        typeCode: values.rulesType,
        batchCode: '1d996def-f727-40dd-bebf-b6bab93fd388',
      };
      if (dataSourceMethod == 1) {
        obj.baseInfo.sourceCode = algorithmData.algorithmId;
        obj.goodsList = [];
      }
      // 新增规则 点击保存
      if (recoListType === 'addRule') {
        srcType = 'recoRuleManage/addRcmdRule';
      } else if (recoListType === 'editRule') {
        // 编辑规则 点击保存
        srcType = 'recoRuleManage/editRcmdRule';
        obj.rulesId = recoListClickItem.rulesId;
      }
      if (!err) {
        dispatch({
          type: srcType,
          payload: obj,
        }).then(res => {
          if (res && res.topCont && res.topCont.resultCode == -1) {
            message.error(res.topCont.remark, 1);
            form.setFieldsValue({
              rulesName: '',
            });
          } else {
            this.afterSave();
          }
        });
      }
    });
  };

  // 保存新增会员规则
  newMemberRule = () => {
    const {
      form,
      dispatch,
      recoRuleFavorList,
      recoListType,
      recoListClickItem,
      algorithmData,
      dataSourceMethod,
    } = this.props;
    form.validateFields((err, values) => {
      const recoList = recoRuleFavorList.map(item => {
        const newData = item;
        newData.rcmRate = String(item.rcmRate);
        newData.goodsObjectId = String(item.goodsObjectId);
        newData.rgType = '00';
        newData.subsId = String(item.subsId);
        newData.subsName = item.subsName;
        return newData;
      });
      let srcType = '';
      const obj = {
        baseInfo: {
          rulesName: values.rulesName,
          rulesDesc: values.rulesDesc,
          rulesType: values.rulesType,
          sourceType: values.sourceType,
        },
        goodsList: recoList,
        typeCode: values.rulesType,
        batchCode: '289b8a6e-6fa4-450b-a47a-6d8303f182a0',
      };
      if (dataSourceMethod == 1) {
        obj.baseInfo.sourceCode = algorithmData.algorithmId;
        obj.goodsList = [];
      }
      // 新增会员规则 点击保存
      if (recoListType === 'addRule') {
        srcType = 'recoRuleManage/addRcmdRule';
      } else if (recoListType === 'editRule') {
        // 编辑规则 点击保存
        srcType = 'recoRuleManage/editRcmdRule';
        obj.rulesId = recoListClickItem.rulesId;
      }
      if (!err) {
        dispatch({
          type: srcType,
          payload: obj,
        }).then(res => {
          if (res && res.topCont && res.topCont.resultCode == -1) {
            message.error(res.topCont.remark, 1);
            form.setFieldsValue({
              rulesName: '',
            });
          } else {
            this.afterSave();
          }
        });
      }
    });
  };

  // 保存新增相似规则
  newSimilarRule = () => {
    const {
      form,
      dispatch,
      recoRuleSimilarList,
      recoListType,
      recoListClickItem,
      algorithmData,
      dataSourceMethod,
    } = this.props;
    form.validateFields((err, values) => {
      const recoList = recoRuleSimilarList.map(item => {
        const newData = item;
        newData.rcmRate = String(item.rcmRate);
        newData.goodsObjectId = String(item.goodsObjectId);
        newData.goodsObjectName = String(item.goodsObjectName);
        newData.goodsSimilarId = String(item.goodsSimilarId);
        newData.goodsSimilarName = String(item.goodsSimilarName);
        newData.goodsObjectCode = 's_offer_code';
        newData.rgType = '00';
        return newData;
      });
      let srcType = '';
      const obj = {
        baseInfo: {
          rulesName: values.rulesName,
          rulesDesc: values.rulesDesc,
          rulesType: values.rulesType,
          sourceType: values.sourceType,
        },
        goodsList: recoList,
        typeCode: values.rulesType,
      };
      if (dataSourceMethod == 1) {
        obj.baseInfo.sourceCode = algorithmData.algorithmId;
        obj.goodsList = [];
      }
      // 新增相似商品规则 点击保存
      if (recoListType === 'addRule') {
        srcType = 'recoRuleManage/addRcmdRule';
      } else if (recoListType === 'editRule') {
        // 编辑相似商品规则 点击保存
        srcType = 'recoRuleManage/editRcmdRule';
        obj.rulesId = recoListClickItem.rulesId;
      }
      if (!err) {
        dispatch({
          type: srcType,
          payload: obj,
        }).then(res => {
          if (res && res.topCont && res.topCont.resultCode == -1) {
            message.error(res.topCont.remark, 1);
            form.setFieldsValue({
              rulesName: '',
            });
          } else {
            this.afterSave();
          }
        });
      }
    });
  };

  // 保存后的统一操作
  afterSave = () => {
    // 清空表单
    this.clearFormData();
    // 清空商品列表
    this.clearGoodsList();
    // 清空页码
    this.clearPageData();
    // 跳转到首页
    router.push({
      pathname: '/rulesManage/recommendRuleManage',
      state: {
        type: 'cancel',
      },
    });
  };

  // 获取推荐规则首页点击项的商品列表数据
  getRuleClickList = (page, pageSize, searchValue = '') => {
    const { dispatch, recoListClickItem } = this.props;
    const obj = {
      rulesId: recoListClickItem.rulesId,
      pageInfo: { pageNum: page, pageSize },
      typeCode: recoListClickItem.rulesType,
      goodsObjectName: searchValue,
    };
    if (recoListClickItem.rulesType == 'MCC_RULES_IMPLEMENTS_FAVOR') {
      obj.subsName = '';
    }
    dispatch({
      type: 'recoRuleManage/getRuleClickList',
      payload: obj,
    });
  };

  // 更改当前点击项
  changeCurClickItem = (type, item, index) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'recoRuleManage/changeNewModalType',
      payload: type,
    });
    dispatch({
      type: 'recoRuleManage/changeListClickItem',
      payload: item,
    });
    dispatch({
      type: 'recoRuleManage/changeListClickIndex',
      payload: index,
    });
  };

  // 新增商品列表
  addGoodItem = type => {
    this.showGoodModal();
    const { dispatch } = this.props;
    dispatch({
      type: 'recoRuleManage/changeNewModalType',
      payload: type,
    });
  };

  // 编辑商品列表
  editGoodItem = (type, item, index) => {
    this.showGoodModal();
    this.changeCurClickItem(type, item, index);
  };

  // 删除新增商品列表商品条目
  deleteRule = async (type, item, index) => {
    await this.changeCurClickItem(type, item, index);
    const { recoListClickItem } = this.props;
    switch (recoListClickItem.rulesType) {
      // 热卖
      case 'MCC_RULES_IMPLEMENTS_HOTSALE':
        this.changeDelOriginList(item);
        this.deleteGoodItem();
        break;
      // 个人喜欢
      case 'MCC_RULES_IMPLEMENTS_FAVOR':
        this.changeDelOriginList(item);
        this.deleteGoodItem();
        break;
      case 'MCC_RULES_IMPLEMENTS_SIMILAR':
        this.changeDelOriginList(item, index);
        this.deleteGoodItem();
        break;
      default:
    }
  };

  // 修改原始数据（删除操作）
  changeDelOriginList = list => {
    const {
      recoRuleHotSaleList,
      dispatch,
      recoListClickItem,
      recoRuleFavorList,
      recoRuleSimilarList,
      recoListCurPage,
      recoListCurPageSize,
    } = this.props;
    let listData;
    let dispatchType;
    switch (recoListClickItem.rulesType) {
      case 'MCC_RULES_IMPLEMENTS_HOTSALE':
        listData = recoRuleHotSaleList;
        dispatchType = 'changeRecoRuleHotSaleList';
        break;
      case 'MCC_RULES_IMPLEMENTS_FAVOR':
        listData = recoRuleFavorList;
        dispatchType = 'changeRecoRuleFavorList';
        break;
      case 'MCC_RULES_IMPLEMENTS_SIMILAR':
        listData = recoRuleSimilarList;
        dispatchType = 'changeRecoRuleSimilarList';
        break;
      default:
    }
    const originList = [...listData];
    let curIndex;
    if (dispatchType == 'changeRecoRuleSimilarList') {
      originList.forEach((item, index) => {
        if (
          item.goodsObjectId == list.goodsObjectId &&
          item.goodsSimilarId == list.goodsSimilarId
        ) {
          curIndex = index;
        }
      });
    } else {
      listData.forEach((item, index) => {
        if (item.goodsObjectId == list.goodsObjectId) {
          curIndex = index;
        }
      });
    }
    const newData = [...originList.slice(0, curIndex), ...originList.slice(curIndex + 1)];
    dispatch({
      type: `recoRuleManage/${dispatchType}`,
      payload: {
        data: newData.length > 0 ? newData : [],
        pageInfo: {
          total: newData.length > 0 ? newData.length : 0,
        },
      },
    });
    // result 过滤后的当前页的数据
    const result = this.handleShowListData().slice(
      (recoListCurPage - 1) * recoListCurPageSize,
      (recoListCurPage - 1) * recoListCurPageSize + recoListCurPageSize,
    );
    // 如果删除之后当前页没有数据并且为非搜索状态时页码-1
    if (result.length == 0) {
      dispatch({
        type: 'recoRuleManage/changeRecoListCurPage',
        payload: recoListCurPage - 1 || 1,
      });
    }
    // 禁用返回按钮
    this.forbidBack();
  };

  // 编辑状态下删除数据（调用接口）
  deleteGoodItem = () => {
    // 编辑推荐规则需要调用接口更新数据库数据
    const {
      dispatch,
      recoListClickItem,
      recoListType,
      listClickItem,
      goodListSearchValue,
    } = this.props;
    if (recoListType === 'editRule') {
      dispatch({
        type: 'recoRuleManage/delRulesGoods',
        payload: {
          rulesId: recoListClickItem.rulesId.toString(),
          rgRulesId: listClickItem.relId.toString(),
          typeCode: recoListClickItem.rulesType,
        },
      }).then(() => {
        // 删除后重新获取数据
        const { recoListCurPageSize, recoListCurPage } = this.props;
        this.getRuleClickList(recoListCurPage, recoListCurPageSize, goodListSearchValue);
      });
    }
  };

  // 进行了删除操作禁用按钮
  forbidBack = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'recoRuleManage/changeEditBackBtnType',
      payload: true,
    });
  };

  // 商品列表搜索商品名称
  changeSearchName = e => {
    const { value } = e.target;
    this.setState({
      searchValue: value,
    });
  };

  // 点击查询按钮-根据商品名称进行搜索
  searchListData = () => {
    const {
      dispatch,
      recoListType,
      recoListClickItem,
      recoListCurPage,
      recoListCurPageSize,
    } = this.props;
    // 点击查询的时候才进行搜索
    const { searchValue } = this.state;
    dispatch({
      type: 'recoRuleManage/changeListSearchValue',
      payload: searchValue,
    });
    // 新增状态下改变搜索值修改 Modal 会触发 render 会自动过滤数组
    if (recoListType != 'addRule') {
      // 编辑状态下直接调用查询接口
      const obj = {
        rulesId: recoListClickItem.rulesId,
        pageInfo: { pageNum: recoListCurPage, pageSize: recoListCurPageSize },
        typeCode: recoListClickItem.rulesType,
        goodsObjectName: searchValue,
      };
      // 查询会员需要额外多的一个参数 subsName
      if (recoListClickItem.rulesType === 'MCC_RULES_IMPLEMENTS_FAVOR') {
        obj.subsName = '';
      }
      dispatch({
        type: 'recoRuleManage/getRuleClickList',
        payload: obj,
      });
    }
    // 点击搜索的话要把当前页变为 1
    dispatch({
      type: 'recoRuleManage/changeRecoListCurPage',
      payload: 1,
    });
    // 保存当前搜索出来的数据
    // dispatch({
    //   type: 'recoRuleManage/changeListSearchList',
    //   payload: this.searchBtnList(),
    // });
  };

  // 搜索框的处理方法
  searchBtnList = () => {
    const {
      recoRuleHotSaleList,
      recoRuleFavorList,
      recoRuleSimilarList,
      recoListClickItem,
    } = this.props;
    let ruleListName = [];
    switch (recoListClickItem.rulesType) {
      case 'MCC_RULES_IMPLEMENTS_HOTSALE':
        ruleListName = [...recoRuleHotSaleList];
        break;
      case 'MCC_RULES_IMPLEMENTS_FAVOR':
        ruleListName = [...recoRuleFavorList];
        break;
      case 'MCC_RULES_IMPLEMENTS_SIMILAR':
        ruleListName = [...recoRuleSimilarList];
        break;
      default:
    }
    let newList = ruleListName;
    const { searchValue } = this.state;
    // 返回经过搜索值过滤的数据
    newList = ruleListName.filter(curItem => {
      return curItem.goodsObjectName.includes(searchValue);
    });
    return newList;
  };

  // 处理每种类型展示的数据
  handleShowListData = () => {
    const {
      recoListType,
      recoRuleHotSaleList,
      recoRuleFavorList,
      recoRuleSimilarList,
      recoListClickItem,
      goodListSearchValue,
    } = this.props;
    let ruleListName = [];
    switch (recoListClickItem.rulesType) {
      case 'MCC_RULES_IMPLEMENTS_HOTSALE':
        ruleListName = [...recoRuleHotSaleList];
        break;
      case 'MCC_RULES_IMPLEMENTS_FAVOR':
        ruleListName = [...recoRuleFavorList];
        break;
      case 'MCC_RULES_IMPLEMENTS_SIMILAR':
        ruleListName = [...recoRuleSimilarList];
        break;
      default:
    }
    if (recoListType === 'editRule') {
      // 编辑状态下只需要只需要展示每次接口返回的数据接口
      const newListArr = [...ruleListName];
      return newListArr;
    }
    let newList = ruleListName;
    // 返回经过搜索值过滤的数据
    newList = ruleListName.filter(curItem => {
      return curItem.goodsObjectName.includes(goodListSearchValue);
    });
    return newList;
  };

  // 重置功能
  delSearchVal = async () => {
    const { dispatch, recoListType, recoListCurPage, recoListCurPageSize } = this.props;
    this.setState({
      searchValue: '',
    });
    dispatch({
      type: 'recoRuleManage/changeListSearchValue',
      payload: '',
    });
    // dispatch({
    //   type: 'recoRuleManage/changeListSearchList',
    //   payload: [],
    // });
    if (recoListType != 'addRule') {
      this.getRuleClickList(recoListCurPage, recoListCurPageSize, '');
    }
  };

  // 模版下载
  downLoadTem = () => {
    const { recoListClickItem } = this.props;
    const target = window.location.origin;
    const url = `${target}/mccm-service/mccm/marketmgr/RCMDRulesListController/downloadFile?typeCode=${recoListClickItem.rulesType}`;
    const a = document.createElement('a');
    a.href = url;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // 页码改变
  pageChange = async page => {
    const { dispatch, recoListCurPageSize, recoListType, goodListSearchValue } = this.props;
    // 修改页码
    dispatch({
      type: 'recoRuleManage/changeRecoListCurPage',
      payload: page,
    });
    // 只有非新增状态下才需要重新获取数据
    if (recoListType != 'addRule') {
      this.getRuleClickList(page, recoListCurPageSize, goodListSearchValue);
    }
  };

  // 改变每页显示数据条数
  pageSizeChange = (_, size) => {
    const { dispatch, recoListCurPage, recoListType, goodListSearchValue } = this.props;
    // 修改每页显示页数
    dispatch({
      type: 'recoRuleManage/changeRecoListCurPageSize',
      payload: size,
    });
    if (recoListType != 'addRule') {
      this.getRuleClickList(recoListCurPage, size, goodListSearchValue);
    }
  };

  // 切换选择按钮
  changeRadio = e => {
    const { dispatch, recoListClickItem } = this.props;
    dispatch({
      type: 'recoRuleManage/changeDataSourceMethod',
      payload: e.target.value,
    });
    if (recoListClickItem.rulesType) {
      this.getAlgorithm();
    }
  };

  // 选择不同规则类型
  changeRuleType = value => {
    const { dataSourceMethod } = this.props;
    if (dataSourceMethod == 1) {
      this.getAlgorithm(value);
    }
  };



  // 算法获取
  getAlgorithm = type => {
    const { dispatch, recoListClickItem } = this.props;
    const value = type || recoListClickItem.rulesType;
    dispatch({
      type: 'recoRuleManage/qryAlgorithm',
      payload: {
        typeCode: value,
      },
    });
  };

  // 关闭弹窗
  hiddenRecoRuleModal = async () => {
    router.push({
      pathname: '/rulesManage/recommendRuleManage',
      state: {
        type: 'cancel',
      },
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'recoRuleManage/changeDataSourceMethod',
      payload: '',
    });
    this.clearFormData();
    // 清空商品列表
    this.clearGoodsList();
  };

  // 清空表单数据
  clearFormData = () => {
    const { dispatch } = this.props;
    // 如果是新增规则的话，需要清空表单和列表数据
    dispatch({
      type: 'recoRuleManage/clickRecoListItem',
      payload: {},
    });
  };

  // 清空商品列表数据
  clearGoodsList = () => {
    const { recoListClickItem, dispatch } = this.props;
    let listType = '';
    switch (recoListClickItem.rulesType) {
      // 清理热卖规则
      case 'MCC_RULES_IMPLEMENTS_HOTSALE':
        listType = 'changeRecoRuleHotSaleList';
        break;
      // 清理会员规则
      case 'MCC_RULES_IMPLEMENTS_FAVOR':
        listType = 'changeRecoRuleFavorList';
        break;
      // 清理相似规则
      case 'MCC_RULES_IMPLEMENTS_SIMILAR':
        listType = 'changeRecoRuleSimilarList';
        break;
      default:
    }
    // 清空当前的商品列表(避免数据延后，从有数据变成无数据)
    dispatch({
      type: `recoRuleManage/${listType}`,
      payload: {
        data: [],
        pageInfo: {
          total: 0,
        },
      },
    });
  };

  // 清空页码数据
  clearPageData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'recoRuleManage/changeRecoListCurPage',
      payload: 1,
    });
    dispatch({
      type: 'recoRuleManage/changeRecoListCurPageSize',
      payload: 5,
    });
  };

  // 打开新增商品弹窗
  showGoodModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'recoRuleManage/showNewGoodModal',
    });
  };

  // 打开批量导入弹窗
  showBatchImportModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'recoRuleManage/openBatchImportModal',
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      recoRuleDropListData,
      dataSourceMethod,
      recoListType,
      recoListClickItem,
      forbidSelect,
      showNewGoodModal,
      ifShowBatchImportModal,
      forbidBackBtn,
      loading,
      algorithmData,
    } = this.props;
    let title = '';
    const { searchValue } = this.state;
    if (recoListType === 'viewRule') {
      title = formatMessage({ id: 'rulesManage.recoRule.viewRecoRule' }, '查看推荐规则');
    } else if (recoListType === 'editRule') {
      title = formatMessage({ id: 'rulesManage.recoRule.editRecoRule' }, '编辑推荐规则');
    } else {
      title = formatMessage({ id: 'rulesManage.recoRule.newRecoRule' }, '新增推荐规则');
    }
    const tableList = (
      <div>
        <Button
          type="primary"
          className={styles.recoHeadBtn}
          disabled={recoListType === 'viewRule'}
          onClick={this.addNewRecoRule}
          loading={loading.effects['recoRuleManage/addRcmdRule']}
        >
          {formatMessage({ id: 'rulesManage.recoRule.save' }, '保存')}
        </Button>
        <Button
          disabled={forbidBackBtn}
          onClick={this.hiddenRecoRuleModal}
          className={styles.recoHeadBtn}
        >
          {formatMessage({ id: 'rulesManage.recoRule.cancel' }, '取消')}
        </Button>
      </div>
    );
    return (
      <Card key={recoListType} title={title} extra={tableList} className={styles.newRecoRule}>
        <Form>
          <Row>
            <Col span={12} className={styles.ruleNameAndType}>
              <FormItem
                {...formNameAndTypeLayout}
                label={formatMessage({ id: 'rulesManage.recoRule.ruleName' }, '规则名称')}
              >
                {getFieldDecorator('rulesName', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage(
                        { id: 'rulesManage.recoRule.enterRuleName' },
                        '请输入规则名称',
                      ),
                    },
                    {
                      max: 60,
                      message: formatMessage(
                        { id: 'rulesManage.recoRule.maxEnterlen' },
                        '输入最大长度为60',
                      ),
                    },
                  ],
                })(
                  <Input
                    placeholder={formatMessage({ id: 'rulesManage.recoRule.enter' }, '请输入')}
                    disabled={recoListType === 'viewRule'}
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={12} className={styles.ruleNameAndType}>
              <FormItem
                {...formNameAndTypeLayout}
                label={formatMessage({ id: 'rulesManage.recoRule.ruleType' }, '规则类型')}
              >
                {getFieldDecorator('rulesType', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage(
                        { id: 'rulesManage.recoRule.enterRuleType' },
                        '请选规则类型',
                      ),
                    },
                  ],
                })(
                  <Select
                    onChange={this.changeRuleType}
                    placeholder={formatMessage({ id: 'rulesManage.recoRule.choose' }, '请选择')}
                    disabled={recoListType !== 'addRule' || forbidSelect}
                  >
                    {recoRuleDropListData.map(item => {
                      return (
                        <Option value={item.attrValueCode} key={item.id}>
                          {item.attrValueName}
                        </Option>
                      );
                    })}
                  </Select>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row className={styles.ruleDesc}>
            <FormItem
              {...formDescLayout}
              label={formatMessage({ id: 'rulesManage.recoRule.ruleDesc' }, '规则描述')}
            >
              {getFieldDecorator('rulesDesc', {
                rules: [
                  {
                    required: true,
                    message: formatMessage(
                      { id: 'rulesManage.recoRule.enterRuleDesc' },
                      '请输入规则描述',
                    ),
                  },
                  {
                    max: 240,
                    message: formatMessage(
                      { id: 'rulesManage.recoRule.maxEnterTextAreaLen' },
                      '输入最大长度为240',
                    ),
                  },
                ],
              })(
                <TextArea
                  placeholder={formatMessage({ id: 'rulesManage.recoRule.enter' }, '请输入')}
                  rows={3}
                  disabled={recoListType === 'viewRule'}
                />,
              )}
            </FormItem>
          </Row>
          <Row className={styles.ruleSource}>
            <FormItem
              {...formSourceLayout}
              label={formatMessage({ id: 'rulesManage.recoRule.dataSource' }, '数据来源方式')}
            >
              {getFieldDecorator('sourceType', {
                rules: [
                  {
                    required: true,
                    message: formatMessage(
                      { id: 'rulesManage.recoRule.chooseDataSource' },
                      '请选择数据来源',
                    ),
                  },
                ],
              })(
                <Radio.Group
                  className={styles.radioWrapper}
                  onChange={this.changeRadio}
                  disabled={recoListType === 'viewRule'}
                >
                  <Radio value="0">
                    {formatMessage({ id: 'rulesManage.recoRule.custrom' }, '自定义')}
                  </Radio>
                  <Radio value="1">
                    {formatMessage({ id: 'rulesManage.recoRule.calc' }, '算法获取')}
                  </Radio>
                  {/* <Radio value="2">
                    {formatMessage({ id: 'rulesManage.recoRule.label' }, '根据标签关联度计算')}
                  </Radio> */}
                </Radio.Group>,
              )}
            </FormItem>
          </Row>
          <Row>
            {/* 自定义 + 热卖 */}
            {dataSourceMethod != '' &&
            dataSourceMethod == 0 &&
            recoListClickItem.rulesType == 'MCC_RULES_IMPLEMENTS_HOTSALE' ? (
              <FormItem {...formForCustom}>
                {getFieldDecorator('ruleForCustom', {})(
                  <RecoForHotSale
                    addGoodItem={this.addGoodItem}
                    editGoodItem={this.editGoodItem}
                    deleteRule={this.deleteRule}
                    showBatchImportModal={this.showBatchImportModal}
                    changeSearchName={this.changeSearchName}
                    downLoadTem={this.downLoadTem}
                    searchListData={this.searchListData}
                    pageChange={this.pageChange}
                    pageSizeChange={this.pageSizeChange}
                    handleShowListData={this.handleShowListData}
                    delSearchVal={this.delSearchVal}
                    searchValue={searchValue}
                  />,
                )}
              </FormItem>
            ) : (
              ''
            )}
            {/* 自定义 + 个人喜欢 */}
            {dataSourceMethod != '' &&
            dataSourceMethod == 0 &&
            recoListClickItem.rulesType === 'MCC_RULES_IMPLEMENTS_FAVOR' ? (
              <FormItem {...formForCustom}>
                {getFieldDecorator('ruleForFavor', {})(
                  <RecoForFavor
                    addGoodItem={this.addGoodItem}
                    editGoodItem={this.editGoodItem}
                    deleteRule={this.deleteRule}
                    showBatchImportModal={this.showBatchImportModal}
                    changeSearchName={this.changeSearchName}
                    downLoadTem={this.downLoadTem}
                    searchListData={this.searchListData}
                    pageChange={this.pageChange}
                    pageSizeChange={this.pageSizeChange}
                    handleShowListData={this.handleShowListData}
                    delSearchVal={this.delSearchVal}
                    searchValue={searchValue}
                  />,
                )}
              </FormItem>
            ) : (
              ''
            )}
            {/* 自定义 + 相似商品 */}
            {dataSourceMethod != '' &&
            dataSourceMethod == 0 &&
            recoListClickItem.rulesType === 'MCC_RULES_IMPLEMENTS_SIMILAR' ? (
              <FormItem {...formForCustom}>
                {getFieldDecorator('ruleForSimilar', {})(
                  <RecoForSimilar
                    addGoodItem={this.addGoodItem}
                    editGoodItem={this.editGoodItem}
                    deleteRule={this.deleteRule}
                    showBatchImportModal={this.showBatchImportModal}
                    changeSearchName={this.changeSearchName}
                    downLoadTem={this.downLoadTem}
                    searchListData={this.searchListData}
                    pageChange={this.pageChange}
                    pageSizeChange={this.pageSizeChange}
                    handleShowListData={this.handleShowListData}
                    delSearchVal={this.delSearchVal}
                    searchValue={searchValue}
                  />,
                )}
              </FormItem>
            ) : (
              ''
            )}
            {/* 算法 + 下拉框 */}
            {dataSourceMethod != '' && dataSourceMethod == 1 && recoListClickItem.rulesType ? (
              <FormItem
                {...formForCus}
                className={styles.newRecoRuleForCalc}
                label={formatMessage({ id: 'rulesManage.recoRule.chooseCalc' }, '选择算法')}
              >
                {getFieldDecorator('algorithmName', {
                  rules: [
                    {
                      message: formatMessage(
                        { id: 'rulesManage.recoRule.chooseCurCalc' },
                        '请选择商品算法',
                      ),
                    },
                  ],
                })(
                  <Input
                    loading="true"
                    size="small"
                    placeholder={algorithmData.algorithmName}
                    disabled
                  />,
                )}
              </FormItem>
            ) : (
              ''
            )}
            {/* 标签 + 下拉框 */}
            {dataSourceMethod != '' && dataSourceMethod == 2 && recoListClickItem.rulesType ? (
              <FormItem {...formForCustom}>
                {getFieldDecorator('ruleForLabel', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage(
                        { id: 'rulesManage.recoRule.chooseLable' },
                        '请选择关联标签',
                      ),
                    },
                  ],
                })(<RecoRuleForLabel />)}
              </FormItem>
            ) : (
              ''
            )}
          </Row>
        </Form>
        {ifShowBatchImportModal ? <BatchImport /> : null}
        {showNewGoodModal ? <NewGoodModal handleShowListData={this.handleShowListData} /> : null}
      </Card>
    );
  }
}

export default RecoRule;
