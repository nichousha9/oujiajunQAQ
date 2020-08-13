/* eslint-disable react/no-unused-state */
/* eslint-disable radix */
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, message, Modal, Spin } from 'antd';
import classnames from 'classnames';
import styles from './History.less';
import {
  chatmessagesDesc,
  agentuserUpdate,
  getAgentRemarks,
  getRobotChatList,
  getAgentChatList,
  getGroupChatList,
} from '../../services/api';
import MessageItem from '../Agent/MessageItem';

const { Search } = Input;

@connect((props) => {
  const { routing } = props;
  return { query: routing.location.query || {} }; // 获取query参数
})
@Form.create()
export default class HistoryDetail extends Component {
  state = {
    maxChatListLen: 0,
    userid: this.props.query ? this.props.query.userid : '2411101173', // 测试参数
    search: '', // 搜索关键字
    agentuser: { age: '' },
    chatList: [], // 历史会话
    visible: false, // 修改名字对话框
    remarkList: [], // 跟进备注
  };

  componentWillMount() {
    // if (userid) {
    //   if(!isGroup){
    //     getAgentuser({userid: this.state.userid}).then(resp => {
    //       const agentuser = resp.data || this.state.agentuser// 用户信息
    //       agentuser.age = new Date().getFullYear() - agentuser.yearofbirth || ''// 年龄

    //       // 平均响应时长
    //       let wait = agentuser.waittingtime || 0
    //       let unit = 'S'
    //       wait /= 1000
    //       if(wait > 60){
    //         wait /= 60
    //         unit = '分钟'
    //       }
    //       if(wait > 60){
    //         wait /= 60
    //         unit = '小时'
    //       }
    //       agentuser.waittingtime = parseInt(wait,10) + unit

    //       this.setState({agentuser},() => {
    //         this.getAgentRemarks()
    //       })
    //     })
    //   }
    //   this.getChatList();

    // }

    this.getChatmessages();
  }

  // 处理聊天消息

  onRemarkKeyup = async (e) => {
    if (e.keyCode === 13) {
      // 回车
      const remark = e.target.value.trim();
      e.target.value = '';

      if (!remark) return;

      // 添加备注
      message.success('操作成功');

      await this.getAgentRemarks();
    }
  };

  getAgentRemarks = async () => {
    // 跟进备注列表
    const resp = await getAgentRemarks({ userid: this.state.userid });
    if (resp.data) {
      this.setState({
        remarkList: resp.data,
      });
    }
  };

  getChatmessages = (search, p = 1) => {
    this.setState({ search, page: p, loading: true });
    const {
      query: { key, userId, groupId },
    } = this.props;
    if (key === 0) {
      // 机器人详细聊天信息
      const jsonParam = { userId, keyword: search, p };
      getRobotChatList(jsonParam).then((resp) => {
        this.dealdata(resp);
      });
    } else if (key === 1) {
      // 客服聊天详细信息
      getAgentChatList({ userId }).then((resp) => {
        this.dealdata(resp);
      });
    } else {
      // 群组聊天详细信息
      const jsonParam = { groupId, keyword: search, p };
      getGroupChatList(jsonParam).then((resp) => {
        this.dealdata(resp);
      });
    }
  };

  // 获取消息记录
  getChatList = (agentuser, page = 1) => {
    this.setState({ loading: true });
    const {
      query: { userid = '', isGroup = false },
    } = this.props;
    const { chatList = [], search } = this.state;
    const obj = { p: page, ps: 10, search };
    const key = isGroup ? 'groupid' : 'userid';
    obj[key] = userid;
    this.setState({ loading: true });
    chatmessagesDesc(obj).then((res) => {
      this.setState({ loading: false });
      if (page === 1) {
        this.setState({
          chatList: res.data.list,
          maxChatListLen: res.data.total,
          page: res.data.pageNum,
          isScrollBottom: true,
        });
        this.msgList.scrollTop = this.msgList.scrollHeight || ''; // 滚动到底部
      } else {
        this.setState({
          chatList: [...res.data.list, ...chatList],
          maxChatListLen: res.data.total,
          page: res.data.pageNum,
          isScrollBottom: false,
        });
        this.msgList.scrollTop = this.msgList.scrollHeight - this.oldHeight; // top的高度是要到新增加的高度
      }
    });
  };

