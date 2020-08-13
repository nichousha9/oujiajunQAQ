import React from 'react';
import { Input  } from 'antd';

const { TextArea } = Input;

export default class SceneDialogSetTest extends React.Component{

  handleKey =(e) =>{
    const message = e.target.value;
    if(!message.trim() || e.keyCode!==13) return;
    const { emitMessage } = this.props;
    if(e.keyCode===13 && !e.ctrlKey){
      e.target.value = ''
      emitMessage(message.trim());
    }else{
      // ctrl + enter 换行
      e.target.value = `${message}\n`;
    }
  }
  handleScrollToBottom =()=>{
    if(this.MessageLit)
      this.MessageLit.scrollTop = this.MessageLit.scrollHeight;// 滚动到底部
  }
  textArea={}
  MessageLit = {}
  render(){
    const { style,messageList=[] } = this.props;
    return (
      <div className="commonChatList" style={{flexDirection:'column ',display:'flex',...style}}>
        <div ref={(ele) => {this.MessageLit = ele;}} style={{ flex:'auto',overflowY:"auto"}}>
          {messageList.map((item)=> {
            const isIn = item.touser === item.userid;
            return (
              <div key={item.id} className={isIn ?  '':'floatRight'}style={{width:'80%',overflow:'hidden'}}>
                <div className={isIn ?  'chatRecvBox':'chatSendBox'}>
                  <i className={`chat-arrow-${isIn?'left':'right'}`} />
                  <div>
                    {item.message}
                  </div>
                </div>
              </div>
            )}
          )
        }
        </div>
        <div>
          <TextArea
            onKeyUp={(e)=>{this.handleKey(e)}}
            ref={(ele)=>{this.textArea = ele;}}
            style={{borderLeft:0,borderRight:0,borderRadius:0}}
            placeholder="请输入"
            rows={4}
          />
        </div>
      </div>
    )
  }
}
