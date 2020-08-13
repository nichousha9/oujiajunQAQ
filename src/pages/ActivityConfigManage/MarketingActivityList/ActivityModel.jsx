/* eslint-disable no-console */
import React from 'react';

import { Input, Form, Modal } from 'antd';

@Form.create()
class ActivityModel extends React.Component {
  state = {
    confirmLoading: false,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps === false) {
      this.setState({ confirmLoading: false });
    }
  }

  handleSubmit = e => {
    const { form, handleOk } = this.props;
    e.preventDefault();

    form.validateFields((err, values) => {
      if (!err) {
        this.setState({ confirmLoading: true });
        handleOk(values.tempName);
      }
    });
  };

  render() {
    const { form, visible, handleCancel } = this.props;
    const { confirmLoading } = this.state;
    const { getFieldDecorator } = form;

    return (
      <Modal
        title="活动配置转成模板"
        visible={visible}
        onCancel={handleCancel}
        onOk={this.handleSubmit}
        confirmLoading={confirmLoading}
      >
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item label="模板名称">
            {getFieldDecorator('tempName', {
              rules: [{ required: true, message: '请输入模板名称!' }],
            })(<Input placeholder="请输入模板名称" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default ActivityModel;
