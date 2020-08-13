import React from 'react';
import { Icon,Spin } from 'antd';
import classnames from 'classnames';


class SkillAddUserItem extends React.Component{
  constructor(props){
    super(props)
    const { selectedGroupUser=[] } = props;
    this.state = {
      isHasUser: false,
      isMore:false, // 当前是否有更多的用户
      userData:[],
      selectedUser:selectedGroupUser.map((user)=>{return user.id}),
      selectedUserObj:selectedGroupUser,
      page:0,
    }
  }
  componentWillReceiveProps(nextProps){
    const {selectedGroupUser=[] } = nextProps;
    const { selectedUser } = this.state;
    const nextIdArr = selectedGroupUser.map((user)=>{return user.id});
    if(JSON.stringify(nextIdArr)!==JSON.stringify(selectedUser)){
      this.setState({
        selectedUserObj:selectedUser,
        selectedUser:nextIdArr,
      })
    }
  }
  handleLoadUser =() =>{
    const { page } = this.state;
    const { listItem,loadUser } = this.props;
    loadUser({id: listItem.id,p:page+1,ps:50},this.handleSaveUser);
  }
  handleLoadUserFirst = () =>{
    const { isHasUser,userData } = this.state;
    // 第一次通过点击事件获取的是第一页，而且有的话不用多次请求接口
    if(!isHasUser&&!userData.length){
      this.handleLoadUser();
       return;
    }
    this.setState({isHasUser: !isHasUser});
  }
  // 每次的用户都加在上一次的下面
  handleSaveUser =(userList={}) =>{
    let isMore = false;
    if( (userList.pageNum +1) * (userList.pageSize) < userList.total ){
      isMore = true;
    }
    const { list=[] } = userList;
    const { userData } = this.state;
    this.setState({userData: [...userData,...list],isHasUser:true,isMore,page:userList.number +1});
  }
  // 全选用户
  handelChooseAll = (e)=>{
    e.stopPropagation();
    const {userData=[],selectedUser=[]} = this.state;
    const {handleUpdate} = this.props;
    if(userData.length > selectedUser.length){
      this.setState({
        selectedUser:userData.map((item)=>{return item.id}),
        selectedUserObj:userData,
      });
      userData.forEach((item) => {
        handleUpdate && handleUpdate(item,'add')
      })
    } else {
      this.setState({
        selectedUser:[],
        selectedUserObj:[],
      })
      userData.forEach((item) => {
        handleUpdate && handleUpdate(item,'odd')
      })
    }

  }
  // 选择或取消用户
  handleChooseUser =(user)=>{
    const { selectedUser,selectedUserObj } = this.state;
    const { handleUpdate } = this.props;
    const userIndex = selectedUser.indexOf(user.id);
    if(userIndex<0){
      selectedUser.push(user.id);
      selectedUserObj.push(user);
      handleUpdate && handleUpdate(user,'add')
    }
    if(userIndex>=0){
      selectedUser.splice(userIndex,1);
      selectedUserObj.splice(userIndex,1);
      handleUpdate && handleUpdate(user,'odd')
    }

    this.setState({selectedUser,selectedUserObj})
  }
  render() {
    const { listItem,styles,userLoading } = this.props;
    const { isHasUser=false,userData=[],selectedUser=[],isMore } = this.state;

    return (
      <React.Fragment>
        {!isHasUser&&<li key={listItem.id} onClick={this.handleLoadUserFirst}>{listItem.name}</li>}
        {!!isHasUser&&(
          <div>
            { !userData.length && (
              <React.Fragment>
                <li key={listItem.id} style={{paddingLeft:12}}onClick={this.handleLoadUserFirst}>{listItem.name}</li>
                <div className="text-center padding-15 fontColor3">该组织下暂无数据</div>
              </React.Fragment>
                )}
            {userData && !!userData.length && (
              <React.Fragment>
                <li key={listItem.id} onClick={this.handleLoadUserFirst}>
                  <Icon type="caret-down" className="margin-right-10 font12" />
                  {listItem.name}
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
        )}
      </React.Fragment>
    )
  }
}

export default SkillAddUserItem;
