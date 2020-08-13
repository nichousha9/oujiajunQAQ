import React from 'react';
import { Divider } from 'antd';

 const CommonMenuIcon = ({className,style,...otherProps}) =>{
  return (
    <div className={className} {...otherProps} style={{width:18,height:16,marginRight:10,marginTop:14,...style}}>
      <Divider style={{margin:0,background:'rgba(0,21,41,0.25)'}} />
      <Divider style={{margin:'4px 0',background:'rgba(0,21,41,0.25)'}} />
      <Divider style={{margin:0,background:'rgba(0,21,41,0.25)'}} />
    </div>
  )
}
export default CommonMenuIcon
