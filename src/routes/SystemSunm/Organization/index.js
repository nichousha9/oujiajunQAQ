/* eslint-disable no-unused-expressions */
import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import { message, Spin, Icon } from 'antd';
import StandardTable from '../../../components/StandardTable';
import CommonButton from '../../../components/CommonButton';
import CommonTree from '../../../components/CommonTree';
import CommonFold from '../../../components/CommonFold';
import CommonSearch from '../../../components/CommonSearch';
// import CommonAreaTree from '../../../components/CommonAreaTree';
import EditOrgModal from './EditOrgModal';
import AuthModal from '../AuthModal';
import ChooseUserModal from '../ChooseUserModal';
import style from './index.less';

import { getAllOrgan } from '../../../services/systemSum';

@connect(({ organization, loading, systemSum, dataDic }) => {
  return {
    organization,
    systemSum,
    dataDic,
    listLoading: loading.effects['organization/fetchGetUserByOrg'],
    orgLoading: loading.effects['organization/fetchGetOrgList'],
  };
})
export default class Organization extends React.Component {
  state = {
    areaList: [],
    editOrgModalVisible: false, // 添加的Modal
    roleAuthModalVisible: false, // 添加的Modal
    resourceList: [], // 權限列表
    orgClassList: [],
    userList: {},
    organList: [],
    editOrg: {},
    curOrg: {}, // 当前选中的部门
  };
  componentDidMount() {
    // this.handleGetAreaList()
    const { dispatch } = this.props;
    dispatch({
      type: 'organization/fetchGetOrgList',
      payload: { parent: 0 },
    }).then((res) => {
      if (res && res.status === 'OK' && res.data.length) {
        this.setState({ editOrg: res.data[0] });
        this.loadUserList(res.data[0]);
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    const {
      systemSum: { orgClassList, resourceList },
      organization: { userList, organList, curOrg },
    } = nextProps;
    if (
      JSON.stringify(userList) !== JSON.stringify(this.state.userList) ||
      JSON.stringify(organList) !== JSON.stringify(this.state.organList) ||
      JSON.stringify(resourceList) !== JSON.stringify(this.state.resourceList) ||
      JSON.stringify(orgClassList) !== JSON.stringify(this.state.orgClassList) ||
      JSON.stringify(curOrg) !== JSON.stringify(this.state.curOrg)
    ) {
      this.setState({ userList, organList, curOrg, resourceList, orgClassList });
    }
  }
  onSelectCallBack = (data) => {
    if (JSON.stringify(data) !== JSON.stringify(this.state.curOrg)) {
      this.loadUserList(data, '', true);
      this.setState({ curOrg: data });
    }
  };
  showEditOrgModal = (node, newFlag) => {
    if (newFlag) {
      this.setState({
        editOrgModalVisible: true,
        editOrg: { parent: node ? node.id : 0 },
      });
    } else {
      this.setState({ editOrgModalVisible: true, editOrg: node || { parent: 0 } });
    }
  };
  openAuthModal = () => {
    this.setState({ roleAuthModalVisible: true });
  };
  closeModal = () => {
    this.setState({
      editOrgModalVisible: false,
      roleAuthModalVisible: false,
      chooseUserModalVisible: false,
      editOrg: {},
    });
  };
  // 删除用户
  handleDeleteUser = (data) => {
    const { dispatch } = this.props;
    const { curOrg } = this.state;
    dispatch({
      type: 'organization/fetchDeleteUser',
      payload: { id: data.id, organ: curOrg.id },
    }).then((res) => {
      if (res.status === 'OK') {
        message.success('删除成功');
        this.loadUserList(curOrg);
      }
    });
  };
  // 删除节点
  handleDeleteNode = (data) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'organization/fetchDeleteOrg',
      payload: { id: data.id },
    }).then((res) => {
      if (res && res.status === 'OK') {
        this.loadOrgList();
        message.success('部门删除成功');
      }
    });
  };

  // 加载下级菜单
  loadCallBack = (treeNodeProps) =>
    new Promise((resolve) => {
      getAllOrgan({ parent: treeNodeProps.id }).then((res) => {
        resolve(res.data);
      });
    });

