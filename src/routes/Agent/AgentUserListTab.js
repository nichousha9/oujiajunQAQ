/* eslint-disable no-script-url */
/* eslint-disable no-unused-expressions */
import React from 'react';
import { Tabs, Collapse, Badge } from 'antd';
import classnames from 'classnames';
import { agentusers } from '../../services/api';
import { getTimePass } from '../../utils/utils';
import styles from './Agent.less';

const { TabPane } = Tabs;

export default class AgentUserListTab extends React.PureComponent {
  state = {
    panelStatus: 1,
    minePanelStatus: 1,
    inserviceList: [], // 我接待的在线用户
    endList: [], // 我接待的历史用户
    inserviceRobotList: [], // 机器人接待在线人数
    endRobotList: [], // 机器人接待历史用户数
  };
  componentDidMount() {
    this.handleAgentUsers();
  }

  // 切换
  onCollapseChange = (key) => {
    let newKey = key;
    const { panelStatus } = this.state;
    if (!key) {
      newKey = panelStatus === 1 ? 2 : 1;
    }
    this.setState({
      panelStatus: newKey,
    });
  };
  // 切换
  onMineCollapseChange = (key) => {
    let newKey = key;
    const { minePanelStatus } = this.state;
    if (!key) {
      newKey = minePanelStatus === 1 ? 2 : 1;
    }
    this.setState({
      minePanelStatus: newKey,
    });
  };
  // 获取对话列表
  handleAgentUsers = () => {
    // refresh 仅刷新列表
    Promise.all([
      agentusers({ status: 'inservice', robot: false }), // 人工接待的
      agentusers({ status: 'end', robot: false }), // 人工接待的历史，
      agentusers({ status: 'inservice', robot: true }), // 当前接待的机器人的
      agentusers({ status: 'end', robot: true }), // 机器人接待的历史
    ]).then((res) => {
      let endRobotList = [];
      let inserviceRobotList = [];
      let endList = [];
      let inserviceList = [];
      const [inservice, end, inserviceAi, endAi] = res;
      if (endAi && endAi.status === 'OK') {
        endRobotList = endAi.data.agentList;
      }
      if (inserviceAi && inserviceAi.status === 'OK') {
        inserviceRobotList = inserviceAi.data.agentList;
      }
      if (end && end.status === 'OK') {
        endList = end.data.agentList;
      }
      if (inservice && inservice.status === 'OK') {
        const list = [...inservice.data.agentList, ...inservice.data.groupList];
        inserviceList = [...list];
        const { onSelectAgentUser, agentUser } = this.props;
        const key = agentUser.groupid ? 'groupid' : 'userid';
        if (!onSelectAgentUser) return;
        if (list.length) {
          const userid = agentUser[key];
          if (!userid) {
            onSelectAgentUser(list[0]);
          } else {
            const currUser = list.filter((user) => {
              return user[key] === agentUser[key];
            });
            currUser.length && onSelectAgentUser(list[0]);
          }
        } else {
          // 清空当前的agentUser 和当前聊天框里面的聊天记录
          onSelectAgentUser();
        }
      }
      this.setState({
        endRobotList,
        inserviceRobotList,
        endList,
        inserviceList: [...inserviceList],
      });
    });
  };
  handleAgentUsersByType = (type) => {
    if (type === 'inserviceUser') {
      agentusers({ status: 'inservice', robot: false }).then((response) => {
        if (!response || response.status !== 'OK') return;
        const { onSelectAgentUser } = this.props;
        const list = [...response.data.agentList, ...response.data.groupList];
        this.setState({
          inserviceList: list, // 会话中列表
        });
        onSelectAgentUser(list.length ? list[0] : '');
      });
    }
  };
  // 返回agentUser
  sessionItem = ({ title, time, curAgent, inservice }) => {
    const { agentUser, onSelectAgentUser, hasNewMessageAgent = [] } = this.props;
    const key = curAgent.groupid ? 'groupid' : 'userid';
    const agentKey = agentUser.groupid ? 'groupid' : 'userid';
    const hasNew = inservice && hasNewMessageAgent.indexOf(curAgent[key]) > -1;
    const content = (
      <React.Fragment>
        <span className={classnames(styles.title, 'font14', 'bold')}>
          {curAgent.groupid ? curAgent.groupname : title}
        </span>
        <span className={styles.subtitle}>
          {curAgent.groupid
            ? curAgent.type === '1'
              ? '公聊区'
              : '内部讨论'
            : curAgent.robot
            ? '客服机器人'
            : 'PC客服'}
        </span>
        <span className={styles.time}>{time || curAgent.updatedate}</span>
      </React.Fragment>
    );
    return (
      <div
        key={curAgent[key]}
        onClick={() => {
          onSelectAgentUser(curAgent);
        }}
        className={`${styles.sessionItem} ${
          agentUser[agentKey] === curAgent[key] ? styles.active : ''
        }`}
      >
        {!!hasNew && (
          <React.Fragment>
            <Badge className="customBadge" dot>
              {content}
            </Badge>
          </React.Fragment>
        )}
        {!hasNew && <React.Fragment>{content}</React.Fragment>}
      </div>
    );
  };
  render() {
    const { clientHeight, goToHistory } = this.props;
    const {
      inserviceList,
      panelStatus,
      minePanelStatus,
      endList,
      inserviceRobotList,
      endRobotList,
    } = this.state;
    const height = (document.getElementsByClassName('agentContent')[0] || {}).offsetHeight;
    return (
      <div className={classnames(styles.card, styles.tabLeft, 'tabAgentLeft')}>
        <Tabs>
          <TabPane tab="我的接待" key="mine">
            <div className={classnames(styles.tabLeftContent, 'leftCollapse')}>
              <Collapse accordion activeKey={[`${panelStatus}`]} onChange={this.onCollapseChange}>
                <Collapse.Panel
                  forceRender
                  header={`会话中(${inserviceList.length})`}
                  key="1"
                  className={classnames(styles.panel)}
                >
                  <div style={{ margin: '-1', overflowY: 'auto', height: clientHeight - 191 }}>
                    {inserviceList.map((elem, index) => {
                      return this.sessionItem({
                        title: elem.skillname || elem.name || elem.username || '',
                        time: (
                          <Badge
                            status={elem.tokenum ? 'success' : 'success'}
                            text={getTimePass(elem.servicetime || elem.updatedate)}
                          />
                        ),
                        curAgent: elem,
                        index,
                        inservice: true,
                      });
                    })}
                  </div>
                </Collapse.Panel>
                <Collapse.Panel
                  forceRender
                  header={`历史会话(${endList.length})`}
                  key="2"
                  style={{
                    top:
                      this.state.panelStatus !== 2 ? (height - 42 > 100 ? height - 42 : 100) : 100,
                  }}
                  className={classnames(
                    styles.panel,
                    this.state.panelStatus !== 2 ? styles.paneltranslate : styles.topPanel
                  )}
                >
                  <div style={{ margin: '-15x', overflowY: 'auto', height: clientHeight - 191 }}>
                    {endList.map((elem, index) => {
                      return this.sessionItem({
                        title: elem.skillname || elem.name || elem.username || '',
                        time: (
                          <Badge
                            status={elem.tokenum ? 'success' : 'success'}
                            text={getTimePass(elem.servicetime || elem.updatedate)}
                          />
                        ),
                        curAgent: elem,
                        index,
                      });
                    })}

                    <div style={{ textAlign: 'center', paddingTop: '15px', paddingBottom: '30px' }}>
                      <a onClick={goToHistory} href="javascript:;">
                        更多
                      </a>
                    </div>
                  </div>
                </Collapse.Panel>
              </Collapse>
            </div>
          </TabPane>
          <TabPane tab="机器接待" key="ai">
            <div className={classnames(styles.tabLeftContent, 'leftCollapse')}>
              <Collapse
                accordion
                activeKey={[`${minePanelStatus}`]}
                onChange={this.onMineCollapseChange}
                showArrow={false}
              >
                <Collapse.Panel
                  showArrow={false}
                  header={`会话中(${inserviceRobotList.length})`}
                  key="1"
                  className={classnames(styles.panel)}
                >
                  <div style={{ margin: '-1px', overflowY: 'auto', height: clientHeight - 191 }}>
                    {inserviceRobotList.map((elem, index) => {
                      return this.sessionItem({
                        title: elem.skillname || elem.name || elem.username || '',
                        time: (
                          <Badge
                            status={elem.tokenum ? 'success' : 'success'}
                            text={getTimePass(elem.servicetime || elem.updatedate)}
                          />
                        ),
                        curAgent: elem,
                        index,
                      });
                    })}
                  </div>
                </Collapse.Panel>
                <Collapse.Panel
                  showArrow={false}
                  header={`历史会话(${endRobotList.length})`}
                  key="2"
                  style={{
                    top:
                      this.state.minePanelStatus !== 2
                        ? height - 60 > 100
                          ? height - 42
                          : 100
                        : 100,
                  }}
                  className={classnames(
                    styles.panel,
                    this.state.minePanelStatus !== 2 ? styles.paneltranslate : styles.topPanel
                  )}
                >
                  <div style={{ margin: '-15x', overflowY: 'auto', height: clientHeight - 191 }}>
                    {endRobotList.map((elem, index) => {
                      return this.sessionItem({
                        title: elem.skillname || elem.name || elem.username || '',
                        time: (
                          <Badge
                            status={elem.tokenum ? 'success' : 'success'}
                            text={getTimePass(elem.servicetime || elem.updatedate)}
                          />
                        ),
                        curAgent: elem,
                        index,
                      });
                    })}

                    <div style={{ textAlign: 'center', paddingTop: '15px', paddingBottom: '30px' }}>
                      <a onClick={goToHistory} href="javascript:;">
                        更多
                      </a>
                    </div>
                  </div>
                </Collapse.Panel>
              </Collapse>
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
