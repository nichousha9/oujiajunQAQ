/* eslint-disable no-script-url */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-did-mount-set-state */
/* eslint-disable react/no-string-refs */
/* eslint-disable react/sort-comp */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import { Input, message, Menu, Table, Modal, Collapse } from 'antd';
import {
  getOnlineUsers,
  transferAgent,
  transferAgent2Group,
  getClassifySkillList,
} from '../../services/api';
import { formatDatetime } from '../../utils/utils';

let _self = {};
const { TextArea } = Input;
const { Panel } = Collapse;
const columns = [
  {
    title: '技能组/用户',
    dataIndex: 'nickname',
    key: 'nickname',
    width: 150,
  },
  {
    title: '登录时间',
    dataIndex: 'logintime',
    key: 'logintime',
    width: 150,
  },
  {
    title: '最大用户数',
    dataIndex: 'maxusers',
    key: 'maxusers',
    width: 150,
  },
  {
    title: '服务用户数',
    dataIndex: 'users',
    key: 'users',
    width: 150,
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    render: (text, record) => (
      <span>
        <a
          onClick={() => {
            _self.handleTransfer(record);
          }}
        >
          转接
        </a>
      </span>
    ),
  },
];
export default class TransferModal extends React.Component {
  state = {
    visible: false,
    skillList: [], // 技能组列表
    userList: [], // 用户列表
    transferData: {
      // 转接接口参数
      userid: this.props.userid, // 坐席页面传过来的参数
      agentserviceid: this.props.agentserviceid,
      agentuserid: this.props.agentuserid,
      agentno: '',
      skill_id: '',
      memo: '',
    },
  };

  componentDidMount = async () => {
    _self = this;

    // 获取技能组列表
    const resp = await getClassifySkillList({});
    const skillList = resp.data || [];
    this.setState({
      skillList,
    });

    // 获取在线用户列表
    if (skillList.length) {
      await this.fetchUserList(skillList[0].list[0]);
    }
  };

  // 转接对话框
  handleTransfer = (user) => {
    this.state.transferData.agentno = user.agentno || null;
    this.state.transferData.skill_id = user.skill_id || null;

    this.setState({
      visible: true,
    });
  };
  onClassChange = (index) => {
    if (
      index &&
      this.state.skillList[index] &&
      this.state.skillList[index].list &&
      this.state.skillList[index].list[0]
    ) {
      this.fetchUserList(this.state.skillList[index].list[0]);
    }
  };
  // 根据技能组获取用户
  async fetchUserList(skill) {
    const resp = await getOnlineUsers({ skill_id: skill.id });
    const userList = [
      {
        key: skill.id,
        nickname: skill.name,
        logintime: '-',
        maxusers: '-',
        users: '-',
        skill_id: skill.id,
      },
    ];
    for (const item of resp.data) {
      // table数据组装
      userList.push({
        key: item.id,
        agentno: item.id,
        nickname: item.nickname,
        logintime: item.agentStatus && formatDatetime(item.agentStatus.logindate),
        maxusers: item.agentStatus && item.agentStatus.maxusers,
        users: item.agentStatus && item.agentStatus.users,
      });
    }
    this.setState({
      userList,
    });
  }

  // 对话框点击ok
  handleOk = async () => {
    const { transfOk, onCancel } = this.props;

    const { transferData } = this.state;

    // 转接坐席还是技能组
    const post = transferData.skill_id ? transferAgent2Group : transferAgent;

    await post({ ...transferData, memo: this.refs.memo.textAreaRef.value });
    message.success('转接成功');
    // 成功
    this.setState({ visible: false });
    if (transfOk) transfOk();
    if (onCancel) onCancel();
    /* this.props.dispatch(routerRedux.goBack()) */
  };
  refs = {};
  render() {
    const { onCancel, visible } = this.props;
    return (
      <Modal width="1000px" onOk={onCancel} onCancel={onCancel} visible={visible} title="转接坐席">
        <div className="flexBox">
          <div className="margin-right-20">
            <Collapse
              bordered={false}
              defaultActiveKey={['0']}
              accordion
              onChange={(index) => {
                this.onClassChange(index);
              }}
            >
              {this.state.skillList.map((item, index) => {
                return (
                  <Panel header={item.classname} key={index} showArrow>
                    <Menu
                      style={{ width: 200 }}
                      defaultSelectedKeys={['0']}
                      mode="inline"
                      theme="light"
                    >
                      {item.list.map((litem, lindex) => {
                        return (
                          <Menu.Item key={lindex}>
                            {' '}
                            <a
                              href="javascript:;"
                              onClick={() => {
                                this.fetchUserList(litem);
                              }}
                            >
                              {litem.name}
                            </a>{' '}
                          </Menu.Item>
                        );
                      })}
                    </Menu>
                  </Panel>
                );
              })}
            </Collapse>
          </div>
          <div className="flex1">
            <Table
              dataSource={this.state.userList}
              columns={columns}
              pagination={false}
              scroll={{ y: 300 }}
            />
          </div>
        </div>
        <Modal
          title="转接坐席"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={() => {
            this.setState({ visible: false });
          }}
        >
          <TextArea ref="memo" rows="4" placeholder="转接附言（255字符以内）" />
        </Modal>
      </Modal>
    );
  }
}
