import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col, Input, Icon } from 'antd';
import omit from 'omit.js';
import styles from './index.less';
import map from './map';

const FormItem = Form.Item;

function generator({ defaultProps, defaultRules, type }) {
  return WrappedComponent => {
    return class BasicComponent extends Component {
      static contextTypes = {
        form: PropTypes.object,
        updateActive: PropTypes.func,
      };
      constructor(props) {
        super(props);
        this.state = {
          count: 0,
        };
      }
      componentDidMount() {
        if (this.context.updateActive) {
          this.context.updateActive(this.props.name);
        }
      }
      componentWillUnmount() {
        clearInterval(this.interval);
      }
      onGetCaptcha = () => {

        if (this.props.onGetCaptcha) {
          this.props.onGetCaptcha(()=>{
              let count = 59;
              this.setState({ count });
              this.interval = setInterval(() => {
                count -= 1;
                this.setState({ count });
                if (count === 0) {
                  clearInterval(this.interval);
                }
              }, 1000);
          });
        }

      };
      reset = () => {
          this.setState({ count : 0 });
          clearInterval(this.interval);
      }
      checkConfirm = (rule, value, callback) => {
        const { form } = this.context;
        if (value && value !== form.getFieldValue('password')) {
          callback('两次输入的密码不匹配!');
        } else {
          callback();
        }
      };
      render() {
        const { getFieldDecorator } = this.context.form;
        const options = {};
        let otherProps = {};
        const { onChange, defaultValue, rules, name, ...restProps } = this.props;
        const { count } = this.state;
        options.rules = rules || defaultRules;
        if (onChange) {
          options.onChange = onChange;
        }
        if (defaultValue) {
          options.initialValue = defaultValue;
        }
        otherProps = restProps || otherProps;
        if (type === 'Captcha') {
          const inputProps = omit(otherProps, ['onGetCaptcha']);
          return (
            <FormItem>
              <Row gutter={8}>
                <Col span={16}>
                  {getFieldDecorator(name, options)(
                    <WrappedComponent {...defaultProps} {...inputProps} />
                  )}
                </Col>
                <Col span={8}>
                  <Button
                    disabled={count}
                    className={styles.getCaptcha}
                    size="large"
                    onClick={this.onGetCaptcha}
                  >
                    {count ? `${count} s` : '获取验证码'}
                  </Button>
                </Col>
              </Row>
            </FormItem>
          );
      }else if (type === 'ConfirmPassword') {
          return (
            <FormItem>
              {getFieldDecorator('confirm', {
                rules: [
                  {
                    required: true,
                    message: '请确认密码！',
                  },
                  {
                    validator: this.checkConfirm,
                  },
                ],
            })(<Input size="large" type="password" placeholder="请确认密码" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0, 0.25)' }} />}/>)}
            </FormItem>
          );
        }
        return (
          <FormItem>
            {getFieldDecorator(name, options)(
              <WrappedComponent {...defaultProps} {...otherProps} />
            )}
          </FormItem>
        );
      }
    };
  };
}

const LoginItem = {};
Object.keys(map).forEach(item => {
  LoginItem[item] = generator({
    defaultProps: map[item].props,
    defaultRules: map[item].rules,
    type: item,
  })(map[item].component);
});

export default LoginItem;
