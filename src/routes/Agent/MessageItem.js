/* eslint-disable react/no-danger */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import { Modal, Popover,Checkbox   } from 'antd';
import classnames from 'classnames';
import { getUserInfo } from "../../utils/userInfo";
import styles from './Agent.less';
import CommonImgZoom from '../../components/CommonImgZoom';


const moreImg = require('../../assets/more.png');
//   { key:'knowCollect',text:'知识收录'},
const messageActionList = [
  { key:'answer',text:'解答'},
  { key:'recall',text:'撤回'},
  { key:'group',text:'内部讨论'},
  { key:'multi',text:'多选'},
]


class MessageItem extends React.PureComponent {
  state = {
    showMore: false, // 当前是否显示More;
    messageInModalVisible: false,
    messageContent: '',
    activeMenuKey: '',
    showImgZoom: false,
    zoomImgSrc:'',
    check: false,
  }
  componentWillReceiveProps(nextProps){
    const { messageReset } = nextProps;
    if(!this.props.messageReset && !!messageReset){
      this.setState({check: false,activeMenuKey:''})
    }
  }
  isTable = (__html) => {
    return __html.indexOf('<table') > -1 && __html.indexOf('</table>') > -1
  }
  closeModal = () => {
    this.setState({
      messageInModalVisible: false,
      messageContent: '',
    })
  }
  // 关闭当前的
  handleCloseImgZoom = () => {
    this.setState({
      showImgZoom: false,
      zoomImgSrc: '',
    });
  }
  showMessageInModal = (e,messageContent,isImg,item) => {
    if(item && item.msgtype === 'file'){
      window.open(`${global.req_url}${item.message}?n=${item.filename}`);
      return;
    }
    if(isImg && e.target.tagName!=="IMG" ) return;
    if(isImg && e.target){
      window.open(e.target.src);
/*      this.setState({
        showImgZoom: true,
        zoomImgSrc:e.target.src,
      }) */
      return;
    }
    this.setState({
      messageInModalVisible: true,
      messageContent,
    })
  }
  handleShowMore = () => {
    const { agentuser={},noAvater= false } = this.props;
    if(noAvater) return;
    this.setState({
      showMore: !agentuser.robot,
    });
  }
  showMessageAtions = () => {
    const { handleMessageReset } = this.props;
    if(handleMessageReset) handleMessageReset();
    // this.setState({activeMenuKey:'',check: false});
    // const {actionChange} = this.props;
    // if (actionChange) actionChange(messageActionList[0].key, this.props.item);
  }
  handleCloseMore = () => {
    this.setState({showMore: false});
  }
  handleActionChange = (item,msg) => {
    const {actionChange,checkBoxChange} = this.props;
    // if (item.key === this.state.activeMenuKey) return;
    this.handleCloseMore();
    if (actionChange) actionChange(item.key, this.props.item);
    if(item.key==='multi'){
      if(checkBoxChange) checkBoxChange(true,msg);
      this.setState({activeMenuKey: item.key,check: true});
    }else{
      this.setState({activeMenuKey: item.key});
    }
  }
  ChatDropdown = (msg) => {
    const {activeMenuKey} = this.state;
    const { item:messageItem } = this.props;
    const user = getUserInfo();
    return (
      <div style={{width: 80}} className="text-center">
        {messageActionList.map((item) => {
          // 消息撤回不能是他人操作
         if(item.key==='recall' && user.id !== messageItem.userid){
           return null;
         }
          return (
            <div
              key={item.key}
              onClick={() => {
                this.handleActionChange(item,msg)
              }}
              className={classnames('height32 line-height32 hoverBlue', activeMenuKey === item.key ? 'activeMenu' : '')}
            >
              {item.text}
            </div>
          )
        })}
      </div>
    )
  }
  handleShowHtml = (messageItem,isReplyto) => {
    const item = messageItem || this.props.item;
    const {chatMaxWidth} = this.props;
    let __html = item.message;
    let isIn = item.calltype === 'in'// 是否收到的消息
    const user = getUserInfo() || {}
    if(item.groupid){
      isIn = item.userid !== user.id// 讨论组判断
    }
    if (item.msgtype === 'image') {// 图片
      __html = `<a href="${item.message}" target="_blank"><img src="${item.message}" style="max-width:100%; !important"/></a>`
    }
    if (item.msgtype === 'file') {// 文件
      __html = `<span  ${isIn ? '' : 'style="color: blue;"'}> <i class="iconfont icon-paperclip"></i>  ${item.filename}</span>`
    }
    if(item.replied && !item.replyto && !isReplyto){
     /* */
      __html=`<i class="icon iconfont  icon-check_circle margin-right-5 colorBlue"></i>${__html}`;
    }
    if (item.msgtype === 'quesrecommend') {
      const list = JSON.parse(item.message)
      __html = `<div>
        <p>你要找得是不是：</p>
        ${list.map((listItem, index) => (`<p class="questionitem">${(index + 1)}.${listItem.question}</p>`)).join('')}
      </div>`
    }
    if (item.msgtype === 'voice') {
      const min = parseInt(item.duration / 60)
      const sec = parseInt(item.duration % 60)
      const duration = min > 0 ? `${min}'${sec}''` : `${sec}''`;
      __html = `<p style="margin:0;" class="message-audio" >
      <audio src="${item.message}" id="media" width="1" height="1" preload></audio>
      <span>${duration}</span>
      <i class="iconfont icon-sound"></i>
    </p>`
    }
    if (item.msgtype !== 'voice' || item.msgtype !== 'quesrecommend' || item.msgtype !== 'file' || item.msgtype !== 'image') {
      if (this.isTable(__html)) {
        __html = `<div style=width:${chatMaxWidth * 0.8};overflow-x:auto>${__html}</div>`;
      }
    }
    // 被回复的消息没有小箭头
    if(!isReplyto){
      __html = `<i class="chat-arrow-${isIn ? 'left' : 'right'}"></i>${  __html}`; // 小箭头
    }
    return __html;
  }
  isPopverHtmlProps = (html,item) => {
    let messProps = {
      dangerouslySetInnerHTML: {__html: html},
    }
    if (!!this.isTable(html) || item && !!this.isIncludeImg(item) || item && item.msgtype==='file') {
      messProps = {
        ...messProps,
        style: {cursor: 'pointer'},
        onClick: (e) => {
          this.showMessageInModal(e,html,item && !!this.isIncludeImg(item),item);
        },
      }
    }
    return messProps;
  }

