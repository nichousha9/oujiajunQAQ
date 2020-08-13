/* eslint-disable prefer-template */
/* eslint-disable no-console */
/* eslint-disable react/no-did-mount-set-state */
import React from 'react';
import PropTypes from 'prop-types';
import { Layout, message, Divider } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Redirect, Switch, routerRedux } from 'dva/router';
import { Route } from 'react-router-dom';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import UserHeader from '../components/GlobalHeader/UserHeader';
import UserInfoModal from '../components/UserInfoModal';
import EditPassWordModal from '../components/EditPassWordModal';
import SiderMenu from '../components/SiderMenu';
import NotFound from '../routes/Exception/404';
import { getRoutes, getOnlineMenu, filterMenu, isSubMenu } from '../utils/utils';
import { locationPathName } from '../utils/resource';
import Authorized from '../utils/Authorized';
import { getMenuData } from '../common/menu';
// import Url from 'url-parse';
// import getSubMenuData from '../common/subMenu';
// import { agentusers } from '../services/api';
import logo from '../assets/logo.svg';
import '../common/less/common.less';
import { getUserInfo } from '../utils/userInfo';

// import styles from './index.less';

const { Content } = Layout;
const { AuthorizedRoute, check } = Authorized;
window.tablePageSize = 10;
/**
 * 根据菜单取得重定向地址.
 */
const redirectData = [];
const getRedirect = (item) => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `${item.path}`,
        to: `${item.children[0].path}`,
      });
      item.children.forEach((children) => {
        getRedirect(children);
      });
    }
  }
};

/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 * @param {Object} routerData 路由配置
 */
const getBreadcrumbNameMap = (menuData, routerData) => {
  const result = {};
  const childResult = {};
  for (const i of menuData) {
    if (!routerData[i.path]) {
      result[i.path] = i;
    }
    if (i.children) {
      Object.assign(childResult, getBreadcrumbNameMap(i.children, routerData));
    }
  }
  return Object.assign({}, routerData, result, childResult);
};

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};

let isMobile;
enquireScreen((b) => {
  isMobile = b;
});

