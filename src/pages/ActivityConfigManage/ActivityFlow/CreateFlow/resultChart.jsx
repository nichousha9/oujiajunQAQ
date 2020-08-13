import React, { Component, Fragment } from 'react';
// import { formatMessage } from 'umi-plugin-react/locale';
import { withRouter } from 'dva/router';
import { connect } from 'dva';
import Link from 'umi/link';
import Iconfont from '@/components/Iconfont';
import styles from './index.less';

@connect(({ common, user }) => ({
  attrSpecCodeList: common.attrSpecCodeList,
  userInfo: user.userInfo,
}))
class ResultChart extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    // this.queryCampignKpi();
  };

  queryCampignKpi = () => {
    const { campaignId, dispatch } = this.props;
    if (campaignId) {
      dispatch({
        type: 'activityFlow/queryCampignKpi',
        payload: { campaignId, pageInfo: { pageNum: 1, pageSize: 10 } },
      });
    }
  };

  render() {
    const {
      history: { location },
    } = this.props;
    const {
      query: { tempType },
    } = location;

    return (
      <Fragment>
        <div className={styles.resuleChartBox}>
          <Iconfont type="iconcheckx" className={styles.icon} />
          <div className={styles.finish}>完成</div>
          {tempType === 'edit' ? (
            <Link
              to={{
                pathname: '/activityConfigModel',
              }}
            >
              返回活动配置模板
            </Link>
          ) : (
            <Link
              to={{
                pathname: '/activityConfigManage/marketingActivityList',
                state: {
                  type: 'cancel',
                },
              }}
            >
              返回活动列表
            </Link>
          )}
        </div>
      </Fragment>
    );
  }
}

export default withRouter(ResultChart);
