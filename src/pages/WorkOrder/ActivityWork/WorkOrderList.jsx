import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Table } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './index.less';
import Ellipsis from '@/components/Ellipsis';

@connect(({ activityWork, loading }) => ({
  activityWork,
  loading: loading.effects['workOrder/qryContactList'],
}))
class WorkOrderList extends React.Component {
  workOrderColumns = [
    {
      title: formatMessage({ id: 'workOrder.extName' }), // '活动名称',
      dataIndex: 'extName',
      key: 'extName',
    },
    {
      title: formatMessage({ id: 'workOrder.batch' }), // ''活动批次',
      dataIndex: 'batchId',
      key: 'batchId',
    },
    {
      title: formatMessage({ id: 'workOrder.custType' }), // ''客户类型',
      dataIndex: 'custType',
      key: 'custType',
    },
    // {
    //   title: formatMessage({ id: 'workOrder.custName' }), // ''集团名称',
    //   dataIndex: 'custName',
    //   key: 'custName',
    //   width: 170,
    //   ellipsis: true,
    // },
    // {
    //   title: formatMessage({ id: 'workOrder.memName' }), // ''成员名称',
    //   dataIndex: 'memName',
    //   key: 'memName',
    // },
    {
      title: '对象名称',
      dataIndex: 'objName',
      key: 'objName',
      ellipsis: true,
    },
    {
      title: formatMessage({ id: 'workOrder.planEndDate' }), // ''到期时间',
      dataIndex: 'planEndDate',
      key: 'planEndDate',
      width: 120,
      ellipsis: true,
    },
    {
      title: formatMessage({ id: 'workOrder.managerName' }), // ''所属客户经理',
      dataIndex: 'managerName',
      key: 'managerName',
    },
    {
      title: formatMessage({ id: 'workOrder.receiptTime' }), // '接收时间',
      dataIndex: 'createDate',
      key: 'createDate',
      width: 120,
      ellipsis: true,
    },

    {
      title: formatMessage({ id: 'workOrder.executeState' }), // '执行状态',
      dataIndex: 'executeState',
      key: 'executeState',
    },
    {
      title: formatMessage({ id: 'common.table.action' }), // '操作',
      dataIndex: 'address',
      key: 'address',
      render: (_, record) => {
        return (
          <a onClick={() => this.goDetailPage(record)}>
            {formatMessage({ id: 'workOrder.viewDetail' })}
          </a>
        );
      },
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      data: [], // 列表
      pageNum: 1,
      pageSize: 10,
      pageInfo: {}, // 后端的返回
    };
  }

  componentDidMount() {
    this.fetchList();
  }

  goDetailPage = record => {
    const { goDetailPage } = this.props;
    goDetailPage(record);
  };

  // 获取数据
  fetchList = () => {
    const { dispatch, campaignId } = this.props;
    const { pageNum, pageSize } = this.state;
    dispatch({
      type: 'workOrder/qryContactList',
      payload: {
        pageInfo: {
          pageNum,
          pageSize,
        },
        campaignId,
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

  // 列表条件切换
  onChange = pagination => {
    const { current: pageNum, pageSize } = pagination;
    this.setState(
      {
        pageNum,
        pageSize,
      },
      this.fetchList,
    );
  };

  render() {
    const { loading } = this.props;
    const { pageInfo, data } = this.state;

    const columns = this.workOrderColumns.map(col => {
      if (!col.ellipsis) {
        return col;
      }
      return {
        ...col,
        render: text => (
          <Ellipsis tooltip lines={1}>
            {text}
          </Ellipsis>
        ),
      };
    });

    const pagination = {
      size: 'small',
      current: pageInfo.pageNum,
      pageSize: pageInfo.pageSize,
      total: pageInfo.total,
    };

    return (
      <Fragment>
        <div className={styles.workList}>
          <Table
            rowKey='orderId'
            size="middle"
            dataSource={data}
            columns={columns}
            pagination={pagination}
            loading={loading}
            onChange={this.onChange}
          />
        </div>
      </Fragment>
    );
  }
}

export default WorkOrderList;
