/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Table, Select, Radio, Form, Popover } from 'antd';
// import { Chart, Axis, Line, Area, Tooltip } from 'viser-react';

import moment from 'moment';

import styles from './Index.less';
import MutifyColumnChart from './components/Echarts/LineChart/mutifyColumnChart';
import AreaChart from './components/Echarts/AreaChart/areaChart';
import LineChart from './components/Echarts/LineChart/lineChart';

// import { Bar } from 'ant-design-pro/lib/Charts';
const beginDay = new Date().getTime();
const salesData = [];
for (let i = 0; i < 12; i += 1) {
  salesData.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200,
  });
}

const visitData = [];
for (let i = 0; i < 20; i += 1) {
  visitData.push({
    x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
    y: Math.floor(Math.random() * 100) + 10,
  });
}
@connect(({ operationView }) => ({
  ...operationView,
}))
@Form.create()
export default class Index extends Component {
  state = {
    robotId: '',
    totalDialog: 0,
    monthDialog: 0,
    dialogueType: 'day',
    dialogueChartData: [],
    keyWords: 0,
    knowledge: 0,
    dialogues: 0,
    property: 1,
    propertyData: [],
    label: '知识数量',
    newUserCount: 0,
    activeUserCount: 0,
    userCountTotal: 0,
    userType: 1,
    userList: [],
    rankList: [],
    kdbTitle: 'a',
  };
  componentDidMount() {
    const {
      dispatch,
      form: { setFieldsValue },
    } = this.props;
    dispatch({
      type: 'robotManagement/qryRobotList',
      payload: {
        pageInfo: {
          pageNum: 1,
          pageSize: 100,
        },
      },
      callback: (list) => {
        this.setState({ list });
        const user = localStorage.getItem('smartim-user') || '{}';
        let jurisdiction;
        if (user !== '{}') {
          const { roleList } = JSON.parse(user);
          jurisdiction = roleList.some((item) => item.code === 'ORGI_ADMIN');
        }
        if (jurisdiction) {
          this.getDialogueData();
          this.getDialogueChartData();
          this.getPropertyChartData();
          this.getUserData();
          this.getUserDataChart();
          this.getKdbRankList();
        } else {
          setFieldsValue({ aiStatus: list[0].id });
          this.onRobotChange(list[0].id);
        }
      },
    });
  }

  onRobotChange = (value) => {
    this.setState({ robotId: value }, () => {
      this.getDialogueData();
      this.getDialogueChartData();
      this.getPropertyChartData();
      this.getUserData();
      this.getUserDataChart();
      this.getKdbRankList();
    });
  };

  onDialogueTypeChange = (value) => {
    this.setState(
      {
        dialogueType: value,
      },
      () => {
        this.getDialogueChartData();
      }
    );
  };

  onPropertyChange = (value) => {
    this.setState(
      {
        property: value,
      },
      () => {
        this.getPropertyChartData();
      }
    );
  };

  onRadioChange = (val) => {
    this.setState({ kdbTitle: val.target.value });
    // console.log('val',val)
    if (val.target.value === 'a') {
      this.getKdbRankList();
    } else {
      this.getIntentionList();
    }
  };

  onUserChange = (val) => {
    this.setState(
      {
        userType: val,
      },
      () => {
        this.getUserDataChart();
      }
    );
  };

