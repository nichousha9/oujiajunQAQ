import React, { Component } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Modal, Button, Form, Input, InputNumber, message } from 'antd';
import { connect } from 'dva';
import GoodChooseModal from './GoodChooseModal';
import MemberModal from './MemberModal';
import styles from './index.less';
const FormItem = Form.Item;

@Form.create()
@connect(({ recoRuleManage, loading }) => ({
  loading,
  showNewGoodModal: recoRuleManage.showNewGoodModal,
  showNewGoodChooseModal: recoRuleManage.showNewGoodChooseModal,
  selectedGoodItem: recoRuleManage.selectedGoodItem,
  selectedMemberItem: recoRuleManage.selectedMemberItem,
  selectedSimilarItem: recoRuleManage.selectedSimilarItem,
  recoRuleHotSaleList: recoRuleManage.recoRuleHotSaleList,
  recoRuleFavorList: recoRuleManage.recoRuleFavorList,
  recoRuleSimilarList: recoRuleManage.recoRuleSimilarList,
  recoListClickItem: recoRuleManage.recoListClickItem,
  recoListType: recoRuleManage.recoListType,
  newModalType: recoRuleManage.newModalType,
  listClickItem: recoRuleManage.listClickItem,
  listClickIndex: recoRuleManage.listClickIndex,
  forbidBackBtn: recoRuleManage.forbidBackBtn,
  showMemberModal: recoRuleManage.showMemberModal,
  recoListCurPage: recoRuleManage.recoListCurPage,
  recoListCurPageSize: recoRuleManage.recoListCurPageSize,
  goodListSearchList: recoRuleManage.goodListSearchList,
  goodListSearchValue: recoRuleManage.goodListSearchValue,
}))
class NewGoodModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ifIsSimilar: false, // 是否点击的相似商品选择弹窗
      ifIsMember: false, // 是否点击的相似商品选择弹窗
    };
  }

  componentDidMount() {
    const { form, newModalType, listClickItem, recoListClickItem } = this.props;
    if (newModalType == 'edit') {
      if (recoListClickItem.rulesType === 'MCC_RULES_IMPLEMENTS_HOTSALE') {
        form.setFieldsValue({
          goodName: listClickItem.goodsObjectName,
          rcmRate: String(listClickItem.rcmRate),
        });
      } else if (recoListClickItem.rulesType === 'MCC_RULES_IMPLEMENTS_FAVOR') {
        form.setFieldsValue({
          goodName: listClickItem.goodsObjectName,
          rcmRate: String(listClickItem.rcmRate),
          subsId: listClickItem.subsId,
          memberID: listClickItem.goodsObjectId,
        });
      } else if (recoListClickItem.rulesType === 'MCC_RULES_IMPLEMENTS_SIMILAR') {
        form.setFieldsValue({
          goodName: listClickItem.goodsObjectName,
          rcmRate: String(listClickItem.rcmRate),
          subsId: listClickItem.subsId,
          similar: listClickItem.goodsSimilarName,
          goodsID: listClickItem.goodsObjectId,
          similarID: listClickItem.goodsSimilarId,
        });
      }
    } else {
      // 初始化表单状态
      const obj = {};
      if (recoListClickItem.rulesType === 'MCC_RULES_IMPLEMENTS_HOTSALE') {
        obj.goodName = '';
        obj.rcmRate = '';
      } else if (recoListClickItem.rulesType === 'MCC_RULES_IMPLEMENTS_FAVOR') {
        obj.goodName = '';
        obj.rcmRate = '';
        obj.subsId = '';
      } else if (recoListClickItem.rulesType === 'MCC_RULES_IMPLEMENTS_SIMILAR') {
        obj.goodName = '';
        obj.similar = '';
        obj.rcmRate = '';
      }
      form.setFieldsValue(obj);
    }
  }

  // 新增商品弹窗点击确认按钮
  sumbitOk = () => {
    const { form, newModalType } = this.props;
    form.validateFields((err, value) => {
      if (!err) {
        if (newModalType === 'add') {
          // 新增状态-新增规则
          this.addAddCurItem(value);
          // 操作了新增接口，在新增状态下需要把批量导入给禁用
          this.forBidAddMoreBtn();
          // 编辑状态-新增商品 需要调用接口以确保下次查询后端能返回完整数据
          this.editAddCurItem(value);
        } else if (newModalType === 'edit') {
          // 新增状态-编辑商品规则
          this.addEditCurItem(value);
          // 编辑状态-编辑商品 需要调用接口以确保下次查询后端能返回完整数据
          this.editEditCurItem(value);
        }
        // 让下拉框禁用
        this.changeAddSelectType();
        // 关闭弹窗
        this.hiddenModal();
      }
    });
  };

  // 新增推荐规则-新增商品
  addAddCurItem = item => {
    const {
      dispatch,
      recoRuleHotSaleList,
      recoRuleFavorList,
      recoListClickItem,
      recoRuleSimilarList,
      recoListCurPageSize,
      goodListSearchValue,
      // handleShowListData,
      // goodListSearchList
    } = this.props;
    const type = recoListClickItem.rulesType;
    let curList;
    let curType;
    switch (type) {
      // 热卖
      case 'MCC_RULES_IMPLEMENTS_HOTSALE':
        curList = [...recoRuleHotSaleList];
        curType = 'changeRecoRuleHotSaleList';
        break;
      // 个人喜欢
      case 'MCC_RULES_IMPLEMENTS_FAVOR':
        curList = [...recoRuleFavorList];
        curType = 'changeRecoRuleFavorList';
        break;
      // 相似商品
      case 'MCC_RULES_IMPLEMENTS_SIMILAR':
        curList = [...recoRuleSimilarList];
        curType = 'changeRecoRuleSimilarList';
        break;
      default:
    }
    const { length } = curList.concat(this.handleFormData(item));
    dispatch({
      type: `recoRuleManage/${curType}`,
      payload: {
        data: curList.concat(this.handleFormData(item)),
        pageInfo: {
          total: length,
        },
      },
    });
    // 非搜索状态下总条数大于每页显示数据就跳页
    if (length > recoListCurPageSize && !goodListSearchValue) {
      dispatch({
        type: 'recoRuleManage/changeRecoListCurPage',
        payload: Math.ceil(length / recoListCurPageSize) || 1,
      });
    }
    // 如果搜索出来的数据大于每页显示的数据就翻页
    // const data = handleShowListData();
    // console.log(data);
    // if (goodListSearchList.length > recoListCurPageSize) {
    //   dispatch({
    //     type: 'recoRuleManage/changeRecoListCurPage',
    //     payload: Math.ceil(goodListSearchList.length / recoListCurPageSize) || 1,
    //   });
    // }
  };

  // 新增推荐规则-编辑商品
  addEditCurItem = async item => {
    const { recoListType } = this.props;
    if (recoListType === 'addRule') {
      const currentItem = this.handleEditFormData(item);
      // 拿最新数据去更新原始数据
      this.changeEditOriginList(currentItem);
    }
  };

  // 编辑推荐规则-新增商品
  editAddCurItem = value => {
    const currentItem = this.handleFormData(value);
    const { recoListType, dispatch, recoListClickItem, forbidBackBtn } = this.props;
    if (recoListType === 'editRule') {
      const obj = {
        goodsObjectName: currentItem.goodsObjectName,
        goodsObjectId: String(currentItem.goodsObjectId),
        rcmRate: String(currentItem.rcmRate),
        rulesId: recoListClickItem.rulesId,
        typeCode: recoListClickItem.rulesType,
        // goodsObjectCode: selectedGoodItem.zsmartOfferCode,
      };
      if (recoListClickItem.rulesType == 'MCC_RULES_IMPLEMENTS_FAVOR') {
        obj.subsId = String(currentItem.subsId);
        obj.subsName = String(currentItem.subsName);
        obj.userName = String(currentItem.userName);
      }
      if (recoListClickItem.rulesType == 'MCC_RULES_IMPLEMENTS_SIMILAR') {
        obj.goodsSimilarId = String(currentItem.goodsSimilarId);
        obj.goodsSimilarName = String(currentItem.goodsSimilarName);
      }
      dispatch({
        type: 'recoRuleManage/addRulesGoods',
        payload: obj,
      }).then(() => {
        this.getRuleClickList();
        if (!forbidBackBtn) {
          this.changeEditBackBtnType();
        }
      });
    }
  };

  // 编辑推荐规则-编辑商品
  editEditCurItem = item => {
    const {
      dispatch,
      recoListType,
      recoListClickItem,
      recoRuleHotSaleList,
      recoRuleFavorList,
      recoRuleSimilarList,
      listClickIndex,
      forbidBackBtn,
    } = this.props;
    if (recoListType === 'editRule') {
      const currentItem = this.handleEditFormData(item);
      const obj = {
        rulesId: recoListClickItem.rulesId,
        goodsObjectId: currentItem.goodsObjectId,
        goodsObjectName: currentItem.goodsObjectName,
        // goodsObjectCode: 'OFFER_2',
        rcmRate: currentItem.rcmRate,
        typeCode: recoListClickItem.rulesType,
      };
      if (recoListClickItem.rulesType == 'MCC_RULES_IMPLEMENTS_HOTSALE') {
        obj.rgRulesId = recoRuleHotSaleList[listClickIndex].relId;
      }
      if (recoListClickItem.rulesType == 'MCC_RULES_IMPLEMENTS_FAVOR') {
        obj.subsId = String(currentItem.subsId);
        obj.subsName = String(currentItem.subsName);
        obj.userName = String(currentItem.userName);
        obj.rgRulesId = recoRuleFavorList[listClickIndex].relId;
      }
      if (recoListClickItem.rulesType == 'MCC_RULES_IMPLEMENTS_SIMILAR') {
        obj.goodsSimilarId = String(currentItem.goodsSimilarId);
        obj.goodsSimilarName = String(currentItem.goodsSimilarName);
        obj.rgRulesId = recoRuleSimilarList[listClickIndex].relId;
      }
      dispatch({
        type: 'recoRuleManage/modifyRulesGoods',
        payload: obj,
      }).then(() => {
        if (!forbidBackBtn) {
          this.changeEditBackBtnType();
        }
        // 重新获取数据
        this.getRuleClickList();
      });
    }
  };

  // 处理表单数据
  handleFormData = item => {
    const {
      selectedGoodItem,
      recoListClickItem,
      selectedMemberItem,
      selectedSimilarItem,
    } = this.props;
    const formData = {
      goodsObjectId: String(selectedGoodItem.zsmartOfferCode),
      goodsObjectName: item.goodName,
      rcmRate: item.rcmRate,
    };
    // 如果是个人喜欢的情况需要添加一个会员ID字段和用户名称字段
    if (recoListClickItem.rulesType === 'MCC_RULES_IMPLEMENTS_FAVOR') {
      formData.subsId = item.subsId;
      formData.subsName = selectedMemberItem.accNbr;
      formData.userName = selectedMemberItem.userName;
    }
    // 相似商品
    if (recoListClickItem.rulesType === 'MCC_RULES_IMPLEMENTS_SIMILAR') {
      formData.goodsSimilarName = selectedSimilarItem.offerName;
      formData.goodsSimilarId = selectedSimilarItem.zsmartOfferCode;
    }
    return formData;
  };

  // 处理编辑状态的表单数据
  handleEditFormData = item => {
    const { listClickItem, recoListClickItem } = this.props;
    const formData = {
      goodsObjectName: item.goodName,
      rcmRate: String(item.rcmRate),
      goodsObjectId: listClickItem.goodsObjectId,
    };
    if (recoListClickItem.rulesType === 'MCC_RULES_IMPLEMENTS_FAVOR') {
      formData.subsId = listClickItem.subsId;
      formData.subsName = listClickItem.subsName;
      formData.userName = listClickItem.userName;
    }
    if (recoListClickItem.rulesType === 'MCC_RULES_IMPLEMENTS_SIMILAR') {
      formData.goodsSimilarName = listClickItem.goodsSimilarName;
      formData.goodsSimilarId = listClickItem.goodsSimilarId;
    }
    return formData;
  };

  // 修改原始数据（编辑操作）
  changeEditOriginList = list => {
    const {
      dispatch,
      recoListClickItem,
      recoRuleHotSaleList,
      recoRuleFavorList,
      recoRuleSimilarList,
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
    // 找出当前编辑项
    if (recoListClickItem.rulesType === 'changeRecoRuleSimilarList') {
      listData.forEach((item, index) => {
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
    originList[curIndex] = list;
    dispatch({
      type: `recoRuleManage/${dispatchType}`,
      payload: {
        data: originList,
        pageInfo: {
          total: originList.length,
        },
      },
    });
  };

  // 修改返回按钮状态
  changeEditBackBtnType = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'recoRuleManage/changeEditBackBtnType',
      payload: true,
    });
  };

  // 修改下拉框状态
  changeAddSelectType = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'recoRuleManage/changeAddSelectType',
      payload: true,
    });
  };

  // 获取推荐规则首页点击项的商品列表数据(热门，个人喜欢，相似)
  getRuleClickList = () => {
    const {
      dispatch,
      recoListClickItem,
      recoListCurPage,
      recoListCurPageSize,
      goodListSearchValue,
    } = this.props;
    const obj = {
      rulesId: recoListClickItem.rulesId,
      pageInfo: { pageNum: recoListCurPage, pageSize: recoListCurPageSize },
      typeCode: recoListClickItem.rulesType,
      goodsObjectName: goodListSearchValue,
    };
    if (recoListClickItem.rulesType == 'MCC_RULES_IMPLEMENTS_FAVOR') {
      obj.subsName = '';
    }
    dispatch({
      type: 'recoRuleManage/getRuleClickList',
      payload: obj,
    });
  };

  // 关闭新增商品弹窗
  hiddenModal = () => {
    // 点击返回的时候包存当初进来时候的选择项!!!
    const { dispatch } = this.props;
    // 关闭弹窗
    dispatch({
      type: 'recoRuleManage/hiddenNewGoodModal',
    });
  };

  // 打开选择商品弹窗
  showGoodChooseModal = value => {
    const { dispatch, form, recoListClickItem } = this.props;

    // 如果是个人喜欢，需要先点会员
    if (recoListClickItem.rulesType === 'MCC_RULES_IMPLEMENTS_FAVOR') {
      if (!form.getFieldValue('subsId')) {
        message.info('请先选择会员名称', 1);
      } else {
        dispatch({
          type: 'recoRuleManage/showNewGoodChooseModal',
        });
      }
    }
    if (recoListClickItem.rulesType != 'MCC_RULES_IMPLEMENTS_FAVOR') {
      if (value && !form.getFieldValue('goodName')) {
        message.info('请先选择商品名称', 1);
      } else {
        dispatch({
          type: 'recoRuleManage/showNewGoodChooseModal',
        });
        this.setState({
          ifIsSimilar: value,
        });
      }
    }
  };

  // 选择商品弹窗点击返回，隐藏弹窗
  hiddenChooseModal = (item, value) => {
    const { dispatch } = this.props;
    // 关闭弹窗
    dispatch({
      type: 'recoRuleManage/hiddenNewGoodChooseModal',
    });
    // 点击返回保存为当初进来时的状态！！！
    this.reCoverSelectedGoodItem(item, value);
  };

  // 保存为当初进来时的状态,即还原选中的状态
  reCoverSelectedGoodItem = (item, value) => {
    const { dispatch } = this.props;
    let dispatchType = '';
    if (value) {
      dispatchType = 'saveCurrentSelectedSimilarItem';
    } else {
      dispatchType = 'saveCurrentSelectedGoodItem';
    }
    dispatch({
      type: `recoRuleManage/${dispatchType}`,
      payload: item,
    });
  };

  // 选择商品弹窗点击提交按钮
  submitItem = () => {
    const { form, selectedGoodItem, dispatch, selectedSimilarItem, recoListClickItem } = this.props;
    const { ifIsSimilar } = this.state;
    if (ifIsSimilar) {
      // 更新相似规则字段的名称
      form.setFieldsValue({
        similar: selectedSimilarItem.offerName,
        similarID: selectedSimilarItem.offerId,
      });
    } else {
      // 更新商品选择字段的名称
      form.setFieldsValue({
        goodName: selectedGoodItem.offerName,
        goodsID: selectedGoodItem.zsmartOfferCode,
      });
    }
    if (recoListClickItem.rulesType == 'MCC_RULES_IMPLEMENTS_FAVOR') {
      form.setFieldsValue({
        memberID: selectedGoodItem.zsmartOfferCode,
      });
    }
    // 关闭弹窗
    dispatch({
      type: 'recoRuleManage/hiddenNewGoodChooseModal',
    });
  };

  // 会员选择弹窗点击提交按钮
  submitMemberItem = () => {
    const { form, selectedMemberItem, dispatch } = this.props;
    form.setFieldsValue({
      subsId: selectedMemberItem.subsId,
    });
    dispatch({
      type: 'recoRuleManage/hiddenMemberModal',
    });
  };

  // 检验输入框数据为小数点后两位
  checkRcmRate = (rule, value, callback) => {
    const result = /^(\d{1,8})(.\d{0,2})?$/.test(value);
    if (!result) {
      callback('推荐系数最多保留两位小数且不超过10位');
    }
    callback();
  };

  // 打开选择会员弹窗
  showMemberModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'recoRuleManage/openMemberModal',
    });
    this.setState({
      ifIsMember: true,
    });
  };

  // 关闭会员弹窗
  hiddenMemberModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'recoRuleManage/hiddenMemberModal',
    });
  };

  // 禁用批量导入按钮
  forBidAddMoreBtn = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'recoRuleManage/changeAddMoreType',
      payload: true,
    });
  };

  render() {
    const formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    const {
      showNewGoodModal,
      form: { getFieldDecorator },
      showNewGoodChooseModal,
      newModalType,
      recoListClickItem,
      showMemberModal,
      form,
      loading,
    } = this.props;
    const formValue = {
      goodsID: form.getFieldValue('goodsID'),
      similarID: form.getFieldValue('similarID'),
      memberID: form.getFieldValue('memberID'),
    };
    const { ifIsSimilar, ifIsMember } = this.state;
    const modalDesc = {};
    // 热卖
    if (recoListClickItem.rulesType == 'MCC_RULES_IMPLEMENTS_HOTSALE') {
      if (newModalType === 'add') {
        modalDesc.title = formatMessage({ id: 'rulesManage.recoRule.newGood' }, '新增商品');
      } else {
        modalDesc.title = formatMessage({ id: 'rulesManage.recoRule.editGood' }, '编辑商品');
      }
    }
    // 个人喜欢
    if (recoListClickItem.rulesType == 'MCC_RULES_IMPLEMENTS_FAVOR') {
      if (newModalType === 'add') {
        modalDesc.title = formatMessage({ id: 'rulesManage.recoRule.newMember' }, '新增会员');
      } else {
        modalDesc.title = formatMessage({ id: 'rulesManage.recoRule.editMember' }, '编辑会员');
      }
    }
    // 相似商品
    if (recoListClickItem.rulesType == 'MCC_RULES_IMPLEMENTS_SIMILAR') {
      if (newModalType === 'add') {
        modalDesc.title = formatMessage({ id: 'rulesManage.recoRule.newSimilar' }, '新增相似');
      } else {
        modalDesc.title = formatMessage({ id: 'rulesManage.recoRule.editSimilar' }, '编辑相似商品');
      }
    }
    return (
      <Modal
        title={modalDesc.title}
        centered
        visible={showNewGoodModal}
        onOk={this.sumbitOk}
        onCancel={this.hiddenModal}
        className={styles.newGoodModal}
        footer={[
          <Button
            loading={loading.effects['recoRuleManage/addRulesGoods']}
            size="small"
            key="submit"
            type="primary"
            onClick={this.sumbitOk}
          >
            {formatMessage({ id: 'rulesManage.recoRule.submit' }, '提交')}
          </Button>,
          <Button size="small" key="back" onClick={this.hiddenModal}>
            {formatMessage({ id: 'rulesManage.recoRule.back' }, '返回')}
          </Button>,
        ]}
      >
        <Form>
          {/* 个人喜欢--会员选择 */}
          {recoListClickItem.rulesType == 'MCC_RULES_IMPLEMENTS_FAVOR' ? (
            <FormItem
              {...formLayout}
              label={formatMessage({ id: 'rulesManage.recoRule.userID' }, '会员ID')}
              className={styles.goodName}
            >
              {getFieldDecorator('subsId', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: formatMessage(
                      { id: 'rulesManage.recoRule.chooseUserId' },
                      '请选择会员Id',
                    ),
                  },
                ],
              })(<Input size="small" className={styles.goodInput} readOnly />)}
              <Button
                type="primary"
                size="small"
                onClick={this.showMemberModal}
                disabled={newModalType === 'edit'}
              >
                {formatMessage({ id: 'rulesManage.recoRule.memberChoose' }, '会员选择')}
              </Button>
            </FormItem>
          ) : null}

          <FormItem
            {...formLayout}
            label={formatMessage({ id: 'rulesManage.recoRule.goodName' }, '商品名称')}
            className={styles.goodName}
          >
            {getFieldDecorator('goodName', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: formatMessage(
                    { id: 'rulesManage.recoRule.chooseGoodType' },
                    '请选择商品类型',
                  ),
                },
              ],
            })(<Input size="small" className={styles.goodInput} readOnly />)}
            <Button
              type="primary"
              size="small"
              disabled={newModalType === 'edit'}
              onClick={() => {
                this.showGoodChooseModal(false);
              }}
            >
              {formatMessage({ id: 'rulesManage.recoRule.goodChoose' }, '商品选择')}
            </Button>
          </FormItem>

          {/* 相似商品--相似商品选择 */}
          {recoListClickItem.rulesType == 'MCC_RULES_IMPLEMENTS_SIMILAR' ? (
            <FormItem
              {...formLayout}
              label={formatMessage({ id: 'rulesManage.recoRule.similarGoodName' }, '相似商品名称')}
              className={styles.goodName}
            >
              {getFieldDecorator('similar', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: formatMessage(
                      { id: 'rulesManage.recoRule.chooseSimilarGood' },
                      '请选择相似商品',
                    ),
                  },
                ],
              })(<Input size="small" className={styles.goodInput} readOnly />)}
              <Button
                type="primary"
                size="small"
                disabled={newModalType === 'edit'}
                onClick={() => {
                  this.showGoodChooseModal(true);
                }}
              >
                {formatMessage({ id: 'rulesManage.recoRule.goodChoose' }, '商品选择')}
              </Button>
            </FormItem>
          ) : null}

          {/* 会员--会员ID--隐藏 这个字段的作用是提交商品ID */}
          {recoListClickItem.rulesType == 'MCC_RULES_IMPLEMENTS_FAVOR' ? (
            <FormItem {...formLayout} label="会员名称ID" style={{ display: 'none' }}>
              {getFieldDecorator('memberID')(<Input size="small" />)}
            </FormItem>
          ) : null}

          {/* 相似商品--商品ID--隐藏 */}
          {recoListClickItem.rulesType == 'MCC_RULES_IMPLEMENTS_SIMILAR' ? (
            <FormItem {...formLayout} label="商品名称ID" style={{ display: 'none' }}>
              {getFieldDecorator('goodsID')(<Input size="small" />)}
            </FormItem>
          ) : null}

          {/* 相似商品--相似商品ID--隐藏 */}
          {recoListClickItem.rulesType == 'MCC_RULES_IMPLEMENTS_SIMILAR' ? (
            <FormItem {...formLayout} label="相似商品名称ID" style={{ display: 'none' }}>
              {getFieldDecorator('similarID')(<Input size="small" />)}
            </FormItem>
          ) : null}

          <FormItem
            {...formLayout}
            label={formatMessage({ id: 'rulesManage.recoRule.rcmRate' }, '推荐系数')}
            className={styles.goodName}
          >
            {getFieldDecorator('rcmRate', {
              initialValue: 0,
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'rulesManage.recoRule.enterRcmRate' }, ' '),
                },
                { validator: this.checkRcmRate },
              ],
            })(<InputNumber size="small" max={10 ** 10} min={0} />)}
          </FormItem>
        </Form>

        {showNewGoodChooseModal ? (
          <GoodChooseModal
            ifIsSimilar={ifIsSimilar}
            ifIsMember={ifIsMember}
            submitItem={this.submitItem}
            hiddenChooseModal={this.hiddenChooseModal}
            formValue={formValue}
          />
        ) : null}
        {showMemberModal ? (
          <MemberModal
            hiddenMemberModal={this.hiddenMemberModal}
            submitMemberItem={this.submitMemberItem}
            formValue={formValue}
          />
        ) : null}
      </Modal>
    );
  }
}

export default NewGoodModal;
