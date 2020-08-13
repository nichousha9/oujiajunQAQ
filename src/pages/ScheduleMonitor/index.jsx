import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import moment from 'moment';
import { Card, Input, Table, Tabs, Radio, message } from 'antd';
import AdvancedFilterForm from './components/AdvancedFilterForm';

import styles from './index.less';

const { TabPane } = Tabs;

@connect(({ scheduleMonitor, loading }) => ({
  filterCondition: scheduleMonitor.filterCondition,
  scheduleList: scheduleMonitor.scheduleList,
  scheduleDetailList: scheduleMonitor.scheduleDetailList,
  pageInfo: scheduleMonitor.pageInfo,
  scheduleDetailPageInfo: scheduleMonitor.scheduleDetailPageInfo,
  scheduleListLoading: loading.effects['scheduleMonitor/getScheduleListEffect'],
  allScheduleDetailListLoading: loading.effects['scheduleMonitor/getAllScheduleDetailListEffect'],
  runningScheduleDetailListLoading:
    loading.effects['scheduleMonitor/getAlreadyRunningScheduleDetailListEffect'],
  waitingScheduleDetailListLoading:
    loading.effects['scheduleMonitor/getWaitingScheduleDetailListEffect'],
  delTimingInstanceLoading: loading.effects['scheduleMonitor/delTimingInstance'],
}))
class ScheduleMonitor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      advancedFilterVisible: false,
      type: 'A',
      timingId: 0,
    };
  }

  componentDidMount() {
    this.getScheduleList();
  }

  toggleAdvancedFilter = () => {
    this.setState(preState => ({ advancedFilterVisible: !preState.advancedFilterVisible }));
  };

  handleSearch = extName => {
    const { dispatch, pageInfo } = this.props;
    let advanceFilterFieldValue = {};
    if (this.formRef) {
      const fieldValue = this.formRef.getFieldValues();
      advanceFilterFieldValue = { ...fieldValue };
    }
    dispatch({
      type: 'scheduleMonitor/getFilterCondition',
      payload: { extName, ...advanceFilterFieldValue },
    });

    dispatch({
      type: 'scheduleMonitor/getPageInfo',
      payload: { ...pageInfo, pageNum: 1 },
    });

    this.getScheduleList();
  };

  onRowClick = record => {
    // this.getTimingId(record.id);
    const { dispatch, scheduleDetailPageInfo } = this.props;

    dispatch({
      type: 'scheduleMonitor/getScheduleDetailPageInfo',
      payload: { ...scheduleDetailPageInfo, pageNum: 1 },
    });

    this.setState(
      {
        timingId: record.id,
      },
      () => {
        this.getScheduleDetailList();
      },
    );
  };

  onRow = record => {
    return {
      onClick: () => {
        this.onRowClick(record);
      },
    };
  };

  handleTableChange = (pageNum, pageSize) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'scheduleMonitor/getPageInfo',
      payload: { pageNum, pageSize },
    });

    this.getScheduleList();
  };

  handleRadioChange = async event => {
    const { dispatch, scheduleDetailPageInfo } = this.props;
    await dispatch({
      type: 'scheduleMonitor/getScheduleDetailPageInfo',
      payload: { ...scheduleDetailPageInfo, pageNum: 1 },
    });
    this.setState(
      {
        type: event.target.value,
      },
      () => {
        this.getScheduleDetailList();
      },
    );
  };

  handleDetailTableChange = (pageNum, pageSize) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'scheduleMonitor/getScheduleDetailPageInfo',
      payload: { pageNum, pageSize },
    });

    this.getScheduleDetailList();
  };

  // 获取定时任务
  getScheduleList = () => {
    const { dispatch, scheduleDetailPageInfo } = this.props;

    dispatch({
      type: 'scheduleMonitor/getScheduleDetailPageInfo',
      payload: { ...scheduleDetailPageInfo, pageNum: 1 },
    });

    dispatch({
      type: 'scheduleMonitor/getScheduleListEffect',
    }).then(() => {
      const { scheduleList } = this.props;
      if (scheduleList && scheduleList.length) {
        // console.log('id', scheduleList[0].id);
        this.setState(
          {
            timingId: scheduleList[0].id,
          },
          () => {
            this.getScheduleDetailList();
          },
        );
      }
    });
  };

  // getTimingId = timingId => {
  //  if(timingId) {
  //   const { dispatch } = this.props;

  //   dispatch({
  //     type: 'scheduleMonitor/getSelectedTimingId',
  //     payload: timingId
  //   });
  //  }
  // }

  // 获取详情
  getScheduleDetailList = () => {
    const { type, timingId } = this.state;
    // console.log(timingId);
    const { dispatch } = this.props;
    if (type === 'A') {
      dispatch({
        type: 'scheduleMonitor/getAllScheduleDetailListEffect',
        payload: timingId,
      });
    } else if (type === 'R') {
      dispatch({
        type: 'scheduleMonitor/getAlreadyRunningScheduleDetailListEffect',
        payload: timingId,
      });
    } else {
      dispatch({
        type: 'scheduleMonitor/getWaitingScheduleDetailListEffect',
        payload: timingId,
      });
    }
  };

  deleteTimingInstance = record => {
    const { dispatch } = this.props;
    const { timingId, dateId, timeId } = record;
    dispatch({
      type: 'scheduleMonitor/delTimingInstance',
      payload: { timingId, dateId, timeId },
    }).then(res => {
      if (res && res.topCont) {
        if (res.topCont.resultCode === 0) {
          this.getScheduleDetailList();
        }
        if (res.topCont.resultCode === -1) {
          message.error(res.topCont.remark);
        }
      }
    });
  };

  onInputChange = e => {
    const extName = e.target.value;
    const { dispatch } = this.props;
    dispatch({
      type: 'scheduleMonitor/getFilterCondition',
      payload: { extName },
    });
  };

  advancedForm = form => {
    this.formRef = form;
  };

  formatTime = time => {
    let res = time;
    if (time < 10) {
      res = `0${time}`;
    }
    return res;
  };

  render() {
    const { advancedFilterVisible, type } = this.state;
    const {
      scheduleList,
      scheduleDetailList,
      pageInfo,
      scheduleDetailPageInfo,
      scheduleListLoading,
      allScheduleDetailListLoading,
      runningScheduleDetailListLoading,
      waitingScheduleDetailListLoading,
      delTimingInstanceLoading,
    } = this.props;

    const { pageNum, pageSize, total } = pageInfo || {};

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: pageNum,
      total,
      pageSize,
      pageSizeOptions: ['5', '10', '20', '30', '40'],
      onChange: (page, size) => this.handleTableChange(page, size),
      onShowSizeChange: (current, size) => this.handleTableChange(current, size),
    };

    const columns = [
      {
        title: formatMessage({ id: 'scheduleMonitor.timingName' }, 'Timing名称'),
        dataIndex: 'timing_name',
        align: 'center',
        width: 150,
        render: text => text || '--',
      },
      {
        title: formatMessage({ id: 'scheduleMonitor.createdBy' }, '创建人'),
        dataIndex: 'createby',
        align: 'center',
        render: text => text || '--',
      },
      {
        title: formatMessage({ id: 'scheduleMonitor.lastRunDate' }, '最后运行日期'),
        dataIndex: 'last_rundate',
        align: 'center',
        width: 159,
        render: text => text || '--',
      },
      {
        title: formatMessage({ id: 'scheduleMonitor.timingObject' }, 'Timing对象'),
        dataIndex: 'timing_object',
        align: 'center',
        width: 150,
        render: text => text || '--',
      },
      {
        title: formatMessage({ id: 'scheduleMonitor.objectName' }, '对象名称'),
        dataIndex: 'object_name',
        align: 'center',
        render: text => text || '--',
      },
      {
        title: formatMessage({ id: 'scheduleMonitor.extName' }, '营销活动名称'),
        dataIndex: 'ext_name',
        align: 'center',
        render: text => text || '--',
      },
      {
        title: formatMessage({ id: 'scheduleMonitor.timingMethodName' }, '定时方法'),
        dataIndex: 'timing_method_name',
        align: 'center',
        width: 100,
        render: text => text || '--',
      },
      {
        title: formatMessage({ id: 'scheduleMonitor.cycleStartDate' }, '周期开始时间'),
        dataIndex: 'cycle_start_date',
        align: 'center',
        width: 159,
        render: text => text || '--',
      },
      {
        title: formatMessage({ id: 'scheduleMonitor.cycleEndDate' }, '周期结束时间'),
        dataIndex: 'cycle_end_date',
        align: 'center',
        width: 159,
        render: text => text || '--',
      },
      {
        title: formatMessage({ id: 'scheduleMonitor.cycleTypeName' }, '周期类型名称'),
        dataIndex: 'cycle_type_name',
        align: 'center',
        render: text => text || '--',
      },
      {
        title: formatMessage({ id: 'scheduleMonitor.time' }, '时刻'),
        dataIndex: 'time',
        align: 'center',
        render: (text, record) => {
          if (record.hour && record.minute) {
            return (
              <span>
                {this.formatTime(record.hour)}:{this.formatTime(record.minute)}
              </span>
            );
          }
          return '--';
        },
      },
    ];

    const detailColumns = [
      {
        title: formatMessage({ id: 'scheduleMonitor.runTime' }, '运行时间'),
        dataIndex: 'RUN_TIME',
        render: (text, record) => {
          const { DATEID, TIMEID } = record;
          if (DATEID && TIMEID) {
            const runTime = String(DATEID) + String(TIMEID);
            return moment(runTime, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm');
          }
          return '';
        },
      },
      {
        title: formatMessage({ id: 'scheduleMonitor.state' }, '状态'),
        dataIndex: 'RUN_STATE_NAME',
      },
      {
        title: formatMessage({ id: 'scheduleMonitor.startTime' }, '开始时间'),
        dataIndex: 'START_DATE',
      },
      {
        title: formatMessage({ id: 'scheduleMonitor.endTime' }, '结束时间'),
        dataIndex: 'END_DATE',
      },
      {
        title: formatMessage({ id: 'scheduleMonitor.retryTimes' }, '重试次数'),
        dataIndex: 'RETRY_TIMES',
      },
      {
        title: formatMessage({ id: 'scheduleMonitor.actions' }, '操作'),
        dataIndex: 'actions',
        render: (text, record) => {
          return (
            <a
              onClick={() => {
                this.deleteTimingInstance(record);
              }}
            >
              {formatMessage(
                {
                  id: 'component.searchTree.delete',
                },
                '删除',
              )}
            </a>
          );
        },
      },
    ];

    const radioOptions = [
      {
        label: '所有运行',
        value: 'A',
      },
      {
        label: '已经运行',
        value: 'R',
      },
      {
        label: '等待运行',
        value: 'W',
      },
    ];

    const detailPaginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: scheduleDetailPageInfo.pageNum,
      pageSize: scheduleDetailPageInfo.pageSize,
      total: scheduleDetailPageInfo.total,
      onChange: (page, size) => this.handleDetailTableChange(page, size),
      onShowSizeChange: (current, size) => this.handleDetailTableChange(current, size),
    };

    return (
      <div>
        <Card
          size="small"
          title={formatMessage(
            {
              id: 'scheduleMonitor.title',
            },
            '定时任务',
          )}
          extra={
            <div className={styles.advancedFilterBlock}>
              <Input.Search
                size="small"
                allowClear
                placeholder={formatMessage(
                  {
                    id: 'scheduleMonitor.campaign',
                  },
                  '营销活动名称',
                )}
                onSearch={val => {
                  this.handleSearch(val);
                }}
                onChange={this.onInputChange}
              />
              {/* <Button size="small" type="link" onClick={this.toggleAdvancedFilter}>
                {formatMessage(
                  {
                    id: 'common.btn.AdvancedFilter',
                  },
                  '高级筛选',
                )}
                <Icon type={advancedFilterVisible ? 'up' : 'down'} />
              </Button> */}
            </div>
          }
        >
          {advancedFilterVisible ? (
            <AdvancedFilterForm
              getScheduleList={this.getScheduleList}
              wrappedComponentRef={this.advancedForm}
            />
          ) : null}
          <Table
            rowKey={record => record.id}
            onRow={this.onRow}
            columns={columns}
            dataSource={scheduleList}
            pagination={paginationProps}
            scroll={{ x: 1600 }}
            loading={scheduleListLoading}
            rowClassName={styles.scheduleTableRow}
          />
          <Tabs type="card" className={styles.scheduleDetailTab}>
            <TabPane tab={formatMessage({ id: 'scheduleMonitor.detail' }, '详情')} key="detail">
              <Radio.Group
                className={styles.scheduleRadioGroup}
                defaultValue="A"
                onChange={this.handleRadioChange}
                options={radioOptions}
                type={type}
              />
              <Table
                rowKey={record => record.id}
                columns={detailColumns}
                dataSource={scheduleDetailList}
                pagination={detailPaginationProps}
                loading={
                  allScheduleDetailListLoading ||
                  runningScheduleDetailListLoading ||
                  waitingScheduleDetailListLoading ||
                  delTimingInstanceLoading
                }
              />
            </TabPane>
          </Tabs>
        </Card>
      </div>
    );
  }
}

export default ScheduleMonitor;
