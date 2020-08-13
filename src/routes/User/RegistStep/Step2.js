/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-state */
/* eslint-disable import/first */
import styles from './style.less';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Form, Button, Alert, Input, Select } from 'antd';
import { getResMsg } from '../../../utils/codeTransfer';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
class Step2 extends React.PureComponent {
  state = {
    count: 0,
    cteateError: false,
    current: 0,
  };
  componentWillReceiveProps(nextProps) {
    if (this.props.submitting && !nextProps.submitting) {
      if (nextProps.createorg.status === 'success') {
        this.setState({ cteateError: false });
      } else {
        this.setState({ cteateError: true });
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'createorg/getTypeCode',
      payload: {},
    });
    this.props.dispatch({
      type: 'createorg/getScaleCode',
      payload: {},
    });
  }
  // 企业类型
  renderType = (typeCode) => {
    const types = [];
    for (const type of typeCode) {
      types.push(
        <Option key={type.id} value={type.id}>
          {type.name}
        </Option>
      );
    }
    return types;
  };
  // 企业规模
  renderScale = (scaleCode) => {
    const scale = [];
    for (const scal of scaleCode) {
      scale.push(
        <Option key={scal.id} value={scal.id}>
          {scal.name}
        </Option>
      );
    }
    return scale;
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'createorg/doCreate',
          payload: {
            ...values,
          },
        });
      }
    });
  };
  renderMessage = (content) => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };
  // 点击上一步
  onLastStep = () => {
    this.props.dispatch(routerRedux.goBack());
  };
  render() {
    const { form, submitting, createorg } = this.props;
    const { cteateError } = this.state;
    const { typeCode, scaleCode } = createorg;
    const { getFieldDecorator } = form;
    return (
      <Fragment>
        <div style={{ marginTop: 64 }}>
          {createorg.status !== 'OK' &&
            cteateError &&
            this.renderMessage(getResMsg(createorg.status))}
          <Form onSubmit={this.handleSubmit}>
            <FormItem>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入企业名称',
                  },
                ],
              })(<Input size="large" placeholder="请填写企业真实名称" />)}
            </FormItem>
            <FormItem>
              {getFieldDecorator('orgtype', {
                rules: [
                  {
                    required: true,
                    message: '请选择企业类型',
                  },
                ],
              })(
                <Select placeholder="请选择企业类型" size="large">
                  {this.renderType(typeCode)}
                </Select>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('orgscale', {
                rules: [
                  {
                    required: true,
                    message: '请选择企业规模',
                  },
                ],
              })(
                <Select placeholder="请选择企业规模" size="large">
                  {this.renderScale(scaleCode)}
                </Select>
              )}
            </FormItem>

            <FormItem>
              <div className={styles.operRegist}>
                <p className={styles.regist}>
                  已有账户？
                  <Link className={styles.login} to="/user/login">
                    登录
                  </Link>
                </p>
                <div className={styles.operRegistBtn}>
                  <Button style={{ marginRight: 10 }} onClick={this.onLastStep}>
                    上一步
                  </Button>
                  <Button
                    loading={submitting}
                    type="primary"
                    htmlType="submit"
                    onClick={this.handleSubmit}
                  >
                    提交
                  </Button>
                </div>
              </div>
            </FormItem>
          </Form>
        </div>
      </Fragment>
    );
  }
}

export default connect(({ createorg, loading }) => ({
  createorg,
  submitting: loading.effects['createorg/doCreate'],
}))(Step2);
