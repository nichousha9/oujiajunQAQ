import React from 'react';
import { Modal,Radio,Icon } from 'antd';
import { connect } from 'dva';
import classnames from 'classnames';
import SelectedGoupUser from './SelectedGoupUser';
import SkillList from './SkillList';
import AddToGroup from './AddToGroup';
import SearchAutoComplete from '../../../components/SearchAutoComplete';
import styles from './skillList.less';
import { getSkillGroupUserByKeyWord,getOnlineUserByKeyWord } from '../../../services/chatSetting';
import { getClientHeight } from '../../../utils/utils';
import Transfer from "./Transfer";


const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

@connect(({agentstatusUpdate}) =>({agentstatusUpdate}))
class GroupModal extends React.PureComponent{
  constructor(props){
    super(props)
    this.state = {
      groupType: props.isTransfer ? 'addNewGroup' : 'usedGroup',
      tabType:props.isTransfer ? 'transfer' : 'discuss',
      selectedSkill:'',
    }
  }
  componentDidMount(){
    const { agentstatusUpdate:{ groupSkillList=[] }, dispatch} = this.props;
    dispatch({type:'agentstatusUpdate/fetchGetUserGroups'})
    if(!!groupSkillList.length) return;
    dispatch({type:'agentstatusUpdate/fetchGetGroupSkillList'})
  }
  componentWillUnmount(){
    const { dispatch } = this.props;
    dispatch({type:'agentstatusUpdate/clearState'})
  }
  handleChangeGroup =(key) =>{
    const { groupType } = this.state;
    if(groupType !== key){
      this.setState({groupType: key});
    }
 }
  tabChange = (e) =>{
    const tabType = e.target.value;
    this.setState({
      tabType,
      groupType: tabType !=='discuss' ? 'addNewGroup' :'usedGroup',
    })
  }
  handleUpdateSelectedUser =(selectItem) =>{
    const { dispatch,agentstatusUpdate:{ selectedGroupUser } } = this.props;
    dispatch({
      type:'agentstatusUpdate/saveSelectGroupUser',
      payload:{selectedGroupUser:[...selectedGroupUser,...selectItem]},
    })
  }
  handleChangeSelectSkill =(selectSkill) =>{
    this.setState({selectedSkill:selectSkill});
  }
  handleUpdateTransferUser = () =>{

  }
  renderSearchItem =(searchName,item,option) =>{
    const curTest = new RegExp(searchName, 'g');
    const newName = item.nickname.replace(curTest, `<span class=searchName>${searchName}</span>`);
    const organObj = item.organObj || {}
    return (
      <option  key={item.id} value={item.id} label={item.nickname}>
        <div dangerouslySetInnerHTML={{__html: newName}} />
        <div className="font12" style={{color:'rgba(0,21,41,0.45)'}}>
          {`来自分组: ${organObj.class_name ? `${organObj.class_name}-${organObj.name}`: `${organObj.name}`}`}
        </div>
      </option >
    )
  }
  render(){
    const { groupType,tabType,selectedSkill} = this.state;
    const { handleOk,agentUser,selectedMessage=[],isTransfer,visible,onCancel,agentstatusUpdate:{ groupSkillList},transferContent={} } = this.props;
    const modalTitle = (
      <div className="contentCenter">
        <RadioGroup onChange={this.tabChange} defaultValue={tabType}>
          <RadioButton value="discuss">讨论</RadioButton>
          <RadioButton value="transfer" disabled={!isTransfer}>转接</RadioButton>
        </RadioGroup>
      </div>
    )
    const skillGroupProps = {
      selected: this.handleUpdateSelectedUser,
      searchFn: getSkillGroupUserByKeyWord,
    }
    const transferProps = {
      selected: this.handleUpdateTransferUser,
      searchFn: getOnlineUserByKeyWord,
      searchName:'name',
    }
    return (
      <Modal
        bodyStyle={{padding:0}}
        className="commonModal"
        width="850px"
        style={{top:50}}
        maskClosable={false}
        title={modalTitle}
        visible={visible}
        onCancel={onCancel}
        footer={[]}
      >
        <div className="flexBox padding-left-20 padding-right-20" style={{position:'relative'}}>
          <div style={{width:230,height:getClientHeight()-230}} className="padding-top-10 scrollY">
            {tabType!=='transfer' && (
              <React.Fragment>
                <div
                  key="usedGroup"
                  onClick={() => {this.handleChangeGroup('usedGroup')}}
                  className={classnames(groupType==='usedGroup' ? styles.activeGroupType :styles.groupType)}
                >
                  <i className="iconfont icon-groupMember icon margin-right-10" />
                  在用讨论组
                </div>
                {!isTransfer && (
                  <div
                    key="addNewGroup"
                    onClick={()=>{this.handleChangeGroup('addNewGroup')}}
                    className={classnames(groupType==='addNewGroup' ? styles.activeGroupType :styles.groupType)}
                  >
                    <Icon type="plus" className="margin-right-10" />
                    新建讨论组
                  </div>
                )}
              </React.Fragment>
            )}
            {groupType==='addNewGroup'&&  (
              <React.Fragment>
                {tabType!=='transfer' && <SearchAutoComplete {...skillGroupProps} />}
                {tabType==='transfer' && <SearchAutoComplete {...transferProps} />}
                <div className="flex-auto">
                  <SkillList onSelect={this.handleChangeSelectSkill} data={groupSkillList} addUser={tabType!=='transfer'} />
                </div>
              </React.Fragment>
            ) }
          </div>
          <div className="flex1 border-left padding-top-10">
            {tabType==='transfer' && <Transfer selectedSkill={selectedSkill} transferProps={transferContent} onCancel={onCancel} styles={styles} />}
            {tabType!=='transfer'&& groupType==='usedGroup' && <AddToGroup handleOk={handleOk} agentUserId={agentUser.userid}isTransfer={isTransfer} selectedMessage={selectedMessage} onCancel={onCancel} styles={styles} />}
            {tabType!=='transfer'&& groupType==='addNewGroup' && <SelectedGoupUser handleOk={handleOk} agentUser={agentUser} selectedMessage={selectedMessage} onCancel={onCancel}  styles={styles} />}
          </div>
        </div>
      </Modal>
    )
  }
}
export default GroupModal;
