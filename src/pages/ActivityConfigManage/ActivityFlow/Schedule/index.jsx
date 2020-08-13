/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/**
 * Schedule弹窗 组件
 */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import {
  Modal,
  Form,
  Radio,
  Input,
  Icon,
  InputNumber,
  DatePicker,
  TimePicker,
  Select,
  Row,
  Col,
  message,
} from 'antd';
import moment from 'moment';
import commonStyles from '../common.less';
import Log from './Log';

@connect(({ common, user, loading }) => ({
  userInfo: user.userInfo.userInfo,
  selCycleTypeList: common.attrSpecCodeList.CYCLE_TYPE,
  loading:
    loading.effects['activityFlowSchedule/addProcess'] ||
    loading.effects['activityFlowSchedule/modProcess'],
}))
@Form.create()
class ActivityFlowSchedule extends React.Component {
  formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  formItemLayoutWithOutLabel = {
    wrapperCol: { span: 18, offset: 6 },
  };

  constructor(props) {
    super(props);
    this.state = {
      // 环节信息
      processInfo: {},
      campaignEndTime: '', // 活动结束时间
      showLog: false, // 日志列表弹窗
      timingId: '',
      campaigndata: {},
      timingData: undefined,
    };
    const { nodeData = {}, activityInfo = {} } = props;
    const {
      processname: processName, // 节点名称
      PROCESS_ID: processId, // 环节id
      processType, // 环节类型
    } = nodeData;
    const {
      id: flowchartId, // 流程id
      campaignId,
      name: flowchartName, // 流程名字
      campaignState, // 活动流程状态
    } = activityInfo;
    // 用到的流程图传来的信息
    this.selectItem = {
      processName, // 节点名称
      processId, // 环节id
      processType, // 环节类型
      flowchartId: activityInfo.flowchartId, // 流程id
      flowchartName, // 流程名字
      campaignId, // 活动id
      campaignState, // 活动流程状态
    };
    this.runTimeIds = 1;
  }

  componentDidMount() {
    this.qryCamSchedulerNode();
    this.getCampaignparticulars();
    this.qryDcSqlStaticVal();
  }

  // 获取活动结束时间
  qryCamSchedulerNode = () => {
    const { dispatch } = this.props;
    const { processId } = this.selectItem;
    dispatch({
      type: 'activityFlowSchedule/qryCamSchedulerNode',
      payload: { processId },
      success: svcCont => {
        this.setState({ timingData: svcCont.data });
      },
    });
  };

  getCampaignparticulars = () => {
    const { dispatch } = this.props;
    const { campaignId } = this.selectItem;
    dispatch({
      type: 'activityFlowSchedule/getCampaignparticulars',
      payload: { id: campaignId },
      success: svcCont => {
        const { data } = svcCont;
        this.setState({ campaigndata: data });
      },
    });
  };

