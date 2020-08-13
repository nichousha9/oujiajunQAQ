import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
  List,
  Row,
  Col,
  Card,
  Pagination,
  Input,
  Icon,
  // ConfigProvider,
  Button,
  Form,
  Badge,
  Radio,
  // Dropdown,
  // Popconfirm,
  message,
  Table,
  Menu,
  Modal,
  Tooltip,
} from 'antd';
import { Link, router } from 'umi';
import { formatMessage } from 'umi-plugin-react/locale';
import SearchTree from '@/components/SearchTree/index';
import styles from './index.less';
import Iconfont from '@/components/Iconfont';

const { Search } = Input;

@connect(({ commodityList, loading }) => {
  return {
    fold: commodityList.submitData.fold,
    cmdInfo: commodityList.cmdInfo,
    loading: loading.effects['commodityList/qryOffersInfo'],
    treeLoading: loading.effects['commodityList/getMccFolderList'],
  };
})
@Form.create()
class MyList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      advancedFilterShow: 'none',
      // stateType: [], // 状态编码
      cmdTotal: 0, // 商品列表总数
      modalVisible: false, // 控制复制modal可视化
      foldVisible: false, // 控制目录modal可视化
      treeData: [],
      copyOfferData: {},
      offerType: '',
      offerStatue: '',
      prodName: '', // searchValue
      pageInfo: {
        // 页面信息
        pageNum: 1,
        pageSize: 10,
      },
    };
  }

  componentWillMount() {
    // 获取商品列表
    // this.getData();
    // 获取目录树
    this.getTreeData();
    // 每次加载清空数据
    this.setState({ copyOfferData: {} });
  }

  componentWillReceiveProps = nextProps => {
    const { fold } = this.props;
    const { pageInfo } = this.state;
    if (fold != nextProps.fold) {
      // 将页码设置为第一页
      this.setState({
        pageInfo: { ...pageInfo, pageNum: 1 },
      });
      this.getData({ fold: nextProps.fold });
    }
  };

  componentWillUnmount() {
    // 初始化 models state
    this.initState();
  }

  // 初始化 models state
  initState = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'commodityList/initState',
    });
  };

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

  getTreeData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'commodityList/getMccFolderList',
      payload: {
        objType: 4,
      },
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        this.dealTreeData(res.svcCont.data);
      }
    });
  };

  // 商品复制
  copyOffer = () => {
    const { dispatch, form } = this.props;
    const { copyOfferData, pageInfo } = this.state;
    // console.log(copyOfferData, 'copyOfferData');
    dispatch({
      type: 'commodityList/copyOffer',
      payload: { ...copyOfferData, pageInfo },
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        message.success(formatMessage({ id: 'commodityManage.tip.success' }));
        this.getData();
        this.setState({ copyOfferData: {} });
        form.resetFields();
      } else {
        message.error(res.topCont.remark);
      }
    });
  };

  dealTreeData = data => {
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
      // 拿到当前节点的子节点
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
    this.setState({
      treeData: newArr,
    });
  };

  // qryAttrValueByCode = () => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'commodityList/qryAttrValueByCode',
  //     payload: {
  //       attrSpecCode: 'CAMPAIGN_STATE_TYPE',
  //     },
  //   }).then(res => {
  //     if (res && res.topCont && res.topCont.resultCode === 0) {
  //       const arr1 = res.svcCont.data;
  //       const newarr = [];
  //       arr1.forEach(item => {
  //         newarr.push({
  //           name: item.attrValueName,
  //           campaignState: item.attrValueCode,
  //         });
  //       });
  //       this.setState({
  //         stateType: newarr,
  //       });
  //     }
  //   });
  // };

  // 获取商品列表数据
  getData = params => {
    const { state } = this;
    const { props } = this;
    const fold = undefined === params || undefined === params.fold ? props.fold : params.fold;
    const pageInfo =
      undefined === params || undefined === params.pageInfo ? state.pageInfo : params.pageInfo;
    const offerType =
      undefined === params || undefined === params.offerType ? state.offerType : params.offerType;
    const offerStatue =
      undefined === params || undefined === params.offerStatue
        ? state.offerStatue
        : params.offerStatue;
    const prodName =
      undefined === params || undefined === params.prodName ? state.prodName : params.prodName;
    const { dispatch } = props;
    dispatch({
      type: 'commodityList/qryOffersInfo',
      payload: { fold, pageInfo, offerType, offerStatue, prodName, ...params },
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        this.setState({
          cmdTotal: res.svcCont.pageInfo.total,
        });
        this.dealData(res.svcCont.data);
      }
    });
  };

  dealData = data => {
    const { dispatch } = this.props;
    const cmdState = {
      I: <Badge status="default" text={formatMessage({ id: 'commodityManage.status.initial' })} />,
      A: (
        <Badge status="processing" text={formatMessage({ id: 'commodityManage.status.active' })} />
      ),
      R: <Badge status="error" text={formatMessage({ id: 'commodityManage.status.return' })} />,
    };
    const cmdInfo = data.map(item => ({
      stateBadge: cmdState[item.state],
      state: item.state,
      prodName: item.prodName,
      prodCode: item.prodCode,
      offerType: item.offerType,
      offerTypeName: item.offerTypeName,
      prodId: item.prodId,
      offerPrice: item.offerPrice,
      offerEffDate: item.offerEffDate,
      offerExpDate: item.offerExpDate,
      externalOfferCode: item.externalOfferCode,
      prodDesc: item.prodDesc, // -----------------加上功效字段 ------------------
    }));
    // console.log(cmdInfo);
    dispatch({
      type: 'commodityList/saveCmdInfo',
      payload: cmdInfo,
    });
  };

  // 搜索商品
  searchValue = value => {
    const { pageInfo } = this.state;
    // const { nodeKey, nodePath } = this.props;
    // const obj1 = { extName: value, pageInfo, fold: nodeKey || -1, pathCode: nodePath || '-1' };
    this.setState(
      {
        prodName: value,
        pageInfo: {
          ...pageInfo,
          pageNum: 1,
        },
      },
      () => {
        this.offerFilter();
      },
    );
  };

  // 删除商品
  delCampaign = item => {
    const { dispatch } = this.props;
    const { pageInfo } = this.state;
    dispatch({
      type: 'commodityList/delOffer',
      payload: { pageInfo, prodId: item.prodId },
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        message.success(formatMessage({ id: 'commodityManage.tip.success' }));
        this.getData();
      }
    });
  };

  // 改变商品状态
  modOfferState = item => {
    const { dispatch } = this.props;
    const { pageInfo } = this.state;
    let targetState = '';
    if (item.statecode === 'I' || item.statecode === 'R') {
      targetState = 'A';
    } else if (item.statecode === 'A') {
      targetState = 'R';
    }
    dispatch({
      type: 'commodityList/modOfferState',
      payload: { pageInfo, prodId: item.prodId, targetState },
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        message.success(formatMessage({ id: 'commodityManage.tip.success' }));
        this.getData();
      } else {
        message.error(res.topCont.remark);
      }
    });
  };

  getMenu = item => {
    const state = item.statecode;
    const type = item.offerType;
    return (
      <Menu className="drop-menu-style">
        {state !== 'A' && (
          <Menu.Item>
            <a onClick={this.modOfferState.bind(this, item)}>
              {formatMessage({
                id: 'commodityManage.status.active',
              })}
            </a>
          </Menu.Item>
        )}
        {state === 'A' && (
          <Menu.Item>
            <a onClick={this.modOfferState.bind(this, item)}>
              {formatMessage({
                id: 'commodityManage.status.return',
              })}
            </a>
          </Menu.Item>
        )}
        {type === '2' && (
          <Menu.Item>
            <a onClick={this.showcopyModal.bind(this, item)}>
              {formatMessage({
                id: 'commodityManage.action.copy',
              })}
            </a>
          </Menu.Item>
        )}
      </Menu>
    );
  };

  showcopyModal = item => {
    const { form } = this.props;
    const { copyOfferData } = this.state;
    form.setFieldsValue({ copyOfferName: item.prodName });
    this.setState({
      modalVisible: true,
      copyOfferData: {
        ...copyOfferData,
        srcOfferId: item.prodId.toString(),
        srcOfferName: item.prodName,
        offerType: item.offerType,
      },
    });
  };

  offertypeFilter = e => {
    const offerType = e.target.value === 'all' ? '' : e.target.value;
    this.setState({ offerType }, () => {
      this.offerFilter();
    });
  };

  offerstateFilter = e => {
    const offerStatue = e.target.value === 'all' ? '' : e.target.value;
    this.setState({ offerStatue }, () => {
      this.offerFilter();
    });
  };

  offerFilter = () => {
    const { offerType, offerStatue, prodName } = this.state;
    this.getData({ offerType, offerStatue, prodName });
  };

  // pageSize、pageNum改变的回调函数
  onChange = (current, pageSize) => {
    const pageInfo = { pageNum: current, pageSize };
    this.getData({ pageInfo });
    this.setState({ pageInfo });
  };

  render() {
    const {
      copyOfferData,
      advancedFilterShow,
      cmdTotal,
      modalVisible,
      foldVisible,
      treeData,
      pageInfo: { pageNum },
    } = this.state;
    const { fold, loading, treeLoading, form, cmdInfo } = this.props;
    const { getFieldDecorator } = form;
    const topRightDiv = (
      <div>
        {/* ----------新增按钮，暂时不用-------------- */}
        {/* <ConfigProvider autoInsertSpaceInButton={false}>
          <Link to={{ pathname: '/commodityManage/commodityView' }}>
            <Button type="primary" size="small">
              {formatMessage({
                id: 'common.table.status.new',
              })}
            </Button>
          </Link>
        </ConfigProvider> */}
        {/* ----------新增按钮，暂时不用-------------- */}

        <Search
          className="filter-input"
          placeholder={formatMessage({ id: 'commodityManage.tip.searchOfferName' }, '搜索商品名称')}
          size="small"
          onSearch={value => this.searchValue(value)}
          maxLength={21}
        />
        {/* -------------高级筛选，暂时不用-------------- */}
        {/* <span className="dropdown-style" onClick={this.showAdvancedFilter}>
          {formatMessage({ id: 'common.btn.AdvancedFilter' })}
          {advancedFilterShow === 'none' ? <Icon type="down" /> : <Icon type="up" />}
        </span> */}
        {/* -------------高级筛选，暂时不用-------------- */}
      </div>
    );

    const columns = [
      {
        title: '产品名称',
        dataIndex: 'prodName',
        key: 'prodName',
        ellipsis: true,
      },
      {
        title: '产品编码',
        dataIndex: 'prodCode',
        key: 'prodCode',
      },
      {
        title: '产品状态',
        dataIndex: 'stateBadge',
      },
      {
        title: '产品描述',
        dataIndex: 'prodDesc',
        key: 'prodDesc',
        ellipsis: true,
      },

      {
        title: '操作',
        dataIndex: 'address',
        key: 'address',
        render: (_, record) => {
          return (
            <a
              onClick={() => {
                router.push({
                  pathname: '/commodityManage/commodityView',
                  query: {
                    fold,
                    prodName: record.prodName,
                    prodId: record.prodId,
                    actionType: 'view',
                    prodCode: record.prodCode, // ---- 商品编码 ----
                  },
                });
              }}
            >
              {formatMessage({ id: 'common.table.action.detail' })}
            </a>
          );
        },
      },
    ];

    return (
      <Fragment>
        <Card
          title={formatMessage({ id: 'commodityManage.name.offerList' })}
          extra={topRightDiv}
          className="common-card"
          size="small"
        >
          <div style={{ display: advancedFilterShow }} className={styles.showAdvancedDiv}>
            <Row>
              <div className={styles.droprowStyle}>
                <Col span={2} style={{ color: 'black' }}>
                  {formatMessage({ id: 'commodityManage.name.offerType' })}：
                </Col>
                <Col span={18}>
                  <Radio.Group
                    size="small"
                    defaultValue="all"
                    buttonStyle="solid"
                    onChange={this.offertypeFilter}
                  >
                    <Radio.Button value="all">
                      {formatMessage({ id: 'commodityManage.tip.all' })}
                    </Radio.Button>
                    <Radio.Button value="P">Package</Radio.Button>
                    <Radio.Button value="2">Product</Radio.Button>
                  </Radio.Group>
                </Col>
              </div>
            </Row>
            <Row>
              <div className={styles.droprowStyle}>
                <Col span={2} style={{ color: 'black' }}>
                  {formatMessage({ id: 'common.table.status' })}:
                </Col>
                <Col span={18}>
                  <Radio.Group
                    size="small"
                    defaultValue="all"
                    buttonStyle="solid"
                    onChange={this.offerstateFilter}
                  >
                    <Radio.Button value="all">
                      {formatMessage({ id: 'commodityManage.tip.all' })}
                    </Radio.Button>
                    <Radio.Button value="I">
                      <Badge
                        status="default"
                        text={formatMessage({ id: 'commodityManage.status.initial' })}
                      />
                    </Radio.Button>
                    <Radio.Button value="A">
                      <Badge
                        status="processing"
                        text={formatMessage({ id: 'commodityManage.status.active' })}
                      />
                    </Radio.Button>
                    <Radio.Button value="R">
                      <Badge
                        status="error"
                        text={formatMessage({ id: 'commodityManage.status.return' })}
                      />
                    </Radio.Button>
                  </Radio.Group>
                </Col>
              </div>
            </Row>
          </div>
          {/* <List
            itemLayout="horizontal"
            dataSource={cmdInfo}
            className="common-list"
            loading={loading || treeLoading}
            renderItem={item => (
              <List.Item key={item.prodId}>
                <Col span={9}>
                  <List.Item.Meta
                    avatar={
                      <div className="left-lmg">
                        <Iconfont type="iconhuodong" />
                      </div>
                    }
                    title={
                      <div className={styles.deepColor}>
                        <Tooltip placement="topLeft" title={item.prodName}>
                          <Link
                            to={{
                              pathname: '/commodityManage/commodityView',
                              query: {
                                fold,
                                prodName: item.prodName,
                                prodId: item.prodId,
                                actionType: 'view',
                                prodCode: item.prodCode, // ---- 商品编码 ----
                              },
                            }}
                          >
                            {item.prodName}
                          </Link>
                        </Tooltip>
                      </div>
                    }
                    description={
                      <Tooltip placement="topLeft" title={item.prodDesc || ''}>
                        {'功效: '.concat(item.prodDesc || '')}
                      </Tooltip>
                    }
                  />
                </Col>
                <Col span={6}>
                  <List.Item.Meta
                    title={
                      <div className={styles.lightColor}>
                        {formatMessage({ id: 'commodityManage.name.offerCode' })}
                      </div>
                    }
                    description={
                      <Tooltip placement="topLeft" title={item.prodCode}>
                        <div className={styles.deepColor}>{item.prodCode}</div>
                      </Tooltip>
                    }
                  />
                </Col>
                <Col span={5}>
                  <List.Item.Meta
                    title={
                      <div className={styles.lightColor}>
                        {formatMessage({ id: 'commodityManage.name.offerStatus' })}
                      </div>
                    }
                    description={<div className={styles.deepColor}>{item.stateBadge}</div>}
                  />
                </Col>
              </List.Item>
            )}
          /> */}
          <Table
            rowKey="prodId"
            dataSource={cmdInfo}
            columns={columns}
            pagination={false}
            loading={loading || treeLoading}
            className="mt16"
          />

          <div className={styles.paginationStyle}>
            <Pagination
              showQuickJumper
              showSizeChanger
              defaultCurrent={1}
              current={pageNum}
              total={cmdTotal}
              onChange={this.onChange}
              onShowSizeChange={this.onChange}
              defaultPageSize={10}
              pageSizeOptions={['5', '10', '20']}
            />
          </div>
        </Card>
        <Modal
          title={formatMessage({ id: 'commodityManage.name.offerAdd' })}
          visible={modalVisible}
          onOk={() => {
            form.validateFields((err, values) => {
              if (!err) {
                this.setState(
                  {
                    modalVisible: false,
                    copyOfferData: {
                      ...copyOfferData,
                      offerCode: values.newOfferCode,
                      prodName: values.newOfferName,
                    },
                  },
                  () => {
                    this.copyOffer();
                  },
                );
              }
            });
          }}
          onCancel={() => {
            this.setState({ modalVisible: false });
          }}
          centered
        >
          <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} onSubmit={this.copyOffer}>
            <Form.Item label={formatMessage({ id: 'commodityManage.tip.copyOffer' })}>
              {getFieldDecorator('copyOfferName', { rules: [{ required: true }] })(
                <Input size="small" readOnly />,
              )}
            </Form.Item>
            <Form.Item label={formatMessage({ id: 'commodityManage.name.newofferName' })}>
              {getFieldDecorator('newOfferName', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'common.form.input' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'common.form.input' })} size="small" />)}
            </Form.Item>
            <Form.Item label={formatMessage({ id: 'commodityManage.name.newofferCode' })}>
              {getFieldDecorator('newOfferCode', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'common.form.input' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'common.form.input' })} size="small" />)}
            </Form.Item>
            <Form.Item label={formatMessage({ id: 'commodityManage.name.fold' })}>
              {getFieldDecorator('folderName', {})(
                <Input
                  size="small"
                  readOnly
                  suffix={
                    <Button
                      style={{ marginRight: -12 }}
                      type="primary"
                      size="small"
                      onClick={() => {
                        this.setState({
                          foldVisible: true,
                        });
                      }}
                    >
                      <Icon type="search" />
                    </Button>
                  }
                />,
              )}
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title={formatMessage({ id: 'commodityManage.name.offerFold' })}
          visible={foldVisible}
          onOk={() => {
            const { currentData } = this.SearchTree;
            if (!currentData) {
              message.error(formatMessage({ id: 'commodityManage.tip.chooseFold' }));
              return;
            }
            // this.fold = currentData.currentKey;
            this.setState({
              foldVisible: false,
              copyOfferData: {
                ...copyOfferData,
                foldId: currentData.eventKey,
                foldName: currentData.name,
              },
            });
            form.setFieldsValue({ folderName: currentData.name });
          }}
          onCancel={() => {
            this.setState({ foldVisible: false });
          }}
          centered
        >
          <SearchTree
            treeData={treeData}
            showButtons={false}
            Refs={v => {
              this.SearchTree = v;
            }}
          />
        </Modal>
      </Fragment>
    );
  }
}

export default MyList;
