/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/no-string-refs */
/* eslint-disable prefer-template */
/* eslint-disable import/first */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Checkbox, Alert, Form, message } from 'antd';
import { Base64 } from 'js-base64';
import Login from 'components/Login';
import styles from './Login.less';
// import { getResMsg } from '../../utils/codeTransfer';
import classnames from 'classnames';
import logo from '../../assets/logo.svg';
import '../../common/less/common.less';
import { getDownAdress } from '../../services/api';

const { Tab, UserName, Password, Submit } = Login;

@Form.create()
@connect(({ login, loading, global }) => ({
  login,
  global,
  logining: loading.effects['login/login'],
  sendding: loading.effects['global/sendMsg'],
}))
export default class LoginPage extends Component {
  constructor(props) {
    super(props);
    const {
      location: { query = {} },
    } = props;
    // 用于重定向
    const { reloadCallBack = () => {} } = query;
    if (reloadCallBack) reloadCallBack();
    this.state = {
      type: 'account',
      autoLogin: true,
      error: false,
      globalError: false,
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'login/selectStaffMenus' });
    if (window.socket) window.socket.forceClose(); // 断开已有连接
    const accessToken = this.getUrlParam('accessToken');
    if (accessToken != null) {
      this.props.dispatch({
        type: 'login/login',
        payload: {
          accessToken,
        },
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (!nextProps.logining && this.props.logining) {
      if (nextProps.login.status !== 'OK') {
        this.setState({ error: true });
      }
    }
    if (!nextProps.sendding && this.props.sendding) {
      if (nextProps.global.status !== 'OK') {
        this.setState({ globalError: true });
      } else {
        message.success('发送成功！');
      }
    }
  }
  onTabChange = (type) => {
    this.setState({ type });
  };

  getUrlParam = (name) => {
    const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'); // 构造一个含有目标参数的正则表达式对象
    const num = window.location.href.indexOf('?') + 1;
    const r = window.location.href.substr(num).match(reg); // 匹配目标参数
    if (r != null) {
      return unescape(r[2]);
    }
    return null; // 返回参数值
  };

  getDownLink = (code) => {
    if (!code) return;
    getDownAdress({
      paramcode: code,
    }).then((res) => {
      if (res && res.status === 'OK') {
        if (res.data.paramval) window.open(res.data.paramval);
      }
    });
  };

  handleSubmit = (err, values) => {
    // const { type } = this.state;
    if (!err) {
      this.props.dispatch({
        type: 'login/login',
        payload: {
          ...values,
          password: Base64.encode(values.password),
          sla: '1',
          type: this.state.type,
        },
      });
    }
  };

  changeAutoLogin = (e) => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

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
          status: '0', // 代表登录
        },
      });
      cb();
    } else {
      this.props.global.status = 'sms_phone_format_error';
      this.setState({ globalError: true });
    }
  };

  renderMessage = (content) => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };
  render() {
    const { login, logining } = this.props;

    // const globalModel = this.props.global;
    // eslint-disable-next-line no-unused-vars
    const { type, error, globalError } = this.state;
    return (
      <React.Fragment>
        <div
          className={classnames(styles.loginHeader, 'border-bottom height64 line-height64 bgWhite')}
        >
          <img src={logo} />
          <h1>鲸智小蜜</h1>
          <div className="textRight flex1">
            <span>
              <a
                onClick={() => {
                  this.getDownLink('com.smartim.exe.url');
                }}
              >
                <i className="iconfont icon-download" />
                应用下载
              </a>
            </span>
            <span>
              <a
                onClick={() => {
                  this.getDownLink('com.smartim.operationbook.link');
                }}
              >
                <i className="iconfont icon-book" />
                使用手册
              </a>
            </span>
            {/*            <span>
              <i className="iconfont icon-contact" />联系我们
            </span> */}
          </div>
        </div>
        <div className={styles.main}>
          <Login
            defaultActiveKey={type}
            ref="login"
            onTabChange={this.onTabChange}
            onSubmit={this.handleSubmit}
          >
            <Tab key="account" tab="账户密码登录">
              {login.status !== 'OK' &&
                type === 'account' &&
                error &&
                this.renderMessage(login.msgStatus)}
              {login.status === 'OK' && login.noAuth}
              <UserName name="username" placeholder="账号" />
              <Password name="password" type="password" placeholder="密码" />
            </Tab>
            {/* <Tab key="mobile" tab="手机号登录">
              {
                login.status !== 'OK' && type === 'mobile' && error &&
                this.renderMessage(login.status)
              }
              {
                globalModel.status !== 'OK' && globalError && this.renderMessage(globalModel.status)
              }
              <Mobile name="mobile" placeholder="手机号" style={{ marginBottom: 10 }} />
              <Captcha name="code" onGetCaptcha={this.sendMsg} placeholder="验证码" style={{ marginBottom: 10 }} />
              {<Input placeholder="验证码" style={{marginBottom: 20}}/>}
            </Tab> */}
            <div>
              <Checkbox checked={this.state.autoLogin} onChange={this.changeAutoLogin}>
                自动登录
              </Checkbox>
              {/* <Link className={styles.login} to="/user/register/basic">
                注册账户
              </Link> */}
              {/*              <a className={styles.fogetPW}>
                忘记密码
              </a> */}
            </div>
            <Submit loading={logining}>立即登录</Submit>
            {/* <p className="regist">还没有账号？
              <Link className={styles.login} to="/user/register">
                    注册新账号
                </Link>
        </p> */}
          </Login>
        </div>
      </React.Fragment>
    );
  }
}
