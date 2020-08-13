import React, { Component } from 'react';
import { Form, Input, Modal } from 'antd';
import { connect } from 'dva';

@Form.create()
@connect(({ loading, approveList }) => ({
  confirmLoading: loading.effects['approveList/copyApprovalFlowchart'],
  copyApproveInfo: approveList.copyApproveInfo,
}))
class CopyApprove extends Component {
  // 确认
  handleOk = () => {
    const { form, copyApproveInfo, okCallback } = this.props;
    form.validateFields((errors, values) => {
      if (!errors) {
        okCallback(copyApproveInfo.id, values.name);
      }
    });
  };

  // 取消
  handleChannel = () => {
    const { setVisible } = this.props;
    setVisible(false);
  };

  render() {
    const { form, confirmLoading, copyApproveInfo } = this.props;
    return (
      <Modal
        title="复制审批模板"
        visible
        onCancel={this.handleChannel}
        onOk={this.handleOk}
        confirmLoading={!!confirmLoading}
        destroyOnClose
      >
        <Form>
          <Form.Item>
            {form.getFieldDecorator('name', {
              initialValue: `${copyApproveInfo.name}的复制`,
              rules: [{ required: true, message: '请输入新模板的名称' }],
            })(<Input placeholder="请输入新模板的名称" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default CopyApprove;
