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
  state = {
    textlength: 0,
  };

  // 启用停用
  setAble = e => {
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
      const { onOk } = this.props;
      const obj = {
        ...values,
      };
      if (onOk)
        onOk(obj, () => {
          message.success('添加成功');
        });
    });
  };

  textvalue = e => {
    const textname = e.target.value;
    let strlen = 0;
    for (let i = 0; i < textname.length; i += 1) {
      if (textname.charCodeAt(i) > 255) strlen += 1;
      else strlen += 1;
    }
    this.setState({ textlength: strlen });
  };

  render() {
    const {
      form: { getFieldDecorator },
      visible,
      closeModal,
      loading,
      editData = {},
    } = this.props;
    const { textlength } = this.state;
    return (
      <Modal
        className="commonModal"
        maskClosable={false}
        visible={visible}
        title={editData.id ? '修改' : '新增机器人'}
        onOk={this.handleOk}
        onCancel={closeModal}
        bodyStyle={{ padding: 0 }}
        style={{ position: 'relative' }}
        footer={[
          <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
            提交
          </Button>,
        ]}
      >
        <p
          style={{
            position: 'absolute',
            bottom: '30%',
            right: '20%',
            fontSize: 14,
            zIndex: 1,
          }}
        >
          {textlength}/50
        </p>
        <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
          <Row>
            <FormItem {...formItemLayout} label="机器人名称">
              {getFieldDecorator('robotName', {
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
            <FormItem {...formItemLayout} label="说明">
              {getFieldDecorator('robotApply', {
                rules: [
                  {
                    required: true,
                    message: '请输入说明！',
                  },
                  {
                    max: 50,
                    message: '不得超于50字',
                  },
                ],
                initialValue: editData.describe || '',
              })(
                <Input.TextArea
                  style={{height:90}}
                  onChange={e => this.textvalue(e)}
                  placeholder="请输入说明(50字以内)"
                  // maxLength={50}
                />
              )}
            </FormItem>
          </Row>
        </Form>
      </Modal>
    );
  }
}
