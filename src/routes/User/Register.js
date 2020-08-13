import React, { Component } from 'react';
import { Route, Switch } from 'dva/router';
import { Form, Steps } from 'antd';
import styles from './Register.less';
import NotFound from '../Exception/404';
import { getRoutes } from '../../utils/utils';

const { Step } = Steps;

@Form.create()
export default class Register extends Component {
  getCurrentStep() {
    const { location } = this.props;
    const { pathname } = location;
    const pathList = pathname.split('/');
    switch (pathList[pathList.length - 1]) {
      case 'basic':
        return 0;
      case 'org':
        return 1;
      default:
        return 0;
    }
  }
  render() {
    const { match, routerData } = this.props;
    return (
      <div className={styles.main}>
        <div className={styles.title}>
          <span>注册U蜜</span>
          <p>只要简单两步，免费体验所有功能</p>
        </div>
        <Steps current={this.getCurrentStep()} className={styles.stepDiv} size="small">
          <Step title="基本信息" className={styles.step} />
          <Step title="企业信息" className={styles.step} />
        </Steps>
        <Switch>
          {getRoutes(match.path, routerData).map((item) => (
            <Route key={item.key} path={item.path} component={item.component} exact={item.exact} />
          ))}
          <Route render={NotFound} />
        </Switch>
      </div>
    );
  }
}
