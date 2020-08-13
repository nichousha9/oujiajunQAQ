import React, { Component } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Modal, Button, Form, Card, Table, Input, message, Pagination, Icon, Tooltip } from 'antd';
import { connect } from 'dva';
import SearchTree from '@/components/SearchTree/index';
import GoodsAdvancedSearch from './components/GoodsAdvancedSearch';
import styles from './index.less';

@Form.create()
@connect(({ recoRuleManage, loading }) => ({
  loading,
  showNewGoodModal: recoRuleManage.showNewGoodModal,
  chooseTreeList: recoRuleManage.chooseTreeList,
  chooseGoodList: recoRuleManage.chooseGoodList,
  clickTreeFolder: recoRuleManage.clickTreeFolder,
  recoRuleHotSaleList: recoRuleManage.recoRuleHotSaleList,
  recoRuleFavorList: recoRuleManage.recoRuleFavorList,
  recoRuleSimilarList: recoRuleManage.recoRuleSimilarList,
  recoListClickItem: recoRuleManage.recoListClickItem,
  selectedGoodItem: recoRuleManage.selectedGoodItem,
  listClickItem: recoRuleManage.listClickItem,
  chooseGoodListCurPage: recoRuleManage.chooseGoodListCurPage,
  chooseGoodListCurPageSize: recoRuleManage.chooseGoodListCurPageSize,
  chooseGoodListTotal: recoRuleManage.chooseGoodListTotal,
  selectedMemberItem: recoRuleManage.selectedMemberItem,
  treeLoading: loading.effects['recoRuleManage/getChooseTreeList'],
}))
class NewGoodChooseModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 产品列表选中的项目
      selectedRowKeys: [],
      defaultSelectedKeys: [], // ------ 目录默认选中项目 -------------
      modalVisible: false, // 添加，编辑目录的对话框
      modalTitle: '', // 对话框的标题
      // curOperate: null, // 要执行的操作：添加目录（add）或编辑目录（edit）
      treeData: [], // 目录树列表数据
      ifCanSubmit: true, // 是否可以提交，依据是否有重复的商品项
      originSelectedGoodItem: {}, // 初始化选择的商品项
      originSelectedSimilarItem: {}, // 初始化选择的相似项

      advancedSearchData: {}, // ------------ 高级筛选搜索值 ------------------
      isShowAdvancedSearch: false, // ------------ 是否显示高级筛选 ----------------
      fomatSaleState: {
        // 销售状态转换
        '1': '下架',
        '2': '上架',
      },
    };
  }

  componentDidMount = async () => {
    const { selectedGoodItem, selectedSimilarItem } = this.props;
    this.getChooseTreeList();
    this.setState({
      originSelectedGoodItem: selectedGoodItem,
      originSelectedSimilarItem: selectedSimilarItem,
    });
  };

  componentWillUpdate = nextProps => {
    const { clickTreeFolder, chooseGoodListCurPageSize } = this.props;
    if (clickTreeFolder !== nextProps.clickTreeFolder) {
      this.changePageNum(1);
      this.getChooseGoodList({
        pageInfo: {
          pageNum: 1,
          pageSize: chooseGoodListCurPageSize,
        },
        fold: nextProps.clickTreeFolder,
      });
    }
  };

  componentWillUnmount = () => {
    // 清空当前的页数
    const { dispatch } = this.props;
    dispatch({
      type: 'recoRuleManage/changeChooseGoodListCurPage',
      payload: 1,
    });
    // 清空当前选择的每页显示条数
    dispatch({
      type: 'recoRuleManage/changeChooseGoodListCurPageSize',
      payload: 5,
    });
    // 初始化被点击的目录项
    this.onSelectCallBack('');
  };

  // 获取选择商品产品目录数据
  getChooseTreeList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'recoRuleManage/getChooseTreeList',
      payload: {
        objType: '4',
      },
    }).then(() => {
      const { chooseTreeList } = this.props;
      if (chooseTreeList.length > 0) {
        // 处理请求目录树数据
        this.handleCatalogData(chooseTreeList);
      }
    });
  };

  // 页码改变
  pageChange = async page => {
    const { chooseGoodListCurPageSize } = this.props;
    // 修改页码
    this.changePageNum(page);
    // 重新获取数据
    this.getChooseGoodList({
      pageInfo: {
        pageNum: page,
        pageSize: chooseGoodListCurPageSize,
      },
    });
  };

  // 修改页码
  changePageNum = page => {
    const { dispatch } = this.props;

    return dispatch({
      type: 'recoRuleManage/changeChooseGoodListCurPage',
      payload: page,
    });
  };

  // 改变每页显示数据条数
  pageSizeChange = async (_, size) => {
    const { dispatch, chooseGoodListCurPage } = this.props;
    // 修改每页显示页数
    await dispatch({
      type: 'recoRuleManage/changeChooseGoodListCurPageSize',
      payload: size,
    });
    // 重新获取数据
    this.getChooseGoodList({
      pageInfo: {
        pageNum: chooseGoodListCurPage,
        pageSize: size,
      },
    });
  };

  // 获取选择商品产品列表数据
  getChooseGoodList = params => {
    const {
      dispatch,
      clickTreeFolder,
      chooseGoodListCurPage,
      chooseGoodListCurPageSize,
    } = this.props;

    const { advancedSearchData } = this.state;

    const { offerName, goodsType, skuid, brandIdList } = advancedSearchData;

    const defaultParams = {
      fold: clickTreeFolder || '',
      offerName: offerName || '',
      goodsType: goodsType || '',
      skuid: skuid || undefined,
      offerStatue: '',
      pageInfo: {
        pageNum: chooseGoodListCurPage || 1,
        pageSize: chooseGoodListCurPageSize || 5,
      },
    };

    if (Array.isArray(brandIdList) && brandIdList.length > 0) {
      defaultParams.brandIdList = brandIdList;
    }

    dispatch({
      type: 'recoRuleManage/getChooseGoodList',
      payload: { ...defaultParams, ...params },
    });
  };

  // 处理目录树列表数据
  handleCatalogData = data => {
    const len = data.length;
    const treeArr = data.map(item => ({
      title: item.name,
      key: item.fold,
      comments: item.comments,
      pathCodeLen: item.pathCode && item.pathCode.split('.').length,
      parentKey: item.parentFold || '',
      children: [],
      used: false,
      curOperate: '',
      curItem: {},
    }));

    const newArr = [];
    const getChild = node => {
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

    // ------------------------------- 默认选中项 -------------------------------
    const defaultSelectedKey = newArr && newArr.length && newArr[0].key && newArr[0].key.toString();
    // ------------------------------- 默认选中项 -------------------------------
    // ---------------------- 默认选中项 ---------------------------
    this.onSelectCallBack(defaultSelectedKey);
    // ---------------------- 默认选中项 ---------------------------
    this.setState({
      treeData: newArr,
      defaultSelectedKeys: [defaultSelectedKey], //  默认选中项
    });
  };

  // --------------------------------------------------------
  // 在目录树内点击“添加”的回调函数
  // addCallBack = item => {
  //   const { form } = this.props;
  //   this.setState({
  //     modalVisible: true,
  //     curItem: item,
  //     // isAddChild: true,
  //     // isEditOrAddRoot: false,
  //     modalTitle: '添加目录',
  //     curOperate: 'add', // 要执行的操作
  //   });
  //   form.resetFields();
  // };

  // // 在目录树内点击“编辑”的回调函数
  // editCallBack = item => {
  //   this.setState({
  //     curOperate: 'edit',
  //     modalVisible: true,
  //     curItem: item,
  //     modalTitle: '编辑目录',
  //   });
  //   const { form } = this.props;
  //   form.setFieldsValue({
  //     title: item.title,
  //     comments: item.comments || '',
  //   });
  // };

  // // 在目录树内点击“删除”的回调函数
  // deleteCallBack = item => {
  //   const obj = {
  //     comments: item.comments, // 目录描述
  //     name: item.title, // 目录名称
  //     objType: 4, // 对象类型，写死为2
  //     parentFold: item.parentId, // 父级目录
  //     fold: item.key, // 活动目录id
  //   };
  //   this.delMccFolder(obj);
  // };

  // // 删除树目录
  // delMccFolder = params => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'recoRuleManage/IfCanDelFolder',
  //     payload: params,
  //   }).then(res => {
  //     if (res && res.topCont && res.topCont.resultCode === 0) {
  //       this.getChooseTreeList();
  //     }
  //   });
  // };

  // // 目录弹窗点击取消按钮
  // closeTreeModal = () => {
  //   this.setState({
  //     modalVisible: false,
  //   });
  // };

  // // 新增目录树
  // addMccFolder = params => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'recoRuleManage/addMccFolder',
  //     payload: params,
  //   }).then(res => {
  //     if (res && res.topCont && res.topCont.resultCode === 0) {
  //       this.getChooseTreeList();
  //     }
  //   });
  // };

  // // 编辑目录树
  // updateMccFolder = params => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'recoRuleManage/updateMccFolder',
  //     payload: params,
  //   }).then(res => {
  //     if (res && res.topCont && res.topCont.resultCode === 0) {
  //       this.getChooseTreeList();
  //     }
  //   });
  // };
  // ----------------------------------------------------------------------

  /* 在目录树内选择某一个目录的回调函数 */
  onSelectCallBack = key => {
    const { dispatch } = this.props;

    dispatch({
      type: 'recoRuleManage/changeClickTreeFolder',
      payload: key,
    });
  };

  // ---------------------------------------------------------
  // // 目录弹窗点击确认按钮
  // handleAddModalOK = () => {
  //   const { form } = this.props;
  //   const { curOperate, curItem } = this.state;
  //   form.validateFields((err, values) => {
  //     if (!err) {
  //       const { title, comments } = values;
  //       if (curOperate === 'add') {
  //         const obj = {
  //           comments, // 目录描述
  //           name: title,
  //           objType: 4, // 对象类型
  //           parentFold: curItem.key,
  //         };
  //         this.addMccFolder(obj);
  //       } else if (curOperate === 'edit') {
  //         const obj = {
  //           fold: curItem.key, // 活动目录id
  //           parentFold: curItem.parentId, // 父级目录
  //           comments, // 目录描述
  //           name: title, // 目录名称
  //           objType: 4, // 对象类型，写死为2
  //         };
  //         this.updateMccFolder(obj);
  //       }
  //       this.closeTreeModal();
  //     }
  //   });
  // };
  // ---------------------------------------------------------------------

  /*  判断自定义商品目录列表是否已经存在当前项 */
  ifItemExis = item => {
    // 这里的判断列表需要根据当前是点否的相似操作而定
    // 如果是编辑状态的话，需要调接口查看当前项的商品列表项
    const {
      recoRuleHotSaleList,
      recoRuleFavorList,
      recoListClickItem,
      recoRuleSimilarList,
      selectedMemberItem,
      ifIsSimilar,
      // listClickItem,
      formValue,
    } = this.props;
    let result = false; // 当前项是否存在于商品列表
    // 热卖商品选择校验规则
    if (recoListClickItem.rulesType === 'MCC_RULES_IMPLEMENTS_HOTSALE') {
      for (let i = 0, len = recoRuleHotSaleList.length; i < len; i += 1) {
        // 如果已经存在了,那么就不能提交，并且发起提示
        if (recoRuleHotSaleList[i].goodsObjectId == item.zsmartOfferCode) {
          result = true;
        }
      }
      // 个人喜欢选择会员校验规则
    } else if (recoListClickItem.rulesType === 'MCC_RULES_IMPLEMENTS_FAVOR') {
      const curMemberList = [];
      for (let i = 0, len = recoRuleFavorList.length; i < len; i += 1) {
        // 把从列表中和当前商品选择项ID相同的所有会员ID放到数组中
        if (selectedMemberItem.subsId == recoRuleFavorList[i].subsId) {
          curMemberList.push(Number(recoRuleFavorList[i].goodsObjectId));
        }
      }
      if (curMemberList.includes(Number(item.zsmartOfferCode))) {
        result = true;
      }

      // 相似商品校验规则
    } else if (recoListClickItem.rulesType === 'MCC_RULES_IMPLEMENTS_SIMILAR') {
      const len = recoRuleSimilarList.length;
      // 点的是相似商品框
      if (ifIsSimilar) {
        // 当前相似商品ID不能和商品ID相同
        if (item.zsmartOfferCode == formValue.goodsID) {
          result = true;
        }
        // 并且点击的相似商品ID不能和列表数据中和当前选择的商品ID项的所有相似商品ID相同
        const curSimilarList = [];
        for (let i = 0; i < len; i += 1) {
          // 把从列表中和当前商品选择项ID相同的所有相似商品ID放到数组中
          if (formValue.goodsID == recoRuleSimilarList[i].goodsObjectId) {
            curSimilarList.push(Number(recoRuleSimilarList[i].goodsSimilarId));
          }
        }
        if (curSimilarList.includes(Number(item.zsmartOfferCode))) {
          result = true;
        }
      }
      // 点的商品选择框
      if (!ifIsSimilar) {
        // 当前选择的ID不能和原来表单的字段相同
        if (
          item.zsmartOfferCode == formValue.goodsID ||
          item.zsmartOfferCode == formValue.similarID
        ) {
          result = true;
        }
        // 商品选择框编辑的时候不能改成已经存在的和相似ID一样的值
        const editGoodList = [];
        for (let i = 0; i < len; i += 1) {
          if (formValue.similarID == recoRuleSimilarList[i].goodsSimilarId) {
            editGoodList.push(recoRuleSimilarList[i].goodsObjectId);
          }
        }
        if (editGoodList.includes(String(item.zsmartOfferCode))) {
          result = true;
        }
      }
    }
    return result;
  };

  // 保存当前点击项
  saveCurrentItem = item => {
    const { ifIsSimilar } = this.props;
    let dispatchType = '';
    if (ifIsSimilar) {
      dispatchType = 'saveCurrentSelectedSimilarItem';
    } else {
      dispatchType = 'saveCurrentSelectedGoodItem';
    }
    const { dispatch } = this.props;
    dispatch({
      type: `recoRuleManage/${dispatchType}`,
      payload: item,
    });
  };

  // 点击radio按钮触发事件
  onSelectedRowKeysChange = (selectedRowKeys, selectedRow) => {
    // 这里需要区分一下是点相似商品进来还是点商品选择进来
    const showWarn = this.ifItemExis(selectedRow[0]);
    // 如果是已经存在了，那么就不能提交并且提示
    if (showWarn) {
      this.setState({
        ifCanSubmit: false,
      });
      message.warning('当前商品已存在，请重新选择', 1);
    } else {
      this.setState({
        ifCanSubmit: true,
      });
    }
    // 保存当前点击项数据
    this.saveCurrentItem(selectedRow[0]);
    // 保存当前点击项ID
    this.setState({ selectedRowKeys });
  };

  // ------------------------------------- 获取高级筛选值 -----------------------
  getGoodsSearchData = data => {
    this.setState({
      advancedSearchData: data,
    });
  };
  // ------------------------------------- 获取高级筛选值 -----------------------

  // ------------------------------------- 处理是否显示高级筛选 -----------------------
  showAdvancedSearch = bool => {
    this.setState({
      isShowAdvancedSearch: bool,
    });
  };
  // ------------------------------------- 处理是否显示高级筛选 -----------------------

  render() {
    const { fomatSaleState } = this.state;

    const columns = [
      {
        title: formatMessage({ id: 'rulesManage.recoRule.productName' }, '产品名称'),
        dataIndex: 'offerName',
        key: 'offerName',
        render: text => (
          <Tooltip placement="topLeft" title={text}>
            <a>{text}</a>
          </Tooltip>
        ),
      },
      {
        title: formatMessage({ id: 'rulesManage.recoRule.goodId' }, '商品SKUID'),
        dataIndex: 'zsmartOfferCode',
        key: 'zsmartOfferCode',
        render: text => (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ),
      },
      {
        title: formatMessage({ id: 'rulesManage.recoRule.goodType' }, '商品类型'),
        dataIndex: 'offerTypeName',
        key: 'offerTypeName',
        render: text => (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ),
      },
      {
        title: formatMessage({ id: 'rulesManage.recoRule.brand' }, '商品品牌'),
        dataIndex: 'brandName',
        key: 'brandName',
        render: text => (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ),
      },
      {
        title: formatMessage({ id: 'rulesManage.recoRule.salesPrice' }, '商品价格(元)'),
        dataIndex: 'salesPrice',
        key: 'salesPrice',
        render: text => (
          <Tooltip placement="topLeft" title={text && (text / 100).toFixed(2)}>
            {text && (text / 100).toFixed(2)}
          </Tooltip>
        ),
      },
      {
        title: formatMessage({ id: 'rulesManage.recoRule.saleStore' }, '销售商铺'),
        dataIndex: 'saleStore',
        key: 'saleStore',
        render: text => (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ),
      },
      {
        title: formatMessage({ id: 'rulesManage.recoRule.saleStatus' }, '销售状态'),
        dataIndex: 'saleStatus',
        key: 'saleStatus',
        render: text => (
          <Tooltip placement="topLeft" title={fomatSaleState[text]}>
            {fomatSaleState[text]}
          </Tooltip>
        ),
      },
    ];

    const {
      showNewGoodModal,
      submitItem,
      hiddenChooseModal,
      chooseGoodList,
      chooseGoodListTotal,
      form: { getFieldDecorator },
      ifIsSimilar,
      loading,
      treeLoading,
      chooseGoodListCurPage,
    } = this.props;
    const {
      selectedRowKeys,
      modalVisible,
      modalTitle,
      treeData,
      ifCanSubmit,
      originSelectedGoodItem,
      originSelectedSimilarItem,
      advancedSearchData,
      isShowAdvancedSearch,
      defaultSelectedKeys,
    } = this.state;

    // 传递到目录树组件的数据
    const treeProps = {
      treeData: treeData || [],
      defaultSelectedKeys,
      hideSearch: true,
      // add: true,
      // edit: true,
      // del: true,
      // addCallBack: this.addCallBack,
      // editCallBack: this.editCallBack,
      // deleteCallBack: this.deleteCallBack,
      showButtons: false,
      onSelectCallBack: this.onSelectCallBack,
    };

    const rowSelection = {
      type: 'radio',
      selectedRowKeys,
      onChange: this.onSelectedRowKeysChange,
    };
    const formItemLayout = {
      labelCol: {
        span: 4,
        offset: 2,
      },
      wrapperCol: {
        span: 16,
      },
    };

    const originSelectedItem =
      ifIsSimilar === 'similar' ? originSelectedSimilarItem : originSelectedGoodItem;
    return (
      <Modal
        title={formatMessage({ id: 'rulesManage.recoRule.chooseGood' }, '选择商品')}
        visible={showNewGoodModal}
        onCancel={() => {
          hiddenChooseModal(originSelectedItem, ifIsSimilar);
        }}
        className={styles.goodChooseModal}
        footer={[
          <Button
            size="small"
            key="submit"
            type="primary"
            onClick={submitItem}
            disabled={!ifCanSubmit}
          >
            {formatMessage({ id: 'rulesManage.recoRule.submit' }, '提交')}
          </Button>,
          <Button
            size="small"
            key="back"
            onClick={() => {
              hiddenChooseModal(originSelectedItem, ifIsSimilar);
            }}
          >
            {formatMessage({ id: 'rulesManage.recoRule.back' }, '返回')}
          </Button>,
        ]}
      >
        <div className={styles.chooseWrapper}>
          <Card
            size="small"
            title={formatMessage({ id: 'rulesManage.recoRule.productCatalogue' }, '产品目录')}
            className={styles.treeList}
          >
            <SearchTree {...treeProps} />
          </Card>
          <Card
            size="small"
            title={formatMessage({ id: 'rulesManage.recoRule.productList' }, '产品列表')}
            className={styles.goodList}
            // --------------------------------------------------------------
            extra={
              <a
                onClick={() => {
                  this.showAdvancedSearch(!isShowAdvancedSearch);
                }}
              >
                <span style={{ fontSize: '14px' }}>
                  {formatMessage({ id: 'rulesManage.recoRule.advancedSearch' }, '高级筛选')}
                </span>
                &nbsp;
                <Icon style={{ fontSize: '10px' }} type={isShowAdvancedSearch ? 'up' : 'down'} />
              </a>
            }
            // ---------------------------------------------------------------
          >
            {/* --------------------------------------------------------------- */}
            {isShowAdvancedSearch ? (
              <GoodsAdvancedSearch
                advancedSearchData={advancedSearchData}
                getGoodsSearchData={this.getGoodsSearchData}
                getChooseGoodList={this.getChooseGoodList}
                changePageNum={this.changePageNum}
              />
            ) : null}
            {/* --------------------------------------------------------------- */}
            <Table
              loading={loading.effects['recoRuleManage/getChooseGoodList'] || treeLoading}
              rowKey={record => record.offerId}
              columns={columns}
              dataSource={chooseGoodList}
              rowSelection={rowSelection}
              pagination={false}
            />
            <Pagination
              size="small"
              showQuickJumper
              showSizeChanger
              defaultPageSize={5}
              defaultCurrent={1}
              current={chooseGoodListCurPage}
              total={chooseGoodListTotal}
              style={{ float: 'right' }}
              className={styles.goodListPagination}
              onChange={this.pageChange}
              onShowSizeChange={this.pageSizeChange}
              pageSizeOptions={['5', '10', '20', '30', '40']}
            />
          </Card>
          <Modal
            title={modalTitle}
            visible={modalVisible}
            onCancel={this.closeTreeModal}
            footer={
              <div className={styles.modalFooter}>
                <Button type="primary" size="small" onClick={this.handleAddModalOK}>
                  {formatMessage({ id: 'rulesManage.recoRule.confirm' }, '确认')}
                </Button>
                <Button size="small" onClick={this.closeTreeModal}>
                  {formatMessage({ id: 'rulesManage.recoRule.cancel' }, '取消')}
                </Button>
              </div>
            }
          >
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
              <Form.Item
                label={formatMessage({ id: 'rulesManage.recoRule.catalogueName' }, '目录名称')}
              >
                {getFieldDecorator('title', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage(
                        { id: 'rulesManage.recoRule.needCatalogueName' },
                        '目录名称为必填选项！',
                      ),
                    },
                  ],
                })(<Input />)}
              </Form.Item>
              <Form.Item
                label={formatMessage(
                  { id: 'rulesManage.recoRule.backUpCatalogueName' },
                  '目录备注',
                )}
              >
                {getFieldDecorator('comments', {
                  rules: [],
                })(<Input />)}
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </Modal>
    );
  }
}

export default NewGoodChooseModal;