  getDialogueData = () => {
    const { robotId } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'operationView/dialogCountTotal',
      payload: {
        robotId,
      },
      callback: (res) => {
        if (res.status === 'OK') {
          this.setState({ totalDialog: res.data });
        }
      },
    });
    dispatch({
      type: 'operationView/dialogCountCurrMonth',
      payload: {
        robotId,
      },
      callback: (res) => {
        if (res.status === 'OK') {
          this.setState({ monthDialog: res.data });
        }
      },
    });
    dispatch({
      type: 'operationView/intentTotle',
      payload: {
        robotId,
      },
      callback: (res) => {
        if (res.status === 'OK') {
          this.setState({ dialogues: res.data });
        }
      },
    });
    dispatch({
      type: 'operationView/keywordTotle',
      payload: {
        robotId,
      },
      callback: (res) => {
        if (res.status === 'OK') {
          this.setState({ keyWords: res.data });
        }
      },
    });
    dispatch({
      type: 'operationView/questionTotle',
      payload: {
        robotId,
      },
      callback: (res) => {
        if (res.status === 'OK') {
          this.setState({ knowledge: res.data });
        }
      },
    });
  };

  getDialogueChartData = () => {
    const { robotId, dialogueType } = this.state;
    const { dispatch } = this.props;
    if (dialogueType === 'day') {
      const dataDayList = [];
      dispatch({
        type: 'operationView/dialogCountDay',
        payload: {
          robotId,
        },
        callback: (res) => {
          if (res.status === 'OK') {
            // this.setState({ monthDialog: res.data });
            res.data.dialogCount.map((item, index) =>
              dataDayList.push({
                y1: item.count,
                y2: res.data.effIntentCount[index].count,
                y3: res.data.effKdbCount[index].count,
                x1: item.day,
                // r: item.intTopActiveConv,
              })
            );
            this.setState({ dialogueChartData: dataDayList });
          }
        },
      });
    } else {
      const dataMonthList = [];
      dispatch({
        type: 'operationView/dialogCountMonth',
        payload: {
          robotId,
        },
        callback: (res) => {
          if (res.status === 'OK') {
            // this.setState({ monthDialog: res.data });
            // console.log(res.data)
            res.data.dialogCount.map((item, index) =>
              dataMonthList.push({
                y1: item.count,
                y2: res.data.effIntentCount[index].count,
                y3: res.data.effKdbCount[index].count,
                x1: item.day,
                // r: item.intTopActiveConv,
              })
            );
            this.setState({ dialogueChartData: dataMonthList });
          }
        },
      });
    }
  };

  getPropertyChartData = () => {
    const { robotId, property } = this.state;
    const { dispatch } = this.props;
    if (property === 1) {
      const dataDayList = [];
      dispatch({
        type: 'operationView/questionDayCount',
        payload: {
          robotId,
        },
        callback: (res) => {
          if (res.status === 'OK') {
            // this.setState({ monthDialog: res.data });
            res.data.map((item) =>
              dataDayList.push({
                y1: item.count,
                x1: item.day,
                // r: item.intTopActiveConv,
              })
            );
            this.setState({ propertyData: dataDayList, label: '知识数量' });
          }
        },
      });
    }
    if (property === 2) {
      const dataDayList = [];
      dispatch({
        type: 'operationView/intentDayCount',
        payload: {
          robotId,
        },
        callback: (res) => {
          if (res.status === 'OK') {
            // this.setState({ monthDialog: res.data });
            res.data.map((item) =>
              dataDayList.push({
                y1: item.count,
                x1: item.day,
                // r: item.intTopActiveConv,
              })
            );
            this.setState({ propertyData: dataDayList, label: '意图数量' });
          }
        },
      });
    }
    if (property === 3) {
      const dataDayList = [];
      dispatch({
        type: 'operationView/keywordDayCount',
        payload: {
          robotId,
        },
        callback: (res) => {
          if (res.status === 'OK') {
            // this.setState({ monthDialog: res.data });
            res.data.map((item) =>
              dataDayList.push({
                y1: item.count,
                x1: item.day,
                // r: item.intTopActiveConv,
              })
            );
            this.setState({ propertyData: dataDayList, label: '核心词数量' });
          }
        },
      });
    }
  };

  getUserData = () => {
    const { robotId } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'operationView/userCount',
      payload: {
        robotId,
      },
      callback: (res) => {
        if (res.status === 'OK') {
          this.setState({
            newUserCount: res.data.newUserCount,
            activeUserCount: res.data.activeUserCount,
            userCountTotal: res.data.userCountTotal,
          });
        }
      },
    });
  };

  getUserDataChart = () => {
    const { robotId, userType } = this.state;
    const { dispatch } = this.props;
    if (userType === 1) {
      const dataDayList = [];
      dispatch({
        type: 'operationView/userCountDay',
        payload: {
          robotId,
        },
        callback: (res) => {
          if (res.status === 'OK') {
            // this.setState({ monthDialog: res.data });
            res.data.userCountDay.map((item, index) =>
              dataDayList.push({
                y1: item.count,
                y2: res.data.newUserDay[index].count,
                y3: res.data.activeUserDay ? res.data.activeUserDay[index].count : 0,
                x1: item.day,
                // r: item.intTopActiveConv,
              })
            );
            this.setState({ userList: dataDayList });
          }
        },
      });
    }
    if (userType === 2) {
      const dataDayList = [];
      dispatch({
        type: 'operationView/userCountMonth',
        payload: {
          robotId,
        },
        callback: (res) => {
          if (res.status === 'OK') {
            // this.setState({ monthDialog: res.data });
            res.data.userCountMonth.map((item, index) =>
              dataDayList.push({
                y1: item.count,
                y2: res.data.newUserMonth[index].count,
                y3: res.data.activeUserMonth[index].count,
                x1: item.day,
                // r: item.intTopActiveConv,
              })
            );
            this.setState({ userList: dataDayList });
          }
        },
      });
    }
  };

  getKdbRankList = () => {
    const { robotId } = this.state;
    const { dispatch } = this.props;
    const list = [];
    dispatch({
      type: 'operationView/kdbRankingList',
      payload: {
        robotId,
      },
      callback: (res) => {
        if (res.status === 'OK') {
          // this.setState({ totalDialog: res.data });
          res.data.map((item, index) => {
            list.push({
              index: index + 1,
              ...item,
            });
          });
          this.setState({ rankList: list });
        }
      },
    });
  };

  getIntentionList = () => {
    const { robotId } = this.state;
    const { dispatch } = this.props;
    const list = [];
    dispatch({
      type: 'operationView/intentRankingList',
      payload: {
        robotId,
      },
      callback: (res) => {
        if (res.status === 'OK') {
          // this.setState({ totalDialog: res.data });
          res.data.map((item, index) => {
            list.push({
              index: index + 1,
              ...item,
            });
          });
          this.setState({ rankList: list });
        }
      },
    });
  };

  render() {
    const {
      list = [],
      totalDialog,
      monthDialog,
      dialogueChartData,
      keyWords,
      knowledge,
      dialogues,
      propertyData,
      label,
      newUserCount,
      activeUserCount,
      userCountTotal,
      userList,
      userType,
      rankList,
      kdbTitle,
    } = this.state;

    const columns = [
      {
        title: '排名',
        dataIndex: 'index',
        key: 'index',
        width: 20,

        render: (text) =>
          text < 4 ? (
            <div className={styles.rankBlue}>{text}</div>
          ) : (
            <div className={styles.rankGray}>{text}</div>
          ),
      },
      {
        title: kdbTitle === 'a' ? '知识点' : '意图',
        dataIndex: 'kdbIntentName',
        key: 'kdbIntentName',
        render: (text) => (
          <Popover content={text}>
            <div
              style={{
                width: '100px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {text}
            </div>
          </Popover>
        ),
      },
      {
        title: '历史问答',
        dataIndex: 'count',
        key: 'count',
        textWrap: 'word-break',
        width: 54,
      },
      {
        title: '本月问答',
        key: 'currMonthCount',
        dataIndex: 'currMonthCount',
        width: 54,
        render: (text) => <div style={{ width: '54px' }}>{text}</div>,
      },
      {
        title: '热度',
        key: 'heat',
        render: (text, record) => (
          <div
            style={{ width: `${(Number(record.heat) / 10) * 60}px` }}
            className={styles.progress}
          />
        ),
      },
    ];

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 1 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div className={styles.contentView}>
        <Form {...formItemLayout} className="ant-advanced-search-form">
          <Form.Item label="机器人">
            {getFieldDecorator('aiStatus', {
              rules: [],
            })(
              <Select onChange={this.onRobotChange} style={{ width: '280px' }}>
                {list.map((item) => (
                  <Select.Option value={item.id} key={item.id}>
                    {item.robotName}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
        </Form>
        <Row gutter={20}>
          <Col span={8}>
            <Card style={{ height: '157px' }}>
              <div className={styles.cardTitle} style={{ color: '#319CFF' }}>
                {' '}
                <i
                  className="iconfont commonFontIcon"
                  style={{ color: '#319CFF', marginRight: '10px' }}
                >
                  &#xe60a;
                </i>
                用户数
              </div>
              <Row gutter={15}>
                <Col span={8}>
                  <div className={styles.numDiv}>{userCountTotal}</div>
                  <div className={styles.textGray}>累计用户数</div>
                </Col>
                <Col span={4} />
                <Col span={8}>
                  <div style={{ display: 'flex' }}>
                    <div className={styles.textGray} style={{ marginRight: '19px' }}>
                      新增
                    </div>
                    <div className={styles.colorNum}>{newUserCount}</div>
                  </div>
                  <div style={{ display: 'flex' }}>
                    <div className={styles.textGray} style={{ marginRight: '19px' }}>
                      活跃
                    </div>
                    <div className={styles.colorNum}>{activeUserCount}</div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={8}>
            <Card style={{ height: '157px' }}>
              <div className={styles.cardTitle} style={{ color: '#87CA3E' }}>
                {' '}
                <i
                  className="iconfont commonFontIcon"
                  style={{ color: '#87CA3E', marginRight: '10px' }}
                >
                  &#xe60a;
                </i>
                会话次数
              </div>
              <Row gutter={15}>
                <Col span={2} />
                <Col span={8}>
                  <div style={{ color: ' rgba(135, 202, 62, 1)' }} className={styles.numDivSmall}>
                    {totalDialog}
                  </div>
                  <div className={styles.textGray}>累计问答</div>
                </Col>
                <Col span={4} />
                <Col span={8}>
                  <div style={{ color: ' rgba(135, 202, 62, 1)' }} className={styles.numDivSmall}>
                    {monthDialog}
                  </div>
                  <div className={styles.textGray}>本月问答</div>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={8}>
            <Card style={{ height: '157px' }}>
              <div className={styles.cardTitle} style={{ color: '#FFA811' }}>
                <i
                  className="iconfont commonFontIcon"
                  style={{ color: '#FFA811', marginRight: '10px' }}
                >
                  &#xe60a;
                </i>
                资产量
              </div>
              <Row>
                <Col span={8}>
                  <div style={{ color: ' rgba(255, 161, 12, 1)' }} className={styles.numDivSmall}>
                    {keyWords}
                  </div>
                  <div className={styles.textGray}>现有核心词</div>
                </Col>
                <Col span={8}>
                  <div style={{ color: ' rgba(255, 161, 12, 1)' }} className={styles.numDivSmall}>
                    {knowledge}
                  </div>
                  <div className={styles.textGray}>现有知识</div>
                </Col>
                <Col span={8}>
                  <div style={{ color: ' rgba(255, 161, 12, 1)' }} className={styles.numDivSmall}>
                    {dialogues}
                  </div>
                  <div className={styles.textGray}>现有意图</div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Row style={{ marginTop: '24px' }} gutter={24}>
          <Col span={13}>
            <Card style={{ height: '340px' }}>
              <div className={styles.titleDiv}>
                <div className={styles.title4}>接待用户分析</div>
                <div className={styles.textGray}>
                  账期：
                  <Select defaultValue={1} style={{ width: '180px' }} onChange={this.onUserChange}>
                    <Select.Option value={1}>近七天</Select.Option>
                    <Select.Option value={2}>近半年</Select.Option>
                  </Select>
                </div>
              </div>
              <div style={{ height: '280px' }}>
                <MutifyColumnChart
                  height="100%"
                  width="100%"
                  data={userList}
                  labels={
                    userType === 1 ? ['总用户', '新增用户'] : ['总用户', '新增用户', '活跃用户']
                  }
                  lines={[0, 0, 0]}
                />
              </div>
            </Card>
          </Col>
          <Col span={11}>
            <Card style={{ height: '340px' }}>
              <div className={styles.titleDiv}>
                <div className={styles.title4}>近七天用户资产分析</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <Select defaultValue={1} onChange={this.onPropertyChange}>
                  <Select.Option value={1}>知识</Select.Option>
                  <Select.Option value={2}>意图</Select.Option>
                  <Select.Option value={3}>核心词</Select.Option>
                </Select>
              </div>
              <div style={{ height: '280px' }}>
                <AreaChart
                  height="100%"
                  width="100%"
                  barChartData={propertyData}
                  lines={[0, 0, 0]}
                  label={label}
                  colors={['#30C15B', '#F89742', 'rgb(25,144,255)']}
                />
              </div>
            </Card>
          </Col>
        </Row>
        <Row style={{ marginTop: '24px' }} gutter={24}>
          <Col span={13}>
            <Card style={{ height: '530px' }}>
              <div className={styles.titleDiv}>
                <div className={styles.title4}>系统会话分析</div>
                <div className={styles.textGray}>
                  账期：
                  <Select
                    defaultValue="day"
                    style={{ width: '180px' }}
                    onChange={this.onDialogueTypeChange}
                  >
                    <Select.Option value="day">近七天</Select.Option>
                    <Select.Option value="month">近半年</Select.Option>
                  </Select>
                </div>
              </div>
              <Row gutter={15}>
                <Col span={24}>
                  <div style={{ height: '380px' }}>
                    <LineChart
                      height="100%"
                      width="100%"
                      labels={['问答次数', '有效意图', '有效知识问答']}
                      data={dialogueChartData}
                      lines={[0, 0, 0]}
                    />
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={11}>
            <Card style={{ height: '530px' }}>
              <div className={styles.titleDiv}>
                <div className={styles.title4}>
                  {kdbTitle === 'a' ? '知识库' : '意图'}被使用排行榜
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                <Radio.Group defaultValue="a" onChange={this.onRadioChange}>
                  <Radio.Button value="a">知识库问答</Radio.Button>
                  <Radio.Button value="b">意图问答</Radio.Button>
                </Radio.Group>
              </div>
              <Table
                style={{ marginTop: '10px' }}
                rowKey="kdbIntentId"
                columns={columns}
                dataSource={rankList}
                pagination={false}
              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
