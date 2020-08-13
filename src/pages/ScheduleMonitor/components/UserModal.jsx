import React from 'react';
import { Modal, Input, Form, Row, Col, Button, Table, AutoComplete } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from '../index.less';

// const { Option } = Select;

@connect(({ scheduleMonitor, loading }) => ({
  userModalVisible: scheduleMonitor.userModalVisible,
  userList: scheduleMonitor.userList,
  user: scheduleMonitor.user,
  roleList: scheduleMonitor.roleList,
  userListLoading: loading.effects['scheduleMonitor/getSystemUserListEffect'],
  userPageInfo: scheduleMonitor.userPageInfo
}))
@Form.create({
  name: 'user-filter',
})
class UserModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // pageInfo: {
      //   pageNum: 1,
      //   pageSize: 5,
      // },
      // rolePageInfo: {
      //   pageNum: 1,
      //   pageSize: 5
      // },
      user: {},
      // role: {},
      // roleId: 0,
    };
  }

  componentDidMount() {
    this.getSystemUserList();
    // this.getSystemRoleList();
  }

  closeModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'scheduleMonitor/handleUserModal',
      payload: false
    });
    // 清空roleList
    dispatch({
      type: 'scheduleMonitor/getRoleList',
      payload: []
    });
  }

  handleCancel = () => {
   this.closeModal();
  }

  handleOk = () => {
    const { dispatch } = this.props;
    const { user } = this.state;
    dispatch({
      type: 'scheduleMonitor/getSelectedUser',
      payload: user
    });
    this.closeModal();
  }

  onRow = record => {
    return {
      onClick: () => {this.onRowClick(record);}
    }
  }

  onRowClick = record => {
    this.setState({
      user: record
    });
  }

  // onRoleRow = record => {
  //   return {
  //     onClick: () => {this.onRoleRowClick(record);}
  //   }
  // }
  
  // onRoleRowClick = record => {
  //   const { form } = this.props;
  //   console.log('rowCLICK', record);
  //   this.setState({
  //     role: record
  //   }, ()=>{
  //     form.setFieldsValue({ userRole: record.sysRoleName });
  //   });
  // }

  handleSearch = () => {
    const { dispatch, userPageInfo } = this.props;

    let payload  = { ...userPageInfo, pageNum: 1 };
    if(!userPageInfo.pageSize) {
      payload = { ...payload, pageSize: 10 };
    }
    dispatch({
      type: 'scheduleMonitor/getUserPageInfo',
      payload,
    });

    this.getSystemUserList();
  }

  getSystemUserList = () => {
    const { form, dispatch } = this.props;
    // const { pageInfo, role } = this.state;
    // const { pageInfo } = this.state;
    const fieldValue = form.getFieldsValue();
    // console.log('fieldValue',fieldValue);
    // const userRole = role.sysRoleId;
    let { sysRoleId } = fieldValue;
    sysRoleId = parseInt(sysRoleId, 10);
    const finalFieldValue = { ...fieldValue, sysRoleId }; 
    const statusCd = "1000";
    const params = { ...finalFieldValue, statusCd }

    dispatch({
      type: 'scheduleMonitor/getSystemUserListEffect',
      payload: params
    });
  }

  getSystemRoleList = sysRoleName => {
    const { dispatch } = this.props;
    // const { rolePageInfo } = this.state;
    // console.log('autosearch', keyword);
    dispatch({
      type: 'scheduleMonitor/getSystemRoleListEffect',
      payload: { sysRoleName }
    });
  }

  resetForm = () => {
    const { form } = this.props;
    form.resetFields();
  }

  // onDropdownVisibleChange = open => {
  //   if(open) {
  //     const pageNum = 1;
  //     this.setState(
  //       preState => ({ rolePageInfo: { ...preState.rolePageInfo, pageNum } }),
  //       this.getSystemRoleList(),
  //     );
  //   }
  // }

  handleTableChange = (pageNum, pageSize) => {
    // this.setState(
    //   preState => ({ pageInfo: { ...preState.pageInfo, pageNum: page } }),
    //   this.getSystemUserList(),
    // );
    const { dispatch } = this.props;

    dispatch({
      type: 'scheduleMonitor/getUserPageInfo',
      payload: { pageNum, pageSize }
    });

    this.getSystemUserList();
  } 
  
  // handleRoleTableChange = page => {
  //   this.setState(
  //     preState => ({ rolePageInfo: { ...preState.rolePageInfo, pageNum: page } }),
  //     this. getSystemRoleList(),
  //   );
  // } 

  handleAutoSearch = value => {
    if(value && value.indexOf('\'') === -1) {
      // this.setState({
      //   keyword: value
      // },
     this.getSystemRoleList(value);
    }
  }

  // onSelect = value => {
  //   this.setState({ roleId: value });
  // }

  
  render() {
    const { userModalVisible, userList, form, afterClose, roleList, userListLoading, userPageInfo } = this.props;
    const { pageNum, pageSize, total } = userPageInfo || {};
    // const { role } = this.state;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        span: 9,
      },
      wrapperCol: {
        span: 15,
      },
    };

    const columns = [{
      title: formatMessage({ id: 'scheduleMonitor.account' }, '账号'),
      dataIndex: 'sysUserCode',
      sorter: (a, b) => a.sysUserCode - b.sysUserCode,
    }, {
      title: formatMessage({ id: 'scheduleMonitor.staffName'}, '员工名称'),
      dataIndex: 'staffName'
    }];

    const paginationProps = {
      showSizeChanger: true, 
      showQuickJumper: true, 
      current: pageNum,
      total,
      pageSize,
      onChange: (page, size) => this.handleTableChange(page, size),
      onShowSizeChange: (current, size) => this.handleTableChange(current, size)
   };

