import React from 'react';
import { Modal, Row, Col, Input, Table, Form, Button, Pagination, Card } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import SearchTree from '@/components/SearchTree/index';
import styles from './index.less';

@connect(({ loading }) => ({
  campaignListEffectLoading: loading.effects['campaignModal/getCampaignListEffect'],
}))
@Form.create({ name: 'campaign-modal-form' })
class CampaignModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // 表格数据
      campaignList: [],
      // 暂存被选
      selectedCampaignList: [],
      // 选中行待确认添加到数据暂存的数据
      willAddToTransitory: [],
      // 选中行待移除出数据暂存的数据
      willRemoveFromTransitory: [],

      // 分页
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0,
      },
      selectedPageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0,
      },
      // 树
      fold: '1',
      pathCode: '1',
      treeData: [],
      returnData: [],
      defaultSelectedKeys: [],
    };
  }

  componentDidMount() {
    const { initSelectedCampaignList } = this.props;
    this.getMccFolderList({ setDefault: true });
    this.getCampaignList();
    this.setState({
      selectedCampaignList: [...initSelectedCampaignList],
      willAddToTransitory: [...initSelectedCampaignList],
      willRemoveFromTransitory: [...initSelectedCampaignList],
    });
  }

  getMccFolderList = options => {
    const { dispatch, pathCode } = this.props;
    const payload = {
      fold: -1,
      objType: 2,
      code: pathCode,
    };

    dispatch({
      type: 'campaignModal/getMccFolderListEffect',
      payload,
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        this.formatTreeData(res.svcCont.data, options);
      }
    });
  };

  getCampaignList = (fieldValues = {}) => {
    const { dispatch, exclusiveCampaignId } = this.props;
    const { pageInfo, fold, pathCode } = this.state;
    const otherParams = {
      fold,
      pathCode,
      compainType: 1,
      userId: 1,
    };
    console.log('fold', fold, pathCode);
    dispatch({
      type: 'campaignModal/getCampaignListEffect',
      payload: { pageInfo, ...fieldValues, ...otherParams, exclusiveCampaignId },
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        const { pageNum, pageSize, total } = res.svcCont.pageInfo;
        this.setState({
          campaignList: [...res.svcCont.data],
          pageInfo: { pageNum, pageSize, total },
        });
      }
    });
  };

  handleSearch = () => {
    const { form } = this.props;
    const fieldValue = form.getFieldsValue();
    this.getCampaignList(fieldValue);
  };

  // 处理树
  getNodeInfo = (fold, pathCode) => {
    this.setState({
      fold,
      pathCode,
    });
  };

  formatTreeData = (originTreeData, options = {}) => {
    const newArr = this.dealData(originTreeData);
    const defaultSelectedKey = newArr && newArr.length && newArr[0].key && newArr[0].key.toString();
    const pathCode = newArr && newArr.length && newArr[0].pathCode;
    if (options && options.setDefault) {
      this.setState({
        treeData: newArr,
        returnData: originTreeData,
        defaultSelectedKeys: [defaultSelectedKey],
      });
      this.getNodeInfo(defaultSelectedKey, pathCode);
    } else {
      this.setState({
        treeData: newArr,
        returnData: originTreeData,
      });
    }
  };

  dealData = data => {
    const len = data.length;
    const treeArr = data.map(item => ({
      title: item.name,
      key: item.fold,
      comments: item.comments,
      pathCodeLen: item.pathCode.split('.').length,
      parentKey: item.parentFold || '',
      children: [],
      used: false,
      curOperate: '',
      curItem: {},
      pathCode: item.pathCode,
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

  getPathCode = key => {
    const { returnData } = this.state;
    let pathcode = '';
    returnData.forEach(item => {
      if (String(item.fold) === String(key)) {
        pathcode = `${pathcode}${item.pathCode}`;
      }
    });
    return pathcode;
  };

  onSelectCallBack = async fold => {
    const pathCode = this.getPathCode(fold);
    await this.getNodeInfo(fold, pathCode);
    this.getCampaignList();
  };

  changePageInfo = (pageNum, pageSize) => {
    const pages = { pageNum, pageSize };
    this.setState(
      prevState => {
        const { pageInfo } = prevState;
        return {
          pageInfo: { ...pageInfo, ...pages },
        };
      },
      () => {
        this.getCampaignList();
      },
    );
  };

  addToTransitory = () => {
    const { selectedCampaignList } = this.state;
    let { willAddToTransitory } = this.state;

    // 去重
    const transitoryChoosedId = selectedCampaignList.map(item => {
      return item.id;
    });
    willAddToTransitory = willAddToTransitory.filter(willAddItem => {
      return transitoryChoosedId.includes(willAddItem.id) ? '' : true;
    });

    this.setState(() => ({
      selectedCampaignList: [...selectedCampaignList, ...willAddToTransitory],
    }));
  };

  removeFromTransitory = () => {
    const { selectedPageInfo } = this.state;
    const { pageNum, pageSize } = selectedPageInfo;
    const { selectedCampaignList, willRemoveFromTransitory } = this.state;

    const newTransitoryChoosedData = selectedCampaignList.filter(item => {
      return willRemoveFromTransitory.indexOf(item) === -1;
    });

    // 如果移除之后，当前页码没数据，则将页码往前挪
    if (
      !String(
        newTransitoryChoosedData.slice(
          (selectedPageInfo.pageNum - 1) * 5,
          (selectedPageInfo.pageNum - 1) * 5 + selectedPageInfo.pageSize,
        ),
      )
    ) {
      this.changeSelectedPageInfo(pageNum - 1 || 1, pageSize);
    }

    this.setState(() => ({
      selectedCampaignList: newTransitoryChoosedData,
    }));
  };

  onAllChange = (_, selectedRows) => {
    const { willAddToTransitory } = this.state;
    this.setState(() => ({
      willAddToTransitory: [...new Set([...willAddToTransitory, ...selectedRows])],
    }));
  };

  onAllSelect = (record, selected) => {
    const { willAddToTransitory } = this.state;
    const newWillAddToTransitory = willAddToTransitory.filter(item => {
      return item.id !== record.id;
    });
    if (!selected) {
      // 处理取消选中
      this.setState(() => ({
        willAddToTransitory: newWillAddToTransitory,
      }));
    }
  };

  onAllSelectAll = selected => {
    if (!selected) {
      // 处理反选
      this.setState(() => ({
        willAddToTransitory: [],
      }));
    }
  };

  onRemoveChange = (_, selectedRows) => {
    const { willRemoveFromTransitory } = this.state;
    this.setState(() => ({
      willRemoveFromTransitory: [...new Set([...willRemoveFromTransitory, ...selectedRows])],
    }));
  };

  onRemoveSelect = (record, selected) => {
    const { willRemoveFromTransitory } = this.state;
    const newWillAddToTransitory = willRemoveFromTransitory.filter(item => {
      return item.id !== record.id;
    });
    if (!selected) {
      // 处理取消选中
      this.setState(() => ({
        willRemoveFromTransitory: newWillAddToTransitory,
      }));
    }
  };

  onRemoveSelectAll = selected => {
    if (!selected) {
      // 处理反选
      this.setState(() => ({
        willRemoveFromTransitory: [],
      }));
    }
  };

  changeSelectedPageInfo = (pageNum, pageSize) => {
    this.setState(prevState => {
      const prevPageInfo = prevState.selectedPageInfo;
      return {
        selectedPageInfo: { ...prevPageInfo, pageNum, pageSize },
      };
    });
  };

  render() {
    const { campaignVisible, handleOk, handleCancel, form, campaignListEffectLoading } = this.props;
    const {
      treeData,
      defaultSelectedKeys,
      campaignList,
      pageInfo,
      selectedCampaignList,
      selectedPageInfo,
      willAddToTransitory,
      willRemoveFromTransitory,
    } = this.state;

    const { getFieldDecorator } = form;
    const treeProps = {
      defaultSelectedKeys,
      treeData,
      onSelectCallBack: this.onSelectCallBack,
      hideSearch: true,
      showButtons: false,
    };

    const columns = [
      {
        title: formatMessage({ id: 'campaignModal.campaignName' }, '活动名称'),
        dataIndex: 'extName',
      },
      {
        title: formatMessage({ id: 'campaignModal.campaignCode' }, '活动编码'),
        dataIndex: 'extCode',
      },
      {
        title: formatMessage({ id: 'campaignModal.description' }, '描述'),
        dataIndex: 'description',
      },
    ];

    const rowSelection = {
      onChange: this.onAllChange,
      onSelect: this.onAllSelect,
      onSelectAll: this.onAllSelectAll,
      selectedRowKeys: willAddToTransitory.map(item => item.id),
    };

    const removeRowSelection = {
      onChange: this.onRemoveChange,
      onSelect: this.onRemoveSelect,
      onSelectAll: this.onRemoveSelectAll,
      selectedRowKeys: willRemoveFromTransitory.map(item => item.id),
    };

    const formItemLayout = {
      labelCol: {
        // xs: { span: 24 },
        xs: { span: 10 },
      },
      wrapperCol: {
        // xs: { span: 24 },
        xs: { span: 14 },
      },
    };

    return (
      <Modal
        title={formatMessage({ id: 'campaignModal.selectCampaign' }, '选择活动')}
        width={960}
        destroyOnClose
        visible={campaignVisible}
        onOk={() => {
          handleOk(selectedCampaignList);
        }}
        onCancel={handleCancel}
      >
        <Row type="flex" gutter={16}>
          <Col span={5}>
            <Card
              title={formatMessage({
                id: 'activityConfigManage.marketingActivityList.treeTitle',
              })}
              size="small"
              className="common-card"
            >
              {treeData && treeData.length > 0 && <SearchTree {...treeProps} />}
            </Card>
          </Col>
          <Col span={19}>
            <section className="select-campaign-form">
              <Form {...formItemLayout}>
                <Row type="flex" className="row-bottom-line" justify="end">
                  <Col span={7}>
                    <Form.Item
                      label={formatMessage(
                        {
                          id: 'campaignModal.campaignName',
                        },
                        '活动名称',
                      )}
                    >
                      {getFieldDecorator('extName')(<Input size="small" />)}
                    </Form.Item>
                  </Col>
                  <Col span={7}>
                    <Form.Item
                      label={formatMessage(
                        {
                          id: 'campaignModal.campaignCode',
                        },
                        '活动编码',
                      )}
                    >
                      {getFieldDecorator('extCode')(<Input size="small" />)}
                    </Form.Item>
                  </Col>
                  <Col span={2}>
                    <Button
                      size="small"
                      type="primary"
                      onClick={this.handleSearch}
                      className={styles.searchBtn}
                    >
                      {formatMessage(
                        {
                          id: 'common.btn.search',
                        },
                        '搜索',
                      )}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </section>
            <section className="full-campaign-table">
              <Table
                rowKey={record => record.id}
                columns={columns}
                // scroll={{ x: 1000 }}
                rowSelection={rowSelection}
                dataSource={campaignList}
                pagination={false}
                loading={campaignListEffectLoading}
              />
              <div className={styles.tableFooter}>
                <Button onClick={this.addToTransitory} type="primary" size="small">
                  {formatMessage(
                    {
                      id: 'campaignMonitor.confirm',
                    },
                    '确认',
                  )}
                </Button>
                <Pagination
                  size="small"
                  showQuickJumper
                  current={pageInfo.pageNum}
                  defaultCurrent={pageInfo.pageNum}
                  total={pageInfo.total}
                  pageSize={pageInfo.pageSize}
                  showSizeChanger
                  onChange={this.changePageInfo}
                  onShowSizeChange={this.changePageInfo}
                  pageSizeOptions={['5', '10', '20', '30', '40']}
                />
              </div>
              <div className={styles.selectedTitle}>
                <span>
                  {formatMessage(
                    {
                      id: 'campaignModal.selectedCampaign',
                    },
                    '选中活动',
                  )}
                </span>
              </div>
            </section>
            <section>
              <Table
                rowKey={record => record.id}
                columns={columns}
                // scroll={{ x: 1000 }}
                rowSelection={removeRowSelection}
                pagination={false}
                dataSource={selectedCampaignList.slice(
                  (selectedPageInfo.pageNum - 1) * selectedPageInfo.pageSize,
                  (selectedPageInfo.pageNum - 1) * selectedPageInfo.pageSize +
                    selectedPageInfo.pageSize,
                )}
              />
              <div className={styles.tableFooter}>
                <Button onClick={this.removeFromTransitory} type="primary" size="small">
                  {formatMessage(
                    {
                      id: 'campaignModal.remove',
                    },
                    '移除',
                  )}
                </Button>
                <Pagination
                  size="small"
                  showQuickJumper
                  current={selectedPageInfo.pageNum}
                  defaultCurrent={selectedPageInfo.pageNum}
                  total={selectedCampaignList.length}
                  pageSize={selectedPageInfo.pageSize}
                  showSizeChanger
                  onChange={this.changeSelectedPageInfo}
                  onShowSizeChange={this.changeSelectedPageInfo}
                  pageSizeOptions={['5', '10', '20', '30', '40']}
                />
              </div>
            </section>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default CampaignModal;
