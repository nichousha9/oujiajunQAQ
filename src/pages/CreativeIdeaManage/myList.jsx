/* eslint-disable react/no-unused-state */
/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import {
  Row,
  Col,
  Card,
  Input,
  Icon,
  ConfigProvider,
  Button,
  Form,
  Table,
  Dropdown,
  Menu,
  Select,
  Popconfirm,
  Divider,
  message,
  Tooltip,
  Pagination,
} from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import TreeModal from './treeModal';
import SubCreateModal from './subCreateModal';

const { Search } = Input;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};
@connect(({ loading, common }) => ({
  loading: loading.effects['creativeIdeaManage/qryCreativeInfoList'],
  loadingAsso: loading.effects['creativeIdeaManage/qryOffersInfo'],
  attrSpecCodeList: common.attrSpecCodeList,
}))
@Form.create()
class CreativeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      advancedFilterShow: 'none',
      pageSize: 10,
      pageNum: 1,
      total: 0,
      expandedRowKeys: [],
      searchText: '',
      list: [],
      assoList: [],
      curTreeNode: {},
      channelArr: [],
      treeModalVisible: false,
      subModalVisible: false,
      operationType: '',
      curRecord: {},
    };
  }

  componentDidMount() {
    this.getChannel();
    this.getData();
    this.getSpecCode();
  }

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps)
    const { curTreeNode } = nextProps;
    const { curTreeNode: prevTreeNode } = this.props;
    if (curTreeNode.folderId !== prevTreeNode.folderId) {
      this.setState(
        {
          curTreeNode,
        },
        this.getData,
      );
    }
  }

  // 获取字典数值
  getSpecCode() {
    const { attrSpecCodeList, dispatch } = this.props;
    if (!attrSpecCodeList.TEMPLATE_INFO_TYPE) {
      dispatch({
        type: 'common/qryAttrValueByCode',
        payload: {
          attrSpecCode: 'TEMPLATE_INFO_TYPE',
        },
      });
    }
  }

  showAdvancedFilter = () => {
    const { advancedFilterShow } = this.state;
    if (advancedFilterShow === 'none') {
      this.setState({
        advancedFilterShow: 'block',
      });
    } else {
      this.setState({
        advancedFilterShow: 'none',
      });
    }
  };

  searchHandler = searchText => {
    this.setState({ searchText }, this.getData);
  };

  getAssoList = (pageNum = 1) => {
    const { dispatch } = this.props;
    const { expandedRowKeys } = this.state;
    if (!expandedRowKeys.length) return;
    dispatch({
      type: 'creativeIdeaManage/qryOffersInfo',
      payload: {
        pageInfo: {
          pageNum,
          pageSize: 99,
        },
        creativeInfoIds: [expandedRowKeys[0]],
        offerStatueList: ['A'],
        creativeOfferId: expandedRowKeys[0],
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

  getData = pageNums => {
    const { dispatch, form } = this.props;
    const { searchText, curTreeNode } = this.state;
    form.validateFields((err, values) => {
      if (!err) {
        const { pageNum, pageSize } = this.state;
        dispatch({
          type: 'creativeIdeaManage/qryCreativeInfoList',
          payload: {
            pageInfo: {
              pageNum: pageNums || pageNum || 1,
              pageSize,
            },
            adviceName: searchText,
            folderId: curTreeNode.folderId ? Number(curTreeNode.folderId) : null,
            ...values,
          },
        }).then(res => {
          if (res && res.topCont && res.topCont.resultCode === 0) {
            const { pageInfo } = res.svcCont;
            const { pageNum: servePageNum, pageSize: servePageSize, total: totals } = pageInfo;
            this.setState({
              list: res.svcCont.data,
              pageNum: servePageNum,
              pageSize: servePageSize,
              total: totals,
            });
          }
        });
      }
    });
  };

  getChannel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'creativeIdeaManage/qryTargetChannel',
      payload: {
        pageInfo: { pageNum: '1', pageSize: '1000' },
      },
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        // 设置 state
        this.setState({
          channelArr: res.svcCont.data,
        });
      }
    });
  };

  resetForm = () => {
    const { form } = this.props;
    form.resetFields();
  };

  getDetailData = record => {
    const { dispatch, setCreateType, restoreCreativeRecord } = this.props;
    // const { channelArr } = this.state;
    let type = '';
    let param = {};
    // const channelIds = channelArr.map(channel => {
    //   return channel.channelId;
    // });
    if (record.templateInfoType == '1') {
      type = 'qryProLabelRelData';
      param = {
        objectId: record.adviceId,
        objectType: '01',
      };
    }
    // else {
    //   type = 'qryMccAdviceType';
    //   param = {
    //     // channelId: record.channelId,
    //     // folderId: record.folderId,
    //     // creativeInfoName: record.creativeInfoName,
    //     // channelIds,
    //     adviceType: record.adviceType,
    //   };
    // }
    dispatch({
      type: `creativeIdeaManage/${type}`,
      payload: param,
    });

    setCreateType(record.templateInfoType);
    restoreCreativeRecord(record);
  };

  handleEdit = record => {
    const { changeEdit, changeDetail } = this.props;
    this.getDetailData(record);
    changeEdit(true);
    changeDetail(false);
  };

  handleLook = record => {
    const { changeEdit, changeDetail } = this.props;
    this.getDetailData(record);
    changeEdit(false);
    changeDetail(true);
  };

  handleDel = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'creativeIdeaManage/delCreativeInfo',
      payload: {
        adviceId: record.adviceId,
      },
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        // 设置 state
        message.success('删除成功！');
        this.getData();
      } else {
        message.success(res.topCont.remark);
      }
    });
  };

  handleCopy = record => {
    this.setState({
      treeModalVisible: true,
      operationType: 'copy',
      curRecord: record,
    });
  };

  handleDelAssoProduct = record => {
    const { dispatch } = this.props;
    const { expandedRowKeys } = this.state;
    dispatch({
      type: 'creativeIdeaManage/delOfferCreative',
      payload: {
        ...record,
        adviceId: expandedRowKeys[0],
      },
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        // 设置 state
        message.success('删除关联商品成功！');
        this.getAssoList();
      }
    });
  };

  openAssoProductModal = record => {
    this.setState({
      subModalVisible: true,
      curRecord: record,
    });
  };

  // expandedRowRender = record => {
  //   const { assoList } = this.state;
  //   const { loadingAsso } = this.props;
  //   const columns = [
  //     { title: '商品名称', dataIndex: 'offerName', key: 'offerName' },
  //     { title: '商品类型', dataIndex: 'offerTypeName', key: 'offerTypeName' },
  //     { title: '失效时间', dataIndex: 'offerExpDate', key: 'offerExpDate' },
  //     {
  //       title: '操作',
  //       dataIndex: 'operation',
  //       key: 'operation',
  //       render: (i, d) => (
  //         <Popconfirm
  //           placement="topLeft"
  //           title="确定删除？"
  //           onConfirm={() => {
  //             this.handleDelAssoProduct(d);
  //           }}
  //           okText="确定"
  //           cancelText="取消"
  //         >
  //           <a>删除</a>
  //         </Popconfirm>
  //       ),
  //     },
  //   ];

  //   const paginationInfo = {
  //     pageSize: 10,
  //     // total: pageInfo.totalRow || 0,
  //     onChange: this.getAssoList,
  //     showSizeChanger: true,
  //     showQuickJumper: true,
  //     defaultCurrent: 1,
  //     style: { marginTop: '20px', float: 'right' },
  //   };
  //   return (
  //     <div className={styles.expandTableWrapper}>
  //       <Table
  //         columns={columns}
  //         dataSource={assoList}
  //         pagination={paginationInfo}
  //         loading={loadingAsso}
  //         rowKey="offerId"
  //         size="middle"
  //       />
  //       <Button
  //         type="primary"
  //         onClick={() => this.openAssoProductModal(record)}
  //         className={styles.assoButton}
  //       >
  //         关联商品
  //       </Button>
  //     </div>
  //   );
  // };

  // triggerRow = adviceId => {
  //   //   debugger
  //   const { expandedRowKeys } = this.state;
  //   const element = expandedRowKeys.find(e => e === adviceId);
  //   this.setState(
  //     {
  //       expandedRowKeys: element ? [] : [adviceId],
  //     },
  //     this.getAssoList,
  //   );
  // };

  setCreateType = type => {
    const { setCreateType, curTreeNode } = this.props;
    if (Object.keys(curTreeNode).length === 0) {
      message.warning('请先选择目录再添加话术！');
      return;
    }
    if (setCreateType) {
      setCreateType(type);
    }
  };

  pageSizeChange = (current, size) => {
    // 修改每页显示页数
    this.setState(
      {
        pageNum: current,
        pageSize: size,
      },
      () => {
        this.getData();
      },
    );
    // 重新获取数据
  };

  render() {
    const {
      advancedFilterShow,
      pageNum,
      pageSize,
      total,
      treeModalVisible,
      subModalVisible,
      expandedRowKeys,
      list,
      channelArr,
      operationType,
      curRecord,
    } = this.state;

    const { form, loading, attrSpecCodeList = {} } = this.props;
    const TEMPLATE_INFO_TYPE = attrSpecCodeList.TEMPLATE_INFO_TYPE || [];
    const { getFieldDecorator } = form;
    const menu = (
      <Menu>
        {/* <Menu.Item>
          <a onClick={() => this.setCreateType('1')}>新增图片话术</a>
        </Menu.Item> */}
        <Menu.Item>
          <a onClick={() => this.setCreateType('2')}>新增文本话术</a>
        </Menu.Item>
        {/* <Menu.Item>
          <a onClick={() => this.setCreateType('3')}>新增HTML话术</a>
        </Menu.Item> */}
      </Menu>
    );
    const topRightDiv = (
      <Row style={{ width: '450px', display: 'flex', justifyContent: 'flex-end' }} gutter={16}>
        <Col>
          <ConfigProvider autoInsertSpaceInButton={false}>
            <Dropdown overlay={menu}>
              <Button type="primary" size="small">
                新增
                <Icon type="down" />
              </Button>
            </Dropdown>
          </ConfigProvider>
        </Col>
        <Col>
          <Search
            placeholder="搜索话术名称"
            onSearch={this.searchHandler}
            size="small"
            maxLength={21}
          />
        </Col>
        {/* <Col>
          <a onClick={this.showAdvancedFilter}>
            高级筛选
            {advancedFilterShow === 'none' ? <Icon type="down" /> : <Icon type="up" />}
          </a>
        </Col> */}
      </Row>
    );

    const paginationInfo = {
      showQuickJumper: true,
      showSizeChanger: true,
      // showQuickJumper: true,
      pageNum,
      pageSize,
      total,
      onChange: page => this.pageSizeChange(page),
      onShowSizeChange: (current, size) => this.pageSizeChange(current, size),
      pageSizeOptions: ['10', '20', '30', '40'],
    };
    const columns = [
      {
        title: '话术名称',
        dataIndex: 'adviceName',
        // align: 'center',
        render: (text, record) => (
          <a
            onClick={() => {
              this.handleLook(record);
            }}
          >
            {text}
          </a>
        ),
      },
      {
        title: '渠道',
        dataIndex: 'channelId',
        align: 'center',
        render: text => {
          const channel = channelArr.find(e => e.channelId === Number(text));
          return channel ? channel.channelName : '';
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        align: 'center',
      },
      {
        title: '话术模板类型',
        dataIndex: 'adviceType',
        align: 'center',
        render: text => {
          switch (String(text)) {
            case '1':
              return '图片话术';
            case '2':
              return '文本话术';
            case '3':
              return 'HTML话术';
            default:
              return '未知';
          }
        },
      },
      {
        title: '话术模板',
        dataIndex: 'state',
        align: 'center',
        render: text => (text == 'A' ? '是' : '否'),
      },
      {
        title: '操作',
        align: 'right',
        render: (text, record) => {
          const isExpand = !!expandedRowKeys.find(e => e === record.adviceId);
          return (
            <React.Fragment>
              {/* <a onClick={() => this.triggerRow(record.adviceId)}>
                查看话术关联商品
                <Icon
                  style={{
                    transform: `rotate(${isExpand ? '180' : '0'}deg) scale(.8)`,
                  }}
                  className={styles.arrowDown}
                  type="down"
                />
              </a> */}
              {/* <Divider type="vertical" /> */}
              <a
                onClick={() => {
                  this.handleEdit(record);
                }}
              >
                编辑
              </a>
              <Divider type="vertical" />
              <a
                onClick={() => {
                  this.handleCopy(record);
                }}
              >
                复制
              </a>
              {/* <Divider type="vertical" />
              <a
                onClick={() => {
                  this.handleMove(record);
                }}
              >
                移动
              </a> */}
              <Divider type="vertical" />
              <Popconfirm
                placement="topLeft"
                title="确定删除"
                onConfirm={() => {
                  this.handleDel(record);
                }}
                okText="确定"
                cancelText="取消"
              >
                <a>删除</a>
              </Popconfirm>
            </React.Fragment>
          );
        },
      },
    ];
    return (
      <Card title="话术管理" extra={topRightDiv} size="small" className="common-card">
        <div style={{ display: advancedFilterShow }} className="show-advanced-div">
          <Form {...formItemLayout}>
            <Row className={styles.rowBottomLine}>
              <Col span={8}>
                <Form.Item label="话术模板类型">
                  {getFieldDecorator('templateInfoType', {
                    rules: [{ required: false, message: '请选择一个话术模板类型' }],
                  })(
                    <Select style={{ width: '100%' }} placeholder="请选择话术模板类型">
                      {TEMPLATE_INFO_TYPE.map(e => (
                        <Option key={e.attrValueCode}>{e.attrValueName}</Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="模板编码">
                  {getFieldDecorator('creativeInfoCode', {
                    rules: [{ required: false, message: '请输入模板编码' }],
                  })(<Input placeholder="请输入" />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="渠道">
                  {getFieldDecorator('channelId', {
                    rules: [{ required: false, message: '请选择渠道类型' }],
                  })(
                    <Select style={{ width: '100%' }} placeholder="请选择渠道类型">
                      {channelArr.map(each => (
                        <Option key={each.channelId}>{each.channelName}</Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles.rowBottomLine} type="flex" justify="end">
              <Col span={8}>
                <div style={{ marginTop: 6 }}>
                  <Button style={{ float: 'right' }} onClick={this.resetForm}>
                    重置
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
        <Table
          columns={columns}
          dataSource={list}
          pagination={paginationInfo}
          loading={loading}
          // ={this.expandedRowRender}
          // expandIcon={() => null}
          rowKey="adviceId"
          // expandedRowKeys={expandedRowKeys}
          className="assoTable"
        />

        <TreeModal
          visible={treeModalVisible}
          type={operationType}
          record={curRecord}
          changeVisible={v => {
            this.setState({
              treeModalVisible: v,
            });
            this.getData();
          }}
        />
        <SubCreateModal
          visible={subModalVisible}
          record={curRecord}
          getListData={this.getAssoList}
          changeVisible={v => {
            this.setState({
              subModalVisible: v,
            });
          }}
        />
      </Card>
    );
  }
}

export default CreativeList;
