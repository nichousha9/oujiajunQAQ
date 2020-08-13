import React from 'react';
import { Modal, Button, Row, Input, message, Form } from 'antd';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 15,
  },
};

@Form.create()
export default class AddSceneModal extends React.Component {
  // 启用停用
  setAble = (e) => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ isEnable: e });
  };

  // 提交
  handleOk = () => {
    const {
      form: { validateFieldsAndScroll },
    } = this.props;
    validateFieldsAndScroll((err, values) => {
      if (err) return;
      const { onOk, editData = {} } = this.props;
      let obj = {
        ...values,
        // isEnable: values.isEnable ? '1' :'0',
      };
      if (editData.id) {
        obj = { ...obj, id: editData.id };
      }
      if (onOk)
        onOk(obj, () => {
          message.success(editData.id ? '修改成功' : '添加成功');
        });
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      visible,
      closeModal,
      loading,
      editData = {},
    } = this.props;
    return (
      <Modal
        className="commonModal"
        maskClosable={false}
        visible={visible}
        title={editData.id ? '修改' : '新增'}
        onOk={this.handleOk}
        onCancel={closeModal}
        bodyStyle={{ padding: 0 }}
        footer={[
          <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
            提交
          </Button>,
        ]}
      >
        <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
          <Row>
            <FormItem {...formItemLayout} label="名称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入名称！',
                  },
                ],
                initialValue: editData.name || '',
              })(<Input placeholder="请输入名称" />)}
            </FormItem>
          </Row>
          <Row>
            <FormItem {...formItemLayout} label="描述">
              {getFieldDecorator('describe', {
                rules: [
                  {
                    required: true,
                    message: '请输入描述！',
                  },
                ],
                initialValue: editData.describe || '',
              })(<Input.TextArea placeholder="请输入描述" />)}
            </FormItem>
          </Row>
        </Form>
      </Modal>
    );
  }
}
