import React from 'react';
import {Input} from 'antd';
import shortid from 'shortid'

export default class EditInputCells extends React.Component {
  state = {
    values: EditInputCells.setValues(this.props.values, this.props.length),
  };

  componentWillReceiveProps(nextProps) {
   this.changeValuesLength(nextProps.length);
  };

  static setValues(values, length = 1) {
    if (length === 1) {
      return [{
        key: shortid.generate(),
        value: values,
      }];
    } else {
      const result = new Array(length);
      result.fill({});
      const valuesList = values.split(',');
      result.forEach((item, index) => {
        if (valuesList.length > index)
          result[index] = {
            key: shortid.generate(),
            value: valuesList[index],
          }
      });
      return result;
    }
  }

  changeValuesLength(len){
    let {values}=this.state;
    if(!values){
      return;
    }
    if(values.length!==len){
      values=EditInputCells.setValues(this.state.values.map(item=>item.value).join(','),len);
      this.setState({values});
    }
  }

  handleChange = (e, key) => {
    const {value} = e.target;
    const {values} = this.state;
    const filteredValue = values.filter((item) => item.key === key)[0];
    if (value !== filteredValue.value) {
      filteredValue.value = value;
      this.setState({values});
    }
    if (this.props.onChange) {
      this.props.onChange(this.state.values.map((item) => item.value).join(','));
    }
  };


  render() {
    const {values} = this.state;
    const {length = 1} = this.props;
    const width = 100 / length;
    return (
      <div className="editable-cell">
        {
          values.map((item) => {
            return (
              <Input
                value={item.value}
                key={item.key}
                style={{margin: '0 5px', width: `calc(${width}% - 10px)`}}
                onChange={(e) => this.handleChange(e, item.key)}
                // onPressEnter={(e) => this.handleChange(e, item.key)}
                placeholder="请输入"
              />
            )
          })
        }
      </div>
    );
  }
}

