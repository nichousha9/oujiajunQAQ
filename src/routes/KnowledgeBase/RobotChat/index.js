/* eslint-disable react/no-danger */
/* eslint-disable react/sort-comp */
import React from 'react';
import { Input, Button,Icon, message,Radio} from 'antd';
import styles from './index.less'
import { uuid } from "../../../utils/utils";
import {testRobotChat} from '../../../services/lexiconManagement'

const {TextArea} = Input

export default class RobotChat extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      messageList: [],
      msg: '',
      botSession: '',
      loading: false,
      selectedSceneId:'',
    }
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  // 刷新聊天
  refresh = () => {
    this.setState({
      msg: '',
      botSession: '',
      messageList: [],
      selectedSceneId:'',
    })
  }

  msgChange = (e) => {
    this.setState({msg: e.target.value})
  }
  handleSend = (msg)=>{
    // const {sceneId} = this.props
    const {selectedSceneId} = this.state;
    const {loading,botSession,messageList} = this.state
    if (loading) {
      message.info('机器人正努力给您解答问题，请稍等！')
    } else {
      const params = {
        botSession,
        content: msg,
        sceneCode: selectedSceneId,
      }
      const myMessageList = [...messageList,{msg,id: uuid(10)},{id: uuid(10)}]
      this.setState({
        msg: '',
        messageList: myMessageList,
        loading: true,
      },() => {
        this.handleScrollToBottom()
      })
      testRobotChat(params).then((res) => {
        if (res.status === 'OK') {
          myMessageList[myMessageList.length - 1 ] = {...myMessageList[myMessageList.length - 1],...res.data}
          this.setState({
            botSession: res.data.botSession,
            messageList:  myMessageList,
            loading: false,
          },() => {
            this.handleScrollToBottom()
          })
        }
      })
    }
    
  }

  sendMsg =(e) =>{
    const {msg} = this.state;
   
    if(!msg.trim() || (e && e.keyCode!==13)) return;
    if (e) {
      if(e.keyCode===13 && !e.ctrlKey){
        this.handleSend(msg.trim());
      }else{
        // ctrl + enter 换行
        e.target.value = `${msg}\n`;
      }
    } else {
      this.handleSend(msg.trim());
    }
  }
  handleScrollToBottom =()=>{
    if(this.MessageLit)
      this.MessageLit.scrollTop = this.MessageLit.scrollHeight;// 滚动到底部
  }

  onSceneIdChange = (e) =>{
   
    const val = e.target.value;
    this.setState({
      selectedSceneId: val,
    })
  }

  cleanSelected = () =>{
    this.setState({
      selectedSceneId:'',
    })
  }

  render() {
    const {messageList,msg,selectedSceneId } = this.state;
    const {sceneList} = this.props;
    return (
      <div className={styles.chatContainer}>
        <Icon type="reload" className={styles.reload} title="刷新" onClick={this.refresh} />
        <div className={styles.robotChat}>
          <div ref={(ele) => {this.MessageLit = ele;}} className={styles.messagesBox}>
            {messageList.map((item)=> {
              const isIn = !item.msg
              return (
                <div key={item.id} className={isIn ?  '' : 'floatRight'} style={{overflow:'hidden'}}>
                  <div className={isIn ?  styles.chatRecvBox: styles.chatSendBox}>
                    <i className={`chat-arrow-${isIn?'right':'left'}`} />
                    <div>
                      { item.msg || (
                        !item.chatWord ? (<Icon type="loading" className={styles.loadingIcon} />) :
                        (<div dangerouslySetInnerHTML={{__html: item.chatWord}} />)
                      )}
                    </div>
                  </div>
                </div>
              )}
            )
          }
          </div>
          <div style={{margin:'20px 0'}}>
            <Radio.Group style={{ width: '100%' }} onChange={this.onSceneIdChange} value={selectedSceneId} onClick={this.radioClick}>
              {
                sceneList.list.map(item=>(
                  <Radio  value={item.id} key={item.id}>{item.name}</Radio>
                ))
              }
              <Button type="primary" size="small" onClick={() => this.cleanSelected()}>清空选项</Button>
            </Radio.Group>
          </div>
          <div>
            <TextArea
              className={styles.sendInput}
              onKeyUp={(e)=>{this.sendMsg(e)}}
              value={msg}
              onChange={this.msgChange}
              placeholder="请输入"
              rows={4}
            />
            <Button type="primary" onClick={() => this.sendMsg()} className={styles.sendBtn}>发送</Button>
          </div>
        </div>
      </div>
    )
  }
}