  // 获取周期类型数据
  qryDcSqlStaticVal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/qryAttrValueByCode',
      payload: { attrSpecCode: 'CYCLE_TYPE' },
    });
  };

  // 获取初始化数据id
  qryScheduleTimeId = () => {
    const { dispatch, scheduleType, nextNodeData } = this.props;
    const { flowchartId, processId } = this.selectItem;
    const params = { TIMING_OBJECT: scheduleType };
    // 流程定时任务
    if (scheduleType === 'FLOWCHART') {
      params.ID = flowchartId;
    } else if (scheduleType === 'PROCESS' && processId && nextNodeData && nextNodeData.length) {
      const tempArr = [];
      nextNodeData.forEach(item => {
        tempArr.push(item.PROCESS_ID);
      });
      params.OBJECT_IDS = tempArr.join(',');
    } else {
      return;
    }
    dispatch({
      type: 'activityFlowSchedule/qryTimingByObjectId',
      payload: params,
      success: svcCont => {
        if (svcCont && svcCont.data && svcCont.data.length) {
          const timingId = svcCont.data[0].id;
          this.qryScheduleInfo(timingId);
          this.setState({ timingId });
        }
      },
    });
  };

  // 获取初始化数据
  qryScheduleInfo = timimgId => {
    const { dispatch } = this.props;
    if (!timimgId) {
      return;
    }
    dispatch({
      type: 'activityFlowSchedule/qryTiming',
      payload: { id: timimgId },
      success: svcCont => {
        const { data = {} } = svcCont;
        this.setState(({ processInfo }) => ({
          processInfo: {
            ...processInfo,
            // ...data,
            runtype: data.timingMethod,
            processName: data.timingName,
            cycleStartDate: data.cycleStartDate,
            cycleEndDate: data.cycleEndDate,
            cycleType: (data.cycleType || data.cycleType === 0) && data.cycleType.toString(),
            scheduleTime: data.scheduleTime,
            retrytype: data.failedRetryFlage,
            retryTimes: data.retryTimes,
            interval: data.interval,
          },
        }));
        // 如果是列表类型
        if (data.timingMethod === 'L') {
          this.qryTimeListByTimingId(timimgId);
        }
      },
    });
  };

  // 如果是列表类型获取初始化列表运行时间数据
  qryTimeListByTimingId = timimgId => {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'activityFlowSchedule/qryTimeListByTimingId',
      payload: { id: timimgId },
      success: svcConnt => {
        const { data = [] } = svcConnt;
        const runTimes = [];
        const keys = [];
        data.forEach((item, index) => {
          runTimes.push(item.oneTime);
          keys.push(index);
        });
        this.setState(({ processInfo }) => ({
          processInfo: {
            ...processInfo,
            runTimes,
            keys,
          },
        }));
        form.setFieldsValue({
          keys,
        });
        this.runTimeIds = runTimes.length;
      },
    });
  };

  // 判断节点是否不可编辑
  getDisabledFlag = () => {
    const { campaignState } = this.selectItem;
    return campaignState !== 'Editing';
  };

  // 不可选择日期
  disabledDate = current => {
    // Can not select days before today and today
    return current && current < moment().startOf('day');
  };

  // 开始时间不可选择日期
  disabledStartDate = startValue => {
    const { form } = this.props;
    const endDate = form.getFieldValue('cycleEndDate');
    if (!startValue) {
      return false;
    }
    return (
      startValue < moment().startOf('day') || (endDate && startValue.valueOf() > endDate.valueOf())
    );
  };

  // 结束时间不可选择日期
  disabledEndDate = endValue => {
    const { form } = this.props;
    const startDate = form.getFieldValue('cycleStartDate');
    if (!endValue) {
      return false;
    }
    return (
      endValue < moment().startOf('day') || (startDate && endValue.valueOf() < startDate.valueOf())
    );
  };

  // 列表类型时运行时间
  getFormItems = () => {
    const { form } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { processInfo } = this.state;
    getFieldDecorator('keys', { initialValue: processInfo.keys || [0] });
    const keys = getFieldValue('keys');
    return keys.map((k, index) => (
      <Row gutter={24} key={k}>
        <Col span={12}>
          <Form.Item
            {...(index === 0 ? this.formItemLayout : this.formItemLayoutWithOutLabel)}
            label={
              index === 0
                ? formatMessage({ id: 'activityConfigManage.schedule.flowchartRunOnTime' })
                : ''
            }
          >
            {getFieldDecorator(`runTimes[${k}]`, {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'common.form.required' }),
                },
              ],
              initialValue:
                processInfo.runTimes &&
                processInfo.runTimes[index] &&
                moment(processInfo.runTimes[index]),
            })(<DatePicker showTime disabledDate={this.disabledDate} size="small" />)}
          </Form.Item>
        </Col>
        {/* <Col span={12} style={{ paddingTop: '5px' }}>
          {index > 0 ? (
            <Icon type="minus-circle-o" onClick={() => this.remove(k)} />
          ) : (
            <Icon type="plus-circle-o" onClick={this.add} />
          )}
        </Col> */}
      </Row>
    ));
  };

  // 减少列表类型运行时间
  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  // 增加列表类型运行时间
  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat((this.runTimeIds += 1));
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  // 打开日志列表弹窗
  showLog = () => {
    this.setState({ showLog: true });
  };

  // 关闭日志列表弹窗
  hideLog = () => {
    this.setState({ showLog: false });
  };

  /**
   *
   *提交节点
   * @memberof ActivityFlowSetting
   */
  handleSubmit = () => {
    const {
      dispatch,
      form,
      onOk,
      onCancel,
      scheduleType,
      userInfo,
      nextNodeData = {},
      nodeData = {},
    } = this.props;

    const { userId, userName } = userInfo;
    const { processId, processType, flowchartId, flowchartName } = this.selectItem;
    const { campaignEndTime, timingId, campaigndata } = this.state;

    form.validateFieldsAndScroll((err, values) => {
      const {
        processName,
        retrytype,
        retryTimes,
        interval,
        runtype,
        cycleStartDate,
        cycleEndDate,
        scheduleTime,
        cycleType,
        cycleValue,
        runTime,
      } = values;
      // let nextParams = {}; // 下个节点相关入参
      // let runTimeParams = {}; // 运行时间相关入参

      if (err) {
        return;
      }
      // 运行时间

      let onetimes = '';

      if (runtype === 'L') {
        if (runTime) {
          if (new Date(runTime) >= new Date(campaigndata.endDate)) {
            message.info(
              formatMessage({ id: 'activityConfigManage.schedule.runTimeCampaignEntdateWarn' }),
            );
            onetimes = '';

            return;
          }
          onetimes = moment(runTime).format('YYYY-MM-DD HH:mm:ss');

          // //     const timeLists = [];
          // //     let doubleFlag = false;
          // //     let lateFlag = false;
          // //     for (let i = 0; i < runTime.length; i += 1) {
          // //       const item = runTime[i];
          // //       if (item) {
          // //         const oneTime = moment(item).format('YYYY-MM-DD HH:mm:ss');
          // //         if (new Date(oneTime) >= new Date(campaignEndTime)) {
          // //           lateFlag = true;
          // //           break;
          // //         }
          // //         const tempArr = timeLists.filter(fitem => fitem.oneTime === oneTime);
          // //         if (tempArr && tempArr.length) {
          // //           doubleFlag = true;
          // //           break;
          // //         }
          // //         timeLists.push({
          // //           dateid: moment(item).format('YYYYMMDD'),
          // //           oneTime,
          // //           timeid: `${moment(item).format('HHmm')}00`,
          // //         });
          // //       }
          // //     }

          // //     runTimeParams = {
          // //       timeLists,
          // //     };

          // //     if (doubleFlag) {
          // //       // 运行时间不能相同
          // //       message.info(formatMessage({ id: 'activityConfigManage.common.runTimeWarn' }));
          // //       return;
          // //     }
          // //     if (lateFlag) {
          // //       // 定时任务结束时间不能晚于活动结束时间
          // //       message.info(
          // //         formatMessage({ id: 'activityConfigManage.schedule.runTimeCampaignEntdateWarn' }),
          // //       );
          // //       return;
          // //     }
          // //   }
          // // } else {
          // //   // 判断定时任务结束时间不能晚于活动结束时间
          // //   const endDate = moment(cycleEndDate).format('YYYY-MM-DD');
          // //   const time = moment(scheduleTime).format('HH:mm:ss');
          // //   if (new Date(`${endDate} ${time}`) >= new Date(campaignEndTime)) {
          // //     message.info(
          // //       formatMessage({ id: 'activityConfigManage.schedule.runTimeCampaignEntdateWarn' }),
          // //     );
          // //     return;
          // //   }
          // //   runTimeParams = {
          // //     START_DATE: moment(cycleStartDate).format('YYYY-MM-DD'),
          // //     END_DATE: moment(cycleEndDate).format('YYYY-MM-DD'),
          // //     CYCLE_HOUR: moment(scheduleTime).format('HH'),
          // //     CYCLE_MINUTE: moment(scheduleTime).format('mm'),
          // //     CYCLE_TYPE: cycleType,
          // //     timingDateList: [
          // //       {
          // //         cycleType,
          // //         hour: moment(scheduleTime).format('HH'),
          // //         minute: moment(scheduleTime).format('mm'),
          // //       },
          // //     ],
        }
      }

      const creationTime = new Date();

      const params = {
        // USER_ID: userId,
        // USER_NAME: userName,
        processId,
        // PROCESS_TYPE: processType,
        flowchartId,
        // FLOWCHART_NAME: flowchartName,
        timingMethod: runtype,
        oneTime: runtype === 'L' ? onetimes : '',
        cycleValue,
        cycleType,
        cycleTime: runtype === 'L' ? '' : moment(scheduleTime).format('HH:mm:ss'),
        cycleStartDate: campaigndata.startDate,
        cycleEndDate: campaigndata.endDate,
        // PROCESS_NAME: processName,
        // TIMING_METHOD: runtype,
        // RETRY: retrytype,
        // ...(retrytype === 'Y'
        //   ? {
        //       RETRYTIMES: retryTimes, // 重试次数
        //       INTERVAL: interval, // 重试间隔
        //     }
        //   : {}),
        // ...runTimeParams,

        createDate: moment(creationTime).format('YYYY-MM-DD HH:mm:ss'),
      };
      dispatch({
        type: 'activityFlowSchedule/updateCamSchedulerNode',
        payload: params,
        success: svcCont => {
          const { data = {} } = svcCont;

          const newNodeData = {
            ...nodeData,
            ...data,
            PROCESS_ID: data.processId,
            // processname: processName,
          };
          newNodeData.NODE_STATE = 2;

          onOk(newNodeData);

          onCancel();
        },
      });
    });
  };

  render() {
    // nodeData是节点数据，prevNodeData上一个节点数据（有些弹窗有用到），activityInfo是流程数据
    const { loading, form, onCancel, scheduleType, selCycleTypeList } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { processInfo, showLog, timingId, campaigndata, timingData } = this.state;
    console.log(timingData);
    const { processType } = this.selectItem;
    return (
      <Fragment>
        {showLog ? (
          <Log processType={processType} timingId={timingId} onCancel={this.hideLog} />
        ) : null}
        <Modal
          title="定时任务"
          width={960}
          visible
          onOk={this.handleSubmit}
          onCancel={onCancel}
          okText={formatMessage({ id: 'common.btn.submit' })}
          cancelText={formatMessage({ id: 'common.btn.back' })}
          wrapClassName={commonStyles.flowModal}
          confirmLoading={loading}
          okButtonProps={{ disabled: this.getDisabledFlag() }}
        >
          <Form {...this.formItemLayout}>
            {/* 运行类型 */}
            <div className={commonStyles.block}>
              <p className={commonStyles.title}>
                {formatMessage({ id: 'activityConfigManage.schedule.flowchartRunType' })}
              </p>
              <Row gutter={24}>
                <Col span={12}>
                  {/* 运行类型 */}
                  <Form.Item
                    label={formatMessage({ id: 'activityConfigManage.schedule.flowchartRunType' })}
                  >
                    {getFieldDecorator('runtype', {
                      rules: [
                        {
                          required: true,
                          message: formatMessage({ id: 'common.form.required' }),
                        },
                      ],
                      initialValue:
                        timingData !== undefined && timingData.timingMethod !== null
                          ? timingData.timingMethod
                          : 'L',
                    })(
                      <Radio.Group>
                        {/* 列表 */}
                        <Radio value="L">单次运行</Radio>
                        {/* 周期 */}
                        <Radio value="C">周期执行</Radio>
                      </Radio.Group>,
                    )}
                  </Form.Item>
                </Col>
                {/* <Col>
                  <Button size='small' icon="unordered-list" onClick={this.showLog} style={{marginTop: '2px'}}>{formatMessage({ id: 'activityConfigManage.schedule.flowchartLog' })}</Button>
                </Col> */}
              </Row>
            </div>
            {/* 详细信息 */}
            <div className={commonStyles.block}>
              <p className={commonStyles.title}>
                {formatMessage({ id: 'activityConfigManage.schedule.detailInfo' })}
              </p>
              {/* <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    label={
                      scheduleType === 'FLOWCHART'
                        ? formatMessage({ id: 'activityConfigManage.schedule.flowchartTimingName' })
                        : formatMessage({
                            id: 'activityConfigManage.schedule.flowchartProcessName',
                          })
                    }
                  >
                    {getFieldDecorator('processName', {
                      rules: [
                        {
                          required: true,
                          message: formatMessage({ id: 'common.form.required' }),
                        },
                      ],
                      initialValue: processInfo.processName || 'Scheduler',
                    })(<Input size="small" />)}
                  </Form.Item>
                </Col>
              </Row> */}
              {getFieldValue('runtype') === 'L' ? (
                // this.getFormItems()
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item label="运行时间" {...this.formItemLayout}>
                      {getFieldDecorator('runTime', {
                        rules: [
                          {
                            type: 'object',
                            required: true,
                            message: formatMessage({ id: 'common.form.required' }),
                          },
                        ],
                        initialValue:
                          timingData !== undefined
                            ? timingData.oneTime &&
                              moment(timingData.oneTime, 'YYYY-MM-DD HH:mm:ss')
                            : '',
                      })(
                        <DatePicker
                          disabledDate={this.disabledEndDate}
                          size="small"
                          showTime
                          format="YYYY-MM-DD HH:mm:ss"
                        />,
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              ) : (
                // 运行类型为周期
                <Row gutter={24}>
                  <Col span={12}>
                    {/* 周期类型 */}
                    <Form.Item
                      label={formatMessage({
                        id: 'activityConfigManage.schedule.flowchartScheduleRunOn',
                      })}
                    >
                      {getFieldDecorator('cycleType', {
                        rules: [
                          {
                            required: true,
                            message: formatMessage({ id: 'common.form.required' }),
                          },
                        ],
                        initialValue:
                          timingData !== undefined && timingData.cycleType !== null
                            ? timingData.cycleType
                            : '1',
                      })(
                        <Select size="small">
                          {selCycleTypeList &&
                            selCycleTypeList.map(item => (
                              <Select.Option key={item.attrValueCode} value={item.attrValueCode}>
                                {item.attrValueName}
                              </Select.Option>
                            ))}
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>

                  {getFieldValue('cycleType') === '1' ? null : (
                    <Col span={12}>
                      <Form.Item label="周期值">
                        {getFieldDecorator('cycleValue', {
                          rules: [
                            {
                              required: true,
                              message:
                                getFieldValue('cycleType') === '2'
                                  ? '请输入周一 - 周七'
                                  : '请输入1号-31号',
                            },
                          ],
                          initialValue: timingData !== undefined ? timingData.cycleValue : '',
                        })(
                          <InputNumber
                            min={1}
                            max={getFieldValue('cycleType') === '2' ? 7 : 31}
                            formatter={value =>
                              getFieldValue('cycleType') === '2' ? `周 ${value}` : `${value} 号`
                            }
                            // parser={value =>
                            //   getFieldValue('cycleType') === '5' ? value : value.replace('号', '')
                            // }
                            size="small"
                          />,
                        )}
                      </Form.Item>
                    </Col>
                  )}

                  <Col span={12}>
                    {/* 时刻 */}
                    <Form.Item label={formatMessage({ id: 'activityConfigManage.schedule.time' })}>
                      {getFieldDecorator('scheduleTime', {
                        rules: [
                          {
                            type: 'object',
                            required: true,
                            message: formatMessage({ id: 'common.form.required' }),
                          },
                        ],
                        initialValue:
                          timingData !== undefined
                            ? timingData.cycleTime && moment(timingData.cycleTime, 'HH:mm:ss')
                            : '',
                      })(<TimePicker size="small" />)}
                    </Form.Item>
                  </Col>
                </Row>
              )}
              {/* <Row gutter={24}>
                <Col span={12}>
                  {/* 失败重试 
                  <Form.Item
                    label={formatMessage({
                      id: 'activityConfigManage.schedule.flowchartRetryIfFalied',
                    })}
                  >
                    {getFieldDecorator('retrytype', {
                      rules: [
                        {
                          required: true,
                          message: formatMessage({ id: 'common.form.required' }),
                        },
                      ],
                      initialValue: processInfo.retrytype || 'N',
                    })(
                      <Radio.Group>
                        <Radio value="Y">{formatMessage({ id: 'common.text.yes' })}</Radio>
                        <Radio value="N">{formatMessage({ id: 'common.text.no' })}</Radio>
                      </Radio.Group>,
                    )}
                  </Form.Item>
                </Col>
              </Row> */}
              {getFieldValue('retrytype') === 'Y' ? (
                // 失败重试为是
                <Row gutter={24}>
                  <Col span={12}>
                    {/* 重试次数 */}
                    <Form.Item
                      label={formatMessage({
                        id: 'activityConfigManage.schedule.flowchartTetryTimes',
                      })}
                    >
                      {getFieldDecorator('retryTimes', {
                        rules: [
                          {
                            required: true,
                            message: formatMessage({ id: 'common.form.required' }),
                          },
                        ],
                        initialValue: processInfo.retryTimes,
                      })(<InputNumber min={0} precision={0} size="small" />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    {/* 重试间隔 */}
                    <Form.Item
                      className={commonStyles.interval}
                      wrapperCol={{ span: 18 }}
                      label={formatMessage({
                        id: 'activityConfigManage.schedule.flowchartInterval',
                      })}
                    >
                      {getFieldDecorator('interval', {
                        rules: [
                          {
                            required: true,
                            message: formatMessage({ id: 'common.form.required' }),
                          },
                        ],
                        initialValue: processInfo.interval,
                      })(<InputNumber min={0} precision={0} size="small" />)}
                    </Form.Item>
                    <span>
                      {formatMessage({ id: 'activityConfigManage.schedule.minute' }, '分钟')}
                    </span>
                  </Col>
                </Row>
              ) : null}
            </div>
          </Form>
        </Modal>
      </Fragment>
    );
  }
}

export default ActivityFlowSchedule;
