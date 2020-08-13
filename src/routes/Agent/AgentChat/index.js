import React from 'react';
import { Spin ,Tooltip,Button,message,Icon,Modal,Dropdown,Menu} from 'antd';
import classnames from 'classnames';
import styles from '../Agent.less';
import AgentChatHeader from '../AgentChatHeader';
import MessageItem from '../MessageItem';
import GroupModal from '../Group/GroupModal';
import GropMebModal from '../Group/GropMebModal';
import {endService} from "../../../services/api";
import {getGroupMember} from "../../../services/chatSetting";
import '../../../../public/nncapture/jquery-1.6.4.min';
import {getUserInfo} from "../../../utils/userInfo";
import KnowledgeCollection from "../KnowledgeCollection";
import { EDIT_HINT } from '../../../utils/codeTransfer';


export default class AgentChat extends React.PureComponent{
  state = {
    messageReset: false,
    showAction: false, // 显示当前的聊天的消息操作栏
    curGroupUserList:[],//
    showAtUserList:false, // 是否展示at的用户列表
    curActionKey:'',// 当前操作消息的操作key;
    isTransfer: false,// 打开讨论的时候是否打开转接
    at: false, // 消息记录是否at
    atUser:{},// 当前选中要at的人
    knowCollectVisible: false, // 知识收录的Modal
    groupMebModalVisible: false, // 打开讨论组成员的modal,
    groupModalVisible: false, // 讨论组Modal,
  }
  componentDidMount(){
    this.handleEndService = this.handleEndService.bind(this);
    $().ready(() =>{// 截图插件
      Init();
    });
    // 初始化
    this.initKindEditor();
    window.editor.insertHtml(EDIT_HINT);
  }
  componentWillReceiveProps(nextProps){
    const{ agentuser,isScrollBottom ,lastMsgId} = nextProps;
    const { agentuser: oldUser={} } = this.props;
    const key =  agentuser.groupid ? 'groupid':'userid';
    if(oldUser[key] !== agentuser[key]){
      this.selectedMessage = [];
      this.setState({at: false,atUser:{},showAction:false,curActionKey:''});
      this.handleGetGroupMember(agentuser);
    }
    if(!this.msgList) return;
    if(isScrollBottom === 1) return;
    if(isScrollBottom === 2 || !lastMsgId){
      setTimeout(()=>{
        if(!this.msgList) return;
        this.msgList.scrollTop = this.msgList.scrollHeight || ''// 滚动到底部
      },0)
      return;
    }
    if( lastMsgId){
      setTimeout(()=>{
        this.msgList.scrollTop =(this.msgList.scrollHeight - this.oldHeight); // top的高度是要到新增加的高度
      },100)
    }
  }
  handleChangeMessage = ()=>{
    this.setState({messageReset: false})
  }
  // 滚动
  scrollTopFirstAtMesg = ()=>{
    const { atMeMsgIdArr,updateAtMeMsgIdArr  } = this.props;
    const newAtMeMsgIdArr = atMeMsgIdArr.filter((item,index)=>{
      return !!index;
    })
    if(!$('.atMeMsg').length) return;
    const scrollHeight = $('.messageList ').scrollTop() + ($('.atMeMsg').offset().top - $('.messageList ').offset().top) // $('.atMeMsg').offset().top - $('.messageList ').offset().top -15;
    this.msgList.scrollTop = scrollHeight < 0 ? 0 : scrollHeight;
     updateAtMeMsgIdArr(newAtMeMsgIdArr);
  }
  initKindEditor(){
    window.editor = KindEditor.create('#kindeditor_textarea', {
      newlineTag : "br" ,
      uploadJson : () =>{
        return `${global.req_url}/agent/image/upload.html?id=${this.props.agentuser.id}`
      },// 废除这个参数
      uploadUrl: () =>{
        return `${global.req_url}/agent/image/upload.html?id=${this.props.agentuser.id}`
      },
      allowFileManager : false,
      allowInsertUpload:false,		// 增加的参数，上传图片后是否插入到当前区域
      allowImageRemote:false,
      filterMode:true,
      items: ['emoticons',  'image','insertfile','capture', 'comment', 'thumb'],
      htmlTags: {img : ['src', 'width', 'height', 'border', 'alt', 'title', 'align', '.width', '.height', '.border'] , br:[], body:['backgroud-color', 'color']}  ,

      allowFileUpload:true,
      afterUpload:(url)=> {
        console.log('after upload', url)
        return false;
      },
      afterChange : (event)=> {
      },
      afterCreate : ()=> { // 设置编辑器创建后执行的回调函数

        // 回车事件
        for(let i=0;i<window.frames.length;i++){
          const doc = window.frames[i].document;
          if(!doc.body.classList.contains('ke-content')) continue; // editor所在iframe
          doc.onkeydown=(e)=>{
            const isEnter = this.isEnter();
            if(isEnter && (e.keyCode||e.which)===13){
              if(window.editor.html()==='<br />'){
                window.editor.html('')
              }
            }
            if(e.key==='Backspace'){
              this.deleteEditorHtml(window.editor);
            }
          }
          doc.onkeyup=(e)=>{
            if(!e) e=window.event;
            const isEnter = this.isEnter();
            // enter 发送消息
            if(isEnter){
              if((e.keyCode||e.which)!==13){
                this.handleMessageChange();
              }
              if((e.keyCode||e.which)===13 ){
                if(!e.ctrlKey){// 回车发送
                  this.handleSendMessage('', '', true);
                }
                else{// 插入换行
                  window.editor.insertHtml('<br>')
                }
              }
            }else{
              if((e.keyCode||e.which)!==13){
                this.handleMessageChange();
              }
              if((e.keyCode||e.which)===13 ){
                if(e.ctrlKey){// ctrl+enter发送
                  this.handleSendMessage('', '', true);
                } else{// 插入换行
                  window.editor.insertHtml('<br>')
                }
              }
            }
          }
        }
      },
      afterFocus:(event) => {
        if(EDIT_HINT.indexOf(window.editor.html()) != -1){
          window.editor.html("");
        }
      },
      afterBlur:(event) => {
        if(window.editor.html() === "" || window.editor.html() === "<br/>"){
          window.editor.insertHtml(EDIT_HINT);
        }
      },
    });
    KindEditor.options.cssData = "body { font-size: 16px; font-family:'Microsoft Yahei', 'Helvetica', 'Simsun', 'Arial';}";
  }
  handleGetGroupMember = (au={}) =>{
    if(!au.groupid){
      this.setState({curGroupUserList: []});
      return;
    }
    getGroupMember({ groupid: au.groupid}).then((res) => {
      if(res && res.data){
        this.setState({curGroupUserList: res.data});
      }else{
        this.setState({curGroupUserList: []});
      }
    })
  }
  // 聊天框
  handleMessageChange =() =>{
    if(!window.editor) return;
    const text = (window.editor.html() || '').trim();
    const index = text.indexOf('@')+1;
    this.atText = text.substring(index);
    if( index > 0){
      this.setState({showAtUserList: true});
      this.forceUpdate()
    }else{
      this.setState({showAtUserList: false});
    }
  }
  // 选择@
  chooseAt = (user) =>{
    if(!user.id && !window.editor) return;
    const msg = window.editor.html() || "";
    const index = msg.lastIndexOf('@');
    const newMsg = msg.substring(0,index+1);
    window.editor.html(user.id==='all' ?`${newMsg}${user.nickname }` : `${newMsg}${user.nickname }(${user.username})&nbsp;`);
    this.setState({showAtUserList:false,atUser:user});
  }
  // 根据判断
  isEnter = () =>{
    const { enterType ='enter'} = this.props;
    // 如果是enter发送，就是ctrl+enter换行
    return enterType==='enter';
  }
  // 回退健的时候如果是有At,整个回退掉；
  deleteEditorHtml =() =>{
    const { atUser ={} } = this.state;
    const text = window.editor.html() ||'';
    const index = text.lastIndexOf('@')+1;
    const reg = new RegExp("@\\S+\\s*\\&nbsp;$");
    if(!atUser.id || index<0  || !reg.test(text)) return;
    // 清空At的用户；
    this.setState({atUser:{}},()=>{
      window.editor.html(text.substring(0,index-1));
    });
  }
  // 显示讨论组成员的Modal
  showGroupMebModal =() =>{
    this.setState({ groupMebModalVisible: true});
  }
  // 显示讨论组的Modal
  showGroupModal = (isTransfer) =>{
    this.setState({ groupModalVisible: true,isTransfer:!!isTransfer});
  }
  // 讨论组的Modal
  handleShowGroupModal =() => {
    // 重置消息
    this.setState({groupModalVisible: true,messageReset: true});
  }
  // 知识收录的Modal
  handleKnowCollectModal = ()=>{
    // 重置消息
    if(!this.selectedMessage || this.selectedMessage.length<=1){
      message.error('问题收录至少选中两条消息');
      return;
    }
    const isInludeFile = this.selectedMessage.some((msg)=>{
      if(msg.msgtype === 'file') return true;
      return false;
    })
    if(isInludeFile){
      message.error('问题收录不能是文件消息');
      return;
    }
    this.setState({knowCollectVisible: true,messageReset: true});
  }
  // 退出会话 退出会话结束后要刷新当前的在线用户；
  async handleEndService (){
    const { agentuser } = this.props;
    Modal.confirm({
      title:'确认要结束当前会话吗?',
      okText:'确认',
      cancelText:'取消',
      onOk:()=>{
        // 可能调整。。。
        const key = agentuser.groupid ? 'groupid' : 'id'
        const obj = {};
        obj[key] = agentuser[key];
        endService(obj).then(()=> {
          message.success('结束会话成功')
          // 刷新在线用户
          const { handleUpdateAgentUserList } = this.props;
          if(handleUpdateAgentUserList) handleUpdateAgentUserList('inserviceUser');
        });
      },
    })
  }
  // 滚动的距离小于1的时候 加载
  handleMesListScroll = (e)=>{
    const { at } = this.state;
    const { getChatList,chatList=[],maxChatListLen=0,agentuser={} } = this.props;
    if(e.target.scrollTop < 1 && chatList.length < maxChatListLen && getChatList){
      this.oldHeight =this.msgList && this.msgList.scrollHeight || '';
      getChatList(agentuser,window.Number.parseInt(chatList.length/10)+1,at);
    }
  }
  // 选择消息
  handleSlectMessage =(checked,message) =>{
    if(checked){
      this.selectedMessage.push(message);
    }else{
      const selectedMessageIds = this.selectedMessage.map((item) =>{return item.id});
      this.selectedMessage.splice(selectedMessageIds.indexOf(message.id),1);
    }
  }
  //  控制@我开关 重新加载当前的数据
  atChange = (checked) =>{
    const { chatMsgLoading,agentuser,getChatList } = this.props;
    if(chatMsgLoading && !getChatList) return;
    this.setState({at:checked},() => {
      getChatList(agentuser,1,checked);
    });
  }
  // 显示对应的操作栏
  handleShowActions = () => {
    const {curActionKey,showAction,curMessage} = this.state;
    if( !showAction) return null;
    if(curActionKey === 'answer'){
      return (
        <div style={{padding:'5px 10px'}}className={classnames(styles.actionBar,'bgGray')}>
          <Icon onClick={this.closeActionBar} type="close" className={classnames(styles.actionBarClose,'pointer')} />
          <div className="border-bold-left padding-left-5 fontColor3">{curMessage.username}</div>
          <div className="border-bold-left padding-left-5" dangerouslySetInnerHTML={{__html:curMessage.message}} />
        </div>
      )
    }
    if(curActionKey === 'multi'){
      return (
        <div style={{lineHeight:'52px'}}className={classnames(styles.actionBar,'bgLightBlue')}>
          {/*  暂时是有 内不讨论 知识收录 */}
          <Button className="margin-left-10" onClick={this.handleShowGroupModal}>内部讨论</Button>
          <Button className="margin-left-10" onClick={this.handleKnowCollectModal}>知识收录</Button>
          <span
            onClick={this.closeActionBar}
            className={classnames('pointer floatRight margin-right-10 fontColor3')}
          >
            取消
          </span>
        </div>
      )
    }
    return null;
  }
  // 根据用户选择的消息的操作类型进行
  actionChange =(actionKey,msg) =>{
    const { handleRecallMessage } = this.props;
    // 多选或者解答
    if(actionKey==='answer' || actionKey==='multi'){
      this.setState({curActionKey: actionKey,showAction:true,curMessage: msg});
    }
    // 讨论组
    if(actionKey === 'group'){
      this.selectedMessage = []
      this.selectedMessage.push(msg)
      this.handleShowGroupModal()
    }
    // 撤回
    if(actionKey === 'recall' && handleRecallMessage){
      handleRecallMessage(msg);
    }
    return null;
  }
  // 关闭当前的操作bar
  closeActionBar =() => {
    this.selectedMessage =[];
    this.setState({curActionKey: '',messageReset:true,showAction:false,curMessage: {}});
  }
  // 关闭Modal
  closeModal = () => {
    this.setState({
      knowCollectVisible: false,// 知识收录的Modal,
      groupModalVisible: false, // 内部讨论的Modal
      groupMebModalVisible:false, // 讨论组的成员Modal
      isTransfer: false,// 标志转接的字段清空
    });
    this.closeActionBar();
  }
  // 发送消息
  handleSendMessage =(msg,msgEvent) =>{
    const { sendMessage } = this.props;
    const { atUser={},curMessage={},curActionKey } = this.state;
    if(sendMessage){
      sendMessage(msg || window.editor.html(),msgEvent || '',{
        atUser,
        replyto:curActionKey==='answer'&& curMessage && curMessage.id || '',
      });
    }
    window.editor.html("");
    this.setState({showAtUserList: false,atUser:{},curMessage:{},curActionKey:'' });
  }
  // 评论
  handleComment(){
    this.handleSendMessage('评价', 'comment',{})
    message.success('已发送评价请求')
  }
  // 点击，表情或者截图
  handleEditorToolbar(name){// 点击菜单
    if(EDIT_HINT.indexOf(window.editor.html()) != -1){
      window.editor.html("");
    }
    window.editor.clickToolbar(name)
  }
  msgList ={} // 消息列表ref
  selectedMessage = [] // 当前选中的数组
  // @空的时候是所有的html;
  renderAtUserList = () =>{
    let { curGroupUserList=[] } = this.state;
    curGroupUserList = [{nickname:'所有人',id:'all',username:''},...curGroupUserList];
    const arr = !this.atText ? curGroupUserList : curGroupUserList.filter((user)=>{
      return (user.nickname || user.username || '').indexOf(this.atText) > -1;
    });
    const readyChooseUser = arr[0] || {};
    return (
      <div style={{zIndex:100,position:'absolute',bottom:120,left:50,maxHeight:'200px',overflowY:'auto'}}>
        {arr.map((user,index) => {
          return (
            <div
              onClick={() =>{this.chooseAt(user)}}
              className="pointer hoverBgGray"
              style={
                {
                  padding: '5px 10px',
                  background: `${readyChooseUser.id ? (readyChooseUser.id === user.id ? '#F5F6F7' : '#fff') : (index === 0) ? '#F5F6F7' : '@fff'}`,
                }
              }
              key={user.id}
            >
              {`${user.nickname} (${user.username})`}
            </div>
          )
        })
        }
      </div>
    )
  }

