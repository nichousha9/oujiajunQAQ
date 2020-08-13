/* eslint-disable react/no-unused-state */
/* eslint-disable react/no-string-refs */
/* eslint-disable react/sort-comp */
/* eslint-disable import/first */
import styles from './style.less';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Form, Button, Alert, message } from 'antd';
import { getResMsg } from '../../../utils/codeTransfer';
import Login from 'components/Login';

const { UserName, Password, Mobile, Captcha, Submit, ConfirmPassword } = Login;

@Form.create()
class Step1 extends React.PureComponent {
  state = {
    count: 0,
    registError: false,
    loginError: false,
    current: 0,
    globalError: false,
  };
  values = {};
  
  componentWillReceiveProps(nextProps) {
    const { username, password } = this.values;
    if (this.props.submitting && !nextProps.submitting) {
      if (nextProps.register.status === 'success') {
        this.setState({ registError: false });
        // 注册成功，调用登录
        this.props.dispatch({
          type: 'login/login',
          payload: {
            username,
            password,
            sla: '1',
            from: 'register',
          },
        });
      } else {
        this.setState({ registError: true });
      }
    }
    if (!nextProps.sendding && this.props.sendding) {
      if (nextProps.global.status !== 'OK') {
        this.setState({ globalError: true });
      } else {
        message.success('发送成功！');
      }
    }
    if (this.props.logining && !nextProps.logining) {
      if (nextProps.login.status === 'OK') {
        this.setState({ loginError: false });
        // 登录成功，跳转到企业创建页面
        this.props.dispatch(routerRedux.push('/user/register/org'));
      } else {
        this.setState({ loginError: true });
      }
    }
  }
  // 发送短信
  sendMsg = (cb) => {
    const form = this.refs.login.getForm();
    const mobile = form.getFieldValue('mobile');
    if (/^1\d{10}$/.test(mobile)) {
      this.setState({ globalError: false });
      this.props.dispatch({
        type: 'global/sendMsg',
        payload: {
          phoneNumber: mobile,
          status: '1', // 代表注册
        },
      });
      cb();
    } else {
      this.props.global.status = 'sms_phone_format_error';
      this.setState({ globalError: true });
    }
  };
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  handleSubmit = (err, values) => {
    if (!err) {
      this.setState({ globalError: false });
      if (values.password !== values.confirm) {
        return;
      }
      this.values = values;
      this.props.dispatch({
        type: 'register/doRegist',
        payload: {
          ...values,
        },
      });
    }
  };
  renderMessage = (content) => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };
  // 点击取消
  onCancel = () => {
    this.props.dispatch(routerRedux.goBack());
  };
  // 点击上一步
  onLastStep = () => {
    this.props.dispatch(routerRedux.goBack());
  };
  render() {
    const { submitting, register, login } = this.props;
    const globalModel = this.props.global;
    const { registError, loginError, globalError } = this.state;
    return (
      <Fragment>
        <div className={styles.formDiv}>
          {register.status !== 'success' &&
            registError &&
            this.renderMessage(getResMsg(register.status))}
          {login.status !== 'OK' &&
            loginError &&
            this.renderMessage('登录异常，请前往登录页面登录！')}
          {globalModel.status !== 'OK' &&
            globalError &&
            this.renderMessage(getResMsg(globalModel.status))}
          <Login onSubmit={this.handleSubmit} ref="login">
            <UserName name="username" placeholder="用户名" className={styles.formItem} />
            <Mobile name="mobile" placeholder="手机号" className={styles.formItem} />
            <Captcha
              name="code"
              onGetCaptcha={this.sendMsg}
              placeholder="验证码"
              className={styles.formItem}
            />
            <Password name="password" placeholder="请输入密码" className={styles.formItem} />
            <ConfirmPassword name="confirm" placeholder="请确认密码" className={styles.formItem} />
            <div className={styles.operRegist}>
              <p className={styles.regist}>
                已有账户？
                <Link className={styles.login} to="/user/login">
                  登录
                </Link>
              </p>
              <div className={styles.operRegistBtn}>
                <Button style={{ marginRight: 10 }} onClick={this.onCancel}>
                  取消
                </Button>
                <Submit loading={submitting} style={{ marginTop: 0, height: 32 }}>
                  <Button loading={submitting} type="primary" htmlType="submit">
                    下一步
                  </Button>
                </Submit>
              </div>
            </div>
          </Login>
        </div>
      </Fragment>
    );
  }
}

export default connect(({ login, register, loading, global }) => ({
  login,
  register,
  global,
  submitting: loading.effects['register/doRegist'],
  logining: loading.effects['login/login'],
  sendding: loading.effects['global/sendMsg'],
}))(Step1);
