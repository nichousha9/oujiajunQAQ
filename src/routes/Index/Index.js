/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Tabs, Spin, message, Popover } from 'antd';
import { Chart, Axis, Line, Area, Tooltip } from 'viser-react';
import classname from 'classnames';
import { Pie } from '../../components/Charts';
import CommonDatePicker from '../../components/CommonDatePicker';
import StandardTable from '../../components/StandardTable';
import UnsolvedQuestion from './UnsolvedQuestion';
import SolvedQuestion from './SolvedQuestion';
import {
  formatDatetime,
  getTimeForFmortat,
  getMintByMs,
  getHourByMills,
  getDayByMills,
} from '../../utils/utils';
import { getResMsg } from '../../utils/codeTransfer';
import Group6 from '../../assets/Group 6.svg';
import Group7 from '../../assets/Group 7.svg';
import Group from '../../assets/Group.svg';
import styles from './Index.less';

const { TabPane } = Tabs;

const scale1 = [
  {
    dataKey: 'responserate',
    min: 0,
    max: 100,
  },
  {
    dataKey: 'time',
    // min: 0,
    // max: 1,
  },
];

const tOnline = {
  columns: [
    {
      title: '用户名',
      dataIndex: 'nickname',
      width: 120,
    },
    {
      title: '组织',
      dataIndex: 'organName',
      width: 120,
    },
    {
      title: '访问时间',
      dataIndex: 'lastlogintime',
      width: 170,
      render: (date) => <span>{formatDatetime(date)}</span>,
    },
    {
      title: '停留时间',
      dataIndex: 'onlineTime',
      width: 170,
      render: (date) => <span>{date}分钟</span>,
    },
  ],
};
const mostUsed = {
  columns: [
    {
      title: '问题',
      dataIndex: 'question',
      render: (data) => {
        return data;
      },
      width: 400,
    },
    {
      title: '使用次数',
      dataIndex: 'total',
      width: 80,
    },
  ],
};

@connect((props) => {
  const { homens, loading } = props;
  return {
    homens,
    summaryLoading: false, // loading.effects['homens/fetchSummeryByTime'],
    userListLoading: false, // loading.effects['homens/fetchGetOnlineUserList'],
    unSolveLoading: loading.effects['homens/fetchGetUnsolvedQuestionList'],
    mostUsedListLoading: loading.effects['homens/fetchGetMostUsedQuestion'],
  };
})
export default class Index extends Component {
  state = {
    dateData: [], // 当前的时间
    sonDics: {},
  };
  componentDidMount() {
    // 默认获取今天的
    this.loadSummeryByTime(getTimeForFmortat('today'));
    this.loadOnlineUserList();
    this.mostUsedQuestionList();
    this.unSolveQuestionList();
    this.getSonDicsByCode();
  }

  // 当前在线用户列表分页参数
  onlineSize = 10;
  onlineChange = () => {};

  // 在线用户
  onLineUserTableChange = (data) => {
    this.loadOnlineUserList(data.current);
  };

