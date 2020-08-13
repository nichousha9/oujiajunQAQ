/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-state */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Input, Button, Card, Breadcrumb, Progress, message, Icon } from 'antd';
import CommonUpload from '../../components/CommonUpload';
import styles from './ModifyProfile.less';
import { getUserInfo } from '../../utils/userInfo';

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
const submitFormLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 14, offset: 5 },
  },
};

@Form.create()
@connect(({ modifyprofile, loading }) => ({
  modifyprofile,
  submitting: loading.effects['modifyprofile/modifyCurrentInfo'],
}))
export default class ModifyProfile extends PureComponent {
  state = {
    confirmDirty: false,
    visible: false,
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'modifyprofile/getCurrentInfo',
    });
  }

  componentWillReceiveProps(nextProps) {
    const {
      modifyprofile: { userInfo = {} },
    } = nextProps;
    if (this.imageUrl !== userInfo.imageurl) {
      this.imageUrl = userInfo.imageurl;
      this.forceUpdate();
    }
    if (this.getting === false) {
      if (nextProps.modifyprofile.status === 'OK') {
        message.success('修改成功！');
      } else {
        message.error('修改失败，请重试！');
      }
      this.getting = true;
    }
  }

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  checkConfirm = (value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不匹配!');
    } else {
      callback();
    }
  };

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

  checkPassword = (rule, value, callback) => {
    if (value) {
      this.setState({
        help: '',
      });
      if (!this.state.visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }
    }
    callback();
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.getting = false;
        this.props.dispatch({
          type: 'modifyprofile/modifyCurrentInfo',
          payload: {
            ...values,
            agent: getUserInfo().agent,
          },
        });
      }
    });
  };

  handleCancel = () => {
    this.props.dispatch(routerRedux.goBack());
  };

  uploadProcess = (nextFileList, url, loading) => {
    // 不能频繁 setState
    this.fileList = nextFileList;
    this.imageUrl = url;
    this.loading = loading;
    this.forceUpdate();
  };

  handleUploadButton = () => {
    const uploadButton = (
      <div>
        <Icon type={this.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    return this.imageUrl ? (
      <img className="ant-upload ant-upload-select" src={this.imageUrl} alt="" />
    ) : (
      uploadButton
    );
  };
  loading = false;
  imageUrl = '';
  render() {
    const { submitting, userInfo } = this.props.modifyprofile;

    const { getFieldDecorator } = this.props.form;
    const username = userInfo.username ? userInfo.username : '';

    const mobile = userInfo.mobile ? userInfo.mobile : '';
    return (
      <Fragment>
        <Breadcrumb>
          <Breadcrumb.Item>首页</Breadcrumb.Item>
          <Breadcrumb.Item>资料修改</Breadcrumb.Item>
        </Breadcrumb>
        <Card bordered={false} style={{ marginTop: 20 }}>
          <div style={{ width: '50%', margin: '0 auto' }}>
            <Form onSubmit={this.handleSubmit}>
              <FormItem {...formItemLayout} label="账号">
                <div className="height32 line-height32">{username}</div>
              </FormItem>
              <FormItem {...formItemLayout} label="类型" onFieldsChange={this.fieldChange}>
                <div className="height32 line-height32">
                  {userInfo.superuser ? '超级管理员' : '用户'}
                </div>
              </FormItem>
              <FormItem {...formItemLayout} label="昵称">
                {getFieldDecorator('nickname', {
                  rules: [
                    {
                      message: '请输入昵称！',
                    },
                  ],
                  initialValue: userInfo.nickname || '',
                })(<Input placeholder="昵称" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="手机号码" onFieldsChange={this.fieldChange}>
                <InputGroup compact>
                  {getFieldDecorator('mobile', {
                    rules: [
                      {
                        message: '请输入手机号！',
                      },
                      {
                        pattern: /^1\d{10}$/,
                        message: '手机号格式错误！',
                      },
                    ],
                    initialValue: mobile,
                  })(<Input placeholder="11位手机号" />)}
                </InputGroup>
              </FormItem>
              <FormItem {...formItemLayout} label="欢迎语" onFieldsChange={this.fieldChange}>
                <InputGroup compact>
                  {getFieldDecorator('welcomeword', {
                    rules: [
                      {
                        message: '请输入欢迎语！',
                      },
                    ],
                    initialValue: userInfo.welcomeword || '',
                  })(<Input placeholder="欢迎语" />)}
                </InputGroup>
              </FormItem>
              <FormItem {...formItemLayout} label="头像" onFieldsChange={this.fieldChange}>
                <div style={{ display: 'flex' }}>
                  <CommonUpload
                    compo={this.handleUploadButton()}
                    action_url="/smartim/system/attachment/upload"
                    accept="png,jpg"
                    listType="picture-card"
                    onProcess={this.uploadProcess}
                    fileType={/(\.png|\.jpg)$/}
                  />
                  <span className="label margin-left-10" style={{ paddingTop: 60 }}>
                    支持.jpg.png格式
                  </span>
                </div>
              </FormItem>
              <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                <Button type="primary" htmlType="submit" loading={submitting}>
                  保存
                </Button>
              </FormItem>
            </Form>
          </div>
        </Card>
      </Fragment>
    );
  }
}
