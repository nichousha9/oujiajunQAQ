/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-state */
/* eslint-disable import/first */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Tabs } from 'antd';
import CommonDatePicker from '../../components/CommonDatePicker';
import CommonSelect from '../../components/CommonSelect';
import StandardTable from '../../components/StandardTable';
import { getTimeFormat, formatDatetime, getPaginationList } from '../../utils/utils';
import { getOrgStaticCode, getAgentList } from '../../services/api';
import { routerRedux } from 'dva/router';

import styles from './History.less';

const { Search } = Input;
const { TabPane } = Tabs;
const typeList = [
  { id: '0', name: '讨论组' },
  { id: '1', name: '私聊' },
];

@connect(({ historyList, loading }) => ({
  historyList,
  submitting:
    loading.effects['historyList/getHistoryList'] ||
    loading.effects['historyList/fetchGetHistoryGroupList'],
}))
export default class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: '0',
      channelList: [],
      agentoList: [],
    };
  }

  renderForm() {
    const { activeKey } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <div style={{ display: 'inline-flex' }}>
          <Search className="margin-right-10" placeholder="请输入" onSearch={this.search} />
          {activeKey === '0' && (
            <CommonDatePicker
              ref={(ele) => {
                this.refDatePicker = ele;
              }}
              getDataPickerDate={this.getDataPickerDate}
            />
          )}
          {activeKey === '1' && (
            <CommonDatePicker
              ref={(ele) => {
                this.refDatePicker = ele;
              }}
              getDataPickerDate={this.getDataPickerDate}
            />
          )}
          {activeKey === '2' && (
            <CommonSelect
              className="margin-left-10"
              defaultValue=""
              unknownText="所有类型"
              addUnknown
              onChange={this.typeChange}
              optionData={{ datas: typeList }}
            />
          )}
          {activeKey === '1' && (
            <CommonSelect
              className="margin-left-10"
              defaultValue=""
              unknownText="所有客服"
              addUnknown
              onChange={this.agentnoChange}
              optionData={{ datas: this.state.agentoList, optionName: 'nickname' }}
            />
          )}
          {/* activeKey == '1' &&     (
          <CommonSelect
            className="margin-left-10"
            defaultValue=""
            unknownText="所有渠道"
            addUnknown
            onChange={this.channelChange}
            optionData={{datas:this.state.channelList}}
          />
          ) */}
        </div>
      </Form>
    );
  }
  componentDidMount() {
    this.loadData(0, this.pageSize);
    const params = { pcode: 'com.dic.channel.type' };
    getAgentList({ status: 1 }).then((res) => {
      if (res.status === 'OK') {
        this.setState({ agentoList: res.data });
      }
    });
    getOrgStaticCode(params).then((res) => {
      if (res.data) {
        this.setState({
          channelList: res.data,
        });
      }
    });
  }
  // 分页参数
  pageSize = 10;
  handleStandardTableChange = (pagination) => {
    this.loadData(pagination.current, this.pageSize);
  };
  // 加载数据
  loadData = (p) => {
    const { selectedDate = [] } = this.refDatePicker || {};
    const { pagination = {} } = this.tableRef || {};
    const { activeKey } = this.state;
    const { dispatch } = this.props;
    if (activeKey === '1') {
      dispatch({
        type: 'historyList/getHistoryList',
        payload: {
          p: p || 0,
          ps: pagination.pageSize || window.tablePageSize || 10,
          username: this.searchValue || '',
          timeStart: selectedDate[0],
          timeEnd: selectedDate[1],
          channel: this.channel || '',
          agentno: this.agentno || '',
        },
      });
    } else if (activeKey === '2') {
      dispatch({
        type: 'historyList/fetchGetHistoryGroupList',
        payload: {
          // agentno:getUserInfo().id,
          p: p || 0,
          ps: pagination.pageSize || window.tablePageSize || 10,
          username: this.searchValue || '',
          type: this.type || '',
        },
      });
    } else {
      dispatch({
        type: 'historyList/robotMsgList',
        payload: {
          // agentno:getUserInfo().id,
          p: p || 0,
          ps: pagination.pageSize || window.tablePageSize || 10,
          username: this.searchValue || '',
          type: this.type || '',
          timeStart: selectedDate[0],
          timeEnd: selectedDate[1],
          robot: 1,
        },
      });
    }
  };
  // 点击事件
  selectHis = (obj = {}) => {
    const { activeKey } = this.state;
    if (activeKey === '0') {
      // 机器人消息列表详细聊天记录
      this.props.dispatch(
        routerRedux.push({
          pathname: '/history/detail',
          query: {
            userId: obj.userId,
            key: 0,
          },
        })
      );
    } else if (activeKey === '1') {
      // 客服消息记录详细聊天记录
      this.props.dispatch(
        routerRedux.push({
          pathname: '/history/detail',
          query: {
            userId: obj.userId,
            key: 1,
          },
        })
      );
    } else {
      // 群组消息聊天记录
      this.props.dispatch(
        routerRedux.push({
          pathname: '/history/detail',
          query: {
            groupId: obj.id,
            key: 2,
          },
        })
      );
    }
  };
  // 搜索
  search = (value) => {
    this.searchValue = value;
    this.loadData(0, this.pageSize, value);
  };
  // 时间切换列表刷新
  getDataPickerDate = () => {
    this.loadData();
  };
  typeChange = (value) => {
    this.type = value;
    this.loadData();
  };
  agentnoChange = (value) => {
    this.agentno = value;
    this.loadData();
  };
  channelChange = (value) => {
    this.channel = value;
    this.loadData();
  };
  // tab切换
  tabChange = (changeValue) => {
    this.setState({ activeKey: changeValue }, () => {
      this.loadData();
    });
  };
  searchValue = ''; // 当前搜索框的值
  refDatePicker = {}; // 时间
  render() {
    const { list, groupList = {}, robotList } = this.props.historyList;
    const robotColumns = [
      {
        title: '姓名',
        dataIndex: 'userName',
        width: 150,
      },
      {
        title: '客服',
        dataIndex: 'agentName',
        width: 150,
      },
      {
        title: '消息数量',
        dataIndex: 'msgnum',
      },
      {
        title: '会话时长',
        dataIndex: 'sessionTimes',
        width: 100,
        render: (text) => <span>{text}分</span>,
      },
      {
        title: '会话时间',
        dataIndex: 'serviceTime',
        width: 170,
        render: (text) => <span>{formatDatetime(text)}</span>,
      },
    ];
    const columns = [
      {
        title: '姓名',
        dataIndex: 'userName',
        width: 150,
      },
      {
        title: '客服',
        dataIndex: 'agentName',
        width: 150,
      },
      {
        title: '消息数量',
        dataIndex: 'msgnum',
      },
      {
        title: '会话时长',
        dataIndex: 'sessionTimes',
        width: 100,
        render: (text) => <span>{getTimeFormat(text)}</span>,
      },
      {
        title: '会话时间',
        dataIndex: 'serviceTime',
        width: 170,
        render: (text) => <span>{formatDatetime(text)}</span>,
      },
    ];
    const groupColumns = [
      {
        title: '名称',
        dataIndex: 'groupName',
        width: 150,
      },
      {
        title: '类型',
        dataIndex: 'privatechat',
        render: (val) => {
          if (!val) {
            return '讨论组';
          }
          return '私聊';
        },
        width: 100,
      },
      {
        title: '最近发言时间',
        dataIndex: 'lastMessageTime',
        width: 180,
      },
      {
        title: '会话量',
        dataIndex: 'sessionNumber',
      },
      {
        title: '创建人',
        dataIndex: 'createrName',
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        width: 170,
        render: (text) => <span>{formatDatetime(text)}</span>,
      },
    ];
    const { submitting } = this.props;
    return (
      <div className="selfAdapt">
        <Tabs defaultActiveKey="0" onChange={this.tabChange} tabBarExtraContent={this.renderForm()}>
          <TabPane tab="机器人消息列表" key="0">
            <div className={styles.tableList}>
              <StandardTable
                noSelect
                rowKey="userid"
                ref={(ele) => {
                  this.tableRef = ele;
                }}
                cutHeight={140}
                loading={submitting}
                // data={getPaginationList({data:robotList})}
                data={robotList}
                columns={robotColumns}
                onChange={this.handleStandardTableChange}
                selection={{ onSelect: this.selectHis }}
                onRow={(record) => {
                  return {
                    onClick: () => {
                      this.selectHis(record);
                    },
                  };
                }}
              />
            </div>
          </TabPane>
          <TabPane tab="客服消息记录" key="1">
            <div className={styles.tableList}>
              <StandardTable
                noSelect
                rowKey="userid"
                ref={(ele) => {
                  this.tableRef = ele;
                }}
                cutHeight={140}
                loading={submitting}
                data={getPaginationList({ data: list })}
                columns={columns}
                onChange={this.handleStandardTableChange}
                selection={{ onSelect: this.selectHis }}
                onRow={(record) => {
                  return {
                    onClick: () => {
                      this.selectHis(record);
                    },
                  };
                }}
              />
            </div>
          </TabPane>
          <TabPane tab="群组消息记录" key="2">
            <div className={styles.tableList}>
              <StandardTable
                noSelect
                ref={(ele) => {
                  this.tableRef = ele;
                }}
                cutHeight={300}
                loading={submitting}
                data={groupList}
                columns={groupColumns}
                onChange={this.handleStandardTableChange}
                rowKey={(record) => record.sessionid}
                selection={{ onSelect: this.selectHis }}
                onRow={(record) => {
                  return {
                    onClick: () => {
                      this.selectHis(record);
                    },
                  };
                }}
              />
            </div>
          </TabPane>
        </Tabs>
        ,
      </div>
    );
  }
}
