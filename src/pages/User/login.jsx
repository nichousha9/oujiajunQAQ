import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Icon, Row } from 'antd';
import { router } from 'umi';
import styles from './login.less';

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['user/login'],
}))
@Form.create()
class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    const { location } = props;
    const { sso } = location.query;
    // 如果不是统一门户登陆不允许访问，
    // if (!sso) {
    //   router.push({
    //     pathname: '/403',
    //   });
    // }
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'user/getLogin',
          payload: {
            ...values,
          },
        });
      }
    });
  };

  render() {
    const {
      submitting,
      form: { getFieldDecorator },
    } = this.props;

    return (
      <div className={styles.login}>
        <div className={styles.login_box}>
          <div style={{ height: '15px' }} />
          <div className={styles.login_box_title}>同仁堂数据应用</div>
          <div className={styles.login_box_cont}>
            <div className={styles.ipt_box_cont}>
              <Form onSubmit={this.handleSubmit}>
                <Form.Item>
                  {getFieldDecorator('user', {
                    initialValue: '',
                    rules: [
                      {
                        required: true,
                        message: '账号不能为空',
                      },
                    ],
                  })(
                    <Input
                      prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder="请输入您的账号"
                      size="large"
                    />,
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('password', {
                    initialValue: '',
                    rules: [
                      {
                        required: true,
                        message: '密码不能为空',
                      },
                    ],
                  })(
                    <Input
                      prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      type="password"
                      placeholder="请输入您的密码"
                      size="large"
                    />,
                  )}
                </Form.Item>
                <Row className={styles.signin}>
                  <Form.Item>
                    <Button
                      style={{ width: `${100}%`, height: 40 }}
                      type="primary"
                      htmlType="submit"
                      loading={submitting}
                    >
                      登录
                    </Button>
                  </Form.Item>
                </Row>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginPage;
