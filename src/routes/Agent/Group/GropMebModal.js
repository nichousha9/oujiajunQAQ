import React from 'react';
import { Modal } from 'antd';
import { connect } from 'dva';
import SkillList from './SkillList';
import SelectedGoupUser from './SelectedGoupUser';
import SearchAutoComplete from '../../../components/SearchAutoComplete';
import styles from './skillList.less';
import {getClientHeight} from "../../../utils/utils";
import {getSkillGroupUserByKeyWord} from "../../../services/chatSetting";
import PublicChatCheckUser from './PublicChatCheckUser';


@connect(({agentstatusUpdate}) =>({agentstatusUpdate}))
class GropMebModal extends React.PureComponent{
  componentDidMount(){
    const { curGroup={},agentstatusUpdate:{ groupSkillList=[] }, dispatch} = this.props;
    dispatch({
      type:'agentstatusUpdate/fetchGetGroupMember',
      payload:{ groupid: curGroup.groupid},
    });
    if(!!groupSkillList.length) return;
    dispatch({type:'agentstatusUpdate/fetchGetGroupSkillList'})
  }
  componentWillUnmount(){
    const { dispatch } = this.props;
    dispatch({type:'agentstatusUpdate/clearState'})
  }
  handleUpdateSelectedUser =(selectItem) =>{
    const { dispatch,agentstatusUpdate:{ selectedGroupUser } } = this.props;
    dispatch({
      type:'agentstatusUpdate/saveSelectGroupUser',
      payload:{selectedGroupUser:[...selectedGroupUser,...selectItem]},
    })
  }
  render(){
    const { curGroup={},okCallBack,visible,onCancel,agentstatusUpdate:{ groupSkillList} } = this.props;
    const skillGroupProps = {
      selected: this.handleUpdateSelectedUser,
      searchFn: getSkillGroupUserByKeyWord,
    }
    return (
      <Modal
        className="commonModal"
        maskClosable={false}
        bodyStyle={{padding:0}}
        style={{top:50}}
        width="850px"
        title="成员管理"
        visible={visible}
        footer={[]}
        onCancel={onCancel}
      >
        <div className="flexBox padding-left-20 padding-right-20" style={{position:'relative'}}>
          <div style={{width:230,height:getClientHeight()-230}} className="scrollY">
            { curGroup.type!=='1' && (
              <React.Fragment>
                <SearchAutoComplete {...skillGroupProps} />
                <div className="flex-auto">
                  <SkillList  data={groupSkillList} addUser={true} />
                </div>
              </React.Fragment>
            )}
            { curGroup.type ==='1' && (
              <PublicChatCheckUser />
            )}
          </div>
          <div className="flex1 border-left margin-left-10">
            <SelectedGoupUser onOK={okCallBack} onCancel={onCancel} curGroup={curGroup} styles={styles} />
          </div>
        </div>
      </Modal>
    )
  }
}
export default GropMebModal;
