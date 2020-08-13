/* eslint-disable no-extra-boolean-cast */
/* eslint-disable dot-notation */
/* eslint-disable no-shadow */
import React from 'react'
import { Form,Input, Select,Steps,message,Icon } from 'antd';
import { connect } from 'dva';
import classnames from 'classnames';
import {formatTime} from "../../utils/utils";
import styles from './Agent.less';
import AgentWorkOrderList from './AgentWorkOrderList';

const { Option } = Select;
const { TextArea } = Input;
const { Step } = Steps;

const userShowList = [
  {key:'name',label:'姓名',edit:'input'},
  {key:'skillname',label:'部门',edit:false},
  {key:'gender',label:'性别',edit:'select'},
  {key:'age',label:'年龄',edit:'input'},
  {key:'city',label:'位置',edit:false},
  {key:'ipaddr',label:'IP',edit:false},
  {key:'osname',label:'平台',edit:false},
  {key:'browser',label:'浏览器',edit:false},
  {key:'phone',label:'电话',edit:'input'},
  {key:'qq',label:'QQ',edit:'input'},
  {key:'weixinname',label:'微信昵称',edit:'input'},
  {key:'weixin',label:'微信号',edit:'input'},
  {key:'email',label:'邮箱',edit:'input'},
]
@Form.create()
@connect(({agentUserInfo}) =>({agentUserInfo}))
export default class AgentUserInfo extends React.PureComponent{
  state = {
    editKey:'',
    editUserInfo:{},
    showOrder: false,
  }
  componentDidMount(){
      this.getAgentRemarks();
  }
  componentWillReceiveProps(nextProps){
    const { agentuser={} } = this.props;
    // 当前咨询的客户发生变化的时候也，页面重新获取客户信息parseInt
    if(agentuser.userid!== nextProps.agentuser.userid){
      this.getAgentRemarks(nextProps.agentuser.userid);
    }
  }
  componentWillUnmount(){
    const { dispatch } = this.props;
    dispatch({ type:'agentUserInfo/clearState'});
  }
   getAgentRemarks = (userid) => {
    // 跟进备注列表
    const { dispatch,agentuser= {}} = this.props;
    if(!userid && !agentuser.userid) return;
    dispatch({
      type:'agentUserInfo/fetchGetRemarkList',
      payload:{userid: userid || agentuser.userid},
    })
  }
  handleEdit = (item) => {
    if(!item || !item.edit || !item.key) return;
    this.setState({editKey: item.key})
  }
  // 修改用户
  handleEditUser = (value,item)=>{
    if (!value.trim()) {
      message.error('用户不能置空');
      this.setState({editKey: ''});
      return;
    }
    const { dispatch,agentuser = {},updateCallback } = this.props;
    const obj = {
      userid: agentuser.userid,
    };
    if (item.key === 'age') {
      const yearofbirth = new Date().getFullYear() - window.Number.parseInt(value);
      obj.yearofbirth = yearofbirth;
    }else{
      obj[item.key] = value;
    }
    dispatch({
      type:'agentUserInfo/fetchUpdateAgentUser',
      payload:obj,
    }).then((res)=>{
      if(res && res.status==='OK'){
        this.setState({editKey:''})
        message.success('操作成功');
        if(updateCallback) updateCallback({...agentuser,...obj});
      }
    })

  }
  // 添加备注
  handleAddAgentRemark = (e) => {
    if(e.keyCode !== 13) return;
    const remark = e.target.value.trim();
    const { dispatch,agentuser } = this.props;
    if(!remark) return
    e.target.value = ''
    dispatch({
      type:'agentUserInfo/fetchAddAgentRemark',
      payload:{
        userid: agentuser.userid,
        content: remark,
      },
    }).then((res) =>{
      if(!res || res.status!=='OK') return;
      this.getAgentRemarks();
    })
  }
  // 显示工单
  handleShowWorkOrder =()=>{
    const { showOrder= false} = this.state;
    this.setState({ showOrder: !showOrder})
  }
  render () {
    const { agentuser,agentUserInfo:{ remarkList=[]}} = this.props;
    const { editKey,editUserInfo,showOrder } = this.state;
    const curUserInfo = {...agentuser,...editUserInfo};
    return (
      <div style={{height:'calc(100vh - 110px)',overflowY:'auto'}} className={classnames(styles.littleForm,'scrollY')} >
        {!showOrder && (
          <div className={classnames(styles.tabRightContent,"flex-auto margin-top-15")}>
            {userShowList.map((showItem) => {
              let value = showItem.key!=='age' ? curUserInfo[showItem.key] : (window.Number.parseInt(new Date().getFullYear() - curUserInfo['yearofbirth']));
              value = showItem.key==='name' ?  (curUserInfo.name || curUserInfo.username) : value;
              if(!agentuser.contactid && showItem.key==='skillname'){
                return null
              }
              return (
                <div className="hidden line-height32 height32" key={showItem.key}>
                  <div className={classnames("floatLeft normal-label padding-left-10", showItem.key===editKey ? 'bgLightBlue' : '')} >{showItem.label}：</div>
                  {editKey === showItem.key && (
                    <div className="floatLeft width180">
                      {showItem.edit==='input' && (
                        <Input
                          onBlur={(e)=>{this.handleEditUser(e.target.value,showItem)}}
                          className="width180"
                          defaultValue={value ||  ''}
                        />
                      )}
                      {showItem.edit==='select' && (
                        <Select defaultValue={value} className="width180" onChange={(value) =>{this.handleEditUser(value,showItem)}}>
                          <Option value="male">男</Option>
                          <Option value="female">女</Option>
                        </Select>
                      )}
                    </div>
                  )}
                  { editKey !== showItem.key && (
                    <div
                      onClick={() => { this.handleEdit(showItem)}}
                      style={{minWidth:100}}
                      className={classnames("floatLeft margin-left-10 height32",!showItem.edit ? 'disable':'pointer' )}
                    >
                      {showItem.key==='gender'? (value ==='male' ? '男' :(!!value? '女':'')) : (value ||  '')}
                    </div>
                  )}
                </div>
              )
            })}
            <div style={{paddingLeft:10, paddingTop:10, paddingRight:10}}>
              <Steps progressDot current={0} direction='vertical'>
                <Step  description={<TextArea onKeyUp={this.handleAddAgentRemark} rows={4} placeholder='请输入跟进内容，按回车提交' disabled={!(agentuser.name || agentuser.username)} />} />
                {remarkList.map((item)=>{
                  return <Step key={item.id}  description={`${formatTime(item.time)} ${item.agentname}： ${item.content}`} />
                })}
              </Steps>
            </div>
          </div>
        )}
        <div onClick={this.handleShowWorkOrder} className={classnames(styles.workOrder,showOrder ? styles.showOrder:'','pointer')}>
          <Icon className={styles.workOrderIcon} type={showOrder? "caret-down" : "caret-right"} theme="outlined" />
          工单信息
        </div>
        {!!showOrder && <AgentWorkOrderList agentuser={agentuser} />}
      </div>
    )
  }
}
