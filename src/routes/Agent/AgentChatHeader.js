import React from 'react';
import { Icon,Tooltip  } from 'antd';
import classnames from 'classnames';

const AgentChatHeader =({agentuser,styles,showFoldIcon=false,handleOpenFold,...actions}) => {
  return (
    <div className={styles.headerContent}>
      <span className={styles.vistor}>{ agentuser.groupid ? agentuser.groupname: (agentuser.name || agentuser.username)}</span>
      <span className={styles.agent}>
        <i className="iconfont icon-pc_service icon" />
        { agentuser.groupid ? (agentuser.type === '1'?'公聊区':'内部讨论'): (agentuser.robot?'客服机器人':'PC客服')}
      </span>
      {showFoldIcon && (
        <span onClick={()=>{if(handleOpenFold)handleOpenFold()}} className={classnames(styles.fold,'pointer')}><Icon type="left" /></span>
      )}
      {/* <span><Switch checkedChildren={'忙'} unCheckedChildren={'闲'} onChange={this.SwitchonChange} /></span> */}
      { agentuser.groupid && agentuser.type === '1' && (
        <Tooltip title="成员管理">
          <span
            onClick={(agentuser.name || agentuser.username)?actions.showGroupMebModal : ''}
            className={classnames(styles.link,(agentuser.name || agentuser.username)? '':styles.notLink)}
          >
            <i className="iconfont icon-groupMember icon" />
          </span>
        </Tooltip>
      )}
      { agentuser.groupid && agentuser.type !== '1' && (
        <React.Fragment>
          <Tooltip title="退出会话">
            <span style={{paddingLeft:16}} className={styles.linkRed}>
              <i onClick={()=>{ actions.handleEndService(agentuser) }} className="iconfont icon-poweroff icon" />
            </span>
          </Tooltip>
          <Tooltip title="成员管理">
            <span
              onClick={(agentuser.name || agentuser.username)?actions.showGroupMebModal : ''}
              className={classnames(styles.link,(agentuser.name || agentuser.username)? '':styles.notLink)}
            >
              <i className="iconfont icon-groupMember icon" />
            </span>
          </Tooltip>
        </React.Fragment>
      )}
      {agentuser.status === 'inservice' && (
        <Tooltip title="退出会话">
          <span style={{paddingLeft: 16}} className={styles.linkRed}><Icon onClick={()=>{ actions.handleEndService(agentuser) }} type="poweroff" /></span>
        </Tooltip>
      )}
      {agentuser.status === 'inservice' && !agentuser.robot && (
        <Tooltip title="转接">
          <span
            onClick={()=>{actions.showGroupModal('transfer')}}
            className={classnames(styles.link,(agentuser.name || agentuser.username)? '':styles.notLink)}
          >
            <i className="iconfont icon-through_connection icon" />
          </span>
        </Tooltip>
      )}
    </div>
  )
}

export default AgentChatHeader;
