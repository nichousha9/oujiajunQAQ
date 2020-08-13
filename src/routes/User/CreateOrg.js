/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Form, Input, Button, Select, Alert } from 'antd';
import styles from './CreateOrg.less';
import { getResMsg } from '../../utils/codeTransfer';

const FormItem = Form.Item;
const { Option } = Select;


@connect(({ createorg, loading }) => ({
  createorg,
  submitting: loading.effects['createorg/doCreate'],
}))
@Form.create()
export default class CreateOrg extends Component {
  state = {};
  sumYet = false; // 用来判断是否点击按钮

  componentWillMount() {
    this.props.dispatch({
      type: 'createorg/getTypeCode',
      payload: {},
    });
    this.props.dispatch({
      type: 'createorg/getScaleCode',
      payload: {},
    });
  }



  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        this.sumYet = true;
        this.props.dispatch({
          type: 'createorg/doCreate',
          payload: {
            ...values,
          },
        });
      }
    });
  };

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
  renderMessage = (content) => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };

  render() {
    const { form, submitting, createorg } = this.props;
    const { typeCode, scaleCode } = createorg;
    const { getFieldDecorator } = form;
    return (
      <div className={styles.main}>
        <h3>注册</h3>
        {createorg.status !== 'OK' &&
          this.sumYet &&
          !submitting &&
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
            })(<Input size="large" placeholder="企业名称" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('orgtype', {
              rules: [
                {
                  required: true,
                  message: '请选择企业类型',
                },
              ],
            })(<Select>{this.renderType(typeCode)}</Select>)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('orgscale', {
              rules: [
                {
                  required: true,
                  message: '请选择企业规模',
                },
              ],
            })(<Select>{this.renderScale(scaleCode)}</Select>)}
          </FormItem>

          <FormItem>
            <Button
              size="large"
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              注册
            </Button>
            <Link className={styles.login} to="/user/login">
              使用已有账户登录
            </Link>
          </FormItem>
        </Form>
      </div>
    );
  }
}
