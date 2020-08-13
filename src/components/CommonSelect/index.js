import React from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';

export default class CommonSelect extends React.Component {
  state = {
    datas: null, // 数据数组
  };
  componentDidMount() {
    const { api } = this.props;
    const { fun, obj ={} } = api || {};
    if (fun) {
      fun(obj).then((res) => {
        this.setState({
          datas: res.data,
        });
      });
    }
  }
  render() {
    const { placeholder,style,optionData = {}, defaultVal='',defaultValue='',addUnknown, unknownText = '未知', unknownPosition = 'top', ...otherProps } = this.props;
    let datas = this.state.datas || optionData.datas || [];
    let optionsEle;
    if (datas) {
      if (addUnknown) {
        if (unknownPosition === 'top') {
          datas = [{ id: '', name: unknownText }].concat(datas);
        } else if (unknownPosition === 'bottom') {
          datas = datas.concat([{ id: 'unknown', name: unknownText }]);
        }
      }
      optionsEle = datas.map((data) => {
        return (
          <Select.Option value={String(data[optionData.optionId || 'id'] || data.id)} key={String(data[optionData.optionId || 'id'] || data.id)}>
            {data[optionData.optionName || 'name'] || data.name}
          </Select.Option>
        );
      });
    }
    return (
      <Select
        showSearch
        style={{ minWidth:"120px !important",...style }}
        placeholder={placeholder||'请选择'}
        defaultValue={defaultValue || defaultVal || ''}
        {...otherProps}
      >
        {optionsEle || this.props.children}
      </Select>
    );
  }
}

// CommonSelect.propTypes = {
//   addUnknown: PropTypes.bool, // 是否加未知项
//   unknownText: PropTypes.string, // 未知文字
//   unknownPosition: PropTypes.string, // 未知位置 top,bottom
//   optionData: PropTypes.object, // 数据
// };
