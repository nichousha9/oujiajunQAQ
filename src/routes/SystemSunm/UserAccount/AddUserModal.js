/* eslint-disable import/first */
import React from 'react';
import { connect }from 'dva';
import { getResMsg } from '../../../utils/codeTransfer';
import { Modal, Form,Input,Switch,message} from 'antd';

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
@connect(({addUserAccount,loading})=>{
  return {
    addUserAccount,
    loading:loading.models.addUserAccount,
    submitting:loading.effects['addUserAccount/fetchSaveUser'],
  }
})
export default class AddUserModal extends React.Component{
  state = {
    userInfo: {}, // 当前的用户信息
    superuser:false,
  }
  componentDidMount(){
    const { user, dispatch } = this.props;
    if(user){
      dispatch({
        type:'addUserAccount/fetchGetUserDetail',
        payload:{ id: user},
      })
    }
  }
  componentWillReceiveProps(nextProps){
    const { addUserAccount: { userInfo }} = nextProps;
    const { user } = this.props;
    if(user && JSON.stringify(userInfo) !== JSON.stringify(this.state.userInfo)){
      this.setState({userInfo, superuser: userInfo.superuser});
    }
  }
  handleOk = () => {
    const { onOk,user,dispatch,form: { validateFieldsAndScroll }} = this.props;
    validateFieldsAndScroll((err, values) => {
      if(err) return;
      const params = {
        superuser: 'false',
        nickname: values.uname,
        username: values.username,
        mobile: values.mobile,
        email: values.email,
      }
      if(user){
        params.id = user;
      } else {
        params.password = values.password
      }
      dispatch({
        type:'addUserAccount/fetchSaveUser',
        payload: params,
      }).then((res) => {
        if(res.status!=='OK'){
          message.error(getResMsg(res.msg));
          return;
        }
        message.success(user ? '修改成功' : '新增用户成功');
        onOk();
      })
    });
  }
  switchChange (value,type) {
    const obj = {};
     obj[type] = value;
    this.setState(obj);
  }
  handleConfirmBlur = (e) => {
    const {value} = e.target;
    this.setState({ rePassword: this.state.rePassword || !!value });
  }
  compareToFirstPassword = (rule, value, callback) => {
    const {form} = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('密码不一致');
    } else {
      callback();
    }
  }
  render(){
    const { visible,onCancel,user,form:{ getFieldDecorator }} = this.props;
    const { userInfo,superuser} = this.state;
    return(
      <Modal
        maskClosable={false}
        title={!user ? '新增用户' : '修改用户'}
        visible={visible}
        onCancel={onCancel}
        onOk={this.handleOk}
      >
        <Form className="commonModal"  style={{ marginTop: 8 }}>
          <FormItem {...formItemLayout} hasFeedback label="用户名">
            {getFieldDecorator('username', {
              rules: [
                {
                  required: true,
                  message: '请输入正确的用户名',
                  pattern: /^[0-9a-zA-Z_]{1,}$/,
                },
              ],
              initialValue:userInfo.username || '',
            })(<Input placeholder="请输入用户名" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="姓名">
            {getFieldDecorator('uname', {
              rules: [
                {
                  required: true,
                  message: '请输入姓名',
                },
              ],
              initialValue:userInfo.nickname || '',
            })(<Input placeholder="请输入姓名" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="邮箱">
            {getFieldDecorator('email', {
              rules: [
                {
                  required: true,
                  message: '请输入邮箱',
                },
                {
                  type: 'email',
                  message: '请输入正邮箱',
                },
              ],
              initialValue:userInfo.email || '',
            })(<Input placeholder="请输入邮箱" />)}
          </FormItem>
          { !user &&
          (
            <FormItem {...formItemLayout} hasFeedback label="密码">
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: '请输入密码',
                  },
                ],
                initialValue:userInfo.password || '',
              })(<Input type="password" placeholder="请输入密码" />)}
            </FormItem>
          )
          }
          { !user && (
            <FormItem {...formItemLayout} hasFeedback label="确认密码">
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
                initialValue:userInfo.password || '',
              })(<Input type="password" onBlur={this.handleConfirmBlur} placeholder="请确认密码" />)}
            </FormItem>
          )}
          <FormItem {...formItemLayout} hasFeedback label="手机号">
            {getFieldDecorator('mobile', {
              rules: [
                {
                  required: true,
                  message: '请输入手机号',
                },
                // {
                //   validator: this.compareToFirstPassword,
                // },
              ],
              initialValue:userInfo.mobile || '',
            })(<Input placeholder="请输入手机号" />)}
          </FormItem>
          {/* <FormItem {...formItemLayout}  label="管理员">
            {getFieldDecorator('admin', {
              initialValue:userInfo.superuser || false,
            })(
              <Switch checked={superuser} onChange={(value) => this.switchChange(value,'superuser')} className="margin-right-10" checkedChildren="是" unCheckedChildren="否"  />
            )}
          </FormItem> */}
          {/* <FormItem {...formItemLayout}  label="多媒体坐席">
            {getFieldDecorator('agent', {
              initialValue:userInfo.agent || false,
            })(
              <Switch checked={agent} onChange={(value) => this.switchChange(value,'agent')}checkedChildren="开启" unCheckedChildren="关闭" />
            )}
          </FormItem> */}
        </Form>
      </Modal>
    )
  }
}