  render(){
    const { handleOpenFold,showFoldIcon,updateAtMeMsgIdArr,changeEnterType,atMeMsgIdArr=[],handleUpdateAgentUserList,chatMsgLoading,maxChatListLen=0,chatList=[],agentuser={},chatMaxWidth=200 } = this.props;
    const { showAction,messageReset=false,showAtUserList,curActionKey,groupMebModalVisible,groupModalVisible,knowCollectVisible,isTransfer } = this.state;
    const groupMebModalProps ={
      visible: groupMebModalVisible,
      curGroup:agentuser,
      onCancel: this.closeModal,
      okCallBack:()=>{if(handleUpdateAgentUserList){handleUpdateAgentUserList('inserviceUser')}this.handleGetGroupMember();},
    }
    const knowCollectProps = {
      visible: knowCollectVisible,
      onCancel: this.closeModal,
      user:getUserInfo(),
      selectedMessage:this.selectedMessage,
    }
    const groupModalProps = {
      visible: groupModalVisible,
      onCancel: this.closeModal,
      selectedMessage:this.selectedMessage,
      agentUser:agentuser,
      isTransfer,
      handleOk:()=>{if(handleUpdateAgentUserList)handleUpdateAgentUserList('inserviceUser')},
      transferContent:{
        transfOk: ()=>{if(handleUpdateAgentUserList)handleUpdateAgentUserList('inserviceUser')},
        userid: agentuser.userid,// 坐席页面传过来的参数
        agentserviceid: agentuser.agentserviceid,
        agentuserid: agentuser.id,
        onCancel: this.closeModal,
      },
    }
    const isEnter = this.isEnter();
    const menu = (
      <Menu onClick={changeEnterType}>
        <Menu.Item key="enter">
          按Enter发送消息
          {!!isEnter && <i className="iconfont icon-smartSelect floatRight" /> }
        </Menu.Item>
        <Menu.Item key="ctrlEnter">
          按Ctrl+Enter发送消息
          {!isEnter && <i className="iconfont icon-smartSelect floatRight" />}
        </Menu.Item>
      </Menu>
    );
    return (
      <div className={classnames(styles.card, styles.tabCenter)}>
        <Spin wrapperClassName={styles.maxHeightSpin} spinning={chatMsgLoading}>
          <div className={styles.chat}>
            <div className={styles.box}>
              <div className={classnames(styles.header,'bgWhite')} >
                <AgentChatHeader
                  showFoldIcon={showFoldIcon}
                  handleOpenFold={handleOpenFold}
                  showGroupMebModal={this.showGroupMebModal}
                  showGroupModal={this.showGroupModal}
                  handleEndService={this.handleEndService}
                  styles={styles}
                  agentuser={agentuser}
                />
              </div>
              <div ref={(ele)=>{this.msgList = ele;}} onScroll={this.handleMesListScroll} className={classnames('messageList',styles.list,showAction ? styles.hasActionBarList : styles.noActionBarList)}>
                { chatList.length < maxChatListLen && !chatMsgLoading &&<div className="width100 contentCenter"><span className="font10 label">查看更多</span></div>}
                {chatList.map((item)=>(
                  <div className={classnames(atMeMsgIdArr.indexOf(item.id) >-1 ? 'atMeMsg':'')} key={item.id}>
                    {item.dateStr && <div className="time-span">{item.dateStr}</div>}
                    <MessageItem handleMessageReset={this.handleChangeMessage} messageReset={messageReset} atMeMsgIdArr={atMeMsgIdArr} agentuser={agentuser}checkBoxChange={this.handleSlectMessage} showCheck={curActionKey==='multi'} actionChange={this.actionChange} styles={styles} item={item} key={item.id} chatMaxWidth={chatMaxWidth} />
                  </div>
                  )
                )}
                {!!atMeMsgIdArr.length && (
                  <div className="atMsgTip">
                    <a className="padding-right-10" onClick={this.scrollTopFirstAtMesg}>
                      {`${atMeMsgIdArr.length}个人提到你`}
                    </a>
                    <Icon
                      className="pointer"
                      type="close"
                      onClick={() => {
                      if (updateAtMeMsgIdArr) updateAtMeMsgIdArr([])
                    }} 
                    />
                  </div>
                )}
              </div>
              { showAction && <div>{this.handleShowActions()}</div>}
            </div>
            <div className={styles.sender} style={{position:'relative'}}>
              <div className={styles.iconBar}>
                <i title="插入表情"  onClick={()=>{ this.handleEditorToolbar('emoticons') }} className="iconfont icon-emoji icon" />
                <i title="上传图片" onClick={()=>{ $('#imgInput').click() }} className="iconfont icon-upload_pic1 icon" />
                <i title="上传文件" onClick={()=>{ $('#fileInput').click() }} className="iconfont icon-paperclip icon" />
                <i title="截图" onClick={()=>{ this.handleEditorToolbar('capture') }} className="iconfont icon-chatCut icon" />
                <i title="评价" onClick={()=>{ this.handleComment() }} className="iconfont icon-evaluate icon" />
                <a className="floatRight" style={{marginRight:16}}>
                  <Tooltip placement="topRight" title={!this.state.at ? '全部消息' :'与我相关'}>
                    {!this.state.at && <i onClick={()=>{ this.atChange(true) }} className="iconfont icon-open-eye icon" />}
                    {!!this.state.at && <i onClick={()=>{ this.atChange(false) }} className="iconfont icon-close-eye icon colorBlue" />}
                  </Tooltip>
                </a>
              </div>
              {showAtUserList && this.renderAtUserList()}
              <div style={{padding: '0 5px'}}>
                <textarea id="kindeditor_textarea" />
              </div>
              <div className={styles.toolBar}>
                <span style={{'color':'#000000', 'opacity':'0.25','fontSize':'12px','fontFamily': 'PingFangSC-Regular'}}>
                  {`提示：按${isEnter ? ' Enter ' : ' Ctrl+Enter '}键发送`}
                </span>
                <Dropdown overlay={menu} trigger={['click']}>
                  <Button className={styles.btn} style={{right:15}} type="primary">
                    <Icon style={{color:'#fff'}}type="down" />
                  </Button>
                </Dropdown>
                <Button className={styles.btn} style={{paddingRight:0}} type="primary" onClick={()=>{this.handleSendMessage()}}>
                  发送
                </Button>
              </div>
            </div>
          </div>
        </Spin>
        { groupModalVisible && <GroupModal{...groupModalProps} />}
        { groupMebModalVisible && <GropMebModal{...groupMebModalProps} />}
        { knowCollectVisible && <KnowledgeCollection{...knowCollectProps} />}
      </div>
    )
  }
}