  // 解析
  getSonDicsByCode = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'homens/getSonDicsByCode',
    }).then((res) => {
      if (res.status === 'OK') {
        this.setState({
          sonDics: res.data,
        });
      }
    });
  };

  getDataPickerDate = (date) => {
    // 时间切换后页面的数据变化
    this.loadSummeryByTime(date);
    this.setState({ dateData: date });
  };
  // 客服列表分页参数
  loadOnlineUserList = (page) => {
    const { dispatch } = this.props;
    const { pagination = {} } = this.onlineTableRef || {};
    dispatch({
      type: 'homens/fetchGetOnlineUserList',
      payload: {
        p: page || 0,
        ps: pagination.pageSize || 10,
      },
    }).then((res) => {
      if (!res) return;
      if (res.status !== 'OK') {
        // message.error(getResMsg(res.msg));
      }
    });
  };

  loadSummeryByTime = (time = []) => {
    const { dispatch } = this.props;
    const starttime = new Date(time[0]).getTime() || '1527091200000';
    const endtime = new Date(time[1]).getTime() || '1527145200000';
    dispatch({
      type: 'homens/fetchSummeryByTime',
      payload: {
        status: endtime - starttime + 1000 >= 1000 * 60 * 60 * 24 ? 1 : 0,
        starttime,
        endtime,
        ps: 10,
        p: 0,
      },
    });
  };
  // 未解决问题
  unSolveQuestionList = (page) => {
    const { pagination = {} } = this.unsolvedRef || {};
    this.props.dispatch({
      type: 'homens/fetchGetUnsolvedQuestionList',
      payload: {
        p: page || 0,
        ps: pagination.pageSize || 10,
      },
    });
  };
  // 热门问题
  mostUsedQuestionList = (page) => {
    const { pagination = {} } = this.mostUsedRef || {};
    this.props.dispatch({
      type: 'homens/fetchGetMostUsedQuestion',
      payload: {
        p: page || 0,
        ps: pagination.pageSize || 10,
      },
    });
  };
  // 加载客服列表
  loadAgentList = (page) => {
    const { pagination = {} } = this.agentListRef || {};
    this.props.dispatch({
      type: 'homens/fetchGetAgentList',
      payload: {
        status: 0,
        p: page || 0,
        ps: pagination.pageSize || 10,
      },
    });
  };
  // 未解决问题翻页
  unSovleTableChange = (data) => {
    this.unSolveQuestionList(data.current);
  };
  // 热门问题翻页
  mostUsedTableChange = (data) => {
    this.mostUsedQuestionList(data.current);
  };
  // 客服翻页
  agenListTableChange = (data) => {
    this.loadAgentList(data.current);
  };

  handleGraphData = (data = []) => {
    const { homens } = this.props;
    const {
      summeryData: { status },
    } = homens || {};
    if (!data.length) return;
    return data.map((item) => {
      // 按小时获取
      if (!status) {
        const time = getHourByMills(item.statisticaltime);
        return { ...item, time };
      }
      if (status === 1) {
        const time = getDayByMills(item.statisticaltime);
        return { ...item, time };
      }
      return item;
    });
  };
  render() {
    const crosshairs = {
      // showTitle: false,
      itemTpl: ' <span>机器人回复率:{value}%</span>',
    };
    const { sonDics } = this.state;
    const { homens, summaryLoading, userListLoading, mostUsedListLoading } = this.props;
    const homeData = (homens.summeryData || {}).statisticalData || {};
    const { graphData = [] } = homens.summeryData || {};
    const flodData = this.handleGraphData(graphData) || [];
    const onlineUserProps = {
      noTotal: true,
      scroll: { y: 300 },
      loading: userListLoading,
      noSelect: true,
      rowKey: (record) => record.id,
      columns: tOnline.columns,
      data: homens.onLineUserList,
      onChange: this.onLineUserTableChange,
      ref: (ele) => {
        this.onlineTableRef = ele;
      },
    };
    // const unsolvedListProps = {
    //   noTotal:true,
    //   scroll:{y:300},
    //   ref:(ele) => { this.unsolvedRef = ele},
    //   noSelect: true,
    //   loading:unSolveLoading,
    //   rowKey:(record) => (record.id),
    //   columns: mostUsed.columns,
    //   data:homens.unsolvedQuestionList,
    //   onChange: this.unSovleTableChange,
    // }
    // 机器人回复率
    const sourceData = [
      { item: '提升效率', count: homeData.efficiency, percent: homeData.efficiency / 100 },
    ];
    /* const dv = new DataSet.View().source(sourceData);
    dv.transform({
      type: 'percent',
      field: 'count',
      dimension: 'item',
      as: 'percent',
    }); */
    return (
      <div className="margin-bottom-20">
        <Spin spinning={summaryLoading}>
          <Row gutter={13} className={styles.topcontainer}>
            <Col span={6}>
              <Card>
                <Popover content={sonDics && sonDics.description} title="描述">
                  <h3 className={styles.center} style={{ cursor: 'pointer' }}>
                    机器人提升效率
                  </h3>
                </Popover>
                <span className={styles.percent}>
                  <span className={styles.percentnb}>{homeData.efficiency || '0'}</span>%
                </span>
                <Pie
                  tooltipText={{ x: '机器人提升效率', y: '机器人未提升效率' }}
                  inner={0.85}
                  animate
                  percent={homeData.efficiency}
                  height={224}
                  lineWidth={1}
                />
                <h4 className={styles.center2}>
                  {`节省人力成本${getMintByMs(homeData.timesaver)}分钟`}
                </h4>
              </Card>
            </Col>
            <Col span={18}>
              <Card>
                <Row>
                  <Col span={18}>
                    <h4 className={styles.h4}>机器人回复率</h4>
                    {!!flodData.length && (
                      <Chart forceFit height={240} data={flodData} scale={scale1} padding="40">
                        <Tooltip {...crosshairs} />
                        <Axis dataKey="time" />
                        <Axis dataKey="responserate" label={{ formatter: (val) => `${val}%` }} />
                        <Line position="time*responserate" />
                        <Area position="time*responserate" />
                      </Chart>
                    )}
                    {!flodData.length && (
                      <div className="text-center font24" style={{ padding: 40 }}>
                        暂无数据
                      </div>
                    )}
                  </Col>
                  <Col span={6}>
                    <CommonDatePicker getDataPickerDate={this.getDataPickerDate} />
                    <div className={styles.card}>
                      <div className={styles.title2}>机器人有效回复次数</div>
                      <span className={styles.nub}>{homeData.effectivenumber || '0'}</span>
                    </div>
                    <div className={styles.card}>
                      <div className={styles.title2}>会话机器人/客服</div>
                      <span className={styles.nub}>
                        {`${homeData.robotcount || '0'}/${homeData.agentcount || '0'}`}
                      </span>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
          <Row gutter={13}>
            <Col span={6}>
              <div className={classname('bgWhite', 'border', styles.leftSunmary)}>
                <div>
                  <Col span={5}>
                    <img src={Group} />
                  </Col>
                  <Col span={17} className="margin-left-15">
                    <p className={styles.title3}>已接待用户数</p>
                    <p className={styles.nub} style={{ margin: 0 }}>
                      {homeData.receptionnumber || '0'}
                    </p>
                  </Col>
                </div>
                <div>
                  <Col span={5}>
                    <img src={Group6} />
                  </Col>
                  <Col span={17} className="margin-left-15">
                    <p className={styles.title3}>平均服务时长</p>
                    <p className={styles.nub} style={{ margin: 0 }}>
                      {`${getMintByMs(homeData.avgservicetime)}分钟`}
                    </p>
                  </Col>
                </div>
                <div>
                  <Col span={5}>
                    <img src={Group7} />
                  </Col>
                  <Col span={17} className="margin-left-15">
                    <p className={styles.title3}>访客数据(IP/PV)</p>
                    <p className={styles.nub} style={{ margin: 0 }}>
                      {homeData.ipnumber}/{homeData.pvnumber}
                    </p>
                  </Col>
                </div>
                <div>
                  <Col span={5} />
                  <Col span={17} className="margin-left-15">
                    <p className={styles.title3} />
                    <p className={styles.nub} style={{ margin: 0 }} />
                  </Col>
                </div>
              </div>
            </Col>
            <Col span={18}>
              <div className="padding-10 bgWhite tableContent border">
                <Tabs size="large">
                  <TabPane tab="当前在线用户" key="online">
                    <StandardTable {...onlineUserProps} />
                  </TabPane>
                  <TabPane tab="解决方案" key="usedQuestion">
                    {/* <StandardTable { ...mostUsedProps} /> */}
                    <SolvedQuestion dateData={this.state.dateData} />
                  </TabPane>
                  <TabPane tab="未解决问题" key="unsolvedQuestion">
                    {/*   <StandardTable { ...unsolvedListProps} /> */}
                    <UnsolvedQuestion dateData={this.state.dateData} />
                  </TabPane>
                </Tabs>
              </div>
            </Col>
          </Row>
        </Spin>
      </div>
    );
  }
}
