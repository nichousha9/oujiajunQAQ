/* eslint-disable no-unused-expressions */
import React from 'react';
import { connect } from 'dva';
import { Button,message, Icon } from 'antd';
import classnames from 'classnames';
import StandardTable from '../../../components/StandardTable';
import CommonSearch from '../../../components/CommonSearch';
import styles from './index.less';
import AddUserModal from "./AddUserModal";

@connect(({userAccount,loading}) => (
  {
    userAccount,
    loading:loading.models.userAccount,
  }))
export default class UserAccount extends React.Component{
  state = {
    allUserList:{},
    addUserModalVisible: false,
    user:'',
  }
  componentDidMount(){
    this.loadList();
  }
  componentWillReceiveProps(nextProps){
    const { userAccount: { allUserList }} = nextProps;
    if(JSON.stringify(allUserList) !== JSON.stringify(this.state.allUserList)){
      this.setState({allUserList})
    }
  }

  onOK = () => {
    this.closeModal();
    this.loadList();
  }

  inputSearch = (value) => {
    this.searhFilter = { nickName: value };
    this.loadList('');
  }
  
  loadList = (page,ps,clear) => {
    if(clear){
      this.searhFilter={};
      this.commonSearchRef && this.commonSearchRef.clearSearValue();
    }
    const { dispatch } = this.props;
    const { pagination={} } = this.tableRef || {};
    const that = this;
    dispatch({
      type: 'userAccount/fetchGetAllUserList',
      payload: { p:page || 1, ps:pagination.pageSize || 10,...that.search,...this.searhFilter},
    });
  }
  handleEditUser = (user = '') => {
    this.setState({
      addUserModalVisible: true,
      user,
    });
  }
  handleDeleteUser = (row)=>{
    const { dispatch } = this.props;
    // const { curUser } = this.state;
    dispatch({
      type:'userAccount/fetchDeleteLessUser',
      payload:{
        id:row.id,
        // role:curUser,
      },
     }).then((res) => {
      if(res.status==='OK'){
        message.success('用户删除成功');
        this.loadList('');
      }
    })
  }
  closeModal = () => {
    this.setState({addUserModalVisible: false});
  }
  
  tableChange = (data) => {
    this.loadList(data.current,data.pageSize);
  }
  searhFilter = {}
  render(){
    const { allUserList, addUserModalVisible, user} = this.state;
    const { loading } = this.props;
    const addUserModalProps = {
      visible: addUserModalVisible,
      user,
      onCancel: this.closeModal,
      onOk: this.onOK,
    }
    const extralContent = (
      <div>
        <CommonSearch doSearch={this.inputSearch} />
        <Button className='margin-left-10' type="primary" onClick={() =>{this.handleEditUser()}} >创建新用户</Button>
      </div>
)
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
        width:150,
      },
      {
        title: '手机',
        dataIndex: 'mobile',
      },
      {
        title: '管理员',
        dataIndex: 'superuser',
        render: (data) => {
          return data ? <a><Icon type="check" className="bold" /></a> : '';
        },
      },
      {
        title: '操作',
        dataIndex: 'id',
        render: (data,row) => (
          <span>
            <a onClick={() => { this.handleEditUser(data)}} ><Icon type="edit" className="margin-right-5" />编辑</a>
            <a onClick={() => {this.handleDeleteUser(row)}}><Icon type="delete" className="margin-right-5" />删除</a>
          </span>
      ),
      },
    ];
    return (
      <div className={classnames("padding-left-10 padding-right-10",styles.userAccount,'bgWhite','border','height100')}>
        <StandardTable
          ref={(ele)=>{this.tableRef= ele;}}
          loading={loading}
          noSelect="true"
          extralContent={extralContent}
          showTableHeader="true"
          listName="用户列表"
          columns={columns}
          data={allUserList}
          onChange={this.tableChange}
          cutHeight="250"
        />
        {addUserModalVisible && <AddUserModal {...addUserModalProps} />}
      </div>
    )
  }
}
