/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/require-default-props */
import React from 'react';
import PropTypes from 'prop-types';
import { Input, Form } from 'antd';
import getEditor from './values';

class ValueEditor extends React.PureComponent {
  render() {
    const { id, value, operator, form } = this.props;

    const { getFieldDecorator } = form;
    const message = '不能为空';

    if (operator === 'null' || operator === 'notNull') {
      return null;
    }

    return (
      <span>
        <Form.Item label="">
          {getFieldDecorator(`${id}_value`, {
            rules: [{ required: true, message }],
            initialValue: value,
          })(getEditor(this.props))}
        </Form.Item>
      </span>
    );
  }
}

ValueEditor.displayName = 'ValueEditor';

ValueEditor.propTypes = {
  field: PropTypes.string,
  operator: PropTypes.string,
  value: PropTypes.string,
  handleOnChange: PropTypes.func,
  title: PropTypes.string,
};

export default ValueEditor;
