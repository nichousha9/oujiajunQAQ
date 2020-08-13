import React from 'react';
import { connect } from 'dva';
import { Icon, message, Modal } from 'antd';
import StandardTable from '../../../components/StandardTable';
import CommonSearch from '../../../components/CommonSearch';

@connect(({ chooseUser, loading }) => {
  return {
    chooseUser,
    listLoading:
      loading.effects['chooseUser/fetchUserChooseListOrg'] ||
      loading.effects['chooseUser/fetchUserChooseListRole'] ||
      loading.effects['chooseUser/fetchModifyPublicChat'],
  };
})
export default class ChooseUserModal extends React.Component {
  state = {
    userList: {},
  };
  componentDidMount() {
    this.loadUserList();
  }
  componentWillReceiveProps(nextProps) {
    const {
      chooseUser: { userList },
    } = nextProps;
    if (JSON.stringify(userList) !== JSON.stringify(this.state.userList)) {
      this.setState({ userList });
    }
  }
  loadUserList = (page) => {
    const { type, dispatch, curData = {} } = this.props;
    const { pagination = {} } = this.tableRef || {};
    let distype = 'chooseUser/fetchUserChooseListRole';
    if (type === 'Org') {
      distype = 'chooseUser/fetchUserChooseListOrg';
    } else if (type === 'publicchat') {
      distype = 'chooseUser/fetchUserChooseListOrg';
    }
    dispatch({
      type: distype,
      payload: {
        id: curData.id || '',
        p: page || 1,
        ps: pagination.pageSize || 10,
        ...this.searh,
      },
    });
  };
  inputSearch = (value) => {
    this.searh = { nickname: value };
    this.loadUserList('', value);
  };
  handleTableChange = (obj) => {
    this.loadUserList(obj.current);
  };
  handleOk = () => {
    const { selectedRowKeys } = this.tableRef.state;
    if (!selectedRowKeys.length) {
      message.error('请选择要添加的用户');
      return;
    }
    const { dispatch, type, onOK, curData = {}, action } = this.props;
    let obj = { users: selectedRowKeys.join(','), roleId: curData.id };
    let distype = 'chooseUser/fetchAddUserToRole';
    if (type === 'Org') {
      obj = { users: selectedRowKeys.join(','), id: curData.id };
      distype = 'chooseUser/fetchAddUserToOrg';
    } else if (type === 'publicchat') {
      obj = { userids: selectedRowKeys.join(','), id: curData.id, type: action };
      distype = 'chooseUser/fetchModifyPublicChat';
    }
    dispatch({
      type: distype,
      payload: obj,
    }).then((res) => {
      if (res && res.status === 'OK') {
        message.success('添加成功');
        onOK();
      }
    });
  };
  searh = {};
  tableRef;
  render() {
    const { title, visible, onCancel, listLoading } = this.props;
    const { userList } = this.state;
    const columns = [
      {
        title: '用户名',
        dataIndex: 'username',
      },
      {
        title: '姓名',
        dataIndex: 'nickname',
      },
      {
        title: '电子邮件',
        dataIndex: 'email',
        width: 150,
      },
      {
        title: '手机',
        dataIndex: 'mobile',
      },
      {
        title: '管理员',
        dataIndex: 'superuser',
        width: 60,
        render: (data) => {
          return data ? (
            <a>
              <Icon type="check" className="bold" />
            </a>
          ) : (
            ''
          );
        },
      },
    ];
    const extralContent = <CommonSearch doSearch={this.inputSearch} />;
    const tabProps = {
      extralContent,
      loading: listLoading,
      checkable: true,
      rowKey: (record) => record.id,
      data: userList,
      columns,
      onChange: this.handleTableChange,
    };

    return (
      <Modal
        width="900px"
        bodyStyle={{ paddingTop: 5 }}
        visible={visible}
        title={title}
        onCancel={onCancel}
        onOk={this.handleOk}
        wrapClassName="commonModal"
      >
        <StandardTable
          noTotalPage
          {...tabProps}
          ref={(ele) => {
            this.tableRef = ele;
          }}
        />
      </Modal>
    );
  }
}
