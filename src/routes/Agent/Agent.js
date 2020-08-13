import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Tabs, Form, message,Radio } from 'antd';
import classnames from 'classnames';
import CommonFold from '../../components/CommonFold';
import { agentuser,noFilter } from "../../services/api";
import { getUserInfo } from "../../utils/userInfo";
import styles from './Agent.less';
import SmartReply from "./SmartReply";
import AgentWorkOrderList from './AgentWorkOrderList';
import AgentUserInfo  from './AgentUserInfo';
import QuickReplyTabList from './QuickReplyTabList';
import AgentUserListTab from "./AgentUserListTab";
import AgentChat from "./AgentChat";
import { EDIT_HINT } from '../../utils/codeTransfer';

const { TabPane } = Tabs;
let socketInterval;
let socket;

@Form.create()
@connect(({ agentChat,global,loading})=>({
  agentChat,
  global,
  chatMsgLoading: loading.effects['agentChat/fetchGetChatMessages'],
}))
export default class Agent extends Component {
  state = {
    userInfoType:'',
    isScrollBottom:false,
    agentuser: {
      robot: true,
      status: 'end',
    },// 当前选中用户
  }
  componentDidMount() {
    const  user = getUserInfo();
    socket = io.connect(`${global.socket_url  }/im/agent?orgi=${user.orgi}&userid=${user.id}`);
    window.socket = socket;
    const { dispatch } = this.props;
    // 保持连接
    if(socketInterval) clearInterval(socketInterval)
		socketInterval = setInterval(()=>{
      socket.connect()
      socket.emit('ping',{})
    },10*1000);
    socket.connect();
    socket.forceClose = ()=>{// 强制断开
      clearInterval(socketInterval)// 取消ping
      console.log("强制断开socket连接");
      socket.off('disconnect')// 取消事件监听
      socket.disconnect()
    }
    socket.on('connect',  () =>{
      console.log("连接初始化成功");
      // 请求服务端记录 当前用户在线事件
      dispatch({type: 'user/setCurrStatus', payload:{status:'ready'}});
    }).on('disconnect', () => {
      console.log("连接已断开");
      // 请求服务端记录，当前用户离线
      dispatch({type: 'user/setCurrStatus', payload:{status:'notready'}});

      socket.connect();
    });
    socket.on('chatevent',  (data) =>{
      console.log('chatevent:', data)
    }).on('task',(data) =>{
      console(data)
    }).on('new', (data) =>{
      console.log('new:', data)
    }).on('status',  (data) =>{
      console.log('status: ',data)
      // 超时撤回的时候回给出提示； 要不要刷新列表？
      if(data.type==='RECALL_TIME_EXCEED'){
        message.info(data.message);
        return;
      }
      this.handleUpdateAgentUserList('inserviceUser') // 刷新数据
    }).on('message',  (data)=> {
      const { agentuser={} } = this.state;
      console.log('收：',data.type,data,agentuser)
      if (!data.type || data.type === 'message') {
        let { agentChat :{ chatMessages:chatList=[] },global:{atMeMsgIdArr = {} }} = this.props;
        const { global:{ newMessageAgent:hasNewMessageAgent=[]} } = this.props;
        const user = getUserInfo() || {};
        const key = data.groupid ? 'groupid' : 'usession';
        const agentKey = data.groupid ? 'groupid' : 'userid'
        // 自己发的消息不能算新消息,当前的客户发的也不算
        if(hasNewMessageAgent.indexOf(data[key])<0 && agentuser[agentKey] !== data[key] && user.id !== data.userid){
          hasNewMessageAgent.push(data[key]);
        }
        if(data.calltype === 'in' || (data.groupid&&data.userid !== agentuser.userid)) $('#_alertAudio')[0].play()
        if(chatList.length && chatList[chatList.length-1].id === data.id) return// 消息重复

        if(data.replyto){
          // 消息被回复，添加前端手动添加replied字段
          chatList = chatList.map((chat) => {
            if(chat.id === data.replyto){
              return {
                ...chat,
                replied: true,
              }
            }
            return chat;
          })
        };
        // 如果当前是at我
        if(data.at && data.at === user.id  || (data.userid!==user.id && data.at==='all')){
          const arr = atMeMsgIdArr[data[key]] || [];
          if(arr.indexOf(data.id) < 0){
            arr.push(data.id);
            const obj = {};
            obj[data[key]] = arr;
            atMeMsgIdArr = {
              ...atMeMsgIdArr,
              ...obj,
            }
          }
        }
        if(agentuser.groupid && (agentuser.groupid === data.groupid)){
          chatList.push(data)
          // 撤回的时候isScrollBottom 1，不用滚动消息列表，2 滚动到底部
          this.handleUpdateChatList({chatList});
          this.updateNewMsgAgent([...hasNewMessageAgent])
          this.updateAtMeMsg({...atMeMsgIdArr})
          noFilter({message:JSON.stringify(data)});
          this.setState({isScrollBottom:data.replyto ? 1:2})
        }else if( !agentuser.groupid && (data.usession === agentuser.userid)){
          chatList.push(data)
          this.handleUpdateChatList({chatList});
          this.updateNewMsgAgent([...hasNewMessageAgent])
          this.updateAtMeMsg({...atMeMsgIdArr})
          noFilter({message:JSON.stringify(data)});
          this.setState({isScrollBottom:data.replyto ? 1:2})
        }else{// 其他对话
          this.updateAtMeMsg({...atMeMsgIdArr});
          noFilter({message:JSON.stringify(data)});
          this.updateNewMsgAgent([...hasNewMessageAgent]);
          this.setState({isScrollBottom:1});
         // this.handleUpdateAgentUserList('inserviceUser')
        }
      }
    }).on('workorder',  (data) =>{
      console.log('workorder:', data)
    }).on('recall',(data) =>{
      if(!data || !data.id) return;
      const { agentChat :{ chatMessages:chatList=[] }} = this.props;
      const newChatList = chatList.map((chat) => {
        if(data.id !== chat.id) return chat;
        return {
          ...chat,
          recall:true,
        }
      });
      this.setState({isScrollBottom:1});
     this.handleUpdateChatList({chatList:newChatList})
     })
      .on('end',  (data)=> {
      console.log('end:', data)
    });
  }
  componentWillUnmount(){
    if(socketInterval)clearInterval(socketInterval);
    // sockect断开连接
    if(socket) socket.disconnect();
  }
  handleUpload(e){
    if(!e || !e.target || !e.target.files || !e.target.files[0]) return
    const { agentuser } = this.state;
    const data = new FormData()
    data.append('imgFile', e.target.files[0]);
    if(agentuser.groupid){
      data.append('groupid', agentuser.groupid);
    }
    fetch(`${global.req_url}/agent/image/upload.html?id=${agentuser.id}`, {
      method: 'POST',
      credentials: 'include',
      body: data,
    }).then((response)=>{
      return response.json()
    }).then((json)=>{
      console.log(json)
    }).catch((ex)=>{
      message.error('上传失败')
    })
  }
  // 更新at我的信息
  updateAtMeMsg =(atMeMsgIdArr={})=>{
    const {dispatch} = this.props;
    dispatch({
      type: 'global/saveAtMeInf',
      payload: atMeMsgIdArr,
    })
  }
  // 刷新消息的问题
  updateNewMsgAgent = (newMsgAgent=[]) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'global/saveNewMessageAgent',
      payload: newMsgAgent || [],
    })
  }
 // 刷新当前的列表，用户
  handleUpdateAgentUserList =(userType) =>{
   const { handleAgentUsers,handleAgentUsersByType } =  this.agentUserListTab || {};
   if(!userType && handleAgentUsers){
     handleAgentUsers();
   }
    if(handleAgentUsersByType){
      handleAgentUsersByType(userType)
    }
  }
  // 查询客户资料
  getAgentuser=(au)=>{
    if(!au.groupid){
      agentuser({ userid: au.userid }).then((res) => {
        // 客户资料存储到state中
        const agentuser = res.data || this.state.agentuser// 用户信息
        agentuser.age = new Date().getFullYear() - agentuser.yearofbirth || ''// 年龄
        this.setState({agentuser})
      });
    }else{
      this.setState({agentuser:au})
    }
  }
  // 自定义函数，处理发送数据及返回的网络数据的保存操作
  sendMessage = (msg, event,options={}) =>{
    const editorMessage = msg || window.editor.html();
    const { atUser={},replyto='' } = options;
    if(!editorMessage) return;
    if(EDIT_HINT.indexOf(editorMessage) != -1 ) return;
    const { agentuser} = this.state;
    const user = getUserInfo()
    socket.emit(event|| 'message', {
      appid: this.state.agentuser.appid,
      userid: user.id,
      sign: user.sessionid,
      touser: agentuser.userid,
      session: agentuser.sessionid,
      orgi: user.orgi,
      username: agentuser.username,
      nickname: agentuser.username,
      message: editorMessage,
      groupid:agentuser.groupid,
      at:atUser.id ||'',
      replyto: replyto ||  '',
      // msgtype: 'text',
      // attachmentid: attachmentid
    });
  }
  onKeyUp = (e) => {
    // console.log(e.keyCode)
    // e.keyCode === 13 && this.sendMessage()
    if (!e.ctrlKey && e.keyCode === 13){
      this.sendMessage()
    } else if (e.ctrlKey && e.keyCode === 13) {
      let meg=``
      meg=this.state.meg;
      meg=`${meg}\n`
      this.setState({
        meg,
      })
    }
  }
  // 选中一个客户 或者 讨论组
  onSelectAgentuser = (agentuser) => {
    // 没有 选中用户的时候清除数据；
    if(!agentuser){
      this.handleUpdateChatList({chatList:[]})
      this.setState({agentuser:{},userInfoType:''});
      return;
    }
    const userInfoType = agentuser.groupid ? 'quickReply' : 'agentUserInfo';
    this.setState({userInfoType})
    this.getChatList(agentuser);
    this.getAgentuser({...agentuser,tokenum:0})
  }
  // 获取消息记录
  getChatList=(agentuser,page = 1,at=false)=>{
    const { dispatch } = this.props;
    let newMessageAgent = [];
    const { agentChat :{ chatMessages:chatList=[] },global:{newMessageAgent:hasNewMessageAgent=[]}} = this.props;
    // 获取当前的最前消息的前多少条
    const lastMsgId = chatList.length ? chatList[0].id : '';
    const ps = 10;
    const lastMsgIdArr = chatList.filter((item,i)=>{
      return i<ps;
    });
    const lastMsgIds = lastMsgIdArr.map((item)=>{return item.id}).join(',') || '';
    const obj ={ at, ps,msgid:page <=1 ? '': lastMsgId,msgids: page <=1 ? "": lastMsgIds};
    const key =  agentuser.groupid ? 'groupid':'userid';
    obj[key] = agentuser[key];
    const isRemoveNew = hasNewMessageAgent.indexOf(obj[key])>-1;
    if(isRemoveNew){
      newMessageAgent = hasNewMessageAgent.filter((item)=>{
        return item!== obj[key];
      })
    }
    this.updateNewMsgAgent(isRemoveNew ? newMessageAgent: hasNewMessageAgent);
    this.setState({isScrollBottom:false});
    dispatch({type:'agentChat/fetchGetChatMessages', payload:obj});
  }
  // 更新聊天消息
  handleUpdateChatList =({chatList=[]})=>{
    const { dispatch } = this.props;
    dispatch({
      type:'agentChat/updateChatMessages',
      payload:{chatList,maxChatListLen: chatList.length},
    })
  }
  // 更新当前用户
  updateAgentuser = (obj) =>{
    delete obj.yearofbirth;
    const { agentuser } = this.state;
    this.setState({
      agentuser: {...agentuser,...obj},
    })
  }
  // commonFold 后手动render 不建议使用
  handleRender=()=>{
    this.forceUpdate();
 }
  // 奇怪的事情，直接从message获取不到只能clone一个新的???;
  handleRecallMessage = (message ={}) => {
    const newMessage = { ...message}
    if(!newMessage || !newMessage.id) return;
    socket.emit('recall',{
      id:newMessage.id,
    });
  }
  // 修改发送的快捷键
  changeEnterType = (item={})=>{
    const { dispatch,global:{ enterType } } = this.props;
    if(enterType === item.key) return;
    dispatch({
      type:'global/changeEnterType',
      payload:{enterType: item.key},
    })
  }
  // 更新At的信息
  updateAtMeMsgIdArr =(arr=[])=>{
    const { agentuser,atMeMsgIdArr={} } = this.state;
    const key = agentuser.groupid ? 'groupid' : 'id';
    const obj ={};
    obj[agentuser[key]] = arr;
    this.updateAtMeMsg({
      atMeMsgIdArr: {
        ...atMeMsgIdArr,
        ...obj,
      }});
    this.setState({isScrollBottom: 1})
  }
  // 右侧的用户显示信息
  showAgentInfoChange =(e) =>{
    const value = e.target.value;
    const { userInfoType } = this.state;
    if(userInfoType!== value){
      this.setState({userInfoType: value})
    }
  }
  getFoldState =()=>{
    const { state= {}} = this.commonFold;
    const { fold = false} = state;
    return fold;
  }
  handleOpenFold = () =>{
    const { handleOpen }= this.commonFold;
    if(handleOpen) handleOpen();
  }
  commonFold = {}
  agentUserListTab = {};
  render() {
    const {agentuser,userInfoType,isScrollBottom}= this.state;
    const { chatMsgLoading= false,global:{ enterType='enter',newMessageAgent =[],atMeMsgIdArr={}},agentChat :{ chatPage =1,lastMsgId='',chatMessages:chatList=[],maxChatListLen } } = this.props;
    const clientHeight = window.innerHeight || window.document.documentElement.clientHeight || window.document.body;
    const  width = (document.getElementsByClassName('agentContent')[0] || {}).offsetWidth;
    const  tabLeftWidth = (document.getElementsByClassName('tabAgentLeft')[0] || {}).offsetWidth;
    const  tabRightWidth = (document.getElementsByClassName('tabAgentRightBox')[0] || {}).offsetWidth;
    const chatMaxWidth = width - tabLeftWidth -tabRightWidth-120;
    const key = agentuser.groupid ? 'groupid' : 'userid';
    const newAtMeMsgArr = atMeMsgIdArr[agentuser[key]] || [];
    const foldState = this.getFoldState();
  return (
    <div className={classnames(styles.agentContent,'agentContent')}>
      <input id="fileInput" style={{position:'fixed',opacity:0}} type="file" onChange={(e)=>{ this.handleUpload(e) }} />
      <input id="imgInput" style={{position:'fixed',opacity:0}} type="file" accept="image/*" onChange={(e)=>{ this.handleUpload(e) }} />
      <AgentUserListTab
        hasNewMessageAgent={newMessageAgent}
        goToHistory={()=>{ this.props.dispatch(routerRedux.push('/history/list'))}}
        ref={(ele) =>{ this.agentUserListTab = ele}}
        onSelectAgentUser={this.onSelectAgentuser}
        clientHeight={clientHeight}
        agentUser={agentuser}
      />
      <AgentChat
        handleOpenFold={this.handleOpenFold}
        showFoldIcon={foldState}
        enterType={enterType}
        changeEnterType={this.changeEnterType}
        updateAtMeMsgIdArr={this.updateAtMeMsgIdArr}
        atMeMsgIdArr={newAtMeMsgArr}
        isScrollBottom={isScrollBottom}
        chatMsgLoading={chatMsgLoading}
        getChatList={this.getChatList}
        chatPage={chatPage}
        lastMsgId={lastMsgId}
        maxChatListLen={maxChatListLen}
        chatList={chatList}
        agentuser={agentuser}
        sendMessage={this.sendMessage}
        handleRecallMessage={this.handleRecallMessage}
        handleUpdateAgentUserList={this.handleUpdateAgentUserList}
        chatMaxWidth={chatMaxWidth}
      />
      <div className="tabAgentRightBox">
        <CommonFold iconHide={foldState} ref={(ele)=>{this.commonFold=ele;}} foldClick={this.handleRender} Fold="left">
          <div className={classnames(styles.card, styles.tabRight,'tabAgentRight')}>
            <div className={classnames("border-bottom contentCenter",styles.tabRightHeader)}>
              <Radio.Group value={userInfoType} onChange={this.showAgentInfoChange}>
                {!agentuser.groupid &&  <Radio.Button value="agentUserInfo">客户资料</Radio.Button>}
                <Radio.Button value="quickReply">快速回复</Radio.Button>
                <Radio.Button value="smartReply">智能回复</Radio.Button>
              </Radio.Group>
            </div>
            <div>
              {userInfoType==='agentUserInfo' && (
                <AgentUserInfo
                  updateCallback={this.updateAgentuser}
                  clientHeight={clientHeight}
                  agentuser={agentuser}
                />
              )}
              {userInfoType==='quickReply' &&  <QuickReplyTabList sendMessage={this.sendMessage} clientHeight={clientHeight} />}
              {userInfoType==='smartReply' && <SmartReply clientHeight={clientHeight} sendMessage={this.sendMessage} />}
            </div>
          </div>
        </CommonFold>
      </div>
    </div>
    );
  }
}
