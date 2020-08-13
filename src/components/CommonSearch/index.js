import React from 'react';
import { Input } from 'antd';

const Search = Input.Search;

export default class CommonSearch extends React.Component{
  state = {
    value: '', // 搜索框的值
  }
 clearSearValue = () => {
   this.setState({value:''})
 }
  change =(e) =>{
    const { onChange } = this.props;
    if(onChange) onChange(e.target.value)
    this.setState({value:e.target.value})
 }
  render(){
    const { width=140,noWidth=false, placeholder="输入查询",isForce= false,doSearch = () => {},searchValue='' } = this.props;
    const { value } = this.state;
    return (<Search style={{ width:noWidth ? 'auto':width,height:32 }} value={isForce ? searchValue : value} onChange={this.change} placeholder={placeholder} onSearch={doSearch} />)
  }
}
