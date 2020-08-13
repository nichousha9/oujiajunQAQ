import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import NoContent from '../../components/NoContent';
import styles from './Agent.less';

const workorderStates = {
  'pending': '待处理',
  'processing': '处理中',
  'processed': '已处理',
  'closed': '已关闭',
}

@connect(({agentUserInfo})=>({agentUserInfo}))
export default class AgentWorkOrderList extends React.PureComponent{
  componentDidMount(){
   const { agentuser={} } = this.props;
    this.loadWorderList(agentuser)
  }
  componentWillReceiveProps(nextProps){
    const { agentuser }  = nextProps;
    const oldAgentUser = this.props.agentuser || {};
    if(agentuser.userid!==oldAgentUser.userid){
      // 请求接口获取新的工单列表
      this.loadWorderList(agentuser);
    }
  }
  // 请求接口获取新的工单列表
  loadWorderList =(agentuser)=>{
    const { dispatch } = this.props;
    dispatch({
      type:'agentUserInfo/fetchGetWorkOrderList',
      payload:{userid: agentuser.userid},
    })
  }
  render(){
    const { agentUserInfo:{ wordOrderList=[] } } = this.props;
    return (
      <div className={styles.tabRightContent}>
        <NoContent text="暂无工单" data={wordOrderList}>
          {
            wordOrderList.map(item=>(
              <div key={item.id} className={styles.workorderItem}>
                <div className={styles.title}>{item.title || '_'}</div>
                <div className={styles.summary}>
                  <div className={styles.state}>
                    <i className={`${styles.workOrderIcon} ${item.state==='pending'?styles.yellow:styles.gray}`} />
                    {workorderStates[item.state]}
                  </div>
                  <div className={styles.time}>{moment(item.createtime).format('MM-DD HH:mm')}</div>
                </div>
              </div>
            ))
          }
        </NoContent>
      </div>
    )
  }
}
