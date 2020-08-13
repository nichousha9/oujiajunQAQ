import React from 'react';
import { Popover } from 'antd';
import CommonEditor from '../../components/CommonEditor';

export default class CommonShowEditor extends React.Component{
 render(){
   const { data,text = 'hover显示详细信息' }  = this.props;
   const content = <CommonEditor defaultValue={data} toolbarHidden />
   return (
     <Popover trigger="click" content={content}>
       <div  style={{height:20,overflow: 'hidden'}}>
         <div className="commonEditShow" style={{height:20,overflow: 'hidden'}}dangerouslySetInnerHTML={{__html:data}} />
       </div>
     </Popover>
   )
 }
}
