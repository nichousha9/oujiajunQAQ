/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { Tabs, Icon, Modal, message, Button, Divider } from 'antd';
import { connect } from 'dva';
// import { formatMessage } from 'umi-plugin-react/locale';
import classnames from 'classnames';
import router from 'umi/router';
import styles from './index.less';
import FlowSetting from './flowSetting';
import Chart from './chart';

const { TabPane } = Tabs;
const { confirm } = Modal;

@connect(({ user }) => ({
  userInfo: user.userInfo,
}))
class flowChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      campaignInfo: props.campaignInfo,
      campaignId: props.campaignId, // 活动ID
      id: '', // 当前编辑的流程ID
      activityTabs: [], // 活动的tabs
      activeKey: '',
      showFlowSetting: false,
      nextLoding: false,
    };
  }

  componentDidMount = () => {
    this.qryFlowChartByCampaignId();
  };

  // 查询该活动的所有流程
  qryFlowChartByCampaignId = () => {
    const { campaignId } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'activityFlow/qryFlowChartByCampaignId',
      payload: {
        campaignId,
      },
    }).then(res => {
      if (res && res.svcCont && res.svcCont.data) {
        // const {
        //   svcCont: { data = [] },
        // } = res;
        const data = [];
        data.push(res.svcCont.data);

        this.setState({
          activityTabs: data,
          activeKey: data[0].id,
          id: data[0].id,
        });
      } else {
        this.setState({
          id: '',
          showFlowSetting: true,
        });
      }
    });
  };

  changeTabs = activeKey => {
    this.setState({
      activeKey,
      id: activeKey,
    });
  };

  del = index => {
    const { activityTabs } = this.state;
    confirm({
      title: '确定删除该流程吗?',
      onOk: () => {
        if (activityTabs && activityTabs.length == 1) {
          message.warning('请至少有一个流程');
          return;
        }
        activityTabs.splice(index, 1);
        this.setState({
          activityTabs,
          activeKey: activityTabs[0].id,
          id: activityTabs[0].id,
        });
      },
      okText: '确定',
      cancelText: '取消',
    });
  };

  editFlowSetting = id => {
    this.setState({
      id,
      showFlowSetting: true,
    });
  };

  render() {
    const { setStep, location = {} } = this.props;
    const { query } = location;
    const { tempType } = query;
    const {
      activityTabs,
      activeKey,
      showFlowSetting,
      campaignId,
      id,
      nextLoding,
      campaignInfo,
      campaignInfo: { campaignState = 'Editing' },
    } = this.state;
    return (
      <div className={styles.flowChart}>
        <div className={styles.flowHeader}>
          <Tabs
            activeKey={String(activeKey)}
            onChange={this.changeTabs}
            tabBarExtraContent={
              <div className={styles.tabExtra}>
                <Button
                  type="primary"
                  size="small"
                  className={classnames('fr', styles.middle)}
                  loading={nextLoding}
                  onClick={() => {
                    this.setState({ nextLoding: true });
                    setStep(2);
                  }}
                >
                  下一步
                </Button>
                <Button
                  size="small"
                  className={classnames('fr', 'mr10', styles.middle)}
                  onClick={() => {
                    setStep(0);
                  }}
                >
                  上一步
                </Button>
                <Button
                  size="small"
                  className={classnames('fr', 'mr10', styles.middle)}
                  onClick={() => {
                    router.push({
                      pathname:
                        tempType === 'edit'
                          ? '/activityConfigModel'
                          : '/activityConfigManage/marketingActivityList',
                      state: {
                        type: 'cancel',
                      },
                    });
                  }}
                >
                  关闭
                </Button>
              </div>
            }
          >
            {activityTabs.map((item, index) => {
              return (
                <TabPane tab={<div>{item.name}</div>} key={String(item.id)}>
                  {item.id == activeKey ? (
                    <Chart
                      activityInfo={item}
                      campaignInfo={campaignInfo}
                      editFlowSetting={this.editFlowSetting}
                      del={this.del}
                      index={index}
                      setStep={setStep}
                    />
                  ) : null}
                </TabPane>
              );
            })}
          </Tabs>
        </div>

        {/* {showFlowSetting && (
          <FlowSetting
            campaignId={campaignId}
            id={id}
            activityTabs={activityTabs}
            setActivityTabs={v => {
              this.setState({
                activityTabs: v,
              });
            }}
            changeTabs={this.changeTabs}
            cancel={() => {
              this.setState({
                showFlowSetting: false,
              });
            }}
          />
        )} */}
      </div>
    );
  }
}

export default flowChart;
