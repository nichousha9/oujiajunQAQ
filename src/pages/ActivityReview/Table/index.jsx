import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { Card, Form, Select, Input, Button, Icon, Table, Modal } from 'antd';
import router from 'umi/router';
import CommonFilter from '@/components/CommonFilter';
const { Search } = Input;
const { Item } = Form;
const { Option } = Select;

@connect(({ activityReview, user, common, loading }) => ({
  pageInfo: activityReview.pageInfo,
  approveStatus: activityReview.approveStatus,
  userInfo: user.userInfo,
  common,
  tableLoading: loading.effects['activityReview/qryApprovalRecordList'],
  confirmLoading: loading.effects['activityReview/insertApprovalRecord'],
}))
@Form.create()
class ActivityReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      extName: '', // 搜索-活动名称
      tableData: [], // 表格数据
      total: 0, // 数据总量
      showAdvancedFilter: false, // 是否展示高级筛选
      visible: false, // 原因弹窗
      reviewData: {}, // 审核数据
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    this.fetchData();
    // 获取周期类型
    dispatch({
      type: 'common/qryAttrValueByCode',
      payload: {
        attrSpecCode: 'CYCLE_TYPE',
      },
    });
  }

  componentWillUnmount() {
    // 离开页面还原分页信息
    const { dispatch } = this.props;
    dispatch({
      type: 'activityReview/setData',
      payload: {
        pageInfo: {
          pageNum: 1,
          pageSize: 10,
        },
      },
    });
  }

  // 请求数据
  fetchData = async () => {
    const { dispatch, userInfo, form } = this.props;
    const { extName } = this.state;
    const advancedForm = Object.assign({ state: '', staffName: '' }, await form.validateFields());
    dispatch({
      type: 'activityReview/qryApprovalRecordList',
      payload: {
        approvalStaffId: userInfo.staffInfo.staffId,
        extName,
        ...advancedForm,
      },
      success: svcCont => {
        const {
          data: tableData,
          pageInfo: { total },
        } = svcCont;
        this.setState({
          tableData,
          total,
        });
      },
    });
  };

  // 搜索
  handleSearch = value => {
    this.setState(
      {
        extName: value,
      },
      this.fetchData,
    );
  };

  // 重置高级筛选
  handleReset = () => {
    const { form } = this.props;
    form.resetFields();
  };

  // 展示高级筛选
  handleShowAdvancedFilter = () => {
    const { showAdvancedFilter } = this.state;
    this.setState({
      showAdvancedFilter: !showAdvancedFilter,
    });
  };

  /**
   * 处理审核，同意或者驳回
   *
   * @type {String} "2000"为同意，"3000"为驳回
   * @record {Object} 当前选中列数据
   * @return null
   */
  handleApprove = (type, record) => {
    const { userInfo } = this.props;
    const { approvalFlowchartId, approvalProcessId, taskOrderId, comments } = record;
    const payload = {
      approvalFlowchartId, // 流程（模版）id
      approvalProcessId, // 环节点id
      approvalStaffId: userInfo.staffInfo.staffId, // 审核人id
      taskOrderId, // 活动id
      state: type, // 状态
    };
    this.setState({
      visible: true,
    });
    // 备注
    if (comments !== 'null') {
      payload.comments = comments;
    }
    this.setState({
      reviewData: payload,
    });
  };

  // 提交审核原因
  handleSubmit = () => {
    const { form, dispatch } = this.props;
    const { validateFields } = form;
    const { reviewData } = this.state;
    validateFields((errors, { reason }) => {
      if (!errors) {
        dispatch({
          type: 'activityReview/insertApprovalRecord',
          payload: {
            ...reviewData,
            reason,
          },
          success: () => {
            this.setState(
              {
                visible: false,
                reviewData: {},
              },
              this.fetchData,
            );
          },
        });
      }
    });
  };

  // 查看详情
  seeDetail = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activityReview/setData',
      payload: {
        formData: record,
      },
    });
    router.push('/activityReview/detail');
  };

  /**
   * 改变分页信息
   * @param pageNum
   * @param pageSize
   */
  changeInfo = (pageNum, pageSize) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activityReview/setData',
      payload: {
        pageInfo: {
          pageNum,
          pageSize,
        },
      },
    });
    this.fetchData();
  };

  render() {
    const { showAdvancedFilter, total, tableData, visible } = this.state;
    const { form, approveStatus, userInfo, pageInfo, tableLoading, confirmLoading } = this.props;
    // 为0就是admin管理员, 1是智能营销管理员
    const { isAdmin = 0 } = userInfo.userInfo;
    const { getFieldDecorator } = form;
    const columns = [
      {
        title: '主题',
        dataIndex: 'extName',
      },
      {
        title: '编码',
        dataIndex: 'extCode',
      },
      {
        title: '状态',
        render: record => {
          return approveStatus[record.state];
        },
      },
      {
        title: '创建人',
        dataIndex: 'createStaffName',
      },
      {
        title: '当前处理人',
        dataIndex: 'approvalStaffName',
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
      },
      {
        title: '操作',
        render: record => (
          <>
            <Button
              disabled={isAdmin}
              type="link"
              size="small"
              onClick={() => {
                this.seeDetail(record);
              }}
            >
              查看
            </Button>
            <Button
              // approvalStatus 审批流程的状态， state当前审批的状态
              disabled={isAdmin || record.state !== '1000' || record.approvalStatus === '2000'}
              type="link"
              size="small"
              onClick={() => {
                this.handleApprove('2000', record);
              }}
            >
              同意
            </Button>
            <Button
              disabled={isAdmin || record.state !== '1000' || record.approvalStatus === '2000'}
              type="link"
              size="small"
              onClick={() => {
                this.handleApprove('3000', record);
              }}
            >
              驳回
            </Button>
          </>
        ),
      },
    ];
    // 分页器props
    const pagination = {
      total,
      showQuickJumper: true,
      showSizeChanger: true,
      current: pageInfo.pageNum,
      pageSize: pageInfo.pageSize,
      onChange: this.changeInfo,
      onShowSizeChange: this.changeInfo,
    };
    const rightDiv = (
      <div>
        <Search
          className="filter-input"
          placeholder="请输入主题"
          size="small"
          onSearch={this.handleSearch}
        />
        <Button
          type="link"
          className="dropdown-style"
          onClick={this.handleShowAdvancedFilter}
          size="small"
        >
          {formatMessage({ id: 'common.btn.AdvancedFilter' })}
          <Icon type={showAdvancedFilter ? 'up' : 'down'} />
        </Button>
      </div>
    );
    return (
      <>
        <Card title="活动审批管理" extra={rightDiv} bordered={false}>
          {showAdvancedFilter && (
            <div className="show-advanced-div">
              <CommonFilter span={8} handleSubmit={this.fetchData} handleReset={this.handleReset}>
                <Item label="视图类型">
                  {getFieldDecorator('state', { initialValue: '' })(
                    <Select size="small">
                      <Option value="" key="">
                        所有的审核单
                      </Option>
                      <Option value={1000} key="1000">
                        未审批的审核单
                      </Option>
                      <Option value={2000} key="2000">
                        已通过的审核单
                      </Option>
                      <Option value={3000} key="3000">
                        未通过的审核单
                      </Option>
                    </Select>,
                  )}
                </Item>
                <Item label="创建人">
                  {getFieldDecorator('staffName', { initialValue: '' })(<Input size="small" />)}
                </Item>
                {isAdmin ? (
                  <></>
                ) : (
                  <Item label="审核人">
                    {getFieldDecorator('approvalStaffName', { initialValue: '' })(
                      <Input size="small" />,
                    )}
                  </Item>
                )}
              </CommonFilter>
            </div>
          )}
          <Card title="审批列表" bordered={false}>
            <Table
              dataSource={tableData}
              columns={columns}
              loading={!!tableLoading}
              rowKey={record => record.id}
              pagination={pagination}
            />
          </Card>
        </Card>
        {visible && (
          <Modal
            visible
            confirmLoading={!!confirmLoading}
            onOk={this.handleSubmit}
            onCancel={() => this.setState({ visible: false, reviewData: {} })}
          >
            <Form>
              <Item label="原因">
                {getFieldDecorator('reason', {
                  rules: [
                    { required: true, message: '请输入原因！' },
                    { max: 150, message: '内容请控制在150个字符以内' },
                  ],
                })(<Input.TextArea rows={4} maxLength={151} />)}
              </Item>
            </Form>
          </Modal>
        )}
      </>
    );
  }
}

export default ActivityReview;
