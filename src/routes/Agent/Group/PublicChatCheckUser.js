import React from 'react';
import { Icon ,Spin} from 'antd';
import { connect } from 'dva';
import classnames from 'classnames';
import CommonTreeSelect from '../../../components/CommonTreeSelect';
import styles from './skillList.less';
import SearchAutoComplete from '../../../components/SearchAutoComplete';
import { userChooseListRole } from '../../../services/systemSum';


@connect(({agentstatusUpdate,loading}) => ({
  agentstatusUpdate,
  userLoading: loading.effects['agentstatusUpdate/fetchGetSkillGroupUser'],
}))

export default class PublicChatCheckUser extends React.PureComponent{
  state ={
    curOrg:{},
    isMore: false,
    page:1,
    userData: [],
  }
  componentDidMount(){
    this.loadPage();
  }

  getSelectedUser = () =>{
    const { agentstatusUpdate:{ selectedGroupUser=[] } } = this.props;
    const selectedUser = selectedGroupUser.map((item)=>(item.id));
    return {
      selectedUser,
      selectedUserObj:selectedGroupUser,
    }
  }

  handleLoadUser =()=>{
    const { curOrg,page } = this.state;
    this.loadUserList(curOrg,page)
  }

  loadUserList =(listItem,p) =>{
    const { dispatch } = this.props;
    const { userData=[] } = this.state;
    const page = p || this.state.page || 1;
    dispatch({
      type:'agentstatusUpdate/fetchGetSkillGroupUser',
      payload: {id: listItem.id,p:page,ps:10},
    }).then((res) =>{
      const { userList:{ list =[],total=0}} = res;
      let newUserData = [];
      if(page === 1){
        newUserData = list;
      }else{
        newUserData = [...userData,...list]
      }
      this.setState({ page: page+1,userData: newUserData, isMore: total > newUserData.length});
    })
  }
  loadPage =() =>{
    const {agentstatusUpdate:{ organList=[] },dispatch} =  this.props;
    if(organList.length){
      this.loadUserList(organList[0]);
      this.setState({ curOrg: organList[0]})
    }else{
      dispatch({
        type:'agentstatusUpdate/fetchGetAllOrgan',
        payload:{parent:0},
      }).then((res) =>{
        if(!res || res.status!=='OK') return;
        const organList = (res.data || {}).organList
        if(res) this.loadUserList(organList);
        this.setState({ curOrg: organList});
      })
    }
  }
  // 切换组织架构
  changeOrg = (value,label) =>{
    this.setState({curOrg:{id: value,name: label}});
    this.loadUserList({id: value,name: label},1)
  }
  // 更新选中的用户
  handleUpdate =(user,type,curIds=[]) => {
    const { dispatch,agentstatusUpdate:{ selectedGroupUser } } = this.props;
    if(type==='add' &&  curIds.indexOf(user.id) < 0){
      selectedGroupUser.push(user);
    }
    if(type==='odd'  &&  curIds.indexOf(user.id) >= 0 ){
      selectedGroupUser.splice(curIds.indexOf(user.id),1);
    }
    dispatch({
      type:'agentstatusUpdate/saveSelectGroupUser',
      payload:{selectedGroupUser},
    })
  }
  handleUpdateSelectedUser =(selectItem) =>{
    const { dispatch,agentstatusUpdate:{ selectedGroupUser } } = this.props;
    dispatch({
      type:'agentstatusUpdate/saveSelectGroupUser',
      payload:{selectedGroupUser:[...selectedGroupUser,...selectItem]},
    })
  }

  // 选择或取消用户
  handleChooseUser =(user)=>{
    const { selectedUser=[],selectedUserObj=[] } = this.getSelectedUser();
    const userIndex = selectedUser.indexOf(user.id);
    if(userIndex<0){
      selectedUser.push(user.id);
      selectedUserObj.push(user);
      this.handleUpdate(user,'add',selectedUser)
    }
    if(userIndex>=0){
      selectedUser.splice(userIndex,1);
      selectedUserObj.splice(userIndex,1);
      this.handleUpdate(user,'odd',selectedUser)
    }
  }
  // 全选用户
  handelChooseAll = (e)=>{
    e.stopPropagation();
    const {userData=[],selectedUser=[]} = this.state;
    if(userData.length > selectedUser.length){
      userData.forEach((item) => {
        this.handleUpdate(item,'add')
      })
    } else {
      userData.forEach((item) => {
        this.handleUpdate(item,'odd')
      })
    }
  }
  render (){
    const { agentstatusUpdate:{ organList=[] },userLoading} = this.props;
    const { curOrg={},userData=[],isMore= false} = this.state;
    const { selectedUser }= this.getSelectedUser();
    const skillGroupProps = {
      pages:true,
      searchName:'nickname',
      searchFn: userChooseListRole,
      selected:this.handleUpdateSelectedUser,
    }
    return (
      <div className={classnames(styles.skillList,'scrollY')}>
        <div className="margin-top-10 margin-bottom-10">
          <SearchAutoComplete style={{width:'100%'}}{...skillGroupProps} />
        </div>
        <div className="margin-top-10 margin-bottom-10">
          <CommonTreeSelect
            value={curOrg.id}
            treeCheckStrictly
            onChange={this.changeOrg}
            dropdownStyle={{
              width: 400,
              maxHeight:400,
            }}
            style={{ width: '100%' }}
            treeDefaultExpandAll
            treeData={organList}
            nofilter
            type={{ value:"id", name:"name"}}
            placeholder="上级结构"
          />
        </div>
        <div className="flex-auto">
          { !userData.length && (
            <React.Fragment>
              <li key={curOrg.id} style={{paddingLeft:12}}>{curOrg.name}</li>
              <div className="text-center padding-15 fontColor3">该组织下暂无数据</div>
            </React.Fragment>
          )}
          {!!userData.length && (
            <React.Fragment>
              <li key={curOrg.id} onClick={this.handleLoadUserFirst}>
                <Icon type="caret-down" className="margin-right-10 font12" />
                {curOrg.name}
                <span className="floatRight margin-right-10 pointer" onClick={this.handelChooseAll}>
                  {userData.length > selectedUser.length ? '全选': '取消'}
                </span>
              </li>
              <div>
                {userData.map((user) => {
                  return (
                    <div onClick={()=>{this.handleChooseUser(user)}}  className={classnames(styles.killUser,styles.choosed)} key={user.id}>
                      {user.nickname}
                      <span className={classnames("floatRight",styles.userIcon,'pointer')}>
                        {selectedUser.indexOf(user.id)>-1 && <Icon type="check-circle" />}
                      </span>
                    </div>
                  )
                })}
                {isMore && (
                  <div className="text-center padding-15">
                    {!userLoading && <a onClick={this.handleLoadUser}><Icon type="down-circle-o" className="margin-right-10" />更多</a>}
                    {!!userLoading && <Spin spinning={userLoading} />}
                  </div>
                )}
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    )
  }
}
