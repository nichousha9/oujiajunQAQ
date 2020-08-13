import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Table, Divider, Pagination, Badge, Popconfirm, Icon, Tooltip } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import OperationSearch from './HeaderSearch';
import style from '../../index.less';
const { Column } = Table;

@connect(({ operationBitList, loading }) => ({
  dataSource: operationBitList.dataSource,
  pageSize: operationBitList.pageSize,
  dataTotal: operationBitList.dataTotal,
  currentPage: operationBitList.currentPage,
  searchInputCode: operationBitList.searchInputCode,
  searchCode: operationBitList.searchCode,
  searchName: operationBitList.searchName,
  stateToInfo: operationBitList.stateToInfo,
  isLoading: loading,
}))
class ChannelList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 展示表单的策略
      showFormMethod: {
        edit: item => {
          return this.getOperationBitDetailsById(item);
        }, // 获取运营位详情
        readonly: item => {
          return this.getOperationBitDetailsById(item);
        }, // 获取运营位详情
        add: () => {
          return this.clearCurrentOperationBitDetails();
        }, // 清除详情表单数据
      },
    };
  }

  // 获取运营位详情
  getOperationBitDetailsById = item => {
    const { dispatch } = this.props;
    const { adviceChannel, channelId } = item;

    return dispatch({
      type: 'operationBitList/getOperationBitDetailsByIdEffect',
      payload: {
        adviceChannel,
        channelId,
      },
    });
  };

  // 将每次 “运营位编码” 输入框的值存起来，以便搜索调用
  saveSearchInputCode = payload => {
    const { dispatch } = this.props;

    return dispatch({
      type: 'operationBitList/saveSearchInputCode',
      payload,
    });
  };

  // 保存搜索值
  saveSearchName = payload => {
    const { dispatch } = this.props;

    return dispatch({
      type: 'operationBitList/saveSearchName',
      payload,
    });
  };

  saveSearchCode = payload => {
    const { dispatch } = this.props;

    return dispatch({
      type: 'operationBitList/saveSearchCode',
      payload,
    });
  };

  // 清除当前运营位项详情表单数据
  clearCurrentOperationBitDetails = () => {
    const { dispatch } = this.props;

    return dispatch({
      type: 'operationBitList/handleOperationBitDetails',
      payload: {},
    });
  };

  // 展示表单
  handleShowForm = async (method, item) => {
    const { dispatch } = this.props;
    const { showFormMethod } = this.state;

    // 策略：如何展示表单
    await showFormMethod[method](item);

    dispatch({
      type: 'operationBitList/handleShowForm',
      payload: method,
    });
  };

  // 运营位列表的对应的渠道项信息
  handleChannelItemOfOperation = channelItem => {
    const { dispatch } = this.props;

    dispatch({
      type: 'operationBitList/handleChannelItemOfOperation',
      payload: channelItem,
    });
  };

  // 根据状态编码，返回描述信息
  handleStateToInfo = state => {
    const { stateToInfo } = this.props;

    // 返回描述信息
    return stateToInfo[state];
  };

  // 获取运营位列表
  getOperationBitListByChannelId = payload => {
    const { dispatch, channelItem, searchName, searchCode, currentPage, pageSize } = this.props;
    // channelItem 由 ChannelList 传递过来

    // 默认请求参数
    const defaultPayload = {
      channelId: String(channelItem.channelId),
      adviceChannelName: String(searchName),
      adviceChannelCode: String(searchCode),
      state: '1',
      pageInfo: {
        pageNum: currentPage,
        pageSize,
      },
    };
    const newPayload = Object.assign(defaultPayload, payload);

    return dispatch({
      type: 'operationBitList/getListDataByChannelIdEffect',
      payload: newPayload,
    });
  };

  // 处理 PageSize 的改变
  handlePageSizeChange = async (pageNum, size) => {
    const { dispatch } = this.props;

    // 获取更新列表数据
    await this.getOperationBitListByChannelId({
      pageInfo: {
        pageNum,
        pageSize: size,
      },
    });

    // 改变 pageSize
    dispatch({
      type: 'operationBitList/changePageSize',
      payload: size,
    });
  };

  // 搜索运营位列表
  searchOperationBitListByChannelId = params => {
    const { searchInputCode, pageSize } = this.props;

    // 将搜索值存起来
    this.saveSearchName(params.operationName);
    this.saveSearchCode(searchInputCode);

    // 获取运营位列表
    this.getOperationBitListByChannelId({
      adviceChannelName: String(params.operationName),
      adviceChannelCode: String(searchInputCode),
      pageInfo: {
        pageNum: 1,
        pageSize,
      },
    });
  };

  // 删除运营位项
  async handleDeleteOperationBit(payload) {
    const { dispatch } = this.props;

    await dispatch({
      type: 'operationBitList/deleteOperationBitEffect',
      payload,
    });

    // 重新获取数据
    this.getOperationBitListByChannelId();
  }

  render() {
    const { isLoading, dataSource, currentPage, dataTotal, pageSize, channelItem } = this.props;

    return (
      <div className={style.operationBitList}>
        <Card
          title={formatMessage(
            {
              id: 'channelOperation.operation.operationList',
            },
            '运营位列表',
          )}
          /* eslint-disable  react/jsx-wrap-multilines  */
          extra={
            <OperationSearch
              saveSearchInputCode={this.saveSearchInputCode}
              searchOperationBitListByChannelId={this.searchOperationBitListByChannelId}
              channelItem={channelItem}
            />
          }
        >
          <Table
            loading={
              isLoading.effects['operationBitList/getListDataByChannelIdEffect'] ||
              isLoading.effects['operationBitList/getOperationBitDetailsByIdEffect'] ||
              isLoading.effects['operationBitList/deleteOperationBitEffect']
            }
            bordered={false}
            dataSource={dataSource}
            rowKey={record => record.adviceChannel}
            size="middle"
            pagination={false}
          >
            <Column
              className={style.tableCol}
              width="25%"
              title={formatMessage(
                {
                  id: 'channelOperation.operation.operationName',
                },
                '运营位名称',
              )}
              dataIndex="adviceChannelName"
              key="adviceChannelName"
              render={(text, record) => (
                <Tooltip placement="topLeft" title={text}>
                  <a
                    className={style.adviceChannelName}
                    onClick={() => {
                      this.handleShowForm('readonly', record);
                      this.handleChannelItemOfOperation(channelItem);
                    }}
                  >
                    {text}
                  </a>  
                </Tooltip>
              )}
            />
            <Column
              className={style.tableCol}
              width="20%"
              title={formatMessage(
                {
                  id: 'channelOperation.operation.comments',
                },
                '说明',
              )}
              dataIndex="comments"
              key="comments"
              render={(text) => (
                <Tooltip placement="topLeft" title={text}>
                  {text}
                </Tooltip>
              )}
            />
            <Column
              className={style.tableCol}
              width="20%"
              title={formatMessage(
                {
                  id: 'channelOperation.operation.operationCode',
                },
                '运营位编码',
              )}
              dataIndex="adviceChannelCode"
              key="adviceChannelCode"
              render={(text) => (
                <Tooltip placement="topLeft" title={text}>
                  {text}
                </Tooltip>
              )}
            />
            <Column
              className={style.tableCol}
              width="15%"
              // width="20"
              title={formatMessage(
                {
                  id: 'channelOperation.operation.state',
                },
                '状态',
              )}
              dataIndex="state"
              key="state"
              render={data => (
                <Badge
                  status={this.handleStateToInfo(data).icon}
                  text={this.handleStateToInfo(data).des}
                />
              )}
            />
            <Column
              width="10%"
              title={formatMessage(
                {
                  id: 'channelOperation.operation.operate',
                },
                '操作',
              )}
              dataIndex="operate"
              key="operate"
              render={(_, record) => (
                <span>
                  <a
                    className={
                      channelItem.state === '2' || record.state === '2'
                        ? style.operationDisabled
                        : ''
                    }
                  >
                    <span
                      className={
                        channelItem.state === '2' || record.state === '2' ? style.preventClick : ''
                      }
                      onClick={() => {
                        this.handleShowForm('edit', record);
                        this.handleChannelItemOfOperation(channelItem);
                      }}
                    >
                      {formatMessage(
                        {
                          id: 'channelOperation.operation.edit',
                        },
                        '编辑',
                      )}
                    </span>
                  </a>
                  <Divider type="vertical" />
                  <Popconfirm
                    disabled={channelItem.state === '2' || record.state === '2'}
                    title={formatMessage(
                      {
                        id: 'channelOperation.operation.isConfirmDel',
                      },
                      '是否确定删除',
                    ).concat(` "${record.adviceChannelName}" `)}
                    okText={formatMessage(
                      {
                        id: 'channelOperation.operation.confirm',
                      },
                      '确定',
                    )}
                    cancelText={formatMessage(
                      {
                        id: 'channelOperation.operation.cancel',
                      },
                      '取消',
                    )}
                    onConfirm={() => {
                      this.handleDeleteOperationBit({
                        operType: 'delete',
                        channelId: String(record.channelId),
                        channelCode: String(channelItem.channelCode),
                        adviceChannel: String(record.adviceChannel),
                      });
                    }}
                  >
                    <a
                      className={
                        channelItem.state === '2' || record.state === '2'
                          ? style.operationDisabled
                          : ''
                      }
                    >
                      {formatMessage(
                        {
                          id: 'channelOperation.operation.delete',
                        },
                        '删除',
                      )}
                    </a>
                  </Popconfirm>
                </span>
              )}
            />
          </Table>
          <footer className={style.operationBitListFooter}>
            <a
              className={[
                style.footerBtn,
                channelItem.state === '2' ? style.operationDisabled : '',
              ].join(' ')}
            >
              <span
                className={channelItem.state === '2' ? style.preventClick : ''}
                onClick={() => {
                  this.handleShowForm('add');
                  this.handleChannelItemOfOperation(channelItem);
                }}
              >
                <Icon type="plus" />
                &nbsp;
                {formatMessage(
                  {
                    id: 'channelOperation.operation.addOperation',
                  },
                  '新增运营位',
                )}
              </span>
            </a>
            <Pagination
              className={style.pagination}
              showSizeChanger
              showQuickJumper
              defaultCurrent={currentPage}
              total={dataTotal}
              pageSize={pageSize}
              current={currentPage}
              pageSizeOptions={['5', '10', '20', '30', '40']}
              onChange={pageNum => {
                this.getOperationBitListByChannelId({
                  pageInfo: {
                    pageNum,
                    pageSize,
                  },
                });
              }}
              onShowSizeChange={(pageNum, size) => {
                this.handlePageSizeChange(pageNum, size);
              }}
            />
          </footer>
        </Card>
      </div>
    );
  }
}

export default ChannelList;