//    const rolePaginationProps = {
//     showSizeChanger: true, 
//     showQuickJumper: true, 
//     onChange: page => this.handleRoleTableChange(page)
//  };

//     const roleColumns = [{
//       title: formatMessage({ id: 'scheduleMonitor.roleName' }, '角色名称'),
//       dataIndex: 'sysRoleName'
//     }, {
//       title: formatMessage({ id: 'scheduleMonitor.roleCode'}, '角色编码'),
//       dataIndex: 'sysRoleCode'
//     }, {
//       title: formatMessage({ id: 'scheduleMonitor.roleType'}, '角色类型'),
//       dataIndex: 'sysRoleTypeName'
//     }];
    
    return (
      <Modal
        title={formatMessage({ id: 'scheduleMonitor.selectUser' }, '选择用户')}
        width={960}
        destroyOnClose
        visible={userModalVisible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        afterClose={afterClose}
      >
        <Form {...formItemLayout}>
          <Row>
            <Col span={11}>
              <Form.Item
                label={formatMessage(
                  {
                    id: 'scheduleMonitor.userName',
                  },
                  '用户名称',
                )}
              >
                {getFieldDecorator('userName')(
                  <Input
                    size="small"
                    placeholder={formatMessage(
                      {
                        id: 'scheduleMonitor.pleaseInputName',
                      },
                      '请输入名称',
                    )}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item
                label={formatMessage(
                  {
                    id: 'scheduleMonitor.userAccount',
                  },
                  '用户账号',
                )}
              >
                {getFieldDecorator('userAccount')(
                  <Input
                    size="small"
                    placeholder={formatMessage(
                      {
                        id: 'scheduleMonitor.pleaseInputAccount',
                      },
                      '请输入账号',
                    )}
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            {/* <Col span={11}>
              <Form.Item
                label={formatMessage(
                  {
                    id: 'scheduleMonitor.userRole',
                  },
                  '用户角色',
                )}
              >
                {getFieldDecorator('userRole')(
                  <Select
                    size="small"
                    dropdownMatchSelectWidth={false}
                    optionLabelProp="value"
                    getPopupContainer={triggerNode => triggerNode.parentElement}
                    onDropdownVisibleChange={this.onDropdownVisibleChange}
                    placeholder={formatMessage(
                      {
                        id: 'scheduleMonitor.pleaseSelect',
                      },
                      '请选择',
                    )}
                    // dropdownRender={() => (
                    //   <Table
                    //     rowKey={record => record.sysRoleId}
                    //     columns={roleColumns}
                    //     dataSource={roleList}
                    //     pagination={rolePaginationProps}
                    //     onRow={this.onRoleRow}
                    //   />
                    // )}
                  >
                    <Option key="key" value={role.sysRoleName}>
                      <Table
                        rowKey={record => record.sysRoleId}
                        columns={roleColumns}
                        dataSource={roleList}
                        pagination={rolePaginationProps}
                        onRow={this.onRoleRow}
                      />
                    </Option>
                  </Select>,
                )}
              </Form.Item>
            </Col> */}
            <Col span={11}>
              <Form.Item
                label={formatMessage(
                  {
                    id: 'scheduleMonitor.userRole',
                  },
                  '用户角色',
                )}
              >
                {getFieldDecorator('sysRoleId')(
                  <AutoComplete 
                    getPopupContainer={triggerNode => triggerNode.parentElement}
                    onSearch={this.handleAutoSearch}
                    placeholder={formatMessage(
                      {
                        id: 'scheduleMonitor.pleaseSelect',
                      },
                      '请选择',
                    )}
                  >
                    {roleList.map(roleItem => <AutoComplete.Option key={roleItem.sysRoleId}>{roleItem.sysRoleName}</AutoComplete.Option>)}
                  </AutoComplete>
                )}
              </Form.Item>
            </Col>
            <Col span={11} className={styles.scheduleUserBtnGroup}>
              <Button
                className={styles.scheduleQueryBtn}
                size="small"
                type="primary"
                onClick={this.handleSearch}
              >
                {formatMessage(
                  {
                    id: 'common.btn.search',
                  },
                  '搜索',
                )}
              </Button>
              <Button size="small" onClick={this.resetForm}>
                {formatMessage(
                  {
                    id: 'common.btn.reset',
                  },
                  '重置',
                )}
              </Button>
            </Col>
          </Row>
        </Form>
        <Table
          rowKey={record => record.sysUserId}
          onRow={this.onRow}
          columns={columns}
          dataSource={userList}
          pagination={paginationProps}
          loading={userListLoading}
          rowClassName={styles.scheduleTableRow}
        />
      </Modal>
    );
  }
}

export default UserModal;
