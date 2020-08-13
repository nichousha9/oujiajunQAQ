import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { Modal, Table, Pagination, Button, Badge, Tooltip } from 'antd';
import style from '../index.less';

const { Column } = Table;

@connect(({ campaignMonitor, loading }) => ({
  showSearchModal: campaignMonitor.showSearchModal,
  operationsModal: campaignMonitor.operationsModal,
  loading: loading.effects['campaignMonitor/getOperationListEffect'],
}))
class OperationsModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // 选中运营位数据暂存
      transitoryChoosedData: [],
      // 选中行待确认添加到数据暂存的数据
      willAddToTransitory: [],
      // 选中行待移除出数据暂存的数据
      willRemoveFromTransitory: [],
      // 运营位状态
      status: {
        '0': {
          des: formatMessage({id: 'campaignMonitor.awaitEffect'}, "待生效"),
          icon: 'default',
        },
        '1': {
          des: formatMessage({id: 'campaignMonitor.effect'}, "有效"),
          icon: 'success',
        },
        '2': {
          des: formatMessage({id: 'campaignMonitor.invalid'}, "无效"),
          icon: 'error',
        },
      },
    };
  }

  componentDidMount() {
    const { operationsModal } = this.props;
    const { choosedData = [] } = operationsModal || {};

    this.setState(() => ({
      transitoryChoosedData: choosedData,
      willAddToTransitory: choosedData,
    }));
  }

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

    dispatch({
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
      type: 'campaignMonitor/saveOperationChoosedData',
      payload: transitoryChoosedData,
    });

    // 隐藏 Modal
    this.handleCancel();
  };

  // 将选中行添加到选中运营位暂存区
  addToTransitory = () => {
    const { transitoryChoosedData } = this.state;
    let { willAddToTransitory } = this.state;

    // 去重
    const transitoryChoosedId = transitoryChoosedData.map(item => {
      return item.adviceChannel;
    });
    willAddToTransitory = willAddToTransitory.filter(willAddItem => {
      return transitoryChoosedId.includes(willAddItem.adviceChannel) ? '' : true;
    });

    this.setState(() => ({
      transitoryChoosedData: [...transitoryChoosedData, ...willAddToTransitory],
    }));
  };

  // 将选中行从选中运营位暂存区移除
  removeFromTransitory = () => {
    const { operationsModal = {} } = this.props;
    const { choosedDataPageInfo = {} } = operationsModal;
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

  // 根据运营位名称获取运营位列表
  getOperationList = params => {
    const { dispatch, operationsModal = {} } = this.props;
    const { searchVal, allDataPageInfo = {} } = operationsModal;
    const { pageNum, pageSize } = allDataPageInfo;

    const defaultParams = {
      channelId: '',
      adviceChannelName: searchVal || '',
      adviceChannelCode: '',
      state: '1',
      pageInfo: {
        pageNum,
        pageSize,
      },
    };

    return dispatch({
      type: 'campaignMonitor/getOperationListEffect',
      payload: { ...defaultParams, ...params },
    });
  };

  // 改变所有数据 表格的页码信息
  changeAllDataPageInfo = (pageNum, pageSize) => {
    // 获取列表数据
    this.getOperationList({
      pageInfo: {
        pageNum,
        pageSize,
      },
    });
  };

  // 改变选中区页码数
  changeChoosedDataPageInfo = (pageNum, pageSize) => {
    this.changePageInfo(pageNum, pageSize, 'operationsModal.choosedDataPageInfo');
  };

  render() {
    const { showSearchModal, operationsModal, loading } = this.props;
    const { allData, allDataPageInfo = {}, choosedDataPageInfo = {} } = operationsModal || [];
    const {
      transitoryChoosedData,
      willAddToTransitory,
      willRemoveFromTransitory,
      status,
    } = this.state;

    return (
      <Modal
        destroyOnClose
        className={style.operationsModal}
        width="960px"
        title={formatMessage({id: 'campaignMonitor.chooseOperation'}, "运营位选择")}
        visible={showSearchModal === 'operations'}
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
              {formatMessage({id: 'campaignMonitor.sumbit'}, "提交")}
            </Button>
            <Button
              onClick={() => {
                this.handleCancel();
              }}
              size="small"
            >
              {formatMessage({id: 'campaignMonitor.cancel'}, "取消")}
            </Button>
          </Fragment>
        }
      >
        <Table
          loading={loading}
          rowKey={record => record.adviceChannel}
          rowSelection={{
            onChange: (_, selectedRows) => {
              this.setState(() => ({
                willAddToTransitory: [...new Set([...willAddToTransitory, ...selectedRows])],
              }));
            },
            onSelect: (record, selected) => {
              const newWillAddToTransitory = willAddToTransitory.filter(item => {
                return item.adviceChannel !== record.adviceChannel;
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
            selectedRowKeys: willAddToTransitory.map(item => item.adviceChannel),
          }}
          dataSource={allData}
          pagination={false}
        >
          <Column 
            title={formatMessage({id: 'campaignMonitor.operationName'}, "运营位名称")}
            dataIndex="adviceChannelName" 
            key="adviceChannelName" 
            render={text => (
              <div className="tableCol">
                <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
              </div>
            )}
          />
          <Column 
            title={formatMessage({id: 'campaignMonitor.code'}, "编码")}
            dataIndex="adviceChannelCode" 
            key="adviceChannelCode" 
            render={text => (
              <div className="tableCol">
                <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
              </div>
            )}
          />
          <Column 
            title={formatMessage({id: 'campaignMonitor.subOfChannel'}, "所属渠道")}
            dataIndex="channelName" 
            key="channelName" 
            render={text => (
              <div className="tableCol">
                <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
              </div>
            )}
          />
          <Column
            title={formatMessage({id: 'campaignMonitor.state'}, "状态")}
            dataIndex="state"
            key="state"
            render={(_, record) => (
              <Badge status={status[record.state].icon} text={status[record.state].des} />
            )}
          />
        </Table>
        <div className={style.tableFooter}>
          <Button onClick={this.addToTransitory} type="primary" size="small">
            {formatMessage({id: 'campaignMonitor.confirm'}, "确认")}
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
          <span>{formatMessage({id: 'campaignMonitor.choosedOperation'}, "选中运营位")}</span>
        </div>
        <Table
          rowKey={record => record.adviceChannel}
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
                return item.adviceChannel !== record.adviceChannel;
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
            selectedRowKeys: willRemoveFromTransitory.map(item => item.adviceChannel),
          }}
          dataSource={transitoryChoosedData.slice(
            (choosedDataPageInfo.pageNum - 1) * choosedDataPageInfo.pageSize,
            (choosedDataPageInfo.pageNum - 1) * choosedDataPageInfo.pageSize + choosedDataPageInfo.pageSize,
          )}
          pagination={false}
        >
          <Column 
            title={formatMessage({id: 'campaignMonitor.operationName'}, "选中运营位")}
            dataIndex="adviceChannelName" 
            key="adviceChannelName" 
            render={text => (
              <div className="tableCol">
                <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
              </div>
            )}
          />
          <Column 
            title={formatMessage({id: 'campaignMonitor.code'}, "编码")}
            dataIndex="adviceChannelCode" 
            key="adviceChannelCode" 
            render={text => (
              <div className="tableCol">
                <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
              </div>
            )}
          />
          <Column 
            title={formatMessage({id: 'campaignMonitor.subOfChannel'}, "所属渠道")}
            dataIndex="channelName" 
            key="channelName" 
            render={text => (
              <div className="tableCol">
                <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
              </div>
            )}
          />
          <Column
            title={formatMessage({id: 'campaignMonitor.state'}, "状态")}
            dataIndex="state"
            key="state"
            render={(_, record) => (
              <Badge status={status[record.state].icon} text={status[record.state].des} />
            )}
          />
        </Table>
        <div className={style.tableFooter}>
          <Button onClick={this.removeFromTransitory} type="primary" size="small">
            {formatMessage({id: 'campaignMonitor.remove'}, "移除")}
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
      </Modal>
    );
  }
}

export default OperationsModal;
