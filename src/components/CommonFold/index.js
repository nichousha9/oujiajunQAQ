import React from 'react';
import { Icon } from 'antd';
import classnames from 'classnames';
import style from './index.less';

export default class CommonFold extends React.Component{
  state = {
    fold: false,
  }
  handleFold = () => {
    const { foldClick } = this.props;
    this.setState({fold: true},()=>{
      foldClick && foldClick();
    })
  }
  handleOpen = () =>{
    const { foldClick } = this.props;
    this.setState({fold: false},()=>{
      foldClick && foldClick();
    });
  }
  render(){
    const { fold } = this.state;
    const { Fold ='right',iconHide=false } = this.props;
    const isRight = Fold ==='right';
    return(
      <div className={classnames(style.commonFold,fold ? (iconHide ? style.noWidth:style.flod) : '',!isRight? style.bgColorChange:'' )}>
        {!iconHide && !fold &&  <a className={classnames(style.foldRight,isRight? style.iconLeft:style.iconRight)} onClick={this.handleFold}><Icon type={`${isRight?"right":'right'}`} /></a>}
        {!iconHide && !!fold && <a className={classnames(style.foldLeft,isRight? style.iconLeft:style.iconRight)}  onClick={this.handleOpen}><Icon type={`${isRight?"left":'left'}`} /></a>}
         <div className={classnames(style.commonFlodContent,fold ? style.flodContent : '' )}>{ this.props.children}</div>
      </div>
    )
  }
}
