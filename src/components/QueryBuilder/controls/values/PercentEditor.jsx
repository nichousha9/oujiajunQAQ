/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { InputNumber } from 'antd';

const ValueEditor = props => {
  const { operator, handleOnChange, value, className, actionType } = props;

  return (
    <InputNumber
      className={className}
      type="text"
      value={value}
      disabled={actionType === 'V'}
      formatter={value => `${value.replace('%', '')}%`}
      parser={value => value.replace('%', '')}
      onChange={val => handleOnChange(`${val}%`)}
    />
  );
};

ValueEditor.displayName = 'ValueEditor';

ValueEditor.propTypes = {
  field: PropTypes.string,
  operator: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  handleOnChange: PropTypes.func,
  title: PropTypes.string,
};

export default ValueEditor;
