/* eslint-disable no-unused-vars */
import React, { Fragment } from 'react';
import { Card, List, Col, Badge, Row, Divider, Icon, Popconfirm, Tooltip, Table } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import ChannelCardHeaderExtra from './HeaderSearch';
import AdvancedFilterInput from './AdvancedSearch';
import style from '../../index.less';
import OperationList from '../operation/OperationList';
import Iconfont from '@/components/Iconfont/index';

function ChannelListUI(props) {
  const {
    advancedFilterPlaceholder,
    pagination, // 分页信息
    showAdvancedFilterInput,
    dataSource,
    handleShowListItemForm,
    handleShowOperationListById,
    currentShowOperationOfChannel,
    getChannelListData,
    searchInputOfName,
    searchInputOfCode,
    searchOfCode,
    changeSearchOfCode,
    changeSearchInputOfCode,
    changeSearchInputOfName,
    pageSize,
    handleDeleteChannel,
    handleStateToInfo,
    orderListType,
    isLoading,
    orderList,
  } = props;

  const columns = [
    {
      title: '渠道名称',
      dataIndex: 'channelName',
      key: 'channelName',
      ellipsis: true,
    },
    {
      title: '渠道编码',
      dataIndex: 'channelCode',
      key: 'channelCode',
    },
    {
      title: '渠道类型',
      dataIndex: 'processType',
      key: 'processType',
    },
    {
      title: '工单生成规则',
      dataIndex: 'orderCreateType',
      key: 'orderCreateType',
      render: text => {
        return (
          <Tooltip placement="topLeft" title={text}>
            {orderList.filter(items => text === items.attrValueCode)[0].attrValueName || ''}
          </Tooltip>
        );
      },
    },

    {
      title: '渠道描述',
      dataIndex: 'channelDesc',
      key: 'channelDesc',
      ellipsis: true,
    },

    {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      render: text => {
        return (
          <Badge
            status={
              // handleStateToInfo(item.state).icon
              text === 'A' ? 'success' : null
            }
            text={text === 'A' ? '生效' : null}
          />
        );
      },
    },
    {
      title: formatMessage({ id: 'common.table.action' }), // '操作',
      dataIndex: 'address',
      key: 'address',
      render: (_, record) => {
        return (
          <div>
            <a className={record.state === '2' ? style.operationDisabled : ''}>
              <span
                className={record.state === '2' ? style.preventClick : ''}
                onClick={() => {
                  handleShowListItemForm('edit', record);
                }}
              >
                {formatMessage(
                  {
                    id: 'channelOperation.channel.edit',
                  },
                  '编辑',
                )}
              </span>
            </a>
            <Divider type="vertical" />
            <Popconfirm
              disabled={record.state === '2'}
              title={formatMessage(
                {
                  id: 'channelOperation.channel.isConfirmDel',
                },
                '是否确定删除',
              ).concat(` "${record.channelName}" `)}
              okText={formatMessage(
                {
                  id: 'channelOperation.channel.confirm',
                },
                '确定',
              )}
              cancelText={formatMessage(
                {
                  id: 'channelOperation.channel.cancel',
                },
                '取消',
              )}
              onConfirm={() => handleDeleteChannel(record.channelId)}
            >
              <a className={[record.state === '2' ? style.operationDisabled : '']}>
                {formatMessage(
                  {
                    id: 'channelOperation.channel.delete',
                  },
                  '删除',
                )}
              </a>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  return (
    <div className={style.ChannelListUI}>
      <Card
        size="small"
        title={formatMessage(
          {
            id: 'channelOperation.channel.channelList',
          },
          '渠道列表',
        )}
        /* eslint-disable  react/jsx-wrap-multilines  */
        extra={
          <ChannelCardHeaderExtra
            handleShowListItemForm={handleShowListItemForm}
            showAdvancedFilterInput={showAdvancedFilterInput}
            getChannelListData={getChannelListData}
            changeSearchInputOfName={changeSearchInputOfName}
            pageSize={pageSize}
            searchInputOfCode={searchInputOfCode}
            searchOfCode={searchOfCode}
            changeSearchOfCode={changeSearchOfCode}
            searchInputOfName={searchInputOfName}
          />
        }
      >
        {showAdvancedFilterInput ? (
          <AdvancedFilterInput
            title={advancedFilterPlaceholder}
            changeSearchInputOfCode={changeSearchInputOfCode}
            searchInputOfCode={searchInputOfCode}
          />
        ) : null}
        {/* <List
          loading={
            isLoading.effects['channelList/getDataSourceEffect'] ||
            isLoading.effects['channelList/getChannelItemDetailsEffect'] ||
            isLoading.effects['channelList/handleDeleteChannelEffect']
          }
          itemLayout="horizontal"
          dataSource={dataSource}
          pagination={Object.assign(
            {
              showSizeChanger: true,
              showQuickJumper: true,
              onChange: (page, size) => {
                getChannelListData({
                  pageInfo: {
                    pageNum: page,
                    pageSize: size,
                  },
                });
              },
            },
            pagination,
          )}
          renderItem={item => (
            <List.Item key={item.channelId}>
              <Col span={24}>
                <Row gutter={8} className={style.listItemRow}>
                  <Col span={6}>
                    <List.Item.Meta
                      className={style.itemChannelName}
                      avatar={
                        <div className={style.listAvatar}>
                          <Iconfont className={style.iconfont} type={item.icon} />
                        </div>
                      }
                      title={
                        <Tooltip placement="topLeft" title={item.channelName}>
                          <a
                            onClick={() => {
                              handleShowListItemForm('readonly', item);
                            }}
                          >
                            {item.channelName}
                          </a>
                        </Tooltip>
                      }
                      description={
                        <Fragment>
                          <span className={style.itemMetaDes}>
                            {formatMessage(
                              {
                                id: 'channelOperation.channel.desc',
                              },
                              '描述',
                            )}
                          </span>
                          <Tooltip placement="topLeft" title={item.channelDesc || ''}>
                            <span className={style.itemMetaDes}>{item.channelDesc}</span>
                          </Tooltip>
                        </Fragment>
                      }
                    />
                  </Col>
                  <Col span={4}>
                    <List.Item.Meta
                      title={formatMessage(
                        {
                          id: 'channelOperation.channel.channelCode',
                        },
                        '渠道编码',
                      )}
                      description={
                        <Tooltip placement="topLeft" title={item.channelCode}>
                          {item.channelCode}
                        </Tooltip>
                      }
                    />
                  </Col>

                  <Col span={4}>
                    <List.Item.Meta
                      title="渠道类型"
                      description={
                        <Tooltip placement="topLeft" title={item.processType}>
                          {orderListType.filter(
                            items => item.processType === items.attrValueCode,
                          )[0].attrValueName || ''}
                        </Tooltip>
                      }
                    />
                  </Col>

                  <Col span={4}>
                    <List.Item.Meta
                      title="工单生成规则"
                      description={
                        <Tooltip placement="topLeft" title={item.orderCreateType}>
                          {orderList.filter(
                            items => item.orderCreateType === items.attrValueCode,
                          )[0].attrValueName || ''}
                        </Tooltip>
                      }
                    />
                  </Col>

                  <Col span={3}>
                    <List.Item.Meta
                      title={formatMessage(
                        {
                          id: 'channelOperation.channel.state',
                        },
                        '状态',
                      )}
                      description={
                        <Badge
                          status={
                            // handleStateToInfo(item.state).icon
                            item.state === 'A' ? 'success' : null
                          }
                          text={item.state === 'A' ? '生效' : null}
                        />
                      }
                    />
                  </Col>
                  <Col span={4}>
                    {/* <a
                      onClick={() => {
                        handleShowOperationListById(item);
                      }}
                    >
                      {formatMessage(
                        {
                          id: 'channelOperation.channel.operationList',
                        },
                        '运营位列表',
                      )}
                      &nbsp;
                      <Icon
                        className={[
                          style.arrowIcon,
                          currentShowOperationOfChannel === item.channelId ? style.arrowUp : '',
                        ].join(' ')}
                        type="down"
                      />
                    </a>
                    <Divider type="vertical" /> */}
        {/* <a className={item.state === '2' ? style.operationDisabled : ''}>
                      <span
                        className={item.state === '2' ? style.preventClick : ''}
                        onClick={() => {
                          handleShowListItemForm('edit', item);
                        }}
                      >
                        {formatMessage(
                          {
                            id: 'channelOperation.channel.edit',
                          },
                          '编辑',
                        )}
                      </span>
                    </a>
                    <Divider type="vertical" />
                    <Popconfirm
                      disabled={item.state === '2'}
                      title={formatMessage(
                        {
                          id: 'channelOperation.channel.isConfirmDel',
                        },
                        '是否确定删除',
                      ).concat(` "${item.channelName}" `)}
                      okText={formatMessage(
                        {
                          id: 'channelOperation.channel.confirm',
                        },
                        '确定',
                      )}
                      cancelText={formatMessage(
                        {
                          id: 'channelOperation.channel.cancel',
                        },
                        '取消',
                      )}
                      onConfirm={() => handleDeleteChannel(item.channelId)}
                    >
                      <a className={[item.state === '2' ? style.operationDisabled : '']}>
                        {formatMessage(
                          {
                            id: 'channelOperation.channel.delete',
                          },
                          '删除',
                        )}
                      </a>
                    </Popconfirm>
                  </Col>
                </Row>
                {currentShowOperationOfChannel === item.channelId ? (
                  <Row>
                    <Col span={24}>
                      <OperationList channelItem={item} />
                    </Col>
                  </Row>
                ) : null}
              </Col>
            </List.Item>
          )} 
        /> */}

        <Table
          rowKey="channelId"
          dataSource={dataSource}
          columns={columns}
          pagination={Object.assign(
            {
              showSizeChanger: true,
              showQuickJumper: true,
              onChange: (page, size) => {
                getChannelListData({
                  pageInfo: {
                    pageNum: page,
                    pageSize: size,
                  },
                });
              },
            },
            pagination,
          )}
          loading={
            isLoading.effects['channelList/getDataSourceEffect'] ||
            isLoading.effects['channelList/getChannelItemDetailsEffect'] ||
            isLoading.effects['channelList/handleDeleteChannelEffect']
          }
          className="mt16"
        />
      </Card>
    </div>
  );
}

export default ChannelListUI;
