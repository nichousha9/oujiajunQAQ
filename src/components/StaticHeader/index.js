import React, { PureComponent } from 'react';
import { Menu, Icon, Spin, Tag, Dropdown, Avatar } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import { getCurrentOwer } from "../../utils/userInfo";
import { getDefaultUserLogo } from "../../utils/utils";

@connect(({global}) => {
  const { owner ={} } = global;
  return {owner};
})
export default class StaticHeader extends PureComponent {

  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  componentDidMount() {
    this.toggle();
  }
  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      // transform id to item key
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }
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
  renderStatusStyle = (status) => {
      if(status === 'ready'){
          return styles.logo_status_online;
      }else if (status === 'notready') {
          return styles.logo_status_offline;
      }else{
          return styles.logo_status_busy;
      }
  }
  render() {
    const {
      currentUser,
      collapsed,
      fetchingNotices,
      isMobile,
      logo,
      onNoticeVisibleChange,
      onMenuClick,
      onNoticeClear,
      owner,
    } = this.props;
   /* const ower = getCurrentOwer() || {};*/
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="online">
          <Icon className={styles.memuIcon} style={{fontSize:12, backgroundColor:'#48D500'}}/>在线
        </Menu.Item>
        <Menu.Item key="offline">
          <Icon className={styles.memuIcon} style={{fontSize:12, backgroundColor:'#B5BABF'}}/>离线
        </Menu.Item>
        <Menu.Item key="busy" disabled={true}>
          <Icon className={styles.memuIcon} style={{fontSize:12, backgroundColor:'#FFC300'}}/>托管
        </Menu.Item>
        <Menu.Item key="user">
          <Icon type="user" />个人信息
        </Menu.Item>
        <Menu.Item key="logout">
          <Icon type="poweroff" />退出登录
        </Menu.Item>
      </Menu>
    );
    const noticeData = this.getNoticeData();
    return (
      <div className={styles.header}>
        <div className={styles.triggerHeader}>
            <img src={logo} alt="logo" width="32" />
            <span>U蜜</span>
        </div>
        <div className={styles.right}>
          {/* <HeaderSearch
            className={`${styles.action} ${styles.search}`}
            placeholder="站内搜索"
            dataSource={['搜索提示一', '搜索提示二', '搜索提示三']}
            onSearch={value => {
              console.log('input', value); // eslint-disable-line
            }}
            onPressEnter={value => {
              console.log('enter', value); // eslint-disable-line
            }}
          /> */}
          {/* <Tooltip title="使用文档">
            <a
              target="_blank"
              href="http://pro.ant.design/docs/getting-started"
              rel="noopener noreferrer"
              className={styles.action}
            >
              <Icon type="question-circle-o" />
            </a>
          </Tooltip>
          <NoticeIcon
            className={styles.action}
            count={currentUser.notifyCount}
            onItemClick={(item, tabProps) => {
              console.log(item, tabProps); // eslint-disable-line
            }}
            onClear={onNoticeClear}
            onPopupVisibleChange={onNoticeVisibleChange}
            loading={fetchingNotices}
            popupAlign={{ offset: [20, -16] }}
          >
            <NoticeIcon.Tab
              list={noticeData['通知']}
              title="通知"
              emptyText="你已查看所有通知"
              emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
            />
            <NoticeIcon.Tab
              list={noticeData['消息']}
              title="消息"
              emptyText="您已读完所有消息"
              emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
            />
            <NoticeIcon.Tab
              list={noticeData['待办']}
              title="待办"
              emptyText="你已完成所有待办"
              emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg"
            />
          </NoticeIcon> */}
          {currentUser.username ? (
            <Dropdown overlay={menu}>
              <span className={`${styles.action} ${styles.account}`} style={{display:'inline-flex'}}>
                  <div>
                      <i className={this.renderStatusStyle(currentUser.status)}/>
                      <Avatar size="small" className={styles.avatar} src={currentUser.imageurl ? currentUser.imageurl : getDefaultUserLogo() } />
                  </div>
                <span className={styles.name}>{currentUser.username + (owner.tenantname? ('(' + owner.tenantname + ')') :'')}</span>
              </span>
            </Dropdown>
          ) : (
            <Spin size="small" style={{ marginLeft: 8 }} />
          )}
        </div>
      </div>
    );
  }
}