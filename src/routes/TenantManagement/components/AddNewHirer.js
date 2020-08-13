import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';
import { connect } from 'dva';

@connect(({tenantManagement}) => ({
  tenantManagement,
}))
@Form.create()
class AddNewHirer extends Component {

  componentDidMount() {
    this.props.onRef(this);
    const { type, dispatch } = this.props;
    if (type === 'EDIT') {
      const { id, form: {setFieldsValue} } = this.props;
      dispatch({
        type: 'tenantManagement/qryHirerDetail',
        payload: {
          id,
        },
        callback: res => {
          if (res) {
            setFieldsValue({
              name: res.name,
              code: res.code,
              contactName: res.contactName,
              contactNumber: res.contactNumber,
            })
          }
        },
      })
    }
  }

  getHirerMsg = () => {
    const { form: { validateFieldsAndScroll	} } = this.props;
    const promise = new Promise((resolve, reject) => {
      validateFieldsAndScroll((err, values) => {
        if (!err) {
          resolve(values);
        } else {
          reject(err);
        }
      })
    })
    return promise;
  }

  render() {
    const { visible, form, handleOk, handleCancel } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    return (
      <Modal
        title="新增租户"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form>
          <Form.Item label='租户名称' {...formItemLayout}>
            {getFieldDecorator('name', {
              rules: [{
                required: true,
                message: '必填项',
              }],
            })(
              <Input placeholder="请输入" />,
            )}
          </Form.Item>
          <Form.Item label='租户编码' {...formItemLayout}>
            {getFieldDecorator('code', {
              rules: [{
                required: true,
                message: '用户编码只能是英文、数字、下划线组合',
                pattern: /^[0-9a-zA-Z_]{1,}$/,
              }],
            })(
              <Input placeholder="请输入" />,
            )}
          </Form.Item>
          <Form.Item label='联系人姓名' {...formItemLayout}>
            {getFieldDecorator('contactName', {
              rules: [{
                required: true,
                message: '必填项',
              }],
            })(
              <Input placeholder="请输入" />,
            )}
          </Form.Item>
          <Form.Item label='联系人号码' {...formItemLayout}>
            {getFieldDecorator('contactNumber', {
              rules: [{
                required: true,
                message: '输入的号码不符合格式', 
                pattern: /^1(3|4|5|7|8)\d{9}$/,
              }],
            })(
              <Input placeholder="请输入" />,
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

export default AddNewHirer;