/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { Select, Input } from 'antd';

const { Option } = Select;

class ValueSelector extends React.PureComponent {
  render() {
    const { value, options, className, handleOnChange, title, actionType } = this.props;
    return (
      <Select
        className={className}
        value={value}
        title={title}
        disabled={actionType === 'V'}
        onChange={handleOnChange}
      >
        {options.map(option => {
          const key = option.id ? `key-${option.id}` : `key-${option.name}`;
          return (
            <Option key={key} value={option.name}>
              {option.label}
            </Option>
          );
        })}
      </Select>
    );
  }
}

ValueSelector.displayName = 'ValueSelector';

ValueSelector.propTypes = {
  value: PropTypes.string,
  options: PropTypes.array.isRequired,
  className: PropTypes.string,
  handleOnChange: PropTypes.func,
  title: PropTypes.string,
};

export default ValueSelector;
