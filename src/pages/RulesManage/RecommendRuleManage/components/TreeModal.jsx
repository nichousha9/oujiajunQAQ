import React, { Component } from 'react';
import { Modal, Form, Button, Radio, Input } from 'antd';
import styles from '../index.less';
@Form.create()
class TreeModal extends Component {
  handleAddModalCancel=()=>{

  };

  render() {
    const { form, modalVisible,modalTitle,closeTreeModal } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        span: 4,
        offset: 2,
      },
      wrapperCol: {
        span: 16,
      },
    };
    return (
      <Modal
        title={modalTitle}
        visible={modalVisible}
        onCancel={closeTreeModal}
        footer={
          <div className={styles.modalFooter}>
            <Button type="primary" size="small" onClick={this.handleAddModalOK}>
              确认
            </Button>
            <Button size="small" onClick={closeTreeModal}>
              取消
            </Button>
          </div>
        }
      >
        <Form {...formItemLayout}>
          <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
            {getFieldDecorator('model', {
              rules: [],
              initialValue: 'addChild',
            })(
              <Radio.Group onChange={this.changeAddModel}>
                <Radio value="addChild">新增子目录</Radio>
                <Radio value="addRoot">新增根目录</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
          {/* style={{ display: isAddChild ? 'block' : 'none' }} */}
          <Form.Item label="父级目录">
            {getFieldDecorator('parentName', {
              rules: [],
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item label="目录名称">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入目录名称' }],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="目录描述">
            {getFieldDecorator('description', {
              rules: [],
            })(<Input />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default TreeModal;
