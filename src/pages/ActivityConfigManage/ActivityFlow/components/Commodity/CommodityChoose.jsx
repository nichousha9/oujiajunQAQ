/* eslint-disable no-unused-vars */
// 商品内容选择弹窗
import React from 'react';
import { connect } from 'dva';
import { Modal, Row, Col, Table, Input, Card } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import commonStyles from '../../common.less';
import SearchTree from '@/components/SearchTree';
import { formatTree } from '@/utils/formatData';

const { Search } = Input;

@connect(({ activityFlowContact }) => ({
  activityFlowContact,
}))
class CommodityChoose extends React.Component {
  columns = [
    {
      title: '产品名称',
      dataIndex: 'prodName',
      key: 'prodName',
    },
    {
      title: formatMessage({ id: 'activityConfigManage.contact.offerType' }),
      dataIndex: 'offerTypeName',
      key: 'offerTypeName',
    },
    {
      title: '失效时间',
      dataIndex: 'prodExpDate',
      key: 'prodExpDate',
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      // 左边树
      treeSelectedKey: '',
      treeList: [],
      // 右边模块
      pageNum: 1,
      pageSize: 5,
      pageInfo: {}, // 后端的返回
      prodName: '',
      commodityList: [], // 商品列表
      selectedRowKeys: [],
      selectedRows: [],
    };
  }

  componentDidMount() {
    this.getMccFolderList();
  }

  /**
   *获取目录树数据
   *
   * @memberof CommodityChoose
   */
  getMccFolderList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activityFlowContact/getMccFolderList',
      payload: {
        // fold: -6, // 目录id
        // objType: 4, // 对象类型
      },
      success: svcCont => {
        const { data = [] } = svcCont;
        const newArr = this.handleTreeData(data);
        // data.map(item => ({ ...item, key: item.fold, title: item.name }));
        if (newArr && newArr.length && newArr[0].key) {
          const treeSelectedKey = newArr[0].key;
          this.setState({ treeList: newArr, treeSelectedKey }, this.qryOffersInfo);
        } else {
          this.setState({ treeList: newArr || [] });
        }
      },
    });
  };

  handleTreeData = data => {
    const len = data.length;
    const treeArr = data.map(item => ({
      title: item.name, // 目录的名称
      key: item.fold, // 目录的ID
      comments: item.folderName, // 目录的描述
      pathCode: item.pathCode,
      pathCodeLen: item.pathCode.split('.').length,
      parentKey: item.parentFold, // 父目录的ID
      children: [],
      used: false,
      statusCd: item.statusCd, // 目录的状态
      curItem: {}, // 当前选择的目录
      labelType: item.labelType,
      adviceCatg: item.adviceCatg,
      spId: item.spId,
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
    return newArr;
  };

  /**
   *获取商品列表
   *
   * @memberof CommodityChoose
   */
  qryOffersInfo = () => {
    const { dispatch, creativeInfoIds = [] } = this.props;
    const { treeSelectedKey, pageNum, pageSize, prodName } = this.state;
    dispatch({
      type: 'activityFlowContact/qryOffersInfo',
      payload: {
        pageInfo: { pageNum, pageSize },
        creativeInfoIds, // 创意信息id
        creativeOfferId: '',
        fold: treeSelectedKey, // 商品目录id
        prodName, // 商品名称
        offerStatueList: ['A'], // 商品状态
        // tagGoodId: '', // 商品id
      },
      success: svcCont => {
        const { data = [], pageInfo = {} } = svcCont;
        this.setState({
          commodityList: data,
          pageInfo,
        });
      },
    });
  };

  // 商品列表搜索文字改变
  offerNameChange = e => {
    const { value } = e.target;
    this.setState({ prodName: value });
  };

  // 树选中值改变
  onSelectCallBack = key => {
    this.setState({ treeSelectedKey: key }, this.qryOffersInfo);
  };

  // 提交
  handleSubmit = () => {
    const { onOk } = this.props;
    const { selectedRows } = this.state;
    onOk(selectedRows);
  };

  // 列表条件切换
  onChange = pagination => {
    const { current: pageNum, pageSize } = pagination;
    this.setState(
      {
        pageNum,
        pageSize,
      },
      this.qryOffersInfo,
    );
  };

  render() {
    const { visible, onCancel, chooseMultiple } = this.props;
    const { treeList, commodityList, pageInfo, treeSelectedKey, selectedRowKeys } = this.state;

    const treeProps = {
      hideSearch: true,
      showButtons: false,
      defaultSelectedKeys: [treeSelectedKey.toString()],
      treeData: treeList,
      onSelectCallBack: this.onSelectCallBack,
    };

    const pagination = {
      current: pageInfo.pageNum,
      pageSize: pageInfo.pageSize,
      total: pageInfo.total,
      showSizeChanger: true,
      showQuickJumper: true,
    };

    const rowSelection = {
      hideDefaultSelections: !chooseMultiple,
      type: chooseMultiple ? 'checkbox' : 'radio',
      selectedRowKeys,
      onChange: (selectedKeys, selecteds) => {
        this.setState({
          selectedRowKeys: selectedKeys,
          selectedRows: selecteds,
        });
      },
    };

    return (
      <Modal
        title="产品信息"
        visible={visible}
        width={960}
        onOk={this.handleSubmit}
        onCancel={onCancel}
        okText={formatMessage({ id: 'common.btn.submit' })}
        cancelText={formatMessage({ id: 'common.btn.back' })}
        wrapClassName={commonStyles.flowModal}
      >
        <div className={commonStyles.chooseWrapper}>
          <Row type="flex" gutter={8}>
            {/* 创意选择左边目录树 */}
            <Col span={6}>
              <Card
                size="small"
                title={formatMessage({ id: 'activityConfigManage.flow.productCatalog' })}
                className={commonStyles.treeBox}
              >
                <div>{treeList && treeList.length > 0 && <SearchTree {...treeProps} />}</div>
              </Card>
            </Col>
            {/* 创意选择列表及选中列表 */}
            <Col span={18}>
              <Card
                size="small"
                bordered={false}
                className={commonStyles.chooseWrapperCard}
                extra={
                  <Search
                    size="small"
                    placeholder={formatMessage({ id: 'common.form.input' })}
                    onChange={this.offerNameChange}
                    onPressEnter={this.qryOffersInfo}
                    onSearch={this.qryOffersInfo}
                    className={commonStyles.chooseSearch}
                  />
                }
              >
                <Table
                  rowKey="offerId"
                  dataSource={commodityList}
                  columns={this.columns}
                  pagination={pagination}
                  rowSelection={rowSelection}
                  onChange={this.onChange}
                />
              </Card>
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }
}

export default CommodityChoose;
