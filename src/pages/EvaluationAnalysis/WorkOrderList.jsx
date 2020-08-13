import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Table } from 'antd';

import styles from './index.less';
import Ellipsis from '@/components/Ellipsis';

@connect(({ EvaluationAnalysis }) => ({
  EvaluationAnalysis,
}))
class WorkOrderList extends React.Component {
  workOrderColumns = [
    {
      title: '节点名称', // '操作',
      dataIndex: 'processName',
      key: 'processName',
    },
    {
      title: '节点类型', // '操作',
      dataIndex: 'processType',
      key: 'processType',
    },
    {
      title: '运行状态',
      dataIndex: 'runState',
      key: 'runState',
      render: text => {
        let textState = '';
        if (text === 'F') {
          textState = '成功';
        } else if (text === 'R') {
          textState = '待运行';
        } else if (text === 'P') {
          textState = '运行中';
        } else if (text === 'E') {
          textState = '失败';
        }
        return <span>{textState}</span>;
      },
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 150,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
      width: 150,
    },
    {
      title: '总数',
      dataIndex: 'tnum',
      key: 'tnum',
    },
    {
      title: '成功数',
      dataIndex: 'num',
      key: 'num',
    },
    {
      title: '失败数',
      dataIndex: 'fnum',
      key: 'fnum',
    },
    {
      title: '是否手工执行',
      dataIndex: 'isHandRun',
      key: 'isHandRun',
      render: text => {
        return <span>{text === 'Y' ? '是' : '否'}</span>;
      },
    },
    {
      title: '执行概况', // '操作',
      dataIndex: 'comment',
      key: 'comment',
      width: 150,
      ellipsis: true,
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      data: [], // 列表
    };
  }

  componentDidMount() {
    this.fetchList();
  } 

  // componentDidUpdate() {
  //   this.fetchList();
  // }

  goDetailPage = record => {
    const { goDetailPage } = this.props;
    goDetailPage(record);
  };

  // 获取数据
  fetchList = () => {
    const { dispatch, flowchartBatchId } = this.props;
    dispatch({
      type: 'EvaluationAnalysis/qryMccJobPlanDetail',
      payload: {
        flowchartBatchId,
      },
      success: svcCont => {
        const { data } = svcCont;
        this.setState({ data });
      },
    });
  };

  render() {
    const { data } = this.state;

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

    return (
      <Fragment>
        <div className={styles.workList}>
          <Table size="middle" rowKey="id" dataSource={data} columns={columns} pagination={false} />
        </div>
      </Fragment>
    );
  }
}

export default WorkOrderList;
