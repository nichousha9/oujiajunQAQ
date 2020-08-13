import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {Form, Input, Button, Card, Breadcrumb, Progress, message, Icon, Modal} from 'antd';
import CommonUpload from '../../components/CommonUpload';
import { getUserInfo,setUserInfo } from "../../utils/userInfo";

const FormItem = Form.Item;
const InputGroup = Input.Group;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 15,
  },
};
const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

@Form.create()
@connect(() => ({}))
export default class UserInfoModal extends PureComponent {
  constructor(props){
    super(props);
    this.state={
      loading:false,
      imageUrl: props.modifyprofile.userInfo.imageurl  || '',
    }
  }
  componentDidMount(){
      this.props.dispatch({
          type:'modifyprofile/getCurrentInfo',
      })
  }
  componentWillReceiveProps(nextProps){
    const { modifyprofile:{ userInfo = {}} } = nextProps;
    const {imageUrl} = this.state
    if(imageUrl !==  userInfo.imageUrl){
      this.setState({imageUrl: userInfo.imageUrl})
      this.forceUpdate();
    }
    if(this.getting === false){
      if(nextProps.modifyprofile.status === 'OK'){
        message.success('修改成功！');
      }else{
        message.error('修改失败，请重试！');
      }
      this.getting = true;
    }
  }

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.getting = false;
        this.props.dispatch({
          type: 'modifyprofile/modifyCurrentInfo',
          payload: {
            ...values,
            agent:getUserInfo().agent,
          },
        });
      }
    });
  };
  uploadProcess = (nextFileList,url,loading) => {
    if (nextFileList && nextFileList.length && nextFileList[0].response && nextFileList[0].response.data) {
      this.fileList = nextFileList;
      this.setState({
        imageUrl: nextFileList[0].response.data.imageUrl,
        loading,
      })
    }
    this.forceUpdate();
  }
  handleUploadButton = () => {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    return this.state.imageUrl ? <img className="ant-upload ant-upload-select" style={{width: '102px'}} src={`${this.state.imageUrl}`} alt="" /> : uploadButton
  }
  handleSubmit = () => {
   
    const { onCancel,form : { getFieldsValue },dispatch, modifyprofile: { userInfo} } = this.props;
    const {imageUrl} = this.state
    const obj = getFieldsValue();
    if(obj.nickname.length === 0){
      message.error("昵称必须填写！");
      return;
    }
    // obj.imageid= imgData.response  && imgData.response.data.id || userInfo.imageid || '';
    // 保存
    dispatch({
      type:'modifyprofile/modifyCurrentInfo',
      payload:{
        ...obj,
        id: userInfo.id,
        // imageurl: this.state.imageUrl,
      },
    }).then(() => {
      if(onCancel) onCancel();
      const user = getUserInfo()
      Object.assign(user,{mobile: obj.mobile,nickname: obj.nickname})

      if (imageUrl) {
        Object.assign(user,{imageUrl})
      }
      dispatch({
        type: 'user/changeCurUser',
        payload: user,
      })
      setUserInfo(user)
    })
  }
  loading = false;
  fileList=[];

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  render() {
    const { userInfo } = this.props.modifyprofile;
    const { getFieldDecorator } = this.props.form;
    const { visible,onCancel } = this.props;
    const username = userInfo.username ? userInfo.username : '';
    const mobile = userInfo.mobile?userInfo.mobile:'';
    return (
      <Modal
        onOk={this.handleSubmit}
        visible={visible}
        onCancel={onCancel}
      >
        <div className="commonModal" style={{ margin:'0 auto'}}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem  {...formItemLayout} label="账号">
              <div className="height32 line-height32">{username}</div>
            </FormItem>
            <FormItem {...formItemLayout} label="类型" onFieldsChange={this.fieldChange}>
              <div className="height32 line-height32">{userInfo.superuser ? '超级管理员' : '用户'}</div>
            </FormItem>
            <FormItem {...formItemLayout} label="昵称" >
              {getFieldDecorator('nickname', {
                rules: [
                  {
                    required:true,
                    message: '请输入昵称！',
                  },
                ],
                initialValue:userInfo.nickname || '',
              })(<Input  placeholder="昵称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="手机号码"  onFieldsChange={this.fieldChange}>
              <InputGroup compact>
                {getFieldDecorator('mobile', {
                  rules: [
                    {
                      message: '请输入手机号！',
                    },
                    {
                      pattern: /^1[34578]\d{9}$/,
                      message: '手机号格式错误！',
                    },
                  ],
                  initialValue:mobile,
                })(<Input  placeholder="11位手机号" />)}
              </InputGroup>
            </FormItem>
            {/* <FormItem {...formItemLayout} label="欢迎语"  onFieldsChange={this.fieldChange}>
              <InputGroup compact>
                {getFieldDecorator('welcomeword', {
                  rules: [
                    {
                      message: '请输入欢迎语！',
                    },
                  ],
                  initialValue:userInfo.welcomeword || '',
                })(<Input  placeholder="欢迎语" />)}
              </InputGroup>
            </FormItem> */}
            <FormItem style={{paddingBottom:80}}{...formItemLayout} label="头像"  onFieldsChange={this.fieldChange}>
              <div style={{display: 'flex', height: '102px'}}>
                <CommonUpload
                  compo={this.handleUploadButton()}
                  action_url='/smartim/system/users/image/upload'
                  accept="png,jpg"
                  listType="picture-card"
                  onProcess={this.uploadProcess}
                  fileType={/(\.png|\.jpg)$/}
                />
                <span className="label margin-left-10" style={{paddingTop: 60}}>支持.jpg.png格式</span>
              </div>
            </FormItem>
          </Form>
        </div>
      </Modal>
    );
  }
}
