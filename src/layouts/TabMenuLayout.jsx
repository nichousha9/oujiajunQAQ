/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import { getMenuData } from '@ant-design/pro-layout';
import React from 'react';
import { Layout, Tabs } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import { formatMessage } from 'umi-plugin-react/locale';
import pathToRegexp from 'path-to-regexp';
import Base64 from 'base-64';
import { setCookie } from '@/utils/common';
import Authorized from '@/utils/Authorized';
import Header from '@/components/Header';
import Iconfont from '@/components/Iconfont';
import SiderMenu from '@/components/SiderMenu';
import logo from '../assets/images/logo.png';
import styles from './layout.less';

const { Header: AntHeader, Content } = Layout;
const { TabPane } = Tabs;

const homeKey = '123456';

class BasicLayout extends React.Component {
  constructor(props) {
    super(props);
    const { location } = props;
    const { sso, bss3SessionId } = location.query;
    window.isSso = !!sso;
    this.state = {
      panes: [
        // 第一个为首页
        {
          title: '推荐监控',
          key: homeKey,
          closable: true,
          pathAddress: '/campaignMonitor',
          location: {
            pathname: '/campaignMonitor',
          },
        },
      ],
      activeKey: '',
      isSso: !!sso, // 是否单点页面
    };
    // 如果是统一门户又没带参则跳到统一门户登录页面
    if (window.isSso && !bss3SessionId) {
      window.parent.postMessage("{action:'toLogin'}", '*');
    }
    if (window.isSso && bss3SessionId) {
      setCookie('SESSION', bss3SessionId);
    }
    // 如果不是统一门户登陆不允许访问，
    // if (!window.isSso) {
    //   router.push({
    //     pathname: '/403',
    //   });
    // }
  }

