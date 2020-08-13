import React, { Component } from 'react';
import { Row, Col, Card, Input, Table, message, Modal } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import GoodsTree from './goodsTree';

const { Search } = Input;
@connect(({ loading, common }) => ({
  loading: loading.effects['creativeIdeaManage/qryOffersInfo'],
  loadingSave: loading.effects['creativeIdeaManage/addOfferCreative'],
  attrSpecCodeList: common.attrSpecCodeList,
}))
class SubCreateModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageInfo: { pageSize: 5, totalRow: 0 },
      searchText: '',
      assoList: [],
      curTreeNode: {},
      selectedRows: [],
      selectedRowKeys: [],
    };
  }

  componentDidMount() {
    // this.getAssoList();
  }

  getAssoList = (pageNum = 1) => {
    const { dispatch, record } = this.props;
    const { searchText, curTreeNode } = this.state;
 
    dispatch({
      type: 'creativeIdeaManage/qryOffersInfo',
      payload: {
        pageInfo: {
          pageNum,
          pageSize: 99,
        },
        offerStatueList: ['A'],
        creativeOfferId: record.creativeInfoId,
        fold: curTreeNode.fold,
        offerName: searchText,
      },
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        // 设置 state
        this.setState({
          assoList: res.svcCont.data,
        });
      }
    });
  };

  searchHandler = searchText => {
    this.setState({ searchText }, this.getAssoList);
  };

  handleSubmit = () => {
    const { selectedRows } = this.state;
    const { changeVisible, dispatch, record, getListData } = this.props;
  
    if (selectedRows.length > 0) {
      const offerCreatives = selectedRows.map(each => ({
        ...each,
        creativeInfoId: record.creativeInfoId,
      }));
      dispatch({
        type: 'creativeIdeaManage/addOfferCreative',
        payload: {
          offerCreatives,
        },
      }).then(res => {
        if (res && res.topCont && res.topCont.resultCode === 0) {
          // 设置 state
          message.success('关联成功！');
          changeVisible(false);
          getListData();
          this.setState({
            selectedRows: [],
            selectedRowKeys: [],
          });
        }
      });
    } else {
      message.info('请至少选择一个关联商品！');
    }
  };

  handleCancel = () => {
    const { changeVisible } = this.props;
    if (changeVisible) changeVisible(false);
  };

  setCurTreeNode = node => {
    
    this.setState(
      {
        curTreeNode: node,
      },
      this.getAssoList,
    );
  };

  setGood = record => {
    const { selectedRowKeys, selectedRows } = this.state;
    this.setState({
      selectedRows: [...selectedRows, record],
      selectedRowKeys: [...selectedRowKeys, record.offerId],
    });
  };

  render() {
    const { pageInfo, assoList, selectedRowKeys } = this.state;
    const { loading, loadingSave, visible } = this.props;
    // const TEMPLATE_INFO_TYPE = attrSpecCodeList.TEMPLATE_INFO_TYPE || [];
    const topRightDiv = (
      <Row style={{ width: '200px' }}>
        <Col span={24}>
          <Search placeholder="请输入商品名称" onSearch={this.searchHandler} size="small" />
        </Col>
      </Row>
    );
    const paginationInfo = {
      pageSize: pageInfo.pageSize || 5,
      total: pageInfo.totalRow || 0,
      onChange: this.getAssoList,
      showQuickJumper: true,
      defaultCurrent: 1,
      style: { marginTop: '20px', float: 'right' },
    };
    const rowSelection = {
      type: 'checkbox',
      onChange: (changeSelectedRowKeys, selectedRows) => {
        this.setState({
          selectedRows,
          selectedRowKeys: changeSelectedRowKeys,
        });
      },
      selectedRowKeys,
    };
    const columns = [
      { title: '商品名称', dataIndex: 'offerName', key: 'offerName' },
      { title: '商品类型', dataIndex: 'offerTypeName', key: 'offerTypeName' },
      { title: '失效时间', dataIndex: 'offerExpDate', key: 'offerExpDate' },
    ];
    return (
      <Modal
        title="目录信息"
        visible={visible}
        width={900}
        onOk={this.handleSubmit}
        onCancel={this.handleCancel}
        bodyStyle={{ padding: 0 }}
        okText="选择"
        okButtonProps={{ loading: loadingSave }}
        cancelText="返回"
      >
        <Row>
          <Col span={5}>
            <GoodsTree setCurTreeNode={this.setCurTreeNode} />
          </Col>
          <Col span={19} className={styles.rightTableBorder}>
            <Card
              bordered={false}
              title="产品列表"
              size="small"
              extra={topRightDiv}
              headStyle={{ padding: '0 16px', fontWeight: 'bold' }}
            >
              <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={assoList}
                size="middle"
                pagination={paginationInfo}
                loading={loading}
                rowKey="prodId"
                onRow={record => ({
                  onClick: () => this.setGood(record), // 点击行
                })}
              />
            </Card>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default SubCreateModal;
