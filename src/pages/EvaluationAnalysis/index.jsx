// /* eslint-disable no-fallthrough */

/* eslint-disable no-unused-vars */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Collapse,
  Select,
  Input,
  Badge,
  Pagination,
  Spin,
  Empty,
  Button,
  message,
  Table,
} from 'antd';
import classNames from 'classnames';
import Link from 'umi/link';
import router from 'umi/router';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './index.less';
import CommonFilter from '@/components/CommonFilter';
import WorkOrderList from './WorkOrderList';
import Ellipsis from '@/components/Ellipsis';
// import AddIndicatorList from '../AddIndicatorList/index';
import Iconfont from '@/components/Iconfont/index';
const { Option } = Select;

@connect(({ EvaluationAnalysis, common, loading }) => ({
  EvaluationAnalysis,
  stateType: common.attrSpecCodeList.CAMPAIGN_STATE_TYPE,
  loading: loading.effects['EvaluationAnalysis/qryMccJobPlanList'],
}))
@Form.create()
class EvaluationAnalysis extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], // 特征列表
      pageNum: 1,
      pageSize: 10,
      pageInfo: {}, // 后端的返回
      // stateNumInfo: {}, // 活动统计
      camTypes: [], // 活动类型
      titleData: {},
      collapseKey: undefined, // 区域树
    };
  }

  componentDidMount() {
    this.fetchList();
    this.qryCamType();
  }

  // 获取头部数据
  fetchHeaderData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'EvaluationAnalysis/getStateNum',
      payload: {},
      success: svcCont => {
        const { data } = svcCont;
        this.setState({
          titleData: data,
        });
      },
    });
  };

  goDetailPage = record => {
    const { form, dispatch } = this.props;
    const formValue = form.getFieldsValue();
    const { data, pageNum, pageSize, pageInfo } = this.state;
    const { subsId, custType, campaignId } = record;

    router.push({
      pathname: '/workOrder/detail',
      query: {
        subsId,
        custType,
        campaignId,
      },
      type: 'EvaluationAnalysis',
    });
  };

  // 获取选择类型
  getSpecCode = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/qryAttrValueByCode',
      payload: {
        attrSpecCode: 'CAMPAIGN_STATE_TYPE',
      },
    });
  };

  // 获取数据
  fetchList = () => {
    this.setState({ collapseKey: undefined });
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    const otherPamams = this.getForm();
    dispatch({
      type: 'EvaluationAnalysis/qryMccJobPlanList',
      payload: {
        pageInfo: {
          pageNum,
          pageSize,
        },
        ...otherPamams,
      },
      success: svcCont => {
        const { data, pageInfo } = svcCont;
        this.setState({
          data,
          pageInfo: {
            pageNum: pageInfo.pageNum,
            pageSize: pageInfo.pageSize,
            total: pageInfo.total,
          },
        });
      },
    });
  };

  // 活动类型
  qryCamType = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'EvaluationAnalysis/qryCamBusiTypeTree',
      payload: {},
      success: svcCont => {
        const { data } = svcCont;
        const newTree = [];
        data.map(item => newTree.push(...item.childTypes));
        this.setState({
          camTypes: newTree,
        });
      },
    });
  };

  getForm = () => {
    const { form } = this.props;
    const { validateFields } = form;
    let result = {};
    validateFields((err, values) => {
      if (!err) {
        result = { ...values };
      }
    });
    return result;
  };

  // 重置
  resetForm = () => {
    const { form } = this.props;
    form.resetFields();
    this.fetchList();
  };

  // 列表条件切换
  onChange = (pageNum, pageSize) => {
    this.setState(
      {
        pageNum,
        pageSize,
      },
      this.fetchList,
    );
  };

  // 页码条数改变
  onShowSizeChange = (cur, size) => {
    this.setState(
      {
        pageNum: cur,
        pageSize: size,
      },
      () => {
        this.fetchList();
      },
    );
  };

  callback = key => {
    this.setState({ collapseKey: key });
  };

  // clickRow = record => {
  //   const { selectedRow } = this.state;
  //   if (selectedRow.id && selectedRow.id === record.id) {
  //     this.setState({ selectedRow: {} });
  //     return;
  //   }
  //   this.setState({ selectedRow: record }, this.fetchRuleList);
  // };

  render() {
    const { loading, form, stateType, location } = this.props;
    const { getFieldDecorator } = form;
    const { data, pageInfo, collapseKey, camTypes, titleData, stateNumInfo } = this.state;

    return (
      <Fragment>
        <Card size="small" title="活动调度计划">
          <CommonFilter handleSubmit={this.fetchList} handleReset={this.resetForm}>
            <Form.Item label="活动名称">
              {getFieldDecorator('campaignName', {
                rules: [{ max: 20, message: '内容请控制在20个字符以内' }],
              })(
                <Input
                  size="small"
                  placeholder={formatMessage({ id: 'common.form.input' })}
                  maxLength={21}
                />,
              )}
            </Form.Item>

            {/* <Form.Item label="账期">
              {getFieldDecorator('jobAccountDate', {})(
                <Input size="small" placeholder={formatMessage({ id: 'common.form.input' })} />,
              )}
            </Form.Item> */}
            {/* <Form.Item label="任务类型">
              {getFieldDecorator('jobType', {})(
                <Select
                  size="small"
                  placeholder={formatMessage({ id: 'common.form.select' })}
                  allowClear
                >
                  <Option key="CAM_EXEC" value="CAM_EXEC">
                    CAM_EXEC
                  </Option>
                  <Option key="APP_DATA" value="APP_DATA">
                    APP_DATA
                  </Option>
                </Select>,
              )}
            </Form.Item> */}
            {/* <Form.Item
              label={formatMessage({
                id: 'EvaluationAnalysis.activityStatus',
                formatMessage: '活动状态',
              })}
            >
              {getFieldDecorator('campaignState', {})(
                <Select
                  size="small"
                  placeholder={formatMessage({
                    id: 'common.form.select',
                  })}
                  allowClear
                >
                  {stateType.map(item => (
                    <Option key={item.attrValueCode} value={item.attrValueCode}>
                      {item.attrValueName}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item> */}
          </CommonFilter>

          <Row
            style={{ background: '#fafafa', lineHeight: '54px', padding: 10 }}
            type="flex"
            align="middle"
            gutter={24}
          >
            <Col span={3} style={{ textAlign: 'left', fontWeight: 'bold' }}>
              活动名称
            </Col>
            <Col span={3} style={{ textAlign: 'left', fontWeight: 'bold' }}>
              任务创建时间
            </Col>
            <Col span={3} style={{ textAlign: 'left', fontWeight: 'bold' }}>
              任务运行状态
            </Col>
            <Col span={3} style={{ textAlign: 'left', fontWeight: 'bold' }}>
              调度开始时间
            </Col>
            <Col span={3} style={{ textAlign: 'left', fontWeight: 'bold' }}>
              调度结束时间
            </Col>
            <Col span={3} style={{ textAlign: 'left', fontWeight: 'bold' }}>
              活动定时执行类型
            </Col>
            <Col span={3} style={{ textAlign: 'left', fontWeight: 'bold' }}>
              周期类型
            </Col>
            <Col span={3} style={{ textAlign: 'left', fontWeight: 'bold' }}>
              执行方式
            </Col>
          </Row>
          <Spin spinning={!!loading}>
            {data && data.length ? (
              <Collapse
                className={styles.indicatorCollapse}
                accordion
                destroyInactivePanel
                activeKey={collapseKey}
                onChange={this.callback}
              >
                {data.map(item => (
                  <Collapse.Panel
                    key={item.flowchartBatchId}
                    header={
                      <Row type="flex" align="middle" gutter={24}>
                        <Col span={3}>
                          <Ellipsis lines={1} tooltip style={{ textAlign: 'left' }}>
                            {item.campaignName}
                          </Ellipsis>
                        </Col>

                        <Col span={3}>
                          <Ellipsis lines={1} tooltip style={{ textAlign: 'left' }}>
                            {item.jobCreateDate}
                          </Ellipsis>
                        </Col>

                        <Col span={3}>
                          <Ellipsis lines={1} tooltip style={{ textAlign: 'left' }}>
                            {(() => {
                              switch (item.jobRunState) {
                                case '1000':
                                  return '待运行';
                                case '2000':
                                  return '运行成功';
                                case '3000':
                                  return '运行失败';
                                case '4000':
                                  return '运行中';
                                default:
                                  return '';
                              }
                            })()}
                          </Ellipsis>
                        </Col>

                        <Col span={3}>
                          <Ellipsis lines={1} tooltip style={{ textAlign: 'left' }}>
                            {item.startTime}
                          </Ellipsis>
                        </Col>

                        <Col span={3}>
                          <Ellipsis lines={1} tooltip style={{ textAlign: 'left' }}>
                            {item.endTime}
                          </Ellipsis>
                        </Col>

                        <Col span={3}>
                          <Ellipsis lines={1} tooltip style={{ textAlign: 'left' }}>
                            {/* {item.timingMethod === 'L' ? '单次' : '周期'} */}
                            {(() => {
                              switch (item.timingMethod) {
                                case 'C':
                                  return '周期';
                                case 'L':
                                  return '单次';
                                default:
                                  return '';
                              }
                            })()}
                          </Ellipsis>
                        </Col>

                        <Col span={3}>
                          <Ellipsis lines={1} tooltip style={{ textAlign: 'left' }}>
                            {(() => {
                              switch (item.cycleType) {
                                case '1':
                                  return '日';
                                case '2':
                                  return '周';
                                case '3':
                                  return '月';
                                default:
                                  return '';
                              }
                            })()}
                          </Ellipsis>
                        </Col>

                        <Col span={3}>
                          <Ellipsis lines={1} tooltip style={{ textAlign: 'left' }}>
                            {item.execMethod}
                          </Ellipsis>
                        </Col>
                      </Row>
                    }
                  >
                    <div className={classNames([styles.colorGray, styles.description])}>
                      <WorkOrderList flowchartBatchId={item.flowchartBatchId} goDetailPage={this.goDetailPage} />
                    </div>
                  </Collapse.Panel>
                ))}
              </Collapse>
            ) : (
              <Empty />
            )}
          </Spin>

          {pageInfo.total > 0 && (
            <div className="pagination-style">
              <Pagination
                showQuickJumper
                showSizeChanger
                onShowSizeChange={this.onShowSizeChange}
                defaultCurrent={1}
                current={pageInfo.pageNum}
                total={pageInfo.total}
                pageSize={pageInfo.pageSize}
                onChange={this.onChange}
              />
            </div>
          )}
        </Card>
      </Fragment>
    );
  }
}

export default EvaluationAnalysis;
