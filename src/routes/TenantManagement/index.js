/* eslint-disable react/sort-comp */
/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Input,
  Row,
  Col,
  Button,
  Table,
  Divider,
  // Popconfirm,
  Switch,
  message,
} from 'antd';
import AddNewHirer from './components/AddNewHirer';
import styles from './index.less';

@connect(({ tenantManagement, loading }) => ({
  tenantManagement,
  loading: loading.effects['tenantManagement/qryHirerList'],
}))
@Form.create()
class TenantManagement extends Component {
  state = {
    visible: false,
    page: {},
    id: '',
    type: '',
  };

  componentDidMount() {
    this.qryHirerList();
  }

  onRef = (ref) => {
    this.hirerMsg = ref;
  };

  getHirerMsg = () => {
    const promise = this.hirerMsg.getHirerMsg();
    return promise;
  };

  retsetSearch = () => {
    const { form } = this.props;
    form.resetFields();
    this.qryHirerList();
  };

  // 查询租户列表
  qryHirerList = (page = {}) => {
    const {
      dispatch,
      form: { getFieldsValue },
    } = this.props;
    const searchParams = getFieldsValue();
    const { pageNum, pageSize } = page;
    dispatch({
      type: 'tenantManagement/qryHirerList',
      payload: {
        ...searchParams,
        pageInfo: {
          pageNum: pageNum || 1,
          pageSize: pageSize || 10,
        },
      },
      callback: (res) => {
        this.setState({
          page: {
            pageSize: res.pageSize,
            pageNum: res.pageNum,
            total: res.total,
            current: res.pageNum,
          },
        });
      },
    });
  };

  // 新增租户
  addNewHirer = () => {
    this.setState({
      visible: true,
      type: 'ADD',
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  // 确认新增/编辑
  handleOk = () => {
    const promise = this.getHirerMsg();
    const { type, id } = this.state;
    const { dispatch } = this.props;
    if (type === 'EDIT') {
      promise.then((values) => {
        dispatch({
          type: 'tenantManagement/updateHirer',
          payload: {
            id,
            ...values,
          },
          callback: (res) => {
            if (res === 'success') {
              message.success('编辑成功!');
              this.setState({
                visible: false,
              });
              this.qryHirerList();
            }
          },
        });
      });
    } else {
      promise.then((values) => {
        dispatch({
          type: 'tenantManagement/addNewHirer',
          payload: {
            ...values,
          },
          callback: (res) => {
            if (res === 'success') {
              message.success('新增成功!');
              this.setState({
                visible: false,
              });
              this.qryHirerList();
            }
          },
        });
      });
    }
  };

  // 删除租户
  handleDelete = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tenantManagement/deleteHirer',
      payload: {
        id: record.id,
      },
      callback: (res) => {
        if (res === 'success') {
          message.success('删除成功!');
          this.qryHirerList();
        }
      },
    });
  };

  // 页码/页数选择
  handlePageChange = (pageNum, pageSize) => {
    this.qryHirerList({ pageNum, pageSize });
  };

  // 编辑租户信息
  handleUpdateHirer = (record) => {
    this.setState({
      visible: true,
      type: 'EDIT',
      id: record.id,
    });
  };

  // 租户启用/禁用
  onChangeEdit = (record, state) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tenantManagement/updateHirer',
      payload: {
        state: state === '00A' ? '00X' : '00A',
        id: record.id,
        code: record.code,
      },
      callback: (res) => {
        if (res === 'success') {
          if (state === '00A') {
            message.success('禁用成功!');
          } else if (state === '00X') {
            message.success('启用成功!');
          }
          this.qryHirerList();
        } else {
          message.error('状态修改失败');
        }
      },
    });
  };

  render() {
    const { visible, page, type, id } = this.state;
    const {
      form,
      loading,
      tenantManagement: { hirerList },
    } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    const headFormItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    const column = [
      {
        title: '租户编码',
        dataIndex: 'code',
      },
      {
        title: '租户名称',
        dataIndex: 'name',
      },
      {
        title: '联系人姓名',
        dataIndex: 'contactName',
      },
      {
        title: '联系人号码',
        dataIndex: 'contactNumber',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        sorter: (a, b) => new Date(a.createTime) - new Date(b.createTime),
      },
      {
        title: '状态',
        dataIndex: 'state',
        render: (text, record) => (
          <span>
            <Switch
              checked={text === '00A'}
              onClick={() => this.onChangeEdit(record, record.state)}
            />
            <span style={{ marginLeft: 10 }}>{text === '00A' ? '启用' : '禁用'}</span>
          </span>
        ),
      },
      {
        title: '操作',
        render: (record) => (
          <span>
            {/* <a onClick={() => this.handleUpdateHirer(record)}>编辑</a> */}
            <span style={{ color: '#c3b2b2', cursor: 'pointer' }}>编辑</span>
            <Divider type="vertical" />
            {/* <Popconfirm
              title={`确定要删除租户${record.contactName}吗？`}
              onConfirm={() => this.handleDelete(record)}
            > */}
            <span style={{ color: '#c3b2b2', cursor: 'pointer' }}>删除</span>
            {/* </Popconfirm> */}
          </span>
        ),
      },
    ];
    const PaginationProps = {
      ...page,
      showSizeChanger: true,
      showQuickJumper: true,
      onChange: this.handlePageChange,
      onShowSizeChange: this.handlePageChange,
    };
    return (
      <div className={styles.main}>
        <Card title="租户管理">
          <Row gutter={16}>
            <Form>
              <Col span={8}>
                <Form.Item label="租户名称" {...headFormItemLayout}>
                  {getFieldDecorator('name')(<Input placeholder="请输入" />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="联系人姓名" {...formItemLayout}>
                  {getFieldDecorator('contactName')(<Input placeholder="请输入" />)}
                </Form.Item>
              </Col>
            </Form>
            <Col span={6}>
              <Row gutter={16}>
                <Col span={6}>
                  <Button type="primary" onClick={this.qryHirerList}>
                    查询
                  </Button>
                </Col>
                <Col span={6}>
                  <Button onClick={this.retsetSearch}>重置</Button>
                </Col>
              </Row>
            </Col>
            <Col span={2}>
              <Button type="primary" onClick={this.addNewHirer}>
                新增
              </Button>
            </Col>
          </Row>
          <Table
            rowKey="id"
            columns={column}
            loading={loading}
            dataSource={hirerList}
            pagination={PaginationProps}
          />
        </Card>
        {visible ? (
          <AddNewHirer
            type={type}
            id={id}
            visible={visible}
            handleOk={this.handleOk}
            handleCancel={this.handleCancel}
            onRef={this.onRef}
          />
        ) : null}
      </div>
    );
  }
}

export default TenantManagement;
