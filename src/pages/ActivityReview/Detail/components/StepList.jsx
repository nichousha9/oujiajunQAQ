import React, { Component } from 'react';
import { Card, Table, Tooltip } from 'antd';
import { connect } from 'dva';

@connect(({ activityReview }) => ({
  activityReview,
  approveStatus: activityReview.approveStatus,
  formData: activityReview.formData,
}))
class StepList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [], // 表格数据
      pageNum: 1, // 当前页码
      total: 0, // 数据总量
    };
  }

  componentDidMount() {
    const { formData } = this.props;
    // 如果存在formData.taskOrderId数据，
    if (formData.taskOrderId) {
      this.fetchData();
    }
  }

  // 获取数据
  fetchData = () => {
    const { dispatch, formData } = this.props;
    const { pageNum } = this.state;
    dispatch({
      type: 'activityReview/qryApprovalRecordListByCampaign',
      payload: {
        pageInfo: {
          pageNum,
          pageSize: 10,
        },
        taskOrderId: formData.taskOrderId, // 活动id
        flowchartId: formData.approvalFlowchartId, // 流程id
      },
      success: svcCont => {
        this.setState({
          tableData: svcCont.data,
          total: svcCont.pageInfo.total,
        });
      },
    });
  };

  // 改变页码
  changePageNum = value => {
    this.setState(
      {
        pageNum: value,
      },
      this.fetchData,
    );
  };

  render() {
    const { approveStatus } = this.props;
    const { pageNum, total, tableData } = this.state;
    const columns = [
      {
        title: '排序',
        key: 'id',
        render: (text, record, index) => {
          return index + 1;
        },
      },
      {
        title: '当前审批人',
        dataIndex: 'approvalStaffName',
      },
      {
        title: '状态',
        key: 'state',
        render: text => {
          return approveStatus[text.state];
        },
      },
      {
        title: '状态时间',
        dataIndex: 'endDate',
      },
      {
        title: '审批意见',
        dataIndex: 'reason',
        render: text => {
          if (text === 'null') return '';
          return (
            <div className="text-ellipsis">
              <Tooltip placement="bottom" title={text}>
                {text || ''}
              </Tooltip>
            </div>
          );
        },
      },
    ];

    return (
      <Card title="审批步骤列表" bordered={false}>
        <Table
          tableLayout="fixed"
          columns={columns}
          dataSource={tableData}
          rowKey="id"
          pagination={{
            current: pageNum,
            total,
            onChange: this.changePageNum,
            hideOnSinglePage: true,
          }}
        />
      </Card>
    );
  }
}

export default StepList;
