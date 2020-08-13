import React from 'react';
import {connect} from 'dva';
import { Form,Input,Button,message,Icon } from 'antd';
import { getClientHeight ,arrayDeweight} from '../../../utils/utils';
import { getResMsg } from '../../../utils/codeTransfer';

const TextArea = Input.TextArea;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 18,
  },
};

@Form.create()
@connect(({agentstatusUpdate}) =>({agentstatusUpdate}))
class SelectedGoupUser extends React.PureComponent{
  state={
    curUser: {},
  }
  showClose =(user) =>{
    this.setState({curUser:user});
  }
  hideClose=()=>{
    this.setState({curUser:{}});
  }
  handleOk =() =>{
    const { handleOk,onCancel,selectedMessage = [],dispatch,onOK,
      agentstatusUpdate:{selectedGroupUser=[]},
      form:{validateFieldsAndScroll},curGroup={},agentUser={},
    } = this.props;
    validateFieldsAndScroll((errs,values)=>{
      if(errs) return;
      const userids = selectedGroupUser.map((user) => {return user.id});
      let obj = {...values,userids:userids.join(',')};
      if(selectedMessage.length){
        const asker = agentUser.userid;
        const askername = agentUser.username;
        const msgids = selectedMessage.map((item) => {return item.id})
        obj = {...obj, asker:asker,askername:askername,msgids:msgids.join(',')}
      }
      if(curGroup.groupid){
        obj = {...obj,id:curGroup.groupid,type: curGroup.type}
      }
      dispatch({
        type:curGroup.groupid ? 'agentstatusUpdate/fetchModifyGroup' : 'agentstatusUpdate/fetchAddNewGroup',
        payload:obj,
      }).then((res)=>{
        if(!res) return;
        if(res.status==='OK')
        {
          message.success('添加成功');
          handleOk && handleOk();
          onOK &&onOK(curGroup);
          onCancel();
        }else{
          message.error(getResMsg(res.msg));
        }
      })
    })
  }
  handleIds =() =>{
    const { agentstatusUpdate:{ selectedGroupUser } } = this.props;
    return selectedGroupUser.map((user) => {
      return user.id;
    })
  }
  handleUpdate =(user,type) => {
    const { dispatch,agentstatusUpdate:{ selectedGroupUser } } = this.props;
    const curIds = this.handleIds();
    if(type==='add' &&  curIds.indexOf(user.id) < 0){
      selectedGroupUser.push(user);
    }
    if(type==='odd'  &&  curIds.indexOf(user.id) >= 0 ){
      selectedGroupUser.splice(curIds.indexOf(user.id),1);
    }
    dispatch({
      type:'agentstatusUpdate/saveSelectGroupUser',
      payload:{selectedGroupUser},
    })
  }
  render(){
    const { curUser } = this.state;
    const { agentUser ={},curGroup={},styles,agentstatusUpdate:{selectedGroupUser=[]},form:{getFieldDecorator}} = this.props;
    return (
      <div className="scrollY" style={{height:getClientHeight()- 250}}>
        <div className="fontColor1 margin-left-20 margin-top-10 margin-bottom-10">添加讨论组成员</div>
        <div className="flex-auto padding-left-10 padding-right-10 padding-bottom-10" >
          {selectedGroupUser && !!selectedGroupUser.length && selectedGroupUser.map((user)=>{
            return (
              <div
                onMouseEnter={()=>{this.showClose(user)}}
                onMouseLeave={()=>{this.hideClose(user)}}
                key={user.id}
                className={styles.userSelected}
              >
                {user.nickname}
                {curUser.id === user.id && <Icon onClick={()=>{this.handleUpdate(user,'odd')}} type="close" />}
              </div>
            )
          })}
        </div>
        <div className="border-top padding-top-10">
          <Form className="margin-top-10">
            <FormItem {...formItemLayout} label="群组名称" >
              {getFieldDecorator('groupname', {
                rules: [
                  {
                    required:true,
                    message: '请输入群组名称！',
                  },
                ],
                initialValue: curGroup.groupname || `${agentUser.username},等` ||'',
              })(<Input  placeholder="请输入" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="附言描述" >
              {getFieldDecorator('msg', {
                rules: [
                  {
                    message: '请输入附言描述！',
                  },
                ],
                initialValue: curGroup.msg,
              })(<TextArea  placeholder="请输入" />)}
            </FormItem>
          </Form>
        </div>
        <div
          className="border-top bgWhite padding-top-15"
          style={{ position:'absolute',bottom:-60,height:60,lineHeight:60,left:0,width:'100%'}}
        >
          <Button  className="floatRight margin-right-10" type="primary" onClick={this.handleOk}>确定</Button>
          <Button className="floatRight margin-right-10" onClick={this.props.onCancel}>取消</Button>
        </div>
      </div>
    )
  }
}
export default SelectedGoupUser