  // 获取用户列表
  loadUserList = (data, page, clear) => {
    if (clear) {
      this.searhFilter = {};
      this.commonSearchRef &&
        this.commonSearchRef.clearSearValue &&
        this.commonSearchRef.clearSearValue();
    }
    const { dispatch } = this.props;
    const { pagination = {} } = this.tableRef || {};
    dispatch({
      type: 'organization/fetchGetUserByOrg',
      payload: {
        id: data.id,
        data,
        p: page || 1,
        ps: pagination.pageSize || 10,
        ...this.searhFilter,
      },
    });
  };
  inputSearch = (value) => {
    const { curOrg } = this.state;
    this.searhFilter = { nickname: value };
    this.loadUserList(curOrg, '');
  };
  tableChange = (data) => {
    const { curOrg } = this.state;
    this.loadUserList(curOrg, data.current);
  };
  modalHandleOk = () => {
    this.closeModal();
    this.loadUserList(this.state.curOrg);
  };
  addUserToOrg = () => {
    this.setState({ chooseUserModalVisible: true });
  };
  editOrgOk = () => {
    this.loadOrgList();
    this.closeModal();
  };
  loadOrgList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'organization/fetchGetOrgList',
      payload: { parent: 0 },
    });
  };
  // handleGetAreaList = (pId) => {
  //   getAllAreaList({pId: pId||''}).then((res) => {
  //    this.setState({areaList: arrayToTree(res.data,'regionid','parentid')});
  //   })
  // }
  commonSearchRef = {};
  searhFilter = {};
  render() {
    const { listLoading, loading, orgLoading } = this.props;
    const {
      areaList,
      chooseUserModalVisible,
      resourceList,
      roleAuthModalVisible,
      editOrg,
      editOrgModalVisible,
      userList = {},
      organList,
      curOrg = {},
      orgClassList,
    } = this.state;
    // const coverHeader = (<div className="title borderNone">{curOrg.name}</div> ) ;
    const columns = [
      {
        title: '用户',
        dataIndex: 'username',
      },
      {
        title: '姓名',
        dataIndex: 'nickname',
      },
      {
        title: '组织',
        dataIndex: 'organName',
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
          onClick={this.addUserToOrg}
          className="margin-right-10 margin-left-10"
        >
          添加用户到部门
        </CommonButton>
        {/* <CommonAreaTree org={curOrg} loading={loading} /> */}
        {/*  <CommonButton loading={loading} onClick={this.openAuthModal} type="primary" className="margin-right-5">部门授权</CommonButton> */}
      </div>
    );
    const tableProps = {
      ref: (ele) => {
        this.tableRef = ele;
      },
      loading: listLoading,
      noSelect: true,
      /*      showTableHeader:true,
      coverHeader, */
      /*      extralContent, */
      tableClass: 'padding-10',
      data: userList,
      onChange: this.tableChange,
      columns,
      cutHeight: 350,
    };
    // console.log('userList', userList)
    const treeProps = {
      act: true,
      deleteTopAble: true,
      treeData: organList,
      loadCallBack: this.loadCallBack,
      checkable: false,
      parentid: 'parent',
      selectedKeys: [curOrg.id],
      onSelectCallBack: this.onSelectCallBack,
      editCallBack: this.showEditOrgModal,
      handleDeleteNode: this.handleDeleteNode,
    };
    const editModalProps = {
      org: editOrg,
      treeData: organList,
      loadCallBack: this.loadCallBack,
      visible: editOrgModalVisible,
      areaList,
      classlist: orgClassList,
      onCancel: this.closeModal,
      onOk: this.editOrgOk,
    };
    const authModalProps = {
      type: 'Org',
      resourceList,
      curData: (curOrg || {}).id,
      visible: roleAuthModalVisible,
      onCancel: this.closeModal,
      onOK: this.modalHandleOk,
    };
    const chooserUserModalProps = {
      type: 'Org',
      curData: curOrg,
      visible: chooseUserModalVisible,
      title: '添加用户到部门',
      onCancel: this.closeModal,
      onOK: this.modalHandleOk,
    };
    let clientHeight =
      window.innerHeight ||
      window.document.documentElement.clientHeight ||
      window.document.body.clientHeight;
    clientHeight -= 165;
    return (
      <div className={classnames('bgWhite', 'border', style.organization)}>
        <CommonFold>
          <div key="orgLeft" className={classnames(style.orgLeft)}>
            <div className="title border-bottom">
              组织机构
              <Icon
                type="plus"
                style={{
                  color: '#1890ff',
                  marginLeft: 15,
                  cursor: 'pointer',
                }}
                onClick={() => this.showEditOrgModal()}
              />
            </div>
            <Spin spinning={orgLoading}>
              {!orgLoading && (
                <div className="commonTreeBox" style={{ overflow: 'auto', height: clientHeight }}>
                  <CommonTree {...treeProps} />
                </div>
              )}
            </Spin>
          </div>
        </CommonFold>
        <div key="orgRight" className={classnames('border-left', style.orgRight)}>
          <div className="border-bottom" style={{ height: 50 }}>
            <div className="title">{curOrg.name}</div>
          </div>
          <div className="margin-top-10 margin-bottom-10 text-right">{extralContent}</div>
          <StandardTable {...tableProps} />
        </div>
        {editOrgModalVisible && <EditOrgModal {...editModalProps} />}
        {roleAuthModalVisible && <AuthModal {...authModalProps} />}
        {chooseUserModalVisible && <ChooseUserModal {...chooserUserModalProps} />}
      </div>
    );
  }
}
