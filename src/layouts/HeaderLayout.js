import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Layout, Icon, message } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Route, Redirect, Switch, routerRedux } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import StaticHeader from '../components/StaticHeader';
import GlobalFooter from '../components/GlobalFooter';
import SiderMenu from '../components/SiderMenu';
import NotFound from '../routes/Exception/404';
import { getRoutes } from '../utils/utils';
import Authorized from '../utils/Authorized';
import { getMenuData } from '../common/menu';
import logo from '../assets/logo.svg';
import UserInfoModal from '../components/UserInfoModal';

const { Content, Header, Footer } = Layout;
const { AuthorizedRoute, check } = Authorized;

/**
 * 根据菜单取得重定向地址.
 */
const redirectData = [];
const getRedirect = item => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `${item.path}`,
        to: `${item.children[0].path}`,
      });
      item.children.forEach(children => {
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
enquireScreen(b => {
  isMobile = b;
});

class HeaderLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  };
  state = {
    isMobile,
    userInfoModalShow: false,
  };
  getChildContext() {
    const { location, routerData } = this.props;
    return {
      location,
    };
  }
  componentDidMount() {
    const {menuData} = this.props
    console.log(menuData,3241234234)
    getMenuData(menuData).forEach(getRedirect);
    this.enquireHandler = enquireScreen(mobile => {
      this.setState({
        isMobile: mobile,
      });
    });
    this.props.dispatch({
      type: 'user/fetchCurrent',
    });
  }
  componentWillUnmount() {
    unenquireScreen(this.enquireHandler);
  }
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = 'Smart IM';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - Smart IM`;
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
        item => check(routerData[item].authority, item) && item !== '/'
      );
      return authorizedPath;
    }
    return redirect;
  };
  handleNoticeClear = type => {
    message.success(`清空了${type}`);
    this.props.dispatch({
      type: 'global/clearNotices',
      payload: type,
    });
  };
  handleMenuClick = ({ key }) => {
      if (key === 'online') {
          this.props.dispatch({
            type: 'user/changeStatus',
            payload:{status:'ready'},
          });
      }
      if (key === 'offline') {
          this.props.dispatch({
            type: 'user/changeStatus',
            payload:{status:'notready'},
          });
      }
      if (key === 'busy') {
          this.props.dispatch({
            type: 'user/changeStatus',
            payload:{status:'busy'},
          });
          return;
      }
    if (key === 'user') {
        // this.props.dispatch(routerRedux.push('/header/modifyprofile'));
        this.setState({userInfoModalShow: true});
        return;
    }
    if (key === 'logout') {
      this.props.dispatch({
        type: 'login/logout',
      });
    }
  };
  userInfoModalCancle = () => {
    this.setState({userInfoModalShow: false});
  }
  handleNoticeVisibleChange = visible => {
    if (visible) {
      this.props.dispatch({
        type: 'global/fetchNotices',
      });
    }
  };
  render() {
    const bashRedirect = this.getBashRedirect();

    const {currentUser, collapsed, notices, routerData, match, location,modifyprofile} = this.props;
    const { userInfoModalShow } = this.state;
    const userInfoModalProps = {
      visible: userInfoModalShow,
      onCancel: this.userInfoModalCancle,
      modifyprofile,
      dispatch: this.props.dispatch,
    }

    const layout = (
      <Layout>
        <Header style={{ padding: 0 }}>
          <StaticHeader
            logo={logo}
            currentUser={currentUser}
            notices={notices}
            collapsed
            onCollapse={()=>{}}
            isMobile={this.state.isMobile}
            onNoticeClear={this.handleNoticeClear}
            onMenuClick={this.handleMenuClick}
            onNoticeVisibleChange={this.handleNoticeVisibleChange}
          />
          { userInfoModalShow && <UserInfoModal {...userInfoModalProps} />}
        </Header>
        <Content style={{ margin: '24px 24px 0', height: '100%' }}>
          <Switch>
            {redirectData.map(item => (
              <Redirect key={item.from} exact from={item.from} to={item.to} />
              ))}
            {getRoutes(match.path, routerData).map(item => (
              <AuthorizedRoute
                key={item.key}
                path={item.path}
                component={item.component}
                exact={item.exact}
                authority={item.authority}
                redirectPath="/exception/403"
              />
              ))}
            <Redirect exact from="/" to={bashRedirect} />
            <Route render={NotFound} />
          </Switch>
        </Content>
      </Layout>
    );

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default connect(({ user, global, loading, modifyprofile }) => ({
  currentUser: user.currentUser,
  menuData: user.menuData,
  collapsed: global.collapsed,
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,
  modifyprofile,
}))(HeaderLayout);
