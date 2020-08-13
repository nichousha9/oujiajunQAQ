import React from 'react';
import {connect} from 'dva';
import { Form,Input,Button,message } from 'antd';
import classnames from 'classnames';
import {getClientHeight} from "../../../utils/utils";

const FormItem = Form.Item;
const TextArea = Input.TextArea;
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
class AddToGroup extends React.PureComponent{
  state ={
    curGroup:{},
  }
  handleSelectGroup =(group) =>{
    this.setState({curGroup: group});
  }
  handleOk =() =>{
    const { handleOk,agentUserId,isTransfer,dispatch,form:{validateFieldsAndScroll},onCancel,selectedMessage=[] } = this.props;
    const { curGroup } = this.state;
    validateFieldsAndScroll((errs,values)=>{
      if(errs) return;
      let obj = {...values,id: curGroup.groupid}
      if(isTransfer){
        obj = {...values,id: curGroup.groupid,type:'ADD',userids:agentUserId}
      }
      if(selectedMessage.length){//消息记录
        const msgids = selectedMessage.map((item) => {return item.id})
        obj.msgids = msgids
      }
     dispatch({
        type:'agentstatusUpdate/fetchModifyGroup',
        payload:obj,
      }).then((res)=>{
        if(res && res.status==='OK') {
          message.success('修改成功');
          onCancel();
          handleOk && handleOk();
        }
      })
    })
  }
  render(){
    const { curGroup } = this.state;
    const { styles,form:{ getFieldDecorator },agentstatusUpdate:{ userGroups =[]}} = this.props;
    return (
      <div className="scrollY" style={{height:getClientHeight()- 250}}>
        <div className="flex-auto padding-bottom-10 border-bottom">
          {userGroups && !!userGroups.length && userGroups.map((group) => {
            return <div
              key={group.groupid}
              onClick={()=>{this.handleSelectGroup(group)}}
              className={classnames('border',styles.groupItem,curGroup.groupid===group.groupid ? styles.groupItemActive :'')}
            >
              {group.groupname}
            </div>
          })}
        </div>
        <Form className="margin-top-10">
          <FormItem {...formItemLayout} label="附言描述" >
            {getFieldDecorator('msg', {
              rules: [
                {
                  message: '请输入附言描述！',
                },
              ],
              initialValue: '',
            })(<TextArea  placeholder="请输入" />)}
          </FormItem>
        </Form>
        <div
          className="border-top bgWhite padding-top-15"
          style={{ position:'absolute',bottom:-60,height:60,lineHeight:60,left:0,width:'100%'}}
        >
          <Button  className="floatRight margin-right-10" onClick={this.handleOk}type="primary" >确定</Button>
          <Button className="floatRight margin-right-10" onClick={this.props.onCancel}>取消</Button>
        </div>
      </div>
    )
  }
}
export default AddToGroup;
