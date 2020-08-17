import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './index.less';

@connect(({ campaignMonitor }) => ({
  showSearchModal: campaignMonitor.showSearchModal,
  isShowStatistics: campaignMonitor.isShowStatistics,
}))
class CampaignMonitor extends Component {
  componentWillUnmount() {}

  render() {
    return <div className={styles.lyricAnalysis}>舆情分析</div>;
  }
}

export default CampaignMonitor;
