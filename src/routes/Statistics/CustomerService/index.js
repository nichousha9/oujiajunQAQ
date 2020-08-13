/* eslint-disable react/no-unused-state */
/* eslint-disable import/first */
import React from 'react';
import { Icon } from 'antd';
import { connect } from 'dva';
import StandardTable from '../../../components/StandardTable';
import classnames from 'classnames';
import { getStatusClassName } from '../../../utils/utils';

const workQualityColumns = [
  {
    title: '客服',
    dataIndex: 'agentname',
    width: 120,
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: (data) => {
      const arr = getStatusClassName(data);
      return (
        <span>
          <Icon className={classnames(arr[0], 'margin-right-5')} />
          {arr[1]}
        </span>
      );
    },
  },
  {
    title: '在线时长（秒）',
    dataIndex: 'onlinetime',
    width: 120,
  },
  {
    title: '平均会话时长(秒)',
    dataIndex: 'avgsessiontime',
    width: 120,
  },
  {
    title: '响应会话量',
    dataIndex: 'responsenumber',
  },
  {
    title: '消息条数',
    dataIndex: 'messagenumber',
  },
  {
    title: '接入会话量',
    dataIndex: 'sessionnumber',
    width: 130,
  },
  {
    title: '响应率',
    dataIndex: 'responserate',
    percent: true,
    width: 100,
  },
  {
    title: '答问比',
    dataIndex: 'answerrate',
    width: 100,
  },
  {
    title: '评价数',
    dataIndex: 'evaluatenumber',
    width: 100,
  },
  {
    title: '好评率',
    dataIndex: 'praiserate',
    percent: true,
    width: 100,
  },
  {
    title: '差评率',
    dataIndex: 'negativerate',
    percent: true,
    width: 100,
  },
];
@connect((props) => {
  const { customerService, statisticBasicIndex, loading } = props;
  return { customerService, statisticBasicIndex, loading: loading.models.customerService };
})
export default class CustomerService extends React.Component {
  constructor(props) {
    super(props);
    const {
      statisticBasicIndex: { skillUser, skillid, starttime, endtime, status },
    } = props;
    this.state = {
      tabType: 'workload', // 默认显示工作量
      skillid,
      starttime,
      endtime,
      status,
      skillUser,
    };
  }
  componentDidMount() {
    this.loadPage();
  }
  componentWillReceiveProps(nextProps) {
    const {
      activeKey,
      statisticBasicIndex: { starttime, endtime, status, skillid, skillUser },
    } = nextProps;
    const currActiveKey = this.props.activeKey;
    if (currActiveKey !== activeKey && activeKey === 2) {
      this.setState({ starttime, endtime, status, skillid, skillUser }, () => {
        this.loadPage();
      });
      return;
    }
    if (
      starttime !== this.state.starttime ||
      endtime !== this.state.endtime ||
      status !== this.state.status ||
      skillUser !== this.state.skillUser ||
      skillid !== this.state.skillid
    ) {
      if (activeKey === 2) {
        this.setState({ starttime, endtime, status, skillid, skillUser }, () => {
          this.loadPage();
        });
      }
    }
  }
  loadPage = (pagination = {}) => {
    const { starttime, endtime, status, skillid, skillUser } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'customerService/fetchAgentStatistical',
      payload: {
        starttime,
        endtime,
        status,
        skillid,
        agentno: skillUser,
        p: pagination.current || 0,
        ps: pagination.pageSize || window.tablePageSize,
      },
    });
  };
  handleModeChange = (e) => {
    this.setState({ tabType: e.target.value });
    // 每次Tab切换的时候查询的参数清空了
    // dispatch({type:'statisticBasicIndex/clearSaticBasicIndex'});
  };
  tableChange = (pagination) => {
    this.loadPage(pagination);
  };
  render() {
    const {
      loading,
      customerService: { agentList = {} },
    } = this.props;
    return (
      <div>
        <StandardTable
          cutHeight={320}
          rowKey="agentno"
          scrollX
          noSelect
          ref={(ele) => {
            this.workQualityRef = ele;
          }}
          onChange={this.tableChange}
          loading={loading}
          data={agentList}
          columns={workQualityColumns}
        />
      </div>
    );
  }
}
