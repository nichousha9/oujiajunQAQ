import React, { Component } from 'react';
import { connect } from 'dva';
import MonitorList from './components/MonitorList';
import StatisticsModal from './components/StatisticsModal';
import ActivityModal from './components/ActivityModal';
import OperationsModal from './components/OperationsModal';
import RulesModal from './components/RulesModal';
import style from './index.less'

@connect(({ campaignMonitor }) => ({
  showSearchModal: campaignMonitor.showSearchModal,
  isShowStatistics: campaignMonitor.isShowStatistics,
}))
class CampaignMonitor extends Component {
  componentWillUnmount() {
    // 初始化 models
    const { dispatch } = this.props;
    dispatch({
      type: 'campaignMonitor/initState',
    });
  }

  render() {
    const { showSearchModal, isShowStatistics } = this.props;

    return (
      <div className={style.campaignMonitor}>
        <MonitorList />
        {isShowStatistics ? <StatisticsModal /> : null}
        {showSearchModal === 'activity' ? <ActivityModal /> : null}
        {showSearchModal === 'operations' ? <OperationsModal /> : null}
        {showSearchModal === 'rules' ? <RulesModal /> : null}
      </div>
    );
  }
}

export default CampaignMonitor;
