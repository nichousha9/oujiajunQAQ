import React from 'react';
import { Select,Input,Icon } from 'antd';
import classnames from 'classnames';
import CommonEditor from '../../../../../../components/CommonEditor';

class ReplayType extends React.PureComponent{
  state ={
    respType:this.props.item.respType || 'txt',
    respText:this.props.item.respText || '',
  }
  componentWillReceiveProps(nextProps){
    const { item }= nextProps;
    if(JSON.stringify(item)!==this.props.item){
      this.setState({
        respType:item.respType || 'txt',
        respText:item.respText || '',
      })
    }
  }
  // 回复新增
  onchange(key, value) {
    if (this.state[key] !== value) {
      const obj ={[key]: value}
      const {respType} = this.state;
      const { replayCallBack,index} = this.props;
      if(replayCallBack) replayCallBack(index,{...{respType,respText:''},...obj},key );
      if(key === 'respText'&& respType==='richTxt') return;
      this.setState({[key]: value})
    }
  };
  render(){
    const { respType = 'txt',respText} = this.state;
    const { last,handleCols,index } = this.props;
    return  (
      <div
        className="margin-top-5 margin-bottom-5"
        style={{ position:'relative'}}
      >
        <Select
          value={respType}
          style={{width: 90}}
          onChange={value => {
            this.onchange('respType', value)
          }}
        >
          <Select.Option value="txt">文本</Select.Option>
          <Select.Option value="richTxt">富文本</Select.Option>
        </Select>
        { respType!=='richTxt' && (
          <Input
            style={{width: 'calc(100% - 160px)', marginLeft: 40}}
            value={respText}
            onChange={(e) => {
              this.onchange('respText', e.target.value);
            }}
            placeholder="请输入"
          />
        )}
        { respType==='richTxt' && (
          <CommonEditor
            newLink
            defaultValue={respText}
            onChangeCallBack={(value) => {
              this.onchange('respText', value);
            }}
            placeholder="请输入"
          />
        )}
        <Icon
          onClick={() =>{if(handleCols)handleCols(last,index)}}
          className={classnames('pointer',last ? 'blue':'red')}
          type={last ? "plus-circle" : "minus-circle"}
          style={{ position:'absolute',top:10,right:0}}
        />
      </div>
    )
  }
}
export default ReplayType;