class BasicLayout extends React.Component {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  };
  state = {
    isMobile,
    menuData: [],
    userInfoModalShow: false,
    editPassWordModalShow: false,
    dispatchstate: false,
  };
  getChildContext() {
    const { location, routerData } = this.props;
    const { menuData } = this.state;
    return {
      location,
      breadcrumbNameMap: getBreadcrumbNameMap(getMenuData(menuData), routerData),
    };
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'login/selectStaffMenus' }).then((res) => {
      const menus = getOnlineMenu(res.data);
      if (menus.length) {
        this.setState({ menuData: menus });
        getMenuData(menus).forEach(getRedirect);
      }
    });
  }
  componentDidMount() {
    const { location } = this.props;
    if (location.search !== '') {
      const urlArr = location.search.split('?')[1].split('&');
      const urlObj = this.getJson(urlArr);
      for (const i in urlObj) {
        if (i === 'oss') {
          this.setState({ dispatchstate: true });
        }
      }
    } else {
      this.setState({ dispatchstate: false });
    }

    window.addEventListener('resize', this.onReSize, false);
    this.enquireHandler = enquireScreen((mobile) => {
      this.setState({
        isMobile: mobile,
      });
    });
    // dispatch({type: 'user/fetchCurrent'});

    // dispatch({
    //   type:'global/fetchGetAtOutlineInfo',
    //   payload:{
    //     userid: (getUserInfo()|| {}).id,
    //   },
    // }).then((res)=>{
    //   console.log('outline',res);
    // })
    // this.badgeInterval = setInterval(()=>{
    // agentusers({ status:"inservice"  }).then((res) => {
    //   if(!res || res.status!=='OK') return;
    //   const list = [ ...res.data.agentList,...res.data.groupList];
    //   const hasNewMsg = (list || []).filter((item)=>{
    //     return item.tokenum && item.tokenum != 0;
    //   });
    //   this.props.dispatch({
    //     type: 'global/saveNewMessageAgent',
    //     payload: [...hasNewMsg.map((item)=>{return item.userid})],
    //   })
    // });
    // },30000);
  }
  // 用于验权是否有进入该页面的权限
  componentWillReceiveProps(nextProps) {
    const {
      location: { pathname },
    } = nextProps;
    const {
      location: { pathname: myPathname },
      dispatch,
    } = this.props;
    const { menuData } = this.state;
    if (pathname !== myPathname) {
      const { roleAuthMap } = getUserInfo();
      const newMenuArr = filterMenu(menuData, 'authId', roleAuthMap);
      const sunmenu = isSubMenu(pathname, newMenuArr, roleAuthMap);
      const menuPaths = newMenuArr.map((v) => v.path);
      if (menuPaths.indexOf(pathname) === -1 && !sunmenu) {
        dispatch(routerRedux.push('/user/login'));
      }
    }
  }
  componentWillUnmount() {
    window.addEventListener('resize', this.onReSize, false);
    unenquireScreen(this.enquireHandler);
    window.clearInterval(this.badgeInterval);
  }
  onReSize = () => {
    this.forceUpdate();
  };

  getJson = (arr) => {
    const theRequest = {};
    for (let i = 0; i < arr.length; i += 1) {
      const kye = arr[i].split('=')[0];
      const value = arr[i].split('=')[1];
      theRequest[kye] = value;
    }
    return theRequest;
  };

  getQueryString = (name, search) => {
    const searchNew = search ||  window.location.search.substr(1) || window.location.hash.split("?")[1];
    if(!searchNew) return null
    const reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    const r = searchNew.match(reg);
    if (r != null) return  unescape(r[2]); return null;
  }
  

  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = '鲸智小蜜';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - 鲸智小蜜`;
    }
    return title;
  }
  getBashRedirect = () => {
    // According to the url parameter to redirect
    // 这里是重定向的,重定向到 url 的 redirect 参数所示地址
    const urlParams = new URL(window.location.href);

    const redirect = urlParams.searchParams.get('redirect');
    // Remove the parameters in the url
    if (redirect) {
      urlParams.searchParams.delete('redirect');
      window.history.replaceState(null, 'redirect', urlParams.href);
    } else {
      const { routerData } = this.props;
      // get the first authorized route path in routerData
      const authorizedPath = Object.keys(routerData).find(
        (item) => check(routerData[item].authority, item) && item !== '/'
      );
      return authorizedPath;
    }
    return redirect;
  };

  handleMenuCollapse = (collapsed) => {
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  handleNoticeClear = (type) => {
    message.success(`清空了${type}`);
    this.props.dispatch({
      type: 'global/clearNotices',
      payload: type,
    });
  };

  handleMenuClick = ({ key }) => {
    // if (key === 'online') {
    //     this.props.dispatch({
    //       type: 'user/changeStatus',
    //       payload:{status:'ready'},
    //     });
    // }
    // if (key === 'offline') {
    //     this.props.dispatch({
    //       type: 'user/changeStatus',
    //       payload:{status:'notready'},
    //     });
    // }
    // if (key === 'busy') {
    //     this.props.dispatch({
    //       type: 'user/changeStatus',
    //       payload:{status:'busy'},
    //     });
    //     return;
    // }
    // if (key === 'tenant') {
    //     this.props.dispatch(routerRedux.push('/header/createtenant'));
    //     return;
    // }
    if (key === 'user') {
      this.setState({ userInfoModalShow: true });
      return;
    }
    if (key === 'editPassWord') {
      this.setState({ editPassWordModalShow: true });
      return;
    }
    if (key === 'logout') {
      this.props.dispatch({ type: 'dataDic/clearState' });
      this.props.dispatch({ type: 'login/logout' });
    }
    // if(key == 'switch'){
    //     let loginForm = localStorage.getItem("LOGIN_FORM_DATA" ) || '{}'
    //     loginForm = JSON.parse(loginForm)
    //     if(loginForm.appid){
    //       location.href = `/im/text/${loginForm.appid}.html`
    //     }else{
    //       alert('无法切换')
    //     }
    // }
  };
  handleNoticeVisibleChange = (visible) => {
    if (visible) {
      this.props.dispatch({
        type: 'global/fetchNotices',
      });
    }
  };
  closeModal = () => {
    this.setState({ userInfoModalShow: false, editPassWordModalShow: false });
  };
  renderChildRoute = (data) => {
    return (data || []).map((item) => {
      return (
        <AuthorizedRoute
          key={item.path}
          path={item.path}
          component={item.component}
          exact={item.exact}
          authority={item.authority}
          redirectPath="/exception/403"
        />
      );
    });
  };
  renderCurUser = () => {
    const { currentUser, collapsed, notices } = this.props;
    return (
      <UserHeader
        logo={logo}
        currentUser={currentUser}
        notices={notices}
        collapsed={collapsed}
        isMobile={this.state.isMobile}
        onNoticeClear={this.handleNoticeClear}
        onCollapse={this.handleMenuCollapse}
        onMenuClick={this.handleMenuClick}
        onNoticeVisibleChange={this.handleNoticeVisibleChange}
      />
    );
  };
  render() {
    const { collapsed, routerData, match, location = {}, modifyprofile } = this.props;
    const renderContent = true; // currentUser.id; // 当前存在用户
    const { userInfoModalShow, editPassWordModalShow, menuData, dispatchstate } = this.state;
    const bashRedirect = this.getBashRedirect();
    const userInfoModalProps = {
      visible: userInfoModalShow,
      onCancel: this.closeModal,
      modifyprofile,
      dispatch: this.props.dispatch,
    };
    const editPassWordModalProps = {
      visible: editPassWordModalShow,
      onCancel: this.closeModal,
      dispatch: this.props.dispatch,
    };

    // const { search } = window.location;
    // console.log('widnow', window.location);
    // const data = Url(search, true);
    // const {
    //   query: { sso },
    // } = data;

    // console.log('data', getMenuData(menuData));

    const sso = this.getQueryString('sso');

    // console.log('sso',sso)

    const isUnifiedPortal = sso === '0';

    const layout = (
      <Layout>
        {menuData.length && !isUnifiedPortal ? (
          <SiderMenu
            logo={logo}
            // style={{ dispatch: 'none' }}
            // 不带Authorized参数的情况下如果没有权限,会强制跳到403界面
            // If you do not have the Authorized parameter
            // you will be forced to jump to the 403 interface without permission
            Authorized={Authorized}
            menuData={getMenuData(menuData)}
            collapsed={collapsed}
            location={location}
            isMobile={this.state.isMobile}
            onCollapse={this.handleMenuCollapse}
            renderCurUser={this.renderCurUser}
          />
        ) : null}

        <Layout
          style={
            dispatchstate === false
              ? { marginLeft: collapsed ? 64 : 180, height: '100vh', dispatch: 'none' }
              : { height: '100vh', dispatch: 'none' }
          }
        >
          {/*  <Layout style={{ height: '100vh'}}> */}
          {dispatchstate === false ? (
            <div
              style={{
                width: collapsed ? 'calc(100% - 64px)' : 'calc(100% - 180px)',
              }}
              className="bgWhite navTitle"
            >
              {(locationPathName[location.pathname] || {}).back && (
                <React.Fragment>
                  <a
                    onClick={() => {
                      history.back();
                    }}
                  >
                    <i className="iconfont icon-back icon margin-right-10" />
                    返回
                  </a>
                  <Divider
                    style={{ margin: '0 15px', height: 16, color: '#D9D9D9' }}
                    type="vertical"
                  />
                </React.Fragment>
              )}
              <span> {(locationPathName[location.pathname] || {}).label || '首页'}</span>
            </div>
          ) : null}

          {userInfoModalShow && <UserInfoModal {...userInfoModalProps} />}
          {editPassWordModalShow && <EditPassWordModal {...editPassWordModalProps} />}
          {renderContent && (
            <Content
              className="smartContent"
              style={{ margin: '76px 16px 0', height: 'calc(100% - 76px)' }}
            >
              <Switch>
                {redirectData.map((item) => (
                  <Redirect key={item.from} exact from={item.from} to={item.to} />
                ))}
                <Redirect exact from="/" to={bashRedirect} />
                {getRoutes(match.path, routerData).map((item) => {
                  if (item.routes && item.routes.length) {
                    return (
                      <item.component key="item.path">
                        <Switch>
                          <AuthorizedRoute
                            key={item.path}
                            path={item.path}
                            component={item.routes[0].component}
                            exact={item.exact}
                            authority={item.authority}
                            redirectPath="/exception/403"
                          />
                          {this.renderChildRoute(item.routes)}
                        </Switch>
                      </item.component>
                    );
                  }
                  return (
                    <AuthorizedRoute
                      key={item.key}
                      path={item.path}
                      component={item.component}
                      exact={item.exact}
                      authority={item.authority}
                      redirectPath="/exception/403"
                    />
                  );
                })}
                <Route render={NotFound} />
              </Switch>
            </Content>
          )}
        </Layout>
      </Layout>
    );

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {(params) => <div className={classNames(params, 'layoutContent')}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default connect(({ user, global, login, loading, modifyprofile }) => ({
  currentUser: user.currentUser,
  menuData: login.menuData,
  collapsed: global.collapsed,
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,
  modifyprofile,
  hasNewMsg: global.hasNewMsg,
  newMessageAgent: global.newMessageAgent,
}))(BasicLayout);
