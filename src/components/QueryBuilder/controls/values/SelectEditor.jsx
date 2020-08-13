/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Select, Input } from 'antd';

const { Option } = Select;

@connect(() => ({
  // staticMap: queryBuilderModel.staticMap,
}))
class SelectEditor extends React.PureComponent {
  componentDidMount() {
    const { dispatch, fieldRow = {} } = this.props;
    const { fieldCode } = fieldRow;
  }

  render() {
    const {
      value,
      fieldRow = {},
      className,
      handleOnChange,
      title,
      actionType,
      options,
    } = this.props;
    const { fieldCode } = fieldRow;
    const list = options || [];
    return (
      <Select
        size="small"
        className={className}
        value={value}
        title={title}
        disabled={actionType === 'V'}
        onChange={handleOnChange}
      >
        {list.map(option => {
          const key = option.masterdataValuesId
            ? `key-${option.masterdataValuesId}`
            : `key-${option.masterdataValue}`;
          return (
            <Option key={key} value={option.attrValueCode || option.id}>
              {option.attrValueName || option.name}
            </Option>
          );
        })}
      </Select>
    );
  }
}

export default SelectEditor;
