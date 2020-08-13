/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/require-default-props */
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

const ActionElement = props => {
  const { label, className, handleOnClick, title, type, actionType, level } = props;

  return (
    <Button
      size="small"
      className={className}
      title={title}
      type={type}
      style={{ display: actionType === 'V' ? 'none' : '' }}
      onClick={e => handleOnClick(e, level)}
    >
      {label}
    </Button>
  );
};

ActionElement.displayName = 'ActionElement';

ActionElement.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  handleOnClick: PropTypes.func,
  title: PropTypes.string,
  isPrimary: PropTypes.bool,
};

export default ActionElement;
