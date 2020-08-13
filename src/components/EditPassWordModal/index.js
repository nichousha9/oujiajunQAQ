import React from 'react';
import { Modal,Form,Input,message } from 'antd';
import { Base64 } from 'js-base64';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 15,
  },
};
@Form.create()
export default class EditPassWordModal extends React.Component{
  state={
    rePassword:'',
  }
  handleSubmit = () =>{
    const { form:{ validateFields }} = this.props;
    validateFields((err,values)=>{
      if(err) return;
      // 更新密码操作
      const { dispatch,onCancel } = this.props;
      dispatch({
        type:'modifyprofile/fetchEditPassword',
        payload:{
          password: Base64.encode(values.password),
          newpassword: Base64.encode(values.newPassWord),
        },
      }).then((res) => {
        if(res.status==='OK'){
          message.success('修改成功');
          onCancel();
        }else{
          message.error('修改失败')
        }
      })
    })
  }
  compareToFirstPassword = (rule, value, callback) => {
    const { form:{ getFieldValue }} = this.props;
    if (value && value !== getFieldValue('newPassWord')) {
      callback('密码不一致');
    } else {
      callback();
    }
  }
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ rePassword: this.state.rePassword || !!value });
  }
  validatePassWord =(rule, value, callback) => {
    const { dispatch } = this.props;
    if(value){
       const value1 = Base64.encode(value);
      dispatch({
        type:'modifyprofile/fetchValidatePassword',
        payload:{ password: value1},
      }).then((res)=>{
        if(res && res.status==='OK'){
          callback();
        }else{
          callback('原始密码不正确');
        }
      })
    }else{
      callback();
    }
  }
  render(){
    const {visible,onCancel,form:{getFieldDecorator}} = this.props;
    return(
      <Modal
        title="修改密码"
        onOk={this.handleSubmit}
        visible={visible}
        onCancel={onCancel}
      >
        <div className="commonModal" style={{ margin:'0 auto'}}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout} label="原始密码" >
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: '请输入原始密码！',
                  },
                  {
                    validator: this.validatePassWord,
                  },
                ],
                validateTrigger: 'onBlur',
              })(<Input type="password"  placeholder="原始密码" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="新密码" >
              {getFieldDecorator('newPassWord', {
                rules: [
                  {
                    required: true,
                    message: '请输入新密码！',
                  },
                ],
              })(<Input  type="password" placeholder="新密码" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="确认密码" >
              {getFieldDecorator('rePassword', {
                rules: [
                  {
                    required: true,
                    message: '请确认密码',
                  },
                 {
                    validator: this.compareToFirstPassword,
                  },
                ],
              })(<Input type="password" onBlur={this.handleConfirmBlur} placeholder="请确认密码" />)}
            </FormItem>
          </Form>
        </div>
      </Modal>
    )
  }
}
