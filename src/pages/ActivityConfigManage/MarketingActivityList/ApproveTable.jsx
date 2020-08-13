import React, { Component } from 'react';
import { Modal, Card, Table, Form, Input } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
const { Search } = Input;
@connect(({ approveList, loading }) => ({
  qryApprovalFlowchart: approveList.qryApprovalFlowchart,
  tableLoading: loading.effects['approveList/qryApprovalFlowchart'],
  confirmLoading: loading.effects['activityReview/insertApprovalRecord'],
}))
@Form.create()
class ApproveTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [], // 数据
      pageInfo: {
        pageNum: 1, // 当前页码
        pageSize: 10, // 一页数据条数
      },
      total: 0, // 数据总量
      approveId: [], // 当前选择的审核模版id
    };
  }

  componentDidMount() {
    this.qryApprovalFlowchart();
  }

  // 获取模版数据
  qryApprovalFlowchart = () => {
    const { dispatch } = this.props;
    const { pageInfo } = this.state;
    dispatch({
      type: 'approveList/qryApprovalFlowchart',
      payload: {
        fold: 10,
        status: '2000',
        pageInfo,
      },
      success: svcCont => {
        const {
          data,
          pageInfo: { total },
        } = svcCont;
        this.setState({
          tableData: data,
          total,
        });
      },
    });
  };

  // 改变页码
  changePageInfo = (pageNum, pageSize) => {
    this.setState(
      {
        pageInfo: {
          pageNum,
          pageSize,
        },
      },
      this.qryApprovalFlowchart,
    );
  };

  render() {
    const { onOk, onCancel, tableLoading, confirmLoading } = this.props;
    const { tableData, pageInfo, approveId, total } = this.state;
    const rowSelection = {
      type: 'radio',
      onChange: selectedRowKeys => {
        this.setState({
          approveId: selectedRowKeys,
        });
      },
    };
    const columns = [
      {
        title: '模板名称',
        dataIndex: 'name',
      },
      {
        title: '流程编码',
        dataIndex: 'code',
      },
      {
        title: '业务类型',
        dataIndex: 'flowchartTypeName',
      },
      {
        title: '状态',
        render: () => {
          return (
            <>
              <span className={styles.statusPoint} style={{ background: '#52c41a' }} />
              <span>发布中</span>
            </>
          );
        },
      },
      {
        title: '开始时间',
        dataIndex: 'startDate',
        ellipsis: true,
      },
      {
        title: '结束时间',
        dataIndex: 'endDate',
        ellipsis: true,
      },
    ];
    // 分页props
    const pagination = {
      total,
      current: pageInfo.pageNum,
      pageSize: pageInfo.pageSize,
      pageSizeOptions: ['10', '15', '20', '25'],
      showQuickJumper: true,
      showSizeChanger: true,
      onShowSizeChange: this.changePageInfo,
      onChange: this.changePageInfo,
    };

    return (
      <Modal
        width={960}
        visible
        onOk={() => {
          onOk(approveId);
        }}
        onCancel={onCancel}
        destroyOnClose
        confirmLoading={!!confirmLoading}
      >
        <Card
          title="选择审核模板"
          bordered={false}
          extra={
            <Search
              size="small"
              placeholder="请输入流程名称"
              onSearch={this.qryApprovalFlowchart}
            />
          }
        >
          <Table
            size="small"
            rowKey="id"
            loading={!!tableLoading}
            dataSource={tableData}
            columns={columns}
            rowSelection={rowSelection}
            pagination={pagination}
          />
        </Card>
      </Modal>
    );
  }
}

export default ApproveTable;
