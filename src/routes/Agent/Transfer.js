/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-string-refs */
/* eslint-disable no-script-url */
/* eslint-disable react/no-did-mount-set-state */
/* eslint-disable react/sort-comp */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/first */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Input,
  Card,
  Breadcrumb,
  Row,
  Col,
  Menu,
  Table,
  Modal,
} from 'antd';
import {
  getSkillList,
  getOnlineUsers,
  transferAgent,
  transferAgent2Group,
} from '../../services/api';
import { routerRedux } from 'dva/router';
import { formatDatetime } from '../../utils/utils';

const { TextArea } = Input;
let _self;

const columns = [
  {
    title: '技能组/用户',
    dataIndex: 'username',
    key: 'username',
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
          href="javascript:;"
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

@connect((props) => {
  const { routing } = props;
  return { query: routing.location.query }; // 获取query参数
})
export default class Transfer extends PureComponent {
  state = {
    visible: false,
    skillList: [], // 技能组列表
    userList: [], // 用户列表
    transferData: {
      // 转接接口参数
      userid: this.props.query.userid, // 坐席页面传过来的参数
      agentserviceid: this.props.query.agentserviceid,
      agentuserid: this.props.query.agentuserid,
      agentno: '',
      skill_id: '',
      memo: '',
    },
  };

  // 转接对话框
  handleTransfer = (user) => {
    this.state.transferData.agentno = user.agentno || null;
    this.state.transferData.skill_id = user.skill_id || null;

    this.setState({
      visible: true,
    });
  };
  componentDidMount = async () => {
    _self = this;

    // 获取技能组列表
    const resp = await getSkillList({});
    const skillList = resp.data || [];
    this.setState({
      skillList,
    });

    // 获取在线用户列表
    if (skillList.length) {
      await this.fetchUserList(skillList[0]);
    }
  };

  // 根据技能组获取用户
  async fetchUserList(skill) {
    const resp = await getOnlineUsers({ skill_id: skill.id });
    const userList = [
      {
        key: skill.id,
        username: skill.name,
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
        username: item.username,
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
    const data = this.state.transferData;
    data.memo = this.refs.memo.textAreaRef.value; // 备注

    // 转接坐席还是技能组
    const post = data.skill_id ? transferAgent2Group : transferAgent;

    await post(data);

    // 成功
    this.setState({ visible: false });

    this.props.dispatch(routerRedux.goBack());
  };
  render() {
    return (
      <Fragment>
        <Breadcrumb>
          <Breadcrumb.Item>坐席</Breadcrumb.Item>
          <Breadcrumb.Item>转接坐席</Breadcrumb.Item>
        </Breadcrumb>
        <Card bordered={false} style={{ marginTop: 20 }}>
          <Row style={{ margin: -10 }}>
            <Col md={6} xs={24}>
              <Menu
                style={{ width: 256 }}
                defaultSelectedKeys={['0']}
                mode="inline"
                theme="light"
                // onClick={ (item)=>{ this.fetchUserList(item.key) } }
              >
                {this.state.skillList.map((item, index) => {
                  return (
                    <Menu.Item key={index}>
                      {' '}
                      <a
                        href="javascript:;"
                        onClick={() => {
                          this.fetchUserList(item);
                        }}
                      >
                        {item.name}
                      </a>{' '}
                    </Menu.Item>
                  );
                })}
              </Menu>
            </Col>
            <Col md={16} xs={24}>
              <Table
                dataSource={this.state.userList}
                columns={columns}
                pagination={false}
                scroll={{ y: 300 }}
              />
            </Col>
          </Row>
        </Card>

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
      </Fragment>
    );
  }
}
