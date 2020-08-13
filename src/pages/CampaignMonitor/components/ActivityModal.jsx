import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { Modal, Table, Pagination, Button, Row, Col, Input, Tooltip } from 'antd';
import ActivityCatalogue from './ActivityCatalogue';
import style from '../index.less';

const { Column } = Table;

@connect(({ campaignMonitor, loading }) => ({
  showSearchModal: campaignMonitor.showSearchModal,
  activityModal: campaignMonitor.activityModal,
  treeLoading: loading.effects['campaignMonitor/getMccFolderList'],
  tableLoading: loading.effects['campaignMonitor/getCampaignListEffect'],
}))
class ActivityModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // 选中活动数据暂存
      transitoryChoosedData: [],
      // 选中行待确认添加到数据暂存的数据
      willAddToTransitory: [],
      // 选中行待移除出数据暂存的数据
      willRemoveFromTransitory: [],

      // 目录树
      key: '',
      pathCode: '',
    };
  }

  componentDidMount() {
    const { activityModal } = this.props;
    const { choosedData = [] } = activityModal || {};

    this.setState(() => ({
      transitoryChoosedData: choosedData,
      willAddToTransitory: choosedData,
    }));
  }

  async componentDidUpdate(_, prevState) {
    const { key, pathCode } = this.state;
    if (key != prevState.key || pathCode != prevState.pathCode) {
      // 初始化表格分页信息
      await this.changePageInfo(1, 5, 'activityModal.allDataPageInfo');
      this.getCampaignList();
    }
  }

  // 目录树
  getNodeInfo = (key, pathCode) => {
    this.setState({
      key,
      pathCode,
    });
  };

  // 隐藏模态框
  handleCancel = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'campaignMonitor/handleShowSearchModal',
      payload: false,
    });

    // 初始化表格分页信息
    this.changePageInfo(1, 5);
  };

  // 改变分页信息
  changePageInfo = (pageNum, pageSize, type) => {
    const { dispatch } = this.props;

    return dispatch({
      type: 'campaignMonitor/changePageInfo',
      payload: {
        pageNum,
        pageSize,
        type,
      },
    });
  };

  // 处理提交事件，将暂存的选中区域保存至 models 中进行搜索的数据
  handleConfirm = () => {
    const { dispatch } = this.props;
    const { transitoryChoosedData } = this.state;

    dispatch({
      type: 'campaignMonitor/saveActivityChoosedData',
      payload: transitoryChoosedData,
    });

    // 隐藏 Modal
    this.handleCancel();
  };

  // 将选中行添加到选中活动暂存区
  addToTransitory = () => {
    const { transitoryChoosedData } = this.state;
    let { willAddToTransitory } = this.state;

    // 去重
    const transitoryChoosedId = transitoryChoosedData.map(item => {
      return item.id;
    });
    willAddToTransitory = willAddToTransitory.filter(willAddItem => {
      return transitoryChoosedId.includes(willAddItem.id) ? '' : true;
    });

    this.setState(() => ({
      transitoryChoosedData: [...transitoryChoosedData, ...willAddToTransitory],
    }));
  };

  // 将选中行从选中活动暂存区移除
  removeFromTransitory = () => {
    const { activityModal = {} } = this.props;
    const { choosedDataPageInfo = {} } = activityModal;
    const { pageNum, pageSize } = choosedDataPageInfo;
    const { transitoryChoosedData, willRemoveFromTransitory } = this.state;

    const newTransitoryChoosedData = transitoryChoosedData.filter(item => {
      return willRemoveFromTransitory.indexOf(item) === -1;
    });

    // 如果移除之后，当前页码没数据，则将页码往前挪
    if (
      !String(
        newTransitoryChoosedData.slice(
          (choosedDataPageInfo.pageNum - 1) * 5,
          (choosedDataPageInfo.pageNum - 1) * 5 + choosedDataPageInfo.pageSize,
        ),
      )
    ) {
      this.changeChoosedDataPageInfo(pageNum - 1 || 1, pageSize);
    }

    this.setState(() => ({
      transitoryChoosedData: newTransitoryChoosedData,
    }));
  };

  // 获取活动列表数据 ======= start
  getCampaignList = params => {
    const { dispatch, activityModal = {} } = this.props;
    const { searchVal, allDataPageInfo = {} } = activityModal;
    const { pageNum, pageSize } = allDataPageInfo;
    const { key, pathCode } = this.state;

    const defaultParams = {
      userId: 1,
      extName: searchVal || '',
      compainType: 1,
      fold: key,
      pathCode,
      pageInfo: {
        pageNum,
        pageSize,
      },
    };

    dispatch({
      type: 'campaignMonitor/getCampaignListEffect',
      payload: { ...defaultParams, ...params },
    });
  };

  // 改变搜索值
  changeSearchVal = val => {
    const { dispatch } = this.props;

    dispatch({
      type: 'campaignMonitor/changeActivitySearchVal',
      payload: val,
    });
  };

  // 处理搜索框搜索
  handleSearch = val => {
    const { activityModal: { allDataPageInfo: { pageSize } } } = this.props

    // 改变搜索值
    this.changeSearchVal(val);

    // 获取数据
    this.getCampaignList({
      extName: val,
      pageInfo: {
        pageNum: 1,
        pageSize
      }
    });
  };

  // 改变所有数据 表格的页码信息
  changeAllDataPageInfo = (pageNum, pageSize) => {
    // 获取列表数据
    this.getCampaignList({
      pageInfo: {
        pageNum,
        pageSize,
      },
    });
  };

  // 改变选中区页码数
  changeChoosedDataPageInfo = (pageNum, pageSize) => {
    this.changePageInfo(pageNum, pageSize, 'activityModal.choosedDataPageInfo');
  };

  render() {
    const { showSearchModal, activityModal, tableLoading, treeLoading } = this.props;
    const { allData, allDataPageInfo = {}, choosedDataPageInfo = {} } = activityModal || [];
    const { transitoryChoosedData, willAddToTransitory, willRemoveFromTransitory } = this.state;

    return (
      <Modal
        destroyOnClose
        className={style.operationsModal}
        width="960px"
        title={formatMessage({
          id: 'campaignMonitor.choosedActivity'
        }, "活动选择")}
        visible={showSearchModal === 'activity'}
        onCancel={this.handleCancel}
        footer={
          <Fragment>
            <Button
              type="primary"
              onClick={() => {
                this.handleConfirm();
              }}
              size="small"
            >
              {formatMessage({
                id: 'campaignMonitor.sumbit'
              }, "提交")}
            </Button>
            <Button
              onClick={() => {
                this.handleCancel();
              }}
              size="small"
            >
              {formatMessage({
                id: 'campaignMonitor.cancel'
              }, "取消")}
            </Button>
          </Fragment>
        }
      >
        <Row type="flex" gutter={16}>
          <Col span={5}>
            {/* <Spin spinning={treeLoading}> */}
            <ActivityCatalogue getNodeInfo={this.getNodeInfo} />
            {/* </Spin> */}
          </Col>
          <Col span={19}>
            <Input.Search
              className={style.searchInput}
              size="small"
              allowClear
              placeholder={formatMessage({
                id: 'campaignMonitor.activityName'
              }, "活动名称")}
              onSearch={val => {
                this.handleSearch(val);
              }}
            />
            <Table
              loading={tableLoading || treeLoading}
              rowKey={record => record.id}
              rowSelection={{
                onChange: (_, selectedRows) => {
                  this.setState(() => ({
                    willAddToTransitory: [...new Set([...willAddToTransitory, ...selectedRows])],
                  }));
                },
                onSelect: (record, selected) => {
                  const newWillAddToTransitory = willAddToTransitory.filter(item => {
                    return item.id !== record.id;
                  });
                  if (!selected) {
                    // 处理取消选中
                    this.setState(() => ({
                      willAddToTransitory: newWillAddToTransitory,
                    }));
                  }
                },
                onSelectAll: selected => {
                  if (!selected) {
                    // 处理反选
                    this.setState(() => ({
                      willAddToTransitory: [],
                    }));
                  }
                },
                selectedRowKeys: willAddToTransitory.map(item => item.id),
              }}
              dataSource={allData}
              pagination={false}
            >
              <Column 
                title={formatMessage({
                  id: 'campaignMonitor.activityName'
                }, "活动名称")}
                dataIndex="extName" 
                key="extName" 
                render={text => (
                  <div className="tableCol">
                    <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                  </div>
                )}
              />
              <Column 
                title={formatMessage({
                  id: 'campaignMonitor.activityCode'
                }, "活动代码")}
                dataIndex="extCode" 
                key="extCode"
                render={text => (
                  <div className="tableCol">
                    <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                  </div>
                )}
              />
              <Column 
                title={formatMessage({
                  id: 'campaignMonitor.description'
                }, "描述")}
                dataIndex="description" 
                key="description" 
                render={text => (
                  <div className="tableCol">
                    <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                  </div>
                )}
              />
            </Table>
            <div className={style.tableFooter}>
              <Button onClick={this.addToTransitory} type="primary" size="small">
                {formatMessage({
                  id: 'campaignMonitor.confirm'
                }, "确认")}
              </Button>
              <Pagination
                size="small"
                showQuickJumper
                current={allDataPageInfo.pageNum}
                defaultCurrent={allDataPageInfo.pageNum}
                total={allDataPageInfo.total}
                pageSize={allDataPageInfo.pageSize}
                showSizeChanger
                onChange={(page, pageSize) => {
                  this.changeAllDataPageInfo(page, pageSize);
                }}
                onShowSizeChange={(page, pageSize) => {
                  this.changeAllDataPageInfo(page, pageSize);
                }}
                pageSizeOptions={['5', '10', '20', '30', '40']}
              />
            </div>
            <div className={style.choosedTitle}>
              <span>
                {formatMessage({
                  id: 'campaignMonitor.choosedActivity'
                }, "选中活动")}
              </span>
            </div>
            <Table
              rowKey={record => record.id}
              rowSelection={{
                onChange: (_, selectedRows) => {
                  this.setState(() => ({
                    willRemoveFromTransitory: [
                      ...new Set([...willRemoveFromTransitory, ...selectedRows]),
                    ],
                  }));
                },
                onSelect: (record, selected) => {
                  const newWillRemoveFromTransitory = willRemoveFromTransitory.filter(item => {
                    return item.id !== record.id;
                  });
                  if (!selected) {
                    // 处理取消选中
                    this.setState(() => ({
                      willRemoveFromTransitory: newWillRemoveFromTransitory,
                    }));
                  }
                },
                onSelectAll: selected => {
                  if (!selected) {
                    // 处理反选
                    this.setState(() => ({
                      willRemoveFromTransitory: [],
                    }));
                  }
                },
                selectedRowKeys: willRemoveFromTransitory.map(item => item.id),
              }}
              dataSource={transitoryChoosedData.slice(
                (choosedDataPageInfo.pageNum - 1) * choosedDataPageInfo.pageSize,
                (choosedDataPageInfo.pageNum - 1) * choosedDataPageInfo.pageSize + choosedDataPageInfo.pageSize,
              )}
              pagination={false}
            >
              <Column 
                title={formatMessage({
                  id: 'campaignMonitor.activityName'
                }, "活动名称")}
                dataIndex="extName" 
                key="extName" 
                render={text => (
                  <div className="tableCol">
                    <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                  </div>
                )}
              />
              <Column 
                title={formatMessage({
                  id: 'campaignMonitor.activityCode'
                }, "活动代码")}
                dataIndex="extCode"
                key="extCode" 
                render={text => (
                  <div className="tableCol">
                    <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                  </div>
                )}
              />
              <Column 
                title={formatMessage({
                  id: 'campaignMonitor.description'
                }, "描述")}
                dataIndex="description" 
                key="description" 
                render={text => (
                  <div className="tableCol">
                    <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                  </div>
                )}
              />
            </Table>
            <div className={style.tableFooter}>
              <Button onClick={this.removeFromTransitory} type="primary" size="small">
                {formatMessage({
                  id: 'campaignMonitor.remove'
                }, "移除")}
              </Button>
              <Pagination
                size="small"
                showQuickJumper
                current={choosedDataPageInfo.pageNum}
                defaultCurrent={choosedDataPageInfo.pageNum}
                pageSize={choosedDataPageInfo.pageSize}
                showSizeChanger
                total={transitoryChoosedData.length}
                onChange={(page, pageSize) => {
                  this.changeChoosedDataPageInfo(page, pageSize);
                }}
                onShowSizeChange={(page, pageSize) => {
                  this.changeChoosedDataPageInfo(page, pageSize);
                }}
                pageSizeOptions={['5', '10', '20', '30', '40']}
              />
            </div>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default ActivityModal;
