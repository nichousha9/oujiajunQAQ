import React from 'react';

class NoContent extends React.PureComponent{
  render(){
    const {text="暂无内容",data=[],className} = this.props;
    if(!!data.length && this.props) return this.props.children;
    return (
      <div className={`contentCenter ${className}`}>
        {text}
      </div>
    )
  }
}

export default  NoContent;
