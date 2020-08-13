import React from 'react';
import { Icon } from 'antd';

 const CommonAddNew =({className,...otherProps}) =>{
   return (<div {...otherProps} className={`commonAddNew height32 line-height32 ${className}`}><Icon type="plus" /></div>)
 }
 export default CommonAddNew;
