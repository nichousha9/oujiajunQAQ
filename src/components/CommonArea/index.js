import React from 'react';
import  {Cascader } from 'antd';
import { arrayToTree,addNodeToChild,getParentIdArr } from '../../utils/utils';
import {getAreaList} from "../../services/systemSum";


export default class CommonArea extends React.Component{
  state = {
    curArea:[],
    areaList:[],
  }
  componentDidMount(){
    const { areaList,area } = this.props;
    if(areaList&&areaList.length){
      this.handleChange((area || '').split(','));
      this.areaList = areaList;
     return;
    }
    this.handleGetAreaList();
  }
  handleGetAreaList = (parentid) => {
    const { area } = this.props;
    getAreaList({parentid: parentid || ''}).then((res) => {
      const { data:{ areaList } } = res;
      const treeData = arrayToTree(areaList,'id','parentid');
      this.areaList = addNodeToChild(treeData);
      this.setState({
        areaList: addNodeToChild(treeData),
        curArea:(area || '').split(','),
      });
      if(area){
        this.handleChange((area || '').split(','));
      }
    })
  }
  handleChange = (value) => {
    const { onChange }= this.props;
    this.setState({curArea:value});
    if(onChange) onChange(value);
  }
  render(){
    const { curArea } = this.state;
    const areaList = this.props.areaList ? this.props.areaList :  this.state.areaList;
    const { placeholder } = this.props;
    return (
      <Cascader
        value={curArea}
        onChange={this.handleChange}
        options={areaList}
        placeholder={placeholder}
      />
    )
  }
}
