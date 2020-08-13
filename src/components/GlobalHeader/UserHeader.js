import React, { PureComponent } from 'react';
import { Menu, Icon, Spin, Tag, Dropdown, Avatar } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import Debounce from 'lodash-decorators/debounce';
import { connect } from 'dva';
import styles from './index.less';
import { getDefaultUserLogo } from "../../utils/utils";

@connect(({global}) => {
  const { owner ={} } = global;
  return {owner};
})
export default class UserHeader extends PureComponent {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  // getNoticeData() {
  //   const { notices = [] } = this.props;
  //   if (notices.length === 0) {
  //     return {};
  //   }
  //   const newNotices = notices.map(notice => {
  //     const newNotice = { ...notice };
  //     if (newNotice.datetime) {
  //       newNotice.datetime = moment(notice.datetime).fromNow();
  //     }
  //     // transform id to item key
  //     if (newNotice.id) {
  //       newNotice.key = newNotice.id;
  //     }
  //     if (newNotice.extra && newNotice.status) {
  //       const color = {
  //         todo: '',
  //         processing: 'blue',
  //         urgent: 'red',
  //         doing: 'gold',
  //       }[newNotice.status];
  //       newNotice.extra = (
  //         <Tag color={color} style={{ marginRight: 0 }}>
  //           {newNotice.extra}
  //         </Tag>
  //       );
  //     }
  //     return newNotice;
  //   });
  //   return groupBy(newNotices, 'type');
  // }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);

    // console.log(collapsed)
    // console.log(onCollapse)
    this.triggerResizeEvent();
  };
  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  // renderStatusStyle = (status) => {
  //   if(status === 'ready'){
  //     return styles.logo_status_online;
  //   }else if (status === 'notready') {
  //     return styles.logo_status_offline;
  //   }else{
  //     return styles.logo_status_busy;
  //   }
  // }
  render() {
    const { currentUser={}, onMenuClick,collapsed} = this.props;
    // const status = currentUser.status === 'ready' ? 'online' : (currentUser.status === 'notready' ? 'offline':'busy')
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        {/* <Menu.Item key="online">
          <Icon className={styles.memuIcon} style={{fontSize:10, backgroundColor:'#48D500'}}/>在线
          {status==='online' && <i className="iconfont icon-smartSelect floatRight" />}
        </Menu.Item>
        <Menu.Item key="offline">
          <Icon className={styles.memuIcon} style={{fontSize:10, backgroundColor:'#B5BABF'}}/>离线
          {status==='offline' && <i className="iconfont icon-smartSelect floatRight" />}
        </Menu.Item>
        <Menu.Item key="busy">
          <Icon className={styles.memuIcon} style={{fontSize:10, backgroundColor:'#FFC300'}}/>托管
          {status==='busy' && <i className="iconfont icon-smartSelect floatRight" />}
        </Menu.Item> */}
        {/* <Menu.Item key="tenant">
          <Icon type="team" />租户信息
        </Menu.Item> */}
        {/* <Menu.Item key="switch">
          <Icon type="swap" />切换接待
        </Menu.Item> */}
        <Menu.Item key="user">
          <Icon type="user" />个人信息
        </Menu.Item>
        <Menu.Item key="editPassWord">
          <Icon type="eye" />修改密码
        </Menu.Item>
        <Menu.Item key="logout">
          <Icon type="poweroff" />退出登录
        </Menu.Item>
      </Menu>
    );
    return (
      <div>
        {/* {currentUser.username ? ( */}
          <Dropdown overlay={menu}>
            <span className={`${styles.action} ${styles.account}`} style={{display:'inline-flex'}}>
              <div>
                <span style={{position:'relative'}}>
                  {/* <i className={`${this.renderStatusStyle(currentUser.status)} ${styles.userStatus}`}/> */}
                  <Avatar shape="square" size="large" className={styles.avatar} src={currentUser.imageUrl ? currentUser.imageUrl : getDefaultUserLogo() } />
                </span>
                {!collapsed && <span style={{color:'rgba(255, 255, 255, 0.65)',marginLeft:16}}>{currentUser.nickname}</span>}
              </div>
            </span>
          </Dropdown>
        {/* ) : (
          <Spin size="small" style={{ marginLeft: 8 }} />
        )} */}
      </div>
    );
  }
}
