import React from 'react';
import classnames from 'classnames';
import { connect } from 'dva';
import styles from './skillList.less';
import SkillAddUserItem from './SkillAddUserItem';
import { getTheFirstChild } from '../../../utils/utils';

@connect(({agentstatusUpdate,loading}) =>({
  agentstatusUpdate,
  userLoading: loading.effects['agentstatusUpdate/fetchGetSkillGroupUser'],
}))
class SkillList extends  React.PureComponent{
  state ={
    selectKey: '',
    selectUsers:[],
  }
  componentDidMount(){
    const { data,onSelect } = this.props;
    const { selectKey } = this.state;
    if(!!data.length && !selectKey){
      const firseChild = getTheFirstChild(data);
      this.setState({selectKey: firseChild.id});
      onSelect && onSelect(firseChild)
    }
  }
  componentWillReceiveProps(nextProps){
    const { data,onSelect } = nextProps
    const { selectKey } = this.state;
    if(!!data.length && !selectKey){
      const firseChild = getTheFirstChild(data);
      this.setState({selectKey: firseChild.id});
      onSelect && onSelect(firseChild);
    }
  }
  handleIds = () =>{
    const { agentstatusUpdate:{ selectedGroupUser=[] } } = this.props;
    return selectedGroupUser.map((user)=>{return user.id})
  }
  handleUpdate =(user,type) => {
    const { dispatch,agentstatusUpdate:{ selectedGroupUser } } = this.props;
    const curIds = this.handleIds();
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
    this.setState({selectUsers: selectedGroupUser});
  }
  skillListSelect =(selectSkill) =>{
    const { addUser, onSelect } = this.props;
    if(!addUser){
      onSelect && onSelect(selectSkill)
      this.setState({selectKey:selectSkill.id});
    }
  }
  handleLoadSkillUser =(payload,callBack)=> {
    const {dispatch} = this.props
    dispatch({
      type: 'agentstatusUpdate/fetchGetSkillGroupUser',
      payload,
    }).then((res)=>{
      if(res) return callBack(res && res.userList);
    })
  }

  handleLi = (list) => {
      const {addUser = false,userLoading = false,agentstatusUpdate:{ selectedGroupUser=[] }} = this.props;
      const {selectKey} = this.state;
      if (!addUser) {
        return (
          <li
            key={list.id}
            onClick={() => {
              this.skillListSelect(list)
            }}
            className={classnames(styles.noAddUserLi, selectKey === list.id ? styles.active : '')}
          >
            {list.name}
          </li>
        )
      }
      if (!!addUser) {
        return (
          <SkillAddUserItem
            selectedGroupUser={selectedGroupUser}
            key={list.id}
            handleUpdate={this.handleUpdate}
            styles={styles}
            loadUser={this.handleLoadSkillUser}
            listItem={list}
            userLoading={userLoading}
          />
        )
    }
  }
  render(){
    const { data=[]} = this.props;
    return (
      <div>
        {data.map((item)=>{
          return (
            <ul className={styles.skillList} key={item.classvalue}>
              <li key={`${item.classvalue}_li`}>{item.classname}</li>
              { item.list && !!item.list.length && (
                <ul className={classnames(styles.skillLi)}>
                  { item.list.map((list) => {
                    return this.handleLi(list)
                  })}
                </ul>
              )}
            </ul>
          )
        })}
      </div>
    )
  }
}

export default SkillList;
