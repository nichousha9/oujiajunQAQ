import React from 'react';
import { Form, Input, Row } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';

@Form.create({
  mapPropsToFields(props) {
    const { record } = props;
    return record
      ? {
          attrSpecKey: Form.createFormField({ value: record.key }),
          attrSpecValue: Form.createFormField({ value: record.value }),
        }
      : {};
  },
})
class ExpandedRow extends React.Component {
  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form>
        <Row>
          <Form.Item
            label={formatMessage({ id: 'cacheManage.cacheCode' }, '缓存代码')}
            labelCol={{ xs: { span: 24 }, sm: { span: 2 } }}
            wrapperCol={{ xs: { span: 24 }, sm: { span: 14 } }}
          >
            {getFieldDecorator('attrSpecKey')(<Input readOnly />)}
          </Form.Item>
        </Row>
        <Row>
          <Form.Item
            label={formatMessage({ id: 'cacheManage.description' }, '描述')}
            labelCol={{ xs: { span: 24 }, sm: { span: 2 } }}
            wrapperCol={{ xs: { span: 24 }, sm: { span: 20 } }}
          >
            {getFieldDecorator('attrSpecValue', {
              rules: [{ max: 150, message: '内容请控制在150个字符以内' }],
            })(<Input.TextArea maxLength={151} readOnly autosize={{ minRows: 3 }} />)}
          </Form.Item>
        </Row>
      </Form>
    );
  }
}

export default ExpandedRow;
