import React from 'react';
import {getUserInfo} from "../../utils/userInfo";

class CommonChat extends React.Component{
  componentDidMount(){
    // 创建socket连接
    const { socketUrl } = this.props;
    const user = getUserInfo()
    window.socket = io.connect(global.socket_url + `/im/agent?orgi=${user.orgi}&userid=${user.id}`);
    socket.on('connect',  ()=> {
      console.log("连接初始化成功");
      // 请求服务端记录 当前用户在线事件
    }).on('disconnect', () => {
      console.log("连接已断开");
      // 请求服务端记录，当前用户离线
      window.socket.connect();
      }).on('message',()=>{
        // 获取消息
      console.log('message' );
    })
  }
  render(){
    return(
      <div className="commonChat">

      </div>
    )
  }
}
export default CommonChat;
