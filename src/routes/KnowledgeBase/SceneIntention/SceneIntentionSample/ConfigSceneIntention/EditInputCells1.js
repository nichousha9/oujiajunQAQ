import React from 'react';
import {Input} from 'antd';

export default class EditInputCells extends React.Component {
  state = {
    values: EditInputCells.setValues(this.props.values, this.props.length),
  };

  componentWillReceiveProps(nextProps) {
    const values = EditInputCells.setValues(nextProps.values, nextProps.length);
    this.setState({values});
  };

  static setValues(values, length=1) {
    if (length === 1) {
      return [values];
    } else {
      const result = new Array(length);
      result.fill('');
      const valuesList = values.split(',');
      result.forEach((item, index) => {
        if(valuesList.length > index)
          result[index]=valuesList[index];
      });
      return result;
    }
  }

  handleChange = (e, index) => {
    const {value} = e.target;
    const {values} = this.state;
    if (value !== values[index]) {
      values[index] = value;
      this.setState({values});
    }
    if (this.props.onChange) {
      this.props.onChange(this.state.values.join(','));
    }
  };


  render() {
    const {values} = this.state;
    const {length = 1} = this.props;
    const width = 100 / length;
    let key = 0;
    return (
      <div className="editable-cell">
        {
          values.map((item, index) => {
            key += 1;
            return (
              <Input
                value={item}
                key={key}
                style={{margin: '0 10px', width: `calc(${width}% - 20px)`}}
                onChange={(e) => this.handleChange(e, index)}
                onPressEnter={this.check}
                placeholder="请输入"
              />
            )
          })
        }
      </div>
    );
  }
}

