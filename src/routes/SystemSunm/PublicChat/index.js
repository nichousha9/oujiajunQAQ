/* eslint-disable no-param-reassign */
/* eslint-disable react/no-string-refs */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/first */
import React from 'react';
import { connect } from 'dva';
import { message, Icon, Popover, Modal } from 'antd';
import CommonButton from '../../../components/CommonButton';
import CommonMenue from '../../../components/CommonMenue';
import CommonFold from '../../../components/CommonFold';
import CommonSearch from '../../../components/CommonSearch';
import StandardTable from '../../../components/StandardTable';
import AuthModal from '../AuthModal/index';
import ChooseUserModal from '../ChooseUserModal';
import { getResMsg } from '../../../utils/codeTransfer';
import classnames from 'classnames';
import style from './index.less';

const { confirm } = Modal;

const coverHeader = <div className="title borderNone" />;
@connect(({ loading, systemSum, publicchat }) => {
  return {
    systemSum,
    publicchat,
    loading: loading.models.publicchat,
    listLoading:
      loading.effects['publicchat/fetchGroupMemberPage'] ||
      loading.effects['publicchat/fetchAllPublicGroup'],
  };
})
export default class PublicChat extends React.Component {
  state = {
    resourceList: [], // 权限树的数据
    roleAuthModalVisible: false, // 权限Modal
    publicGroupList: [], // 公聊列表
    currGroup: '', // 当前选中的公聊区
    addVisible: false, // 创建公聊区弹窗
  };
  componentDidMount() {
    this.loadAllGroupList();
  }
  componentWillReceiveProps(nextProps) {
    const {
      systemSum: { resourceList },
      publicchat: { currGroup, publicGroupList, groupUserList },
    } = nextProps;
    if (
      JSON.stringify(resourceList) !== JSON.stringify(this.state.resourceList) ||
      JSON.stringify(publicGroupList) !== JSON.stringify(this.state.publicGroupList) ||
      JSON.stringify(groupUserList) !== JSON.stringify(this.state.groupUserList) ||
      currGroup !== this.state.currGroup
    ) {
      this.setState({ currGroup, resourceList, publicGroupList, groupUserList });
    }
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'publicchat/clearState' });
  }
  loadAllGroupList = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'publicchat/fetchAllPublicGroup', payload: { type: '1' } }).then((res) => {
      if (res && res.data) {
        this.handleLoadList(res.data[0].id);
      }
    });
  };
  handleLoadList = (id, page, clear) => {
    if (clear) {
      this.searhFilter = {};
      this.commonSearchRef && this.commonSearchRef.clearSearValue();
    }
    const { dispatch } = this.props;
    const { pagination = {} } = this.tableRef || {};
    dispatch({
      type: 'publicchat/fetchGroupMemberPage',
      payload: {
        groupid: id,
        p: page || 0,
        ps: pagination.pageSize || 10,
        ...this.searhFilter,
      },
    });
  };
  inputSearch = (value) => {
    const { currGroup } = this.state;
    this.searhFilter = { nickname: value };
    this.handleLoadList(currGroup, '');
  };
  handleDeleteMenu = (id) => {
    const { dispatch } = this.props;
    const loadAllGroupList = this.loadAllGroupList;
    confirm({
      title: '执行删除操作之后公聊数据将无法恢复，确定删除？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'publicchat/deletePublicChat',
          payload: { id },
        }).then((res) => {
          if (res && res.status === 'OK') {
            message.success('删除成功');
            loadAllGroupList();
          }
        });
      },
    });
  };
  handleSaveMenue = (menu) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'publicchat/fetchModifyPublicChat',
      payload: {
        id: menu.id,
        groupname: menu.name,
      },
    }).then((res) => {
      menu.type = undefined;
      if (res.status === 'OK') {
        message.success('修改成功');
        this.loadAllGroupList();
      } else {
        message.error(getResMsg(res.data));
      }
    });
  };
  handleDeleteUser = (row) => {
    const { dispatch } = this.props;
    const { currGroup } = this.state;
    dispatch({
      type: 'publicchat/fetchModifyPublicChat',
      payload: {
        id: currGroup,
        userids: row.id,
        type: 'DELETE',
      },
    }).then((res) => {
      if (res.status === 'OK') {
        message.success('用户删除成功');
        this.handleLoadList(currGroup);
      }
    });
  };
  menuSelected = (id) => {
    this.handleLoadList(id, '', true);
  };
  addNewPublicChat = () => {
    if (!this.refs.pchatName.value) {
      message.error('公聊区名称不能为空！');
      return;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'publicchat/fetchAddPublicChat',
      payload: {
        groupname: this.refs.pchatName.value,
        msg: this.refs.pchatMsg.value ? this.refs.pchatMsg.value : '',
        type: '1',
      },
    }).then((res) => {
      if (res.status === 'OK') {
        message.success('添加成功');
        this.refs.pchatName.value = '';
        this.refs.pchatMsg.value = '';
        this.loadAllGroupList();
      } else {
        message.error(getResMsg(res.data));
      }
    });
    this.setState({ addVisible: false });
  };
  closeModal = () => {
    this.setState({
      chooseUserModalVisible: false,
    });
  };
  openUserChooseModal = () => {
    this.setState({
      chooseUserModalVisible: true,
    });
  };
  modalHandleOk = () => {
    this.closeModal();
    this.handleLoadList(this.state.currGroup);
  };
  tableChange = (data) => {
    const { currGroup } = this.state;
    this.handleLoadList(currGroup, data.current);
  };
  // 关闭Popover
  closePopover = () => {
    this.refs.pchatName.value = '';
    this.refs.pchatMsg.value = '';
    this.setState({ addVisible: false });
  };
  commonSearchRef = {};
  searhFilter = {};
  render() {
    const {
      chooseUserModalVisible,
      roleAuthModalVisible,
      resourceList,
      currGroup,
      publicGroupList,
      groupUserList,
    } = this.state;
    const { loading, listLoading } = this.props;
    const authModalProps = {
      type: 'publicchat',
      resourceList,
      curData: currGroup,
      visible: roleAuthModalVisible,
      onCancel: this.closeModal,
      onOK: this.modalHandleOk,
    };
    const columns = [
      {
        title: '用户',
        dataIndex: 'username',
      },
      {
        title: '姓名',
        dataIndex: 'uname',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        width: 150,
      },
      {
        title: '手机',
        dataIndex: 'mobile',
      },
      {
        title: '操作',
        dataIndex: 'act',
        render: (data, row) => (
          <a
            onClick={() => {
              this.handleDeleteUser(row);
            }}
          >
            删除
          </a>
        ),
      },
    ];
    const extralContent = (
      <div>
        <CommonSearch
          ref={(ele) => {
            this.commonSearchRef = ele;
          }}
          doSearch={this.inputSearch}
        />
        <CommonButton
          loading={loading}
          onClick={this.openUserChooseModal}
          className="margin-left-10 margin-right-10"
        >
          添加用户到公聊
        </CommonButton>
      </div>
    );
    const tableProps = {
      ref: (ele) => {
        this.tableRef = ele;
      },
      loading: listLoading,
      noSelect: true,
      showTableHeader: true,
      coverHeader,
      extralContent,
      tableClass: 'padding-10',
      onChange: this.tableChange,
      data: groupUserList,
      columns,
      cutHeight: 250,
    };
    const menuProps = {
      menueSelect: this.menuSelected,
      selectedKeys: [currGroup],
      menuData: publicGroupList,
      onAct: false,
      handleSaveMenue: this.handleSaveMenue,
      handleDeleteMenu: this.handleDeleteMenu,
    };
    const popoverContent = (
      <div className="padding-10">
        <div className="padding-10" style={{ textAlign: 'center' }}>
          <label style={{ display: 'block' }}>
            名称：
            <input style={{ width: 200 }} ref="pchatName" />
          </label>
          <label style={{ display: 'block', marginTop: 6, marginBottom: 8 }}>
            附言：
            <input style={{ width: 200 }} ref="pchatMsg" />
          </label>
          <CommonButton onClick={this.closePopover} style={{ marginRight: 10 }}>
            取消
          </CommonButton>
          <CommonButton loading={loading} onClick={this.addNewPublicChat} type="primary">
            保存
          </CommonButton>
        </div>
      </div>
    );
    const chooserUserModalProps = {
      type: 'publicchat',
      action: 'ADD',
      curData: { id: currGroup },
      visible: chooseUserModalVisible,
      title: '添加用户到公聊',
      onCancel: this.closeModal,
      onOK: this.modalHandleOk,
    };
    let clientHeight =
      window.innerHeight ||
      window.document.documentElement.clientHeight ||
      window.document.body.clientHeight;
    clientHeight -= 165;
    return (
      <div className={classnames(style.systemRole, 'border', 'bgWhite')}>
        <CommonFold>
          <div key="roleLeft" className={classnames(style.roleLeft)}>
            <div className={style.systemRoleHeader}>
              <div className="title border-bottom">公聊列表</div>
              <div className={style.addMenueBox}>
                <Popover
                  visible={this.state.addVisible}
                  title="创建公聊区"
                  trigger="click"
                  content={popoverContent}
                >
                  <div
                    className={classnames(style.addMenue)}
                    onClick={() => {
                      this.setState({ addVisible: !this.state.addVisible });
                    }}
                  >
                    <Icon type="plus" />
                    新建公聊区
                  </div>
                </Popover>
              </div>
            </div>
            <div className={style.menuList} style={{ overflow: 'auto', height: clientHeight }}>
              <CommonMenue {...menuProps} />
            </div>
          </div>
        </CommonFold>
        <div key="roleRight" className={classnames(style.roleRight, 'border-left')}>
          <StandardTable {...tableProps} />
        </div>
        {roleAuthModalVisible && <AuthModal {...authModalProps} />}
        {chooseUserModalVisible && <ChooseUserModal {...chooserUserModalProps} />}
      </div>
    );
  }
}