  dealdata = (resp) => {
    // 历史消息
    this.setState({ loading: false });
    const { chatList } = this.state;
    if (resp.data) {
      const chatList2 = resp.data.content || [];
      const newList = [...chatList2, ...chatList];
      const h0 = this.msgList.scrollHeight;
      newList.map((item) => {
        Object.assign(item, {
          message: item.message
            .replace(/\/res\/image\.html/g, `${global.req_url}/res/image.html`)
            .replace(/\/res\/file\.html/g, `${global.req_url}/res/file.html`),
        });
        return item;
      });
      this.setState({
        chatList: newList,
        maxChatListLen: resp.data.totalPages,
        page: resp.data.number,
      });
      const h1 = this.msgList.scrollHeight;
      this.msgList.scrollTop = h1 - h0; // 滚动到底部
    }
  };

  handleChangeName = async () => {
    const name = this.nameInput.input.value;
    await agentuserUpdate({
      name,
      userid: this.state.agentuser.userid,
    });
    const { agentuser } = this.state;
    message.success('操作成功');
    this.setState({
      visible: false,
      agentuser: {
        ...agentuser,
        name,
      },
    });
  };

  updateAgentuser = () => {
    const { form } = this.props;

    // 校验表单
    form.validateFields((err) => {
      if (err) return;

      const obj = form.getFieldsValue();
      obj.yearofbirth = new Date().getFullYear() - parseInt(obj.age);
      obj.userid = this.state.agentuser.userid; // 用户ID

      for (const key in obj) {
        if (!obj[key]) delete obj[key];
      }

      agentuserUpdate(obj).then(() => {
        message.success('操作成功');
      });
    });
  };

