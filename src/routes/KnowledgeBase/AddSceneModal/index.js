import React from 'react';
import { Modal, Button, Icon, Row, Input, message, Spin, Form } from 'antd';
import CommonSwitch from '../../../components/CommonSwitch';
import { getCommonFieldDecorator } from '../../../utils/utils';

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
        isEnable: values.isEnable ? '1' : '0',
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
        title={editData.id ? '修改场景' : '新增场景'}
        onOk={this.handleOk}
        onCancel={closeModal}
        bodyStyle={{ padding: 0 }}
        footer={[
          <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
            提交
          </Button>,
        ]}
      >
        <Spin spinning={loading}>
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
                {getFieldDecorator('info', {
                  rules: [
                    {
                      required: true,
                      message: '请输入描述！',
                    },
                  ],
                  initialValue: editData.info || '',
                })(<Input placeholder="请输入描述" />)}
              </FormItem>
            </Row>
            <Row>
              <FormItem {...formItemLayout} label="状态">
                {getCommonFieldDecorator(getFieldDecorator, 'isEnable', {
                  rules: [
                    {
                      required: true,
                      message: '请选择状态！',
                    },
                  ],
                  initialValue: editData.id ? editData.isEnable === '1' : true,
                })(
                  <CommonSwitch
                    onSwitch={this.setAble}
                    checkedChildren={<Icon type="check" />}
                    unCheckedChildren={<Icon type="close" />}
                    isSwitch={editData.id ? editData.isEnable === '1' : true}
                  />
                )}
              </FormItem>
            </Row>
          </Form>
        </Spin>
      </Modal>
    );
  }
}
