// 日志弹窗
import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { Modal, Table } from 'antd';
import commonStyles from '../common.less';


@connect(({ loading }) => ({
  loading: loading.effects['activityFlowSchedule/addProcess'],
}))
class Log extends React.Component {
  // P 正在运行  T 待重试  S 运行成功  F 运行失败  B 运行阻塞
  states = {
    P: formatMessage({ id: 'activityConfigManage.schedule.processing' }), // '正在运行',
    T: formatMessage({ id: 'activityConfigManage.schedule.toBeTry' }), // '待重试',
    S: formatMessage({ id: 'activityConfigManage.schedule.success' }), // '运行成功',
    F: formatMessage({ id: 'activityConfigManage.schedule.failed' }), // '运行失败',
    B: formatMessage({ id: 'activityConfigManage.schedule.block' }), // '运行阻塞',
  }

  columns = [
    {
      title: formatMessage({ id: 'activityConfigManage.schedule.flowchartScheduleTime' }), // 日程时间
      dataIndex: 'dateid',
      key: 'dateid',
    },
    {
      title: formatMessage({ id: 'activityConfigManage.schedule.flowchartRetryTime' }), // 重试时间
      dataIndex: 'retryTimes',
      key: 'retryTimes',
    },
    {
      title: formatMessage({ id: 'activityConfigManage.schedule.dmState' }), // 状态
      dataIndex: 'state',
      key: 'state',
      render: (text) => this.states[text] || text
    }
  ];

  constructor(props) {
    super(props);
    this.state = {
      logList: [], // 日志列表
      pageInfo: {}, // 分页情况(后端的返回)
      pageNum: 1,
      pageSize: 5,
    };
  }

  componentDidMount() {
    this.qryRunTimeLog();
  }

  /**
   *获取日志列表
   *
   * @memberof Log
   */
  qryRunTimeLog = () => {
    const { dispatch, processType, timingId } = this.props;
    const { pageNum, pageSize } = this.state;
    dispatch({
      type: 'activityFlowSchedule/qryRunTimeLog',
      payload: {
        id: timingId,
        pageInfo: {
          pageNum,
          pageSize
        },
        PROCESS_TYPE: processType,
        status: 1
      },
      success: svcCont => {
        const { data } = svcCont;
        this.setState({
          logList: data.data,
          pageInfo: data.pageInfo,
        });
      },
    });
  };

  // 列表条件切换
  onChange = pagination => {
    const { current: pageNum, pageSize } = pagination;
    this.setState(
      {
        pageNum,
        pageSize,
      },
      this.qryRunTimeLog,
    );
  };

  render() {
    const { onCancel } = this.props;
    const {
      logList,
      pageInfo
    } = this.state;

    const pagination = {
      current: pageInfo.pageNum,
      pageSize: pageInfo.pageSize,
      total: pageInfo.total,
      showSizeChanger: true,
      showQuickJumper: true,
    };

    return (
      <Modal
        title={formatMessage({ id: 'activityConfigManage.schedule.flowchartLog' })}
        visible
        width={960}
        onOk={onCancel}
        onCancel={onCancel}
        wrapClassName={commonStyles.flowModal}
      >
        <Table
          rowKey="creativeInfoId"
          dataSource={logList}
          columns={this.columns}
          pagination={pagination}
          onChange={this.onChange}
        /> 
      </Modal>
    );
  }
}

export default Log;