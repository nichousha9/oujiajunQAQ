import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { Card, Input, Icon, Table, Tooltip } from 'antd';
import AdvancedSearch from './AdvancedSearch';
import style from '../index.less';

const { Column } = Table;

@connect(({ campaignMonitor, loading }) => ({
  monitorListData: campaignMonitor.monitorListData,
  pageInfo: campaignMonitor.pageInfo,
  advancedSearchVisibility: campaignMonitor.advancedSearchVisibility,
  monitorListSearchVal: campaignMonitor.monitorListSearchVal,
  advancedSearchData: campaignMonitor.advancedSearchData,
  monitorListLoading: loading.effects['campaignMonitor/getMonitorListEffect'],
}))
class MonitorList extends Component {
  componentDidMount() {
    // 获取商品推荐监控表格数据
    this.getMonitorList();
  }

  // 获取商品推荐监控表格数据
  getMonitorList = params => {
    const { dispatch, pageInfo, advancedSearchData = {}, monitorListSearchVal } = this.props;
    const {
      campaignIds = [],
      rulesIds = [],
      adviceChannels = [],
      startTime = '',
      endTime = '',
      contactNumber = ''
    } = advancedSearchData;

    const { pageNum, pageSize } = pageInfo || {};

    // 默认参数
    const defaultParams = {
      pageInfo: {
        pageNum,
        pageSize,
      },
      rulesName: monitorListSearchVal,
      campaignIds,            // 活动id
      adviceChannels,         // 运营位
      rulesIds,               // 规则组Id
      startDate: startTime,   // 开始时间
      endDate: endTime,       // 结束时间
      contactNumber,          // 会员号码
    };
    dispatch({
      type: 'campaignMonitor/getMonitorListEffect',
      payload: { ...defaultParams, ...params },
    });
  };

  // 显示隐藏统计信息模态框
  showStatistics = record => {
    const { dispatch } = this.props;

    dispatch({
      type: 'campaignMonitor/showStatistics',
      payload: record,
    });
  };

  // 改变页码
  changePageInfo = (page, size) => {
    this.getMonitorList({
      pageInfo: {
        pageNum: page,
        pageSize: size,
      },
    });
  };

  // 高级搜索组件可见性
  handleAdvancedSearchVisibility = bool => {
    const { dispatch } = this.props;

    dispatch({
      type: 'campaignMonitor/handleAdvancedSearchVisibility',
      payload: bool,
    });
  };

  // 处理搜索
  handleSearchByOperation = async val => {
    const { pageInfo: { pageSize } } = this.props

    // 保存搜索值
    this.saveSearchVal(val);

    // 获取列表数据
    this.getMonitorList({
      rulesName: val,
      pageInfo: {
        pageNum: 1,
        pageSize
      }
    });
  };

  // 保存搜索值
  saveSearchVal = val => {
    const { dispatch } = this.props;

    dispatch({
      type: 'campaignMonitor/saveMonitorListSearchVal',
      payload: val,
    });
  };

  render() {
    const {
      monitorListData,
      pageInfo,
      monitorListLoading,
      advancedSearchVisibility,
      monitorListSearchVal,
    } = this.props;
    const { pageNum, pageSize, total } = pageInfo || {};
    return (
      <div className={style.monitorList}>
        <Card
          size="small"
          title={formatMessage({
            id: 'campaignMonitor.recommendMonitor'
          }, "推荐监控")}
          extra={
            <div className={style.monitoreHeaderSearch}>
              <Input.Search
                placeholder={formatMessage({
                  id: 'campaignMonitor.rulesName'
                }, "规则组名称")}
                defaultValue={monitorListSearchVal}
                size="small"
                onSearch={val => {
                  this.handleSearchByOperation(val);
                }}
              />
              <a
                onClick={() => {
                  this.handleAdvancedSearchVisibility(!advancedSearchVisibility);
                }}
              >
                <span>
                  {formatMessage({
                    id: 'campaignMonitor.advancedSearch'
                  }, "高级筛选")}
                </span>
                &nbsp;
                <Icon
                  className={[style.arrowIcon, advancedSearchVisibility ? style.arrowUp : ''].join(
                    ' ',
                  )}
                  type="down"
                />
              </a>
            </div>
          }
        >
          {advancedSearchVisibility ? (
            <AdvancedSearch getMonitorList={this.getMonitorList} />
          ) : null}
          <Table
            rowKey={record => record.contactId}
            loading={monitorListLoading}
            dataSource={monitorListData}
            pagination={{
              current: pageNum,
              pageSize,
              total,
              pageSizeOptions: ['5', '10', '20', '30', '40'],
              showQuickJumper: true,
              showSizeChanger: true,
              size: 'middle',
              onChange: this.changePageInfo,
              onShowSizeChange: this.changePageInfo,
            }}
          >
            <Column
              // width="10%"
              title={formatMessage({
                id: 'campaignMonitor.activityName'
              }, "活动名称")}
              dataIndex="campaignName"
              key="campaignName"
              render={text => (
                <div className="tableCol">
                  <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                </div>
              )}
            />
            <Column
              // width="7.07%"
              title={formatMessage({
                id: 'campaignMonitor.rulesName'
              }, "规则组名称")}
              dataIndex="groupName"
              key="groupName"
              render={text => (
                <div className="tableCol">
                  <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                </div>
              )}
            />
            <Column
              // width="7.07%"
              title={formatMessage({
                id: 'campaignMonitor.operationName'
              }, "运营位名称")}
              dataIndex="adviceChannelName"
              key="adviceChannelName"
              render={text => (
                <div className="tableCol">
                  <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                </div>
              )}
            />
            <Column
              // width="7.07%"
              title={formatMessage({
                id: 'campaignMonitor.contactNumber'
              }, "会员号码")}
              dataIndex="contactNumber"
              key="contactNumber"
              render={text => (
                <div className="tableCol">
                  <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                </div>
              )}
            />
            <Column
              // width="10.00%"
              title={formatMessage({
                id: 'campaignMonitor.requester'
              }, "请求方")}
              dataIndex="requester"
              key="requester"
              render={text => (
                <div className="tableCol">
                  <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                </div>
              )}
            />
            <Column
              // width="10.00%"
              title={formatMessage({
                id: 'campaignMonitor.requestTime'
              }, "请求时间")}
              dataIndex="sendingDate"
              key="sendingDate"
              render={text => (
                <div className="tableCol">
                  <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                </div>
              )}
            />
            <Column
              // width="5.20%"
              title={formatMessage({
                id: 'campaignMonitor.recommendResult'
              }, "推荐结果")}
              dataIndex="respCount"
              key="respCount"
              render={(text, record) => (
                <div className="tableCol">
                  <Tooltip placement="topLeft" title={text}>
                    <a
                      onClick={() => {
                        this.showStatistics(record);
                      }}
                    >
                      {text}
                    </a>
                  </Tooltip>
                </div>
              )}
            />
          </Table>
        </Card>
      </div>
    );
  }
}

export default MonitorList;
