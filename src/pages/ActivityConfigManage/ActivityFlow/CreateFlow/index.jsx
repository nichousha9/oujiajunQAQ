import React, { Component, Fragment } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Steps, message } from 'antd';
import { withRouter } from 'dva/router';
import styles from './index.less';
import ActivityDesc from './activityDesc';
import FlowChart from './flowChart';
import ResultChart from './resultChart';

const { Step } = Steps;

class ActivityFlow extends Component {
  constructor(props) {
    const {
      location: { query = {} },
    } = props;
    super(props);
    this.state = {
      current: 0,
      campaignId: query.id ? query.id : '',
      campaignInfo: {}, // 活动信息
    };
  }

  getActivityDesc = (id, campaignInfo) => {
    this.setState({
      campaignId: id,
      current: 1,
      campaignInfo,
    });
  };

  setStep = current => {
    const { current: currentStep, campaignId } = this.state;
    // 判断为新增的时候，不允许跳过步骤
    if (!campaignId && currentStep === 0 && current === 2) {
      message.warn('请按照步骤新增');
      return;
    }
    this.setState({
      current,
    });
  };

  render() {
    const { current, campaignId, campaignInfo } = this.state;
    const { location } = this.props;
    return (
      <Fragment>
        <div className={styles.stepContainer}>
          <Steps current={current}>
            <Step
              title={formatMessage(
                {
                  id: 'activityConfigManage.activityFlow.desc',
                },
                '活动概述',
              )}
            />
            <Step
              title={formatMessage(
                {
                  id: 'activityConfigManage.activityFlow.flow',
                },
                '营销流程',
              )}
            />
            <Step
              title={formatMessage(
                {
                  id: 'activityConfigManage.activityFlow.finish',
                },
                '完成',
              )}
            />
          </Steps>
        </div>

        <div className={styles.main}>
          <div>
            {current == 0 && (
              <ActivityDesc getActivityDesc={this.getActivityDesc} campaignId={campaignId} />
            )}
          </div>

          <div>
            {current == 1 && (
              <FlowChart
                campaignId={campaignId}
                campaignInfo={campaignInfo}
                setStep={this.setStep}
                location={location}
              />
            )}
          </div>

          <div>
            {current == 2 && <ResultChart campaignId={campaignId} campaignInfo={campaignInfo} />}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default withRouter(ActivityFlow);
