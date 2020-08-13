import React from 'react';
import { Tabs } from 'antd';
import { connect } from 'dva';
import RobotResponse from './RobotResponse';
import CustomerService from './CustomerService';
import Communication from './Communication';
import Guest from './Guest';
import TabActionList from './TabActionList';
import { authResource, hasResource } from '../../utils/utils';

const { TabPane } = Tabs;

@connect(({ statisticBasicIndex }) => ({ statisticBasicIndex }))
export default class BasicIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: '1',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'statisticBasicIndex/getUserOrganTree',
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'statisticBasicIndex/clearSaticBasicIndex',
    });
  }
  tabChange = (key) => {
    const activeKey = Number(key);

    // 每次Tab切换的时候查询的参数清空了 暂时不用
    // dispatch({type:'statisticBasicIndex/clearSaticBasicIndex'});
    this.setState({ activeKey });
  };
  handleGetDefaultKey = () => {
    let activeKey = '';
    const authArr = [
      hasResource(authResource.statisticAgent),
      hasResource(authResource.statisticAgentUser),
      hasResource(authResource.statisticRobot),
      hasResource(authResource.statisticCommunication),
    ];
    authArr.forEach((item, i) => {
      if (!activeKey && !!item) {
        activeKey = i + 1;
      }
    });
    return activeKey;
  };
  // hasResource(authResource.statisticAgent) &&
  // hasResource(authResource.statisticAgentUser) &&
  // hasResource(authResource.statisticRobot) &&
  // hasResource(authResource.statisticCommunication) &&
  render() {
    const { activeKey } = this.state;
    const {
      statisticBasicIndex: { curUserOrganList = [] },
    } = this.props;
    if (!curUserOrganList.length) return null;
    return (
      <div className="selfAdapt">
        <Tabs
          type="card"
          tabBarStyle={{ paddingLeft: 10 }}
          tabBarExtraContent={
            <TabActionList curUserOrganList={curUserOrganList} activeKey={activeKey} />
          }
          onChange={this.tabChange}
        >
          {
            <TabPane tab="访客统计" key="1">
              <Guest activeKey={activeKey} />
            </TabPane>
          }
          {
            <TabPane tab="客服统计" key="2">
              <CustomerService activeKey={activeKey} />
            </TabPane>
          }
          {
            <TabPane tab="机器人回复统计" key="3">
              <RobotResponse activeKey={activeKey} />
            </TabPane>
          }
          {
            <TabPane tab="通讯统计" key="4">
              <Communication activeKey={activeKey} />
            </TabPane>
          }
        </Tabs>
      </div>
    );
  }
}
