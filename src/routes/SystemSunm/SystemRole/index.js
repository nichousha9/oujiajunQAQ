/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable no-unused-expressions */
import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import { message ,Input,Icon,Popover} from 'antd';
import CommonButton  from '../../../components/CommonButton';
import CommonMenue  from '../../../components/CommonMenue';
import CommonFold  from '../../../components/CommonFold';
import CommonSearch  from '../../../components/CommonSearch';
import StandardTable from '../../../components/StandardTable';
import AuthModal from '../AuthModal/index';
import ChooseUserModal from '../ChooseUserModal';
import { getResMsg } from '../../../utils/codeTransfer';
import style from './index.less';


const coverHeader = (<div className="title borderNone" /> ) ;
@connect(({systemRole,loading,systemSum}) => {
  return {
    systemRole,
    systemSum,
    loading: loading.models.systemRole,
    listLoading:loading.effects['systemRole/fetchGetRoleListByRole'] ||
    loading. effects['systemRole/fetchGetAllRoleList'],
  }
})
 export default class SystemRole extends React.Component{
  state = {
    currRole:'',// 当前选中的角色
    roleList: [], // 角色列表
    userRoleList: [], // 当前角色的用户列表
    resourceList:[], // 权限树的数据
    roleAuthModalVisible: false, // 权限Modal
    userChooseLoading:false,
  }
  componentDidMount(){
    const { dispatch } = this.props;
    dispatch({type:'systemRole/fetchGetAllRoleList'}).then((res) => {
      if(res && res.data){
        const roleList = res.data.list || [];
        this.handleLoadList(roleList[0].id);
      }
    })
  }
  componentWillReceiveProps(nextProps){
    const { systemSum:{resourceList},systemRole: { userRoleList,currRole,roleList }} = nextProps;
    if(JSON.stringify(userRoleList) !== JSON.stringify(this.state.userRoleList) ||
      JSON.stringify(roleList) !== JSON.stringify(this.state.roleList) ||
      JSON.stringify(resourceList) !== JSON.stringify(this.state.resourceList) ||
      currRole !== this.state.currRole){
      this.setState({userRoleList,roleList,currRole,resourceList,userChooseLoading:false});
    }
  }
  handleLoadList= (id,page,clear) => {
    if(clear){
      this.searhFilter={};
      this.commonSearchRef && this.commonSearchRef.clearSearValue();
    }
    const { dispatch } = this.props;
    const { pagination ={} } = this.tableRef || {};
    dispatch({
      type:'systemRole/fetchGetRoleListByRole',
      payload:{
        id,
        p:page || 0,
        ps:pagination.pageSize || 10,
        ...this.searhFilter,
      },
    })
  }
  inputSearch=(value)=>{
    const { currRole } = this.state;
    this.searhFilter = { nickname:value };
    this.handleLoadList(currRole,'');
  }
  handleDeleteMenu = (id) => {
     const { dispatch } = this.props;
     dispatch({
      type:'systemRole/fetchDeleteRole',
      payload:{id},
     }).then((res) => {
      if(res.status==='OK'){
        message.success('删除成功');
      }
     })
  }
  handleSaveMenue = (menu) => {
    const { dispatch } = this.props;
    dispatch({
      type:'systemRole/fetchUpdateRole',
      payload:{
        id:menu.id,
        name:menu.name,
      },
    }).then((res) => {
      if(res.status==='OK'){
        message.success('修改成功');
      }else{
        message.error(getResMsg(res.data));
      }
    });
  }
  handleDeleteUser = (row)=>{
    const { dispatch } = this.props;
    const { currRole } = this.state;
    dispatch({
      type:'systemRole/fetchDeleteRoleUser',
      payload:{
        userId:row.id,
        roleId:currRole,
      },
    }).then((res) => {
      if(res.status==='OK'){
        message.success('用户删除成功');
        this.handleLoadList(currRole);
      }
    })
  }
  menuSelected =(id) =>{
    this.handleLoadList(id,'',true);
  }
  addNewRole = (e) => {
    if(!e.target.value){
      message.error('角色名为空，不能添加');
      return;
    }
    const { dispatch } = this.props;
    dispatch({
      type:'systemRole/fetchUpdateRole',
      payload:{name:e.target.value},
    }).then((res) => {
      if(res.status==='OK'){
        message.success('修改成功');
      }else{
        message.error(getResMsg(res.data));
      }
    })
  }
  closeModal = () =>{
    this.setState({
      roleAuthModalVisible: false,
      chooseUserModalVisible:false,
    });
  }
  openUserChooseModal = () => {
    this.setState({
      chooseUserModalVisible:true,
      userChooseLoading:false,
    });
  }
  modalHandleOk = () => {
    this.closeModal();
    this.setState({
      userChooseLoading:true,
    })
    this.handleLoadList(this.state.currRole);
  }
  openAuthModal = () => {
    this.setState({roleAuthModalVisible: true});
  }
  tableChange = (data) => {
    const { currRole } = this.state;
    this.handleLoadList(currRole,data.current);
  }
  commonSearchRef ={}
  searhFilter = {}
  render(){
    const { chooseUserModalVisible,roleList,currRole, userRoleList,roleAuthModalVisible,resourceList,userChooseLoading} = this.state;
    const { loading,listLoading } = this.props;
    const authModalProps = {
      type:'Role',
      resourceList,
      curData:currRole,
      visible:roleAuthModalVisible,
      onCancel: this.closeModal,
      onOK:this.modalHandleOk,
    }
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
        title:'邮箱',
        dataIndex:'email',
        width:150,
      },
      {
        title:'手机',
        dataIndex:'mobile',
      },
      {
        title:'操作',
        dataIndex:'act',
        render:(data,row)=>(<a onClick={() => {this.handleDeleteUser(row)}}>删除</a>),
      },
    ];
    const extralContent = (
      <div>
        <CommonSearch ref={(ele) => { this.commonSearchRef = ele}} doSearch={this.inputSearch} />
        <CommonButton loading={loading} onClick={this.openUserChooseModal} className="margin-left-10 margin-right-10">添加用户到角色</CommonButton>
        <CommonButton loading={loading} className="margin-right-5"onClick={this.openAuthModal} type="primary">角色授权</CommonButton>
      </div>
    )
    const tableProps = {
      ref:(ele)=>{this.tableRef=ele},
      loading:listLoading,
      noSelect:true,
      showTableHeader:true,
      coverHeader,
      extralContent,
      tableClass:'padding-10',
      onChange:this.tableChange,
      data:userRoleList,
      columns,
      cutHeight: 250,
    }
    const menuProps = {
      menueSelect:this.menuSelected,
      selectedKeys: [currRole],
      menuData:roleList,
      onAct: false,
     handleSaveMenue:this.handleSaveMenue,
      handleDeleteMenu:this.handleDeleteMenu, 
    }
    // const popoverContent = (
    //   <div className="padding-10">
    //     <label>角色：<Input onBlur={(e) => {this.addNewRole(e)}} style={{width:200}} /></label>
    //   </div>
    // )
    const chooserUserModalProps = {
      type:'Role',
      curData:{id:currRole},
      visible:chooseUserModalVisible,
      title:'添加用户到角色',
      onCancel: this.closeModal,
      onOK: this.modalHandleOk,
      confirmLoading: userChooseLoading,
    }
    const clientHeight = window.innerHeight || window.document.documentElement.clientHeight || window.document.body.clientHeight -165;
    return (
      <div className={classnames(style.systemRole,'border','bgWhite')}>
        <CommonFold>
          <div key="roleLeft" className={classnames(style.roleLeft,)}>
            <div className={style.systemRoleHeader}>
              <div className="title border-bottom">角色列表</div>
              {/* <div className={style.addMenueBox}>
                <Popover title="创建新角色" trigger="click" content={popoverContent}>
                  <div className={classnames(style.addMenue)}><Icon type="plus-circle" />新建角色</div>
                </Popover>
              </div> */}
            </div>
            <div className={style.menuList} style={{overflow:'auto',height:clientHeight}}>
              <CommonMenue  {...menuProps} />
            </div>
          </div>
        </CommonFold>
        <div  key="roleRight"  className={classnames(style.roleRight,'border-left')}>
          <StandardTable {...tableProps} />
        </div>
        { roleAuthModalVisible && <AuthModal {...authModalProps} /> }
        { chooseUserModalVisible && <ChooseUserModal {...chooserUserModalProps} /> }
      </div>
    )
  }
}

