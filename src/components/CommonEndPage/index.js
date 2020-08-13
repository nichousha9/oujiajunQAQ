import React from 'react';
import { Icon } from 'antd';
import classnames from 'classnames';

 const CommonEndPage= ({classNames,text='审核结束'}) =>{
  return (
    <div className={classnames('text-center padding-top-50 padding-bottom-50',classNames)}>
      <Icon className="font30 endFontColor" type="check-circle" />
      <span className="font22 margin-left-10">{text}</span>
    </div>
  )
}
export default CommonEndPage;