  componentDidMount() {
    const { dispatch, location } = this.props;
    const { bss3SessionId } = location.query;
    if (window.name) {
      const userInfo = JSON.parse(Base64.decode(window.name));
      dispatch({
        type: 'user/updateSaasSession',
        payload: userInfo,
      });
    } else {
      dispatch({
        type: 'user/getLoginInfo',
        payload: { token: bss3SessionId },
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.addTab(nextProps);
  }

  getMenuName = (menuData, pathname) => {
    let translateName;

    menuData.some(item => {
      const { name, path, locale, children } = item;

      if (pathToRegexp(path).test(pathname)) {
        translateName = formatMessage({
          id: locale,
          defaultMessage: name,
        });
      } else if (children) {
        translateName = this.getMenuName(children, pathname);
      }
      return translateName;
    });

    return translateName;
  };

  /**
   * 获取所有菜单路由，包括hideInMenu的数据
   */
  getAllRoutes = routes => {
    const newRoutes = [];
    routes.forEach(item => {
      const { routes: childrenRoutes } = item;
      let newChildrenRoutes = [];
      if (childrenRoutes) {
        newChildrenRoutes = this.getAllRoutes(childrenRoutes);
      }
      newRoutes.push({ ...item, hideInMenu: false, routes: newChildrenRoutes });
    });
    return newRoutes;
  };

  addTab = props => {
    const {
      children,
      location: { key, pathname, search, state },
      location,
      route: { routes },
    } = props;

    if (!pathname || pathname === '/') {
      return;
    }
    const { panes, activeKey: currentKey } = this.state;
    let filterPanes = panes;
    if (state && state.type && state.type == 'cancel') {
      const arr = [];
      panes.forEach(item => {
        if (item.key !== currentKey || currentKey == homeKey) {
          arr.push(item);
        }
      });
      filterPanes = arr;
    }
    const allRoutes = this.getAllRoutes(routes);

    const { menuData } = getMenuData(allRoutes);

    const menuName = this.getMenuName(menuData, pathname);

    const activeKey = key;
    if (this.isMenuExists(menuName)) {
      // 如果已经存在该tab，需要把已存在的tab先去掉再取代新的
      // this.activeMenuTab(menuName);
      const newPanes = filterPanes.map(item => {
        if (item.title === menuName) {
          return {
            title: menuName,
            content: children,
            key: activeKey,
            closable: true,
            location: {
              ...location,
              state: {
                ...state,
                type: '',
              },
            },
            pathAddress: `${pathname}${search}`,
          };
        }
        return item;
      });
      this.setState({
        panes: newPanes,
        activeKey,
      });
    } else {
      filterPanes.push({
        title: menuName,
        content: children,
        key: activeKey,
        closable: true,
        location: {
          ...location,
          state: {
            ...state,
            type: '',
          },
        },
        pathAddress: `${pathname}${search}`,
      });
      this.setState({ panes: filterPanes, activeKey });
    }
  };

  isMenuExists = menuName => {
    const { panes } = this.state;
    let exists = false;
    panes.forEach(item => {
      if (menuName == item.title) {
        exists = true;
      }
    });
    return exists;
  };

  activeMenuTab = menuName => {
    const { panes } = this.state;
    panes.forEach(pane => {
      if (pane.title == menuName) {
        this.setState({
          activeKey: pane.key,
        });
      }
    });
  };

  handleTabEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  remove = targetKey => {
    const { panes } = this.state;
    let { activeKey } = this.state;
    let lastIndex;
    panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = panes.filter(pane => pane.key !== targetKey);
    let current = '';
    if (panes.length && activeKey === targetKey) {
      if (lastIndex >= 0) {
        activeKey = panes[lastIndex].key;
        current = panes[lastIndex];
      } else {
        activeKey = panes[0].key;
        // eslint-disable-next-line prefer-destructuring
        current = panes[0];
      }
    }
    this.setState({ panes: newPanes, activeKey }, () => {
      const { location } = current;
      router.push(location);
    });
  };

  handleTabChange = activeKey => {
    const { panes } = this.state;
    this.setState({ activeKey });
    panes.forEach(item => {
      if (item.key === activeKey) {
        const { location } = item;
        router.push(location);
      }
    });
  };

  /**
   * init variables
   */

  handleMenuCollapse = payload => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  };

  render() {
    const { userInfo, loading } = this.props;
    const { panes, activeKey, isSso = false } = this.state;
    const {
      route: { routes },
      collapsed,
      theme,
      children,
    } = this.props;

    const { menuData } = getMenuData(routes);

    const headerProps = {
      logo,
      collapsed,
      onCollapse: this.handleMenuCollapse,
    };
    return (
      <Layout>
        {isSso ? null : (
          <AntHeader className="header">
            <Header {...headerProps} />
          </AntHeader>
        )}
        <Layout>
          {isSso ? null : (
            <SiderMenu
              theme={theme}
              Authorized={Authorized}
              onCollapse={this.handleMenuCollapse}
              menuData={menuData}
              isMobile={false}
              {...this.props}
            />
          )}

          <Layout className={styles.layout}>
            {isSso ? null : (
              <Tabs
                onChange={this.handleTabChange}
                activeKey={activeKey}
                type="editable-card"
                hideAdd
                onEdit={this.handleTabEdit}
                className={styles.layoutTabPath}
                tabBarStyle={{
                  margin: 0,
                  marginRight: '0 !important',
                  height: '32px',
                }}
              >
                {panes.map((pane, index) => {
                  if (index == 0) {
                    return (
                      <TabPane
                        tab={
                          <Iconfont
                            type="iconhome"
                            style={{
                              color: activeKey == pane.key ? '#1890FF' : '#627499',
                              textAlign: 'center',
                              margin: 0,
                            }}
                          />
                        }
                        key={pane.key}
                        closable={false}
                      />
                    );
                  }
                  return <TabPane tab={pane.title} key={pane.key} closable={pane.closable} />;
                })}
              </Tabs>
            )}
            <Content
              style={{
                background: '#EDEFF0',
                padding: 16,
                margin: 0,
                height: 'calc(100vh - 78px)',
                overflow: 'auto',
              }}
            >
              {userInfo.staffId ? children : <p>{loading ? '加载中' : '没有用户信息'}</p>}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

export default connect(({ global, user, loading }) => ({
  collapsed: global.collapsed,
  theme: global.theme,
  userInfo: user.userInfo || {},
  // userInfo: { userId: 1, userCode: 'admin', userName: 'admin' },
  // orgInfo: {},
  // staffInfo: { staffId: 1, staffName: 'admin' },
  // userRoles: [{ sysRoleId: 10, sysRoleName: '系统管理角色', sysRoleCode: '系统管理角色' }],
  // staffId: 1,

  loading: loading.effects['user/getLoginInfo'],
}))(BasicLayout);
