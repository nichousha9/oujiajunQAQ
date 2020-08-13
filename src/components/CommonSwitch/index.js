import React from 'react';
import { Switch } from 'antd';

 export default class CommonSwitch extends React.PureComponent{
   state = {
     isSwitch: this.props.isSwitch || false,
   }
   componentWillReceiveProps(nextProps) {
     if (nextProps.isSwitch !== this.props.isSwitch) {
       this.setState({isSwitch: nextProps.isSwitch})
     }
   }
   switchChange = (value) => {
     const { onSwitch } = this.props;
     this.setState({isSwitch: value});
     if(onSwitch) onSwitch(value);
   }
   render(){
     const { checkedChildren="开启", unCheckedChildren="关闭"  } = this.props;
     const { isSwitch } = this.state;
     return (
       <Switch checked={isSwitch} onChange={this.switchChange} checkedChildren={checkedChildren} unCheckedChildren={unCheckedChildren} />
     )
   }
 }
