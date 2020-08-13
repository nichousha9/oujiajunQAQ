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
const status = {
  Editing: 'processing', // 编辑中
  Running: 'success', // 运行
  Suspended: 'warning', // 暂停
  Termination: 'error', // 终止
  Finished: 'default', // 结束
  Published: 'success', // 已发布
  ToPublished: 'warning', // 待发布
  Approvaling: 'warning', // 审核中
  Deleted: 'default', // 已失效
  Publishing: 'success', // 发布中
  'Audit failed': 'error', // 审核不通过
};

@connect(({ activityWork, common, loading }) => ({
  activityWork,
  stateType: common.attrSpecCodeList.CAMPAIGN_STATE_TYPE,
  loading: loading.effects['activityWork/getCampaignList'],
}))
@Form.create()
class ActivityWork extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], // 特征列表
      pageNum: 1,
      pageSize: 10,
      pageInfo: {}, // 后端的返回
      selectedRow: {},
      // stateNumInfo: {}, // 活动统计
      camTypes: [], // 活动类型
      titleData: {},
      collapseKey: undefined,
      // orgTree: [], // 区域树
    };
  }

  componentDidMount() {
    const { activityWork, form, dispatch } = this.props;
    const { formValue, historyState, ...rest } = activityWork;
    // historyState: 记录是否详情跳转回来
    if (historyState && historyState === 'activityWork') {
      this.setState({
        ...rest,
      });
      form.setFieldsValue(formValue);
      // 重置historyState
      dispatch({
        type: 'activityWork/save',
        payload: {
          historyState: '',
        },
      });
    } else {
      this.fetchList();
      this.qryStateNum();
    }
    this.getSpecCode();
    this.qryCamType();
    this.fetchHeaderData();
  }

  // 获取头部数据
  fetchHeaderData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activityWork/getStateNum',
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
    const { subsId, campaignId, orderId } = record;

    router.push({
      pathname: '/workOrder/detail',
      query: {
        orderId,
        type: 'activityWork',
      },
    });
    dispatch({
      type: 'activityWork/save',
      payload: {
        formValue,
        data,
        pageNum,
        pageSize,
        pageInfo,
        historyState: 'activityWork',
      },
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
      type: 'activityWork/getCampaignList',
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
      type: 'workOrder/qryCamBusiTypeTree',
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

  // 活动统计
  qryStateNum = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activityWork/qryStateNum',
      payload: {},
      success: svcCont => {
        const { data } = svcCont;
        this.setState({
          stateNumInfo: data,
        });
      },
    });
  };

  // // 活动类型
  // qryCamType = () => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'workOrder/qryCamType',
  //     payload: {},
  //     success: svcCont => {
  //       const { data } = svcCont;
  //       this.setState({
  //         camTypes: data,
  //       });
  //     },
  //   });
  // };

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

  // onButtonClick = () => {
  //   const { selectedRows } = this.state;
  //   if (selectedRows.length != 2) {
  //     message.info('请选择两个活动');
  //   } else {
  //     router.replace({
  //       pathname: '/campaignMarketingComparison',
  //       state: {
  //         selectedRows,
  //       },
  //     });
  //   }
  // };

  clickRow = record => {
    const { selectedRow } = this.state;
    if (selectedRow.id && selectedRow.id === record.id) {
      this.setState({ selectedRow: {} });
      return;
    }
    this.setState({ selectedRow: record }, this.fetchRuleList);
  };

  // 查询区域
  // qryRegions = () => {
  //   const { dispatch, userorgInfo } = this.props;
  //   dispatch({
  //     type: 'activityWork/qryAllLan',
  //     payload: {
  //       commonRegionId: userorgInfo.regionId,
  //     },
  //     success: svcCont => {
  //       const { data } = svcCont;
  //       this.setState({
  //         orgTree: data.map(v => ({ ...v, isLeaf: false })),
  //       });
  //     },
  //   });
  // };

  callback = key => {
    this.setState({ collapseKey: key });
  };

  render() {
    const { loading, form, stateType, location } = this.props;
    const { getFieldDecorator } = form;
    const {
      data,
      pageInfo,
      selectedRow,
      camTypes,
      titleData,
      stateNumInfo,
      collapseKey,
    } = this.state;
    // const topRightDiv = (
    //   <div className={styles.sumCon}>
    //     <span>
    //       <Iconfont type='iconpiechartdefuben' />
    //       活动总数：
    //       <span className={styles.num}>{stateNumInfo['活动总数']}</span>
    //     </span>
    //     <span>
    //       <Iconfont type='icontimeout' />
    //       待执行活动：
    //       <span className={styles.num}></span>
    //     </span>
    //     <span>
    //       <Iconfont type='iconcheck-circle' />
    //       已执行活动：
    //       <span className={styles.num}></span>
    //     </span>
    //   </div>
    // );

    return (
      <Fragment>
        <Card
          size="small"
          title="评估分析"
          extra={
            <div className={styles.titleExtra}>
              <div className={styles.textLayout}>
                <Iconfont type="iconpiechartdefuben" style={{ color: '#1890FF' }} />
                <div className={styles.grayText}>
                  活动总数：<span className={styles.numberText}>{titleData.totalNum || 0}</span>
                </div>
              </div>
              <div className={styles.textLayout}>
                <Iconfont type="iconbarchart" style={{ color: '#F5A623' }} />
                <div className={styles.grayText}>
                  总工单数：
                  <span className={styles.numberText}>{titleData.contactTotalNum || 0}</span>
                </div>
              </div>
              <div className={styles.textLayout}>
                <Iconfont type="iconfund" style={{ color: '#50E3C2' }} />
                <div className={styles.grayText}>
                  总执行率：<span className={styles.numberText}>{titleData.executedRate || 0}</span>
                </div>
                <div className={styles.grayText}>
                  -总执行数：<span className={styles.numberText}>{titleData.executedNum || 0}</span>
                </div>
                <div className={styles.grayText}>
                  -总派发数：
                  <span className={styles.numberText}>{titleData.contactTotalNum || 0}</span>
                </div>
              </div>
              <div className={styles.textLayout}>
                <Iconfont type="iconcheck-circle" style={{ color: '#7ED321' }} />
                <div className={styles.grayText}>
                  总成功率：<span className={styles.numberText}>{titleData.successRate || 0}</span>
                </div>
                <div className={styles.grayText}>
                  -总成功数：<span className={styles.numberText}>{titleData.successNum || 0}</span>
                </div>
              </div>
            </div>
          }
        >
          <CommonFilter handleSubmit={this.fetchList} handleReset={this.resetForm}>
            <Form.Item
              label={formatMessage({ id: 'workOrder.camType', defaultMessage: '活动类别' })}
            >
              {getFieldDecorator('busiType', {})(
                <Select
                  size="small"
                  placeholder={formatMessage({ id: 'common.form.select' })}
                  allowClear
                >
                  {camTypes &&
                    camTypes.map(item => (
                      <Option key={item.busiCode} value={item.busiCode}>
                        {item.busiName}
                      </Option>
                    ))}
                </Select>,
              )}
            </Form.Item>
            <Form.Item
              label={formatMessage({ id: 'workOrder.extName', defaultMessage: '活动名称' })}
            >
              {getFieldDecorator('extName', {
                rules: [{ max: 20, message: '内容请控制在20个字符以内' }],
              })(
                <Input
                  size="small"
                  placeholder={formatMessage({ id: 'common.form.input' })}
                  maxLength={21}
                />,
              )}
            </Form.Item>
            <Form.Item
              label={formatMessage({
                id: 'activityWork.activityStatus',
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
            </Form.Item>

            {/* <Form.Item label={<Tooltip title="派发范围">派发范围</Tooltip>}>
              {getFieldDecorator('distributeRange', {
                // initialValue: distributeRange,
              })(
                <Select mode="multiple" style={{ width: '100%' }} placeholder="请选择派发范围">
                  {orgTree &&
                    orgTree.map(item => {
                      return (
                        <Option key={item.commonRegionId} value={item.commonRegionId}>
                          {item.regionName}
                        </Option>
                      );
                    })}
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
            <Col span={2} style={{ fontWeight: 'bold' }}>
              活动名称
            </Col>
            <Col span={2} style={{ fontWeight: 'bold' }}>
              活动类别
            </Col>
            <Col span={2} style={{ fontWeight: 'bold' }}>
              活动说明
            </Col>
            <Col span={2} style={{ fontWeight: 'bold' }}>
              创建人
            </Col>
            <Col span={3} style={{ fontWeight: 'bold' }}>
              派发时间
            </Col>
            <Col span={3} style={{ fontWeight: 'bold' }}>
              到期时间
            </Col>
            <Col span={2} style={{ fontWeight: 'bold' }}>
              工单总数
            </Col>
            <Col span={2} style={{ fontWeight: 'bold' }}>
              待处理数
            </Col>
            <Col span={2} style={{ fontWeight: 'bold' }}>
              成功率
            </Col>
            <Col span={2} style={{ fontWeight: 'bold' }}>
              执行率
            </Col>
            <Col span={2} style={{ fontWeight: 'bold' }}>
              执行状态
            </Col>
          </Row>
          <Spin spinning={!!loading}>
            {data && data.length ? (
              <Collapse
                className={styles.indicatorCollapse}
                accordion
                onChange={this.callback}
                activeKey={collapseKey}
              >
                {data.map(item => (
                  <Collapse.Panel
                    key={item.id}
                    onClick={() => {
                      this.clickRow(item);
                    }}
                    header={
                      <Row type="flex" align="middle" gutter={24}>
                        <Col span={2}>
                          <Ellipsis lines={1} tooltip>
                            {/* <Link
                              to={`/activityConfigManage/activityFlow?id=${item.id}&from=${location.pathname}`}
                            > */}
                            {item.extName}
                            {/* </Link> */}
                          </Ellipsis>
                        </Col>
                        <Col span={2}>
                          <Ellipsis lines={1} tooltip>
                            {item.busiName}
                          </Ellipsis>
                        </Col>
                        <Col span={2}>
                          <Ellipsis lines={1} tooltip>
                            {item.description}
                          </Ellipsis>
                        </Col>
                        <Col span={2}>
                          <Ellipsis lines={1} tooltip>
                            {item.staffName}
                          </Ellipsis>
                        </Col>
                        <Col span={3}>
                          <Ellipsis lines={1} tooltip>
                            {item.startDate}
                          </Ellipsis>
                        </Col>
                        <Col span={3}>
                          <Ellipsis lines={1} tooltip>
                            {item.endDate}
                          </Ellipsis>
                        </Col>
                        <Col span={2}>
                          <Ellipsis lines={1} tooltip>
                            {item.totalNum}
                          </Ellipsis>
                        </Col>
                        <Col span={2}>
                          <Ellipsis lines={1} tooltip>
                            {item.waitHandleNum}
                          </Ellipsis>
                        </Col>
                        <Col span={2}>
                          <Ellipsis lines={1} tooltip>
                            {item.successRate}
                          </Ellipsis>
                        </Col>
                        <Col span={2}>
                          <Ellipsis lines={1} tooltip>
                            {item.executeRate}
                          </Ellipsis>
                        </Col>
                        <Col span={2}>
                          <Badge
                            status={status[item.campaignState]}
                            text={item.campaignStateName}
                          />
                        </Col>
                      </Row>
                    }
                  >
                    <div className={classNames([styles.colorGray, styles.description])}>
                      {/* {selectedRow.id === item.id ? ( */}
                      <WorkOrderList campaignId={item.id} goDetailPage={this.goDetailPage} />
                      {/* ) : null} */}
                    </div>
                  </Collapse.Panel>
                ))}
              </Collapse>
            ) : (
              <Empty />
            )}
          </Spin>

          {/* <Button style={{ marginTop: '16px' }} icon="search" onClick={this.onButtonClick}>
            加入对比
          </Button> */}

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

export default ActivityWork;
