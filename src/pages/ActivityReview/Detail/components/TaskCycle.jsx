import React, { Component, Fragment } from 'react';
import { Row, Col, Card, Spin, Empty } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import styles from '../index.less';

@connect(({ common, activityReview, activityFlowSchedule, loading }) => ({
  activityFlowSchedule,
  CYCLE_TYPE: common.attrSpecCodeList.CYCLE_TYPE,
  formData: activityReview.formData,
  spinning: loading.global,
}))
class TaskCycle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cycleInfo: [], // 任务执行周期
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  // 获取数据
  fetchData = () => {
    const { formData } = this.props;
    // 如果存在formData.taskOrderId数据
    if (formData.taskOrderId) {
      // 获取全局配置定时任务数据
      // this.getFlowchartData();
      // 获取schedule节点定时任务数据
      this.getScheduleData();
    }
  };

  // 获取Schedule节点配置的周期id和开始结束时间
  getScheduleData = () => {
    const { dispatch, formData } = this.props;
    dispatch({
      type: 'activityReview/qryProcessTimingByCampaignId',
      payload: {
        campaignId: formData.taskOrderId,
      },
      success: async ({ data }) => {
        if (data && data.length) {
          for (let i = 0; i < data.length; i += 1) {
            const { id } = data[i];
            this.qryFlowTiming(id);
          }
        }
      },
    });
  };

  // 获取配置的全局周期
  getFlowchartData = () => {
    const { dispatch, formData } = this.props;
    dispatch({
      type: 'activityFlow/qryFlowChartByCampaignId',
      payload: {
        CAMPAIGN_ID: formData.taskOrderId,
      },
    }).then(({ svcCont }) => {
      if (!svcCont || !svcCont.data.length) return;
      const { id } = svcCont.data[0];
      dispatch({
        type: 'activityFlowSchedule/qryTimingByObjectId',
        payload: {
          ID: id,
          TIMING_OBJECT: 'FLOWCHART',
        },
        success: async ({ data = [] }) => {
          if (!data.length) return;
          const timingId = data[0].id;
          this.qryFlowTiming(timingId);
        },
      });
    });
  };

  // 查询任务执行类型，以及周期开始和结束时间
  qryFlowTiming = timingId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activityFlowSchedule/qryTiming',
      payload: { id: timingId },
      success: async svcCont => {
        const { data = {} } = svcCont;
        const { cycleStartDate = '', cycleEndDate = '', timingMethod, scheduleTime = '' } = data;
        const { cycleInfo } = this.state;
        // 如果存在scheduleTime表明是南基schedule节点定时任务
        if (scheduleTime) {
          cycleInfo.push({
            cycleStartDate,
            cycleEndDate,
            listData: [this.formatTime(data)],
            runTime: [],
          });
        }
        // 如果是列表类型
        if (timingMethod === 'L') {
          const runTime = await this.qryTimeListByTimingId(timingId);
          cycleInfo.push({ cycleStartDate, cycleEndDate, listData: [], runTime });
          this.setState({
            cycleInfo,
          });
        } else {
          const listData = await this.qryTimingCycleList(timingId);
          cycleInfo.push({ cycleStartDate, cycleEndDate, listData, runTime: [] });
          this.setState({
            cycleInfo,
          });
        }
      },
    });
  };

  // 查询按次运行时间
  qryTimeListByTimingId = timingId => {
    const { dispatch } = this.props;
    return new Promise(resolve => {
      dispatch({
        type: 'activityFlowSchedule/qryTimeListByTimingId',
        payload: { id: timingId },
        success: svcCont => {
          const { data = [] } = svcCont;
          resolve(data);
        },
      });
    });
  };

  // 查询周期时刻
  qryTimingCycleList = timingId => {
    return new Promise(resolve => {
      const { dispatch } = this.props;
      dispatch({
        type: 'activityFlowSchedule/qryTimingCycleList',
        payload: {
          timingId,
        },
        success: ({ data: data1 }) => {
          const listData = data1.map(item => this.formatTime(item));
          resolve(listData);
        },
      });
    });
  };

  // 格式化时刻
  formatTime = time => {
    const { CYCLE_TYPE } = this.props;
    if (time.hour && time.minute && time.cycleType) {
      return {
        type: CYCLE_TYPE[time.cycleType - 1].attrValueName,
        time: `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`,
      };
    }
    return '';
  };

  // 渲染时刻周期列表
  renderCycleList = ({ cycleStartDate, cycleEndDate, listData, runTime }, key) => {
    const rowColLayout = {
      md: { span: 12 },
      sm: { span: 24 },
      xs: { span: 24 },
    };
    return (
      <Fragment key={`_${key}`}>
        {cycleStartDate ? (
          <Col {...rowColLayout}>
            <span className={styles.label}>开始时间：</span>
            <span>{moment(cycleStartDate).format('YYYY-MM-DD')}</span>
          </Col>
        ) : null}
        {cycleEndDate ? (
          <Col {...rowColLayout}>
            <span className={styles.label}>结束时间：</span>
            <span>{moment(cycleEndDate).format('YYYY-mm-DD')}</span>
          </Col>
        ) : null}
        {listData && listData.length
          ? listData.map((item, index) => {
              return (
                <Fragment key={`0_${index}`}>
                  <Col {...rowColLayout}>
                    <span className={styles.label}>周期类型：</span>
                    <span>{item.type}</span>
                  </Col>
                  <Col {...rowColLayout}>
                    <span className={styles.label}>时刻：</span>
                    <span>{item.time}</span>
                  </Col>
                </Fragment>
              );
            })
          : null}
        {runTime && runTime.length
          ? runTime.map((item, index) => {
              return (
                <Fragment key={`1_${index}`}>
                  <Col xm={{ span: 24 }} sm={{ span: 24 }} key={`_${key}`}>
                    <span className={styles.label}>运行时间：</span>
                    <span>{moment(item.runTime).format('YYYY-MM-DD HH:mm')}</span>
                  </Col>
                </Fragment>
              );
            })
          : null}
      </Fragment>
    );
  };

  render() {
    const { spinning } = this.props;
    const { cycleInfo } = this.state;

    return (
      <Card title="任务审核周期" bordered={false}>
        <Spin spinning={!!spinning}>
          <Row className={styles.cycleContainer}>
            {cycleInfo.length ? (
              cycleInfo.map((item, index) => this.renderCycleList(item, index))
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Row>
        </Spin>
      </Card>
    );
  }
}

export default TaskCycle;