  isIncludeImg = (item) => {
    return item.msgtype==='text' && /<img[^>]*?(src="[^"]*?")[^>]*?>/.test(item.message);
  }

  isFromAsker = (item) => {
    const user = getUserInfo() || {}
    const {actionChange} = this.props;
    let isIn = item.calltype === 'in'
    if(item.at && (item.at===user.id || item.at === 'all')){
      return (
        <div className={classnames("text-center margin-top-10 padding-top-10", isIn ? styles.borderTopBlue: styles.borderTopGray )}>
          <a onClick={()=>{actionChange('answer',item)}}>解答</a>
        </div>
      )
    }
    if((!item.fromasker || !actionChange) && !item.at) return null;
    if(item.groupid){
      isIn = item.userid !== user.id
    }
    return (
      <div className={classnames("text-center margin-top-10 padding-top-10", isIn ? styles.borderTopBlue: styles.borderTopGray )}>
        <a onClick={()=>{actionChange('answer',item)}}>解答</a>
      </div>
    )
  }
  handleCheckBox =(e,item) =>{
    const { checkBoxChange } = this.props;
    this.setState({check: e.target.checked})
    if(checkBoxChange) checkBoxChange(e.target.checked,item)
  }
  render() {
    const {item,title, chatMaxWidth,showCheck=false,noAvater=false} = this.props;
    const {showImgZoom=false,zoomImgSrc='',showMore, messageInModalVisible, messageContent,check= false} = this.state;
    const user = getUserInfo() || {}
    let isIn = item.calltype === 'in'
    if(item.groupid){
      isIn = item.userid !== user.id; // 讨论组判断
    }
    const imageurl = item.imageurl ? item.imageurl : (isIn ? '/images/icon-default.png' : '/images/icon-ai.svg');
    const messageHtml = this.handleShowHtml();
    const replyToHtml = item.replyto ? this.handleShowHtml(item.replyTo,true) : ''; // 当前是否是回复消息；
      return (
        <React.Fragment>
          { !!item.recall && (
            <div style={{color:'#ccc'}} className="font12 text-center margin-top-10 margin-bottom-10">{`${item.username}撤回了一条消息`}</div>
          )}
          { !item.recall && (
            <div key={item.id} className={styles.clearfix} style={{position: 'relative'}}>
              {showCheck && <Checkbox checked={check} onChange={(e)=>{this.handleCheckBox(e,item)}} style={{position:'absolute',top:10}} />}
              {!noAvater && <img src={imageurl} className={classnames(isIn ? styles.recvAvater : styles.sendAvater,showCheck? styles.moreLeftImg:'')} />}

              <div className={classnames(isIn ? styles.recvContent : styles.sendContent,noAvater ? styles.noAvater:'',showCheck? styles.checkMoreLeft:'')}>
                <div className={classnames(styles.clearfix, ``)}>
                  {title?  <React.Fragment>{title}</React.Fragment> : ( <div className={isIn ? '' : 'floatRight'}>{item.username}</div>) }
                </div>
                <div onMouseEnter={this.handleShowMore} onMouseLeave={this.handleCloseMore} className={styles.clearfix}>
                  <div
                    className={classnames(isIn ? '' : 'floatRight', styles.messageBox, styles.clearfix)}
                    style={{maxWidth: chatMaxWidth * 0.8}}
                  >
                    {!!replyToHtml && (
                      <div style={{minWidth:chatMaxWidth*0.6}}  className={classnames( isIn ? styles.recvBox : styles.sendBox)}>
                        <div>
                          <div className="margin-bottom-10">{item.replyTo && item.replyTo.username}</div>
                          <div className={styles.replayBox}>
                            <span className={classnames(styles.questionIcon,'bgOrg')}>Q</span>
                            <div style={{marginLeft:10}} {...this.isPopverHtmlProps(replyToHtml)} />
                          </div>
                        </div>
                        <div className={classnames("margin-top-10 padding-top-10",styles.replayBox,isIn?styles.borderIn:styles.borderOut)}>
                          <span className={classnames(styles.questionIcon,'bgRight')}>A</span>
                          <div className="padding-left-5 " {...this.isPopverHtmlProps(messageHtml,item)} />
                        </div>
                        {this.isFromAsker(item)}
                      </div>
                    )}
                    {!replyToHtml && (
                      <div className={classnames( isIn ? styles.recvBox : styles.sendBox,)}>
                        <div {...this.isPopverHtmlProps(messageHtml,item)} />
                        {this.isFromAsker(item)}
                      </div>
                    )}
                    {!!showMore && (
                      <Popover
                        overlayClassName="chatProver"
                        trigger="click"
                        onVisibleChange={this.showMessageAtions}
                        content={this.ChatDropdown(item)}
                        placement={isIn ? 'right' : 'left'}
                      >
                        <img
                          style={{width: 16, height: 16}}
                          className={classnames(isIn ? styles.moreImgLeft : styles.moreImgRight)}
                          src={moreImg}
                        />
                      </Popover>
                    )}
                  </div>
                </div>
                
              </div>
            </div>
          )}

          {messageInModalVisible && (
          <Modal
            width='1000px'
            footer={null}
            onCancel={this.closeModal}
            visible={messageInModalVisible}
          >
            <div className={styles.messageContetnModal} dangerouslySetInnerHTML={{__html: messageContent}} />
          </Modal>
)}
          {showImgZoom && zoomImgSrc && <CommonImgZoom handleColose={this.handleCloseImgZoom} showImgZoom={showImgZoom} zoomImgSrc={zoomImgSrc} />}
        </React.Fragment>
      )
    }
}

export default MessageItem;
