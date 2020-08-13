/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';

const ValueEditor = props => {
  const { operator, handleOnChange, value, className, actionType } = props;

  return (
    <Input
      size="small"
      className={className}
      type="text"
      value={value}
      disabled={actionType === 'V'}
      onChange={e => handleOnChange(e.target.value)}
    />
  );
};

ValueEditor.displayName = 'ValueEditor';

ValueEditor.propTypes = {
  field: PropTypes.string,
  operator: PropTypes.string,
  value: PropTypes.string,
  handleOnChange: PropTypes.func,
  title: PropTypes.string,
};

export default ValueEditor;
