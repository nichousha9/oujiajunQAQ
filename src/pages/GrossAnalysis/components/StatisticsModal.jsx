import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { Modal, Table, Button, Tooltip } from 'antd';
import style from '../index.less';

const { Column } = Table;

@connect(({ campaignMonitor, loading }) => ({
  isShowStatistics: campaignMonitor.isShowStatistics,
  statisticsListData: campaignMonitor.statisticsListData,
  statisticsPageInfo: campaignMonitor.statisticsPageInfo,
  loading: loading.effects['campaignMonitor/getStatisticsListEffect'],
}))
class StatisticsModal extends Component {
  componentDidMount() {
    // 获取数据
    this.getStatisticsList();
  }

  componentWillUnmount() {
    // 初始化 models 返回数量相关数据
    this.initStatisticsState();
  }

  // 处理隐藏返回数量统计模态框
  showStatistics = record => {
    const { dispatch } = this.props;

    dispatch({
      type: 'campaignMonitor/showStatistics',
      payload: record,
    });
  };

  // 获取返回数量表格数据
  getStatisticsList = params => {
    const { dispatch, statisticsPageInfo, isShowStatistics = {} } = this.props;
    const { pageNum, pageSize } = statisticsPageInfo || {};

    // 默认参数
    const defaultParams = {
      contactId: isShowStatistics.contactId,
      pageInfo: {
        pageNum,
        pageSize,
      },
    };
    dispatch({
      type: 'campaignMonitor/getStatisticsListEffect',
      payload: { ...defaultParams, ...params },
    });
  };

  // 改变页码
  changePageInfo = (page, size) => {
    this.getStatisticsList({
      pageInfo: {
        pageNum: page,
        pageSize: size,
      },
    });
  };

  // 初始化 models 返回数量相关 state 数据
  initStatisticsState() {
    const { dispatch } = this.props;

    dispatch({
      type: 'campaignMonitor/initStatisticsState',
    });
  }

  render() {
    const { statisticsListData, statisticsPageInfo, isShowStatistics, loading } = this.props;
    const { pageNum, pageSize, total } = statisticsPageInfo || {};
    return (
      <Modal
        className={style.statisticsModal}
        width={920}
        title={formatMessage({ id: 'campaignMonitor.recommendResult' }, '推荐结果')}
        visible={!!isShowStatistics}
        onCancel={() => {
          this.showStatistics(false);
        }}
        footer={
          <Button
            onClick={() => {
              this.showStatistics(false);
            }}
            size="small"
          >
            {formatMessage({ id: 'campaignMonitor.cancel' }, '取消')}
          </Button>
        }
      >
        <Table
          rowKey={record => record.id}
          loading={loading}
          dataSource={statisticsListData}
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
            title={formatMessage({ id: 'campaignMonitor.subRuleName' }, '子规则名称')}
            dataIndex="rulesName"
            key="rulesName"
            render={text => (
              <div className="tableCol">
                <Tooltip placement="topLeft" title={text}>
                  {text}
                </Tooltip>
              </div>
            )}
          />
          <Column
            title={formatMessage({ id: 'campaignMonitor.goodID' }, '商品ID')}
            dataIndex="zsmartOfferCode"
            key="zsmartOfferCode"
            render={text => (
              <div className="tableCol">
                <Tooltip placement="topLeft" title={text}>
                  {text}
                </Tooltip>
              </div>
            )}
          />
          <Column
            title={formatMessage({ id: 'campaignMonitor.goodName' }, '商品名称')}
            dataIndex="offerName"
            key="offerName"
            render={text => (
              <div className="tableCol">
                <Tooltip placement="topLeft" title={text}>
                  {text}
                </Tooltip>
              </div>
            )}
          />
          <Column
            title={formatMessage({ id: 'campaignMonitor.time' }, '时间')}
            dataIndex="sendingDate"
            key="sendingDate"
            render={text => (
              <div className="tableCol">
                <Tooltip placement="topLeft" title={text}>
                  {text}
                </Tooltip>
              </div>
            )}
          />
        </Table>
      </Modal>
    );
  }
}

export default StatisticsModal;
