/* eslint-disable no-unused-vars */
/* eslint-disable react/no-did-mount-set-state */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Component } from 'react';
import {
  Input,
  Row,
  Col,
  Form,
  Button,
  Table,
  Card,
  Avatar,
  Tabs,
  Pagination,
  Modal,
  message,
  Popconfirm,
  Icon,
} from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from './index.less';
import logo from '../../assets/logo.svg';

const { TabPane } = Tabs;

@Form.create()
@connect(({ robotManagement, loading }) => ({
  ...robotManagement,
  loading: loading.effects['robotManagement/qryscene'],
}))
export default class RobotConfiguration extends Component {
  state = {
    // pageNum: 1,
    // pageSize: 10,
    selectedRowKeys: [],
    sceneKeys: [],
    compile: false,
    pageIdentifier: 0,
    visible: false,
    tableName: '绑定知识库',
    robotName: '机器人名称',
    robotApply: '机器人描述',
    id: '',
    textlength: 0,
  };

  // componentWillMount () {
  //   // 拦截判断是否离开当前页面
  //   window.addEventListener('beforeunload', this.beforeunload);
  // }
  //
  componentDidMount() {
    const { dispatch, location } = this.props;
    if (location.query) {
      const { id, robotName, robotApply } = location.query;
      dispatch({
        type: 'robotManagement/qryRobotDetail',
        payload: { id },
      });
      this.setState({
        id,
        robotName: robotName || '机器人名称',
        robotApply: robotApply || '机器人描述',
      });
      this.qryKdbNoRelevanceRobotList(id);
      this.qryKdbRelevanceRobotList(id);
    }
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  onSceneChange = (sceneKeys) => {
    this.setState({ sceneKeys });
  };

  // 获取机器人列表

  onShowSizeChange = (current, pageSize) => {
    const { pageIdentifier, id } = this.state;
    if (pageIdentifier === 0) {
      this.qryKdbRelevanceRobotList(id, 1, pageSize);
    } else if (pageIdentifier === 1) {
      this.qrySceneRelevanceRobotList(id, 1, pageSize);
    }
  };

  // 解除数据绑定
  getDetail = (delId) => {
    const { dispatch } = this.props;
    const { pageIdentifier, id } = this.state;
    let arr = [];
    if (Number.isInteger(delId)) {
      arr.push(delId);
    } else {
      arr = delId;
    }

    dispatch({
      type: 'robotManagement/unbindRobot',
      payload: { ids: arr },
    }).then(() => {
      if (pageIdentifier === 0) {
        this.qryKdbRelevanceRobotList(id);
      } else if (pageIdentifier === 1) {
        this.qrySceneRelevanceRobotList(id);
      }
      message.success('解绑成功');
    });
  };

  noonShowSizeChange = (current, pageSize) => {
    const { pageIdentifier, id } = this.state;
    if (pageIdentifier === 0) {
      this.qryKdbNoRelevanceRobotList(id, 1, pageSize);
    } else if (pageIdentifier === 1) {
      this.qrySceneNoRelevanceRobotList(id, 1, pageSize);
    }
  };

  // 批量解绑
  deleteInBatches = () => {
    const { sceneKeys, pageIdentifier } = this.state;
    if (sceneKeys.length === 0) {
      if (pageIdentifier === 0) {
        message.warning('请选择需要解绑的知识库');
      } else if (pageIdentifier === 1) {
        message.warning('请选择需要解绑的场景信息');
      }
    } else {
      this.getDetail(sceneKeys);
    }
  };

  // 未关联知识库
  qryKdbNoRelevanceRobotList = (robotId, pageNum = 1, pageSize = 10) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'robotManagement/qryKdbNoRelevanceRobotList',
      payload: {
        robotId,
        pageInfo: { pageNum, pageSize },
      },
    });
  };

  // 关联知识库
  qryKdbRelevanceRobotList = (robotId, pageNum = 1, pageSize = 10) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'robotManagement/qryKdbRelevanceRobotList',
      payload: {
        robotId,
        pageInfo: { pageNum, pageSize },
      },
    });
  };

  nohandlePageChanged = (pageNumber) => {
    console.log(pageNumber);
    const { pageIdentifier, id } = this.state;
    if (pageIdentifier === 0) {
      this.qryKdbNoRelevanceRobotList(id, pageNumber);
    } else if (pageIdentifier === 1) {
      this.qrySceneNoRelevanceRobotList(id, pageNumber);
    }
  };

  handlePageChanged = (pageNumber) => {
    const { pageIdentifier, id } = this.state;
    if (pageIdentifier === 0) {
      this.qryKdbRelevanceRobotList(id, pageNumber);
    } else if (pageIdentifier === 1) {
      this.qrySceneRelevanceRobotList(id, pageNumber);
    }
  };

  // 未关联场景
  qrySceneNoRelevanceRobotList = (robotId, pageNum = 1, pageSize = 10) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'robotManagement/qrySceneNoRelevanceRobotList',
      payload: {
        robotId,
        pageInfo: { pageNum, pageSize },
      },
    });
  };

  // 关联场景
  qrySceneRelevanceRobotList = (robotId, pageNum = 1, pageSize = 10) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'robotManagement/qrySceneRelevanceRobotList',
      payload: {
        robotId,
        pageInfo: { pageNum, pageSize },
      },
    });
  };

  // 修改详情信息
  saveRobot = () => {
    const { form, location, dispatch } = this.props;
    const { id } = location.query;
    form.validateFields((err, { robotName, robotApply }) => {
      if (!err) {
        dispatch({
          type: 'robotManagement/updateRobot',
          payload: {
            id,
            robotName,
            robotApply,
          },
        }).then(() => {
          message.success('修改成功');
        });
      }
      this.setState({ compile: false, robotName, robotApply });
    });
  };

  updatakeys = (key) => {
    const { id } = this.state;
    if (key === '0') {
      this.qryKdbRelevanceRobotList(id);
      this.setState({ pageIdentifier: 0, tableName: '绑定知识库' });
    } else if (key === '1') {
      this.qrySceneRelevanceRobotList(id);
      this.setState({ pageIdentifier: 1, tableName: '绑定场景' });
    }
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
    const { pageIdentifier, id } = this.state;
    if (pageIdentifier === 0) {
      this.qryKdbNoRelevanceRobotList(id);
    } else if (pageIdentifier === 1) {
      this.qrySceneNoRelevanceRobotList(id);
    }
  };

  handleOk = () => {
    const { selectedRowKeys, pageIdentifier, id } = this.state;
    const robotConfigList = [];
    selectedRowKeys.map((item) => {
      return robotConfigList.push({
        kdbSceneId: item,
        robotId: id,
      });
    });
    const { dispatch } = this.props;
    if (pageIdentifier === 0) {
      dispatch({
        type: 'robotManagement/kdbBindingRobot',
        payload: { id, robotConfigList },
      }).then(() => {
        message.success('绑定成功');
        this.qryKdbRelevanceRobotList(id);
        this.qryKdbNoRelevanceRobotList(id);
        this.setState({
          visible: false,
          selectedRowKeys: [],
        });
      });
    } else if (pageIdentifier === 1) {
      dispatch({
        type: 'robotManagement/sceneBindingRobot',
        payload: { id, robotConfigList },
      }).then(() => {
        message.success('绑定成功');
        this.qrySceneRelevanceRobotList(id);
        this.qrySceneNoRelevanceRobotList(id);
        this.setState({
          visible: false,
          selectedRowKeys: [],
        });
      });
    }
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  textvalue = (e) => {
    const textname = e.target.value;
    let strlen = 0;
    for (let i = 0; i < textname.length; i += 1) {
      if (textname.charCodeAt(i) > 255) strlen += 1;
      else strlen += 1;
    }
    this.setState({ textlength: strlen });
  };

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const warnTypecolumn = [
      {
        title: '场景ID',
        dataIndex: 'kdbSceneId',
        width: 200,
      },
      {
        title: '场景名称',
        dataIndex: 'name',
        width: 200,
      },
      {
        title: '场景描述',
        dataIndex: 'describe',
        width: 200,
      },
      {
        title: '操作',
        key: 'action',
        width: 160,
        align: 'center',
        render: (text, record) => (
          <Popconfirm
            title={`确定要删除${record.name}吗？`}
            okText="确定"
            cancelText="取消"
            onConfirm={() => this.getDetail(record.id)}
          >
            <a>解绑</a>
          </Popconfirm>
        ),
      },
    ];
    const columns = [
      {
        title: '知识库ID',
        dataIndex: 'kdbSceneId',
        width: 200,
      },
      {
        title: '知识库名称',
        dataIndex: 'name',
        width: 200,
      },
      {
        title: '说明',
        dataIndex: 'describe',
        width: 200,
      },
      {
        title: '操作',
        key: 'action',
        width: 160,
        align: 'center',
        render: (text, record) => (
          <Popconfirm
            title={`确定要删除${record.name}吗？`}
            okText="确定"
            cancelText="取消"
            onConfirm={() => this.getDetail(record.id)}
          >
            <a>解绑</a>
          </Popconfirm>
        ),
      },
    ];

    const addwarnTypecolumn = [
      {
        title: '场景ID',
        dataIndex: 'id',
        width: 200,
      },
      {
        title: '场景名称',
        dataIndex: 'name',
        width: 200,
      },
      {
        title: '场景描述',
        dataIndex: 'describe',
        width: 200,
      },
    ];
    const addcolumns = [
      {
        title: '知识库ID',
        dataIndex: 'id',
        width: 200,
      },
      {
        title: '知识库名称',
        dataIndex: 'name',
        width: 200,
      },
      {
        title: '说明',
        dataIndex: 'describe',
        width: 200,
      },
    ];

    const {
      form: { getFieldDecorator },
      location,
      listArr = [],
      pageNum = 0,
      pageSize = 0,
      total = 0,
      nopageNum = 0,
      nopageSize = 0,
      nototal = 0,
      nolistArr = [],
      dispatch,
    } = this.props;
    const params = location.query;
    const {
      selectedRowKeys,
      pageIdentifier,
      compile,
      tableName,
      robotName,
      robotApply,
      sceneKeys,
      textlength,
    } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const keysAdministration = {
      sceneKeys,
      onChange: this.onSceneChange,
    };
    return (
      <div className={styles.selfAdapt}>
        <p style={{ fontSize: 14 }}>
          <a
            className={styles.superior}
            onClick={() => {
              dispatch(
                routerRedux.push({
                  pathname: '/robotManagement/robotManagement',
                })
              );
            }}
          >
            机器人新增
          </a>
          <span>机器人管理</span>
        </p>
        <Form {...formItemLayout} className="ant-advanced-search-form">
          <Row>
            <Col span={12}>
              {!compile ? (
                <Form.Item>
                  <Card className={styles.card} bordered={false}>
                    <Card.Meta
                      avatar={<Avatar src={logo} />}
                      title={robotName === '' ? params.robotName : robotName}
                      description={
                        <div className={styles.cardtext}>
                          <p>名称：{robotName === '' ? params.robotName : robotName}</p>
                          <p>说明：{robotApply === '' ? params.robotApply : robotApply}</p>
                        </div>
                      }
                    />
                  </Card>
                </Form.Item>
              ) : (
                <Card className={styles.card} bordered={false}>
                  <Card.Meta
                    avatar={<Avatar src={logo} />}
                    title={robotName === '' ? params.robotName : robotName}
                    description={
                      <div>
                        <Form.Item label="名称" required={false}>
                          {getFieldDecorator('robotName', {
                            rules: [
                              {
                                required: true,
                                message: '请输入机器人名称',
                              },
                            ],
                            initialValue: robotName === '' ? params.robotName : robotName,
                          })(<Input />)}
                        </Form.Item>
                        <Form.Item label="说明(50字以内)" required={false}>
                          {getFieldDecorator('robotApply', {
                            rules: [
                              {
                                required: true,
                                message: '请输入说明',
                              },
                            ],
                            initialValue: robotApply === '' ? params.robotApply : robotApply,
                          })(
                            <Input.TextArea
                              placeholder="请输入说明(50字符以内)"
                              maxLength={50}
                              onChange={(e) => this.textvalue(e)}
                            />
                          )}
                        </Form.Item>
                      </div>
                    }
                  />
                </Card>
              )}
            </Col>
            <Col span={12} style={{ textAlign: 'right', marginTop: '5%' }}>
              {!compile ? (
                <Button
                  style={{ marginLeft: '8px' }}
                  type="primary"
                  onClick={() => this.setState({ compile: true })}
                >
                  编辑
                </Button>
              ) : (
                <div>
                  <Button
                    style={{ marginLeft: '8px' }}
                    onClick={() => this.setState({ compile: false })}
                  >
                    取消
                  </Button>
                  <Button
                    style={{ marginLeft: '8px' }}
                    type="primary"
                    onClick={() => {
                      this.saveRobot();
                    }}
                  >
                    保存
                  </Button>
                </div>
              )}
            </Col>
          </Row>
        </Form>
        <Tabs defaultActiveKey="0" onChange={this.updatakeys} type="card">
          <TabPane tab="绑定知识库信息" key="0" />
          <TabPane tab="绑定场景信息" key="1" />
        </Tabs>
        <Row>
          <Button type="primary" onClick={this.showModal}>
            <Icon type="plus" />
            新建绑定
          </Button>
          <Popconfirm
            title="确定解绑吗？"
            okText="确定"
            cancelText="取消"
            onConfirm={() => this.deleteInBatches()}
          >
            <Button style={{ marginLeft: 10 }}>批量解绑</Button>
          </Popconfirm>
        </Row>
        <Table
          style={{ marginTop: 10 }}
          columns={pageIdentifier === 0 ? columns : warnTypecolumn}
          dataSource={listArr}
          rowSelection={keysAdministration}
          rowKey="id"
          pagination={false}
        />
        <Pagination
          current={pageNum}
          defaultPageSize={10}
          total={total}
          showQuickJumper
          showSizeChanger
          onChange={this.handlePageChanged}
          onShowSizeChange={this.onShowSizeChange}
          style={{ margin: 20, float: 'right' }}
        />
        <Modal
          title={`新建${tableName}`}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={800}
        >
          <Table
            style={{ marginTop: 10 }}
            columns={pageIdentifier === 0 ? addcolumns : addwarnTypecolumn}
            dataSource={nolistArr}
            rowSelection={rowSelection}
            rowKey="id"
            pagination={false}
          />
          <div style={{ height: 40 }}>
            <Pagination
              current={nopageNum}
              defaultPageSize={nopageSize}
              total={nototal}
              showQuickJumper
              showSizeChanger
              onChange={this.nohandlePageChanged}
              onShowSizeChange={this.noonShowSizeChange}
              style={{ margin: 20, float: 'right' }}
            />
          </div>
        </Modal>
      </div>
    );
  }
}
