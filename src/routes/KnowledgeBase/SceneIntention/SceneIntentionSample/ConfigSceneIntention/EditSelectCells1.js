import React from 'react';
import { Select } from 'antd';

export default class EditSelectCells extends React.Component {
  state = {
    value: this.props.value,
  };

  handleChange = (value) => {
    if (value !== this.state.value) {
      this.setState({ value });
      if (this.props.onChange) {
        this.props.onChange(value);
      }
    }
  };

  render() {
    const { value } = this.state;
    const { dataSource } = this.props;
    return (
      <Select
        className="editable-select-cell"
        defaultValue={value}
        onChange={(v) => this.handleChange(v)}
      >
        {dataSource.map((item) => {
          return (
            <Select.Option key={item.id} value={item.id}>
              {item.txt}
            </Select.Option>
          );
        })}
      </Select>
    );
  }
}
