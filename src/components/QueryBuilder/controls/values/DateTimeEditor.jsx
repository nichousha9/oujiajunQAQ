/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-max-props-per-line */
/* eslint-disable react/jsx-first-prop-new-line */
import React from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from 'antd';
import moment from 'moment';

const ValueEditor = props => {
  const { handleOnChange, value, className, actionType } = props;

  return (
    <DatePicker
      showTime
      format="YYYYMMDD"
      className={className}
      value={value ? moment(value, 'YYYYMMDD') : null}
      disabled={actionType === 'V'}
      onChange={(date, dateString) => handleOnChange(dateString)}
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