  handleMesListScroll = (e) => {
    const { maxChatListLen = 0, page, search, loading } = this.state;
    if (e.target.scrollTop < 1 && page < maxChatListLen && loading === false) {
      this.oldHeight = (this.msgList && this.msgList.scrollHeight) || '';
      // this.getChatList(agentuser,page+1);
      this.getChatmessages(search, page + 1);
    }
  };
  msgList;
  renderMessageTitle = (item) => {
    return (
      <div className={item.calltype === 'in' ? styles.recvTitle : styles.sendTitle}>
        {`${item.userName}`}
        {item.userMark ? `(${item.userMark})` : ''}{' '}
        <span style={{ paddingLeft: 10 }}> {item.createTime}</span>
      </div>
    );
  };
  render() {
    const {
      query: { isGroup, groupName, type },
    } = this.props;
    const { loading = false, chatList = [], agentuser } = this.state;
    const imgUrl = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
    const chatMaxWidth = (document.getElementsByClassName('detailMsgList')[0] || {}).offsetWidth;
    return (
      <Fragment>
        <div className="selfAdapt">
          <div style={{ display: 'flex', width: '100%', height: '100%', marginRight: 5 }}>
            <div
              onScroll={this.handleMesListScroll}
              className={classnames('border scrollY')}
              style={{
                width: '100%',
                height: '100%',
                borderRightWidth: isGroup ? 1 : 0,
                background: '#F7F9FA',
              }}
            >
              <div className="border-bottom width100 flexBox bgWhite" style={{ height: 80 }}>
                <div
                  style={{
                    width: '50%',
                    lineHeight: '80px',
                    textAlign: 'left',
                    paddingLeft: '10px',
                  }}
                >
                  <img
                    className="vertical-middle"
                    src={imgUrl}
                    style={{ width: 48, height: 48, margin: 'auto' }}
                    alt="头像"
                  />
                  <div className="vertical-middle inlineBlock" style={{ marginLeft: '4px' }}>
                    <p className="font16 fontColor1 line-height16">
                      {agentuser.agentname || groupName || ''}
                    </p>
                    {!!isGroup && (
                      <p className="margin-top-10 fontColor3 line-height16">
                        {type === '0' ? '讨论组' : '公聊'}
                      </p>
                    )}
                    {!isGroup && (
                      <p className="margin-top-10 fontColor3 line-height16">
                        {agentuser.channel}{' '}
                        {agentuser.agentStatus && agentuser.agentStatus.status === 'ready'
                          ? '在线客服'
                          : '离线客服'}
                        {/* 平均响应时长  {agentuser.waittingtime} */}
                      </p>
                    )}
                  </div>
                </div>
                <div
                  className="text-right padding-right-10"
                  style={{ width: '50%', lineHeight: '80px' }}
                >
                  <Search
                    className={styles.extraContentSearch}
                    placeholder="请输入"
                    onSearch={(e) => this.getChatmessages(e)}
                  />
                  {/* <Button style={{ marginLeft: 6, fontSize: '14px', color: 'rgba(0,0,0,0.65)'}}>
                            发起会话
                          </Button> */}
                </div>
              </div>
              {!!loading && <Spin spinning={loading} />}
              <div
                ref={(ele) => {
                  this.msgList = ele;
                }}
                className={classnames('flex-auto detailMsgList', styles.list)}
              >
                {/* {this.state.chatList.map((item,)=>(<Message data={item} />))} */}
                {chatList.map((item) => (
                  <MessageItem
                    chatMaxWidth={chatMaxWidth}
                    title={this.renderMessageTitle(item)}
                    noAvater
                    item={item}
                    key={item.id}
                  />
                ))}
              </div>
            </div>
            {/* { !isGroup && (
            <div className="border scrollY" style={{width:'43%'}}>
              <div className="border-bottom margin-left-15 fontColor1 padding-left-10" style={{height:48, lineHeight:'48px'}}>访客资料</div>
              <div className="flex-auto">
                <div style={{display: 'inline-flex', lineHeight: '80px'}}>
                  <img src={imgUrl} style={{width: 40, height: 40, margin: 'auto', marginLeft: '24px'}} alt="头像" />
                  <span style={{
                       fontSize: '16px',
                       color: 'rgba(0,21,41,0.85)',
                       marginLeft: '10px',
                     }}
                  >{this.state.agentuser.name || this.state.agentuser.username}
                  </span>
                  <Icon
                    onClick={() => {
                       this.setState({visible: true})
                     }}
                    type="edit"
                    style={{marginLeft: 4, lineHeight: '80px', cursor: 'pointer'}}
                  />
                </div>
                <Form layout="vertical" hideRequiredMark>
                  <Row>
                    <Col xl={{span: 12}} lg={{span: 12}} md={{span: 12}} sm={12}>
                      <FormItem
                        {...formItemLayout}
                        className={styles.form_item_lil}
                        label={<span className={styles.label_text}>性别</span>}
                      >
                        {getFieldDecorator('gender', {
                             initialValue: agentuser.gender,
                           })(
                             <Select>
                               <Option value="male">男</Option>
                               <Option value="female">女</Option>
                             </Select>
                          )}
                      </FormItem>
                    </Col>
                    <Col xl={{span: 12}} lg={{span: 12}} md={{span: 12}} sm={12}>
                      <FormItem
                        {...formItemLayout}
                        className={styles.form_item_lil}
                        label={<span className={styles.label_text}>年龄</span>}
                      >
                        {getFieldDecorator('age', {
                             initialValue: agentuser.age,
                             rules: [
                               {
                                 pattern: /^\d+$/g,
                                 message: '请输入数字',
                               },
                             ],
                           })(<Input placeholder="请输入" />)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col xl={{span: 12}} lg={{span: 12}} md={{span: 12}} sm={12}>
                      <FormItem
                        {...formItemLayout}
                        className={styles.form_item_lil}
                        label={<span className={styles.label_text}>位置</span>}
                      >
                        {getFieldDecorator('city', {
                             initialValue: agentuser.city,
                             rules: [],
                           })(<Input placeholder="请输入" />)}
                      </FormItem>
                    </Col>
                    <Col xl={{span: 12}} lg={{span: 12}} md={{span: 12}} sm={12}>
                      <FormItem
                        {...formItemLayout}
                        className={styles.form_item_lil}
                        label={<span className={styles.label_text}>IP</span>}
                      >
                        {getFieldDecorator('ipaddr', {
                             initialValue: agentuser.ipaddr,
                             rules: [],
                           })(<Input placeholder="请输入" />)}

                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col xl={{span: 12}} lg={{span: 12}} md={{span: 12}} sm={12}>
                      <FormItem
                        {...formItemLayout}
                        className={styles.form_item_lil}
                        label={<span className={styles.label_text}>平台</span>}
                      >

                        {getFieldDecorator('osname', {
                             initialValue: agentuser.osname,
                             rules: [],
                           })(<Input placeholder="请输入" />)}
                      </FormItem>
                    </Col>
                    <Col xl={{span: 12}} lg={{span: 12}} md={{span: 12}} sm={12}>
                      <FormItem
                        {...formItemLayout}
                        className={styles.form_item_lil}
                        label={<span className={styles.label_text}>浏览器</span>}
                      >

                        {getFieldDecorator('browser', {
                             initialValue: agentuser.browser,
                             rules: [],
                           })(<Input placeholder="请输入" />)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row className={styles.form_item_big}>
                    <Col xl={{span: 12}} lg={{span: 12}} md={{span: 12}} sm={12}>
                      <FormItem
                        {...formItemLayout}
                        className={styles.form_item_lil}
                        label={<span className={styles.label_text}>电话</span>}
                      >


                        {getFieldDecorator('phone', {
                             initialValue: agentuser.phone,
                             rules: [
                               {
                                 pattern: /^\d+$/g,
                                 message: '手机格式不正确',
                               },
                             ],
                           })(<Input placeholder="请输入" />)}
                      </FormItem>
                    </Col>
                    <Col xl={{span: 12}} lg={{span: 12}} md={{span: 12}} sm={12}>
                      <FormItem
                        {...formItemLayout}
                        className={styles.form_item_lil}
                        label={<span className={styles.label_text}>QQ号</span>}
                      >

                        {getFieldDecorator('qq', {
                             initialValue: agentuser.qq,
                             rules: [
                               {
                                 pattern: /^\d+$/g,
                                 message: 'QQ格式不正确',
                               },
                             ],
                           })(<Input placeholder="请输入" />)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col xl={{span: 12}} lg={{span: 12}} md={{span: 12}} sm={12}>
                      <FormItem
                        {...formItemLayout}
                        className={styles.form_item_lil}
                        label={<span className={styles.label_text}>微信昵称</span>}
                      >

                        {getFieldDecorator('weixinname', {
                             initialValue: agentuser.weixinname,
                             rules: [],
                           })(<Input placeholder="请输入" />)}
                      </FormItem>
                    </Col>
                    <Col xl={{span: 12}} lg={{span: 12}} md={{span: 12}} sm={12}>
                      <FormItem
                        {...formItemLayout}
                        className={styles.form_item_lil}
                        label={<span className={styles.label_text}>微信号</span>}
                      >


                        {getFieldDecorator('weixin', {
                             initialValue: agentuser.weixin,
                             rules: [],
                           })(<Input placeholder="请输入" />)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col xl={{span: 12}} lg={{span: 12}} md={{span: 12}} sm={12}>
                      <FormItem
                        {...formItemLayout}
                        className={styles.form_item_lil}
                        label={<span className={styles.label_text}>邮箱</span>}
                      >

                        {getFieldDecorator('email', {
                             initialValue: agentuser.email,
                             rules: [
                               {
                                 type: 'email',
                                 message: '邮箱格式不正确',
                               },
                             ],
                           })(<Input placeholder="请输入" />)}
                      </FormItem>
                    </Col>
                    <Col xl={{span: 12}} lg={{span: 12}} md={{span: 12}} sm={12} />
                  </Row>
                  <Row>
                    <Col xl={{span: 24}} lg={{span: 24}} md={{span: 24}} sm={24}>
                      <FormItem
                        {...formItem3Layout}
                        className={styles.form_item_lil}
                        label={<span className={styles.label_text}>地址</span>}
                      >

                        {getFieldDecorator('address', {
                             initialValue: agentuser.address,
                             rules: [],
                           })(<Input placeholder="请输入" />)}

                        <Button
                          onClick={this.updateAgentuser}
                          style={{marginTop: 15, paddingLeft: 20, paddingRight: 20}}
                          type="primary"
                        >保存
                        </Button>
                      </FormItem>


                    </Col>
                  </Row>
                </Form>
                <div style={{paddingLeft: 24, marginTop: 20, paddingRight: 10}}>
                  <Steps progressDot current={0} direction='vertical'>
                    <Step
                      description={<TextArea onKeyUp={this.onRemarkKeyup} rows={4} placeholder='请输入跟进内容，按回车提交' />}
                    />
                    {this.state.remarkList.map((item, index) => {
                         return <Step description={`${formatTime(item.time)} ${item.agentname}： ${item.content}`} />
                       })}
                  </Steps>
                </div>
              </div>
            </div>
             ) } */}
          </div>
        </div>
        <Modal
          title="姓名"
          visible={this.state.visible}
          onOk={this.handleChangeName}
          onCancel={() => {
            this.setState({ visible: false });
          }}
        >
          <Input
            ref={(c) => {
              this.nameInput = c;
            }}
            placeholder="输入新姓名"
          />
        </Modal>
      </Fragment>
    );
  }
}
