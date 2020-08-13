import React from  'react';
import { hasResource,authResource } from '../../utils/utils';

export default class CommonAuthContent extends React.Component{
  render(){
    const { auth,noAuthText='暂无权限查看',showNoAuth=false} = this.props;
    return (
      <div style={{width: '100%'}}>
        { hasResource(authResource[auth]) && this.props.children}
        { !hasResource(authResource[auth]) && !!showNoAuth && (
          <div className="text-center bold margin-top-10">
            {noAuthText}
          </div>
        )}
      </div>
    )
  }
}

