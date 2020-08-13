/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Layout, Menu, Icon, Badge } from 'antd';
import pathToRegexp from 'path-to-regexp';
import { Link } from 'dva/router';
import styles from './index.less';
import { urlToList } from '../_utils/pathTools';
import './sider.css';

const { Sider } = Layout;
const { SubMenu } = Menu;

// Allow menu.js  icon as string or ReactNode
//   icon: 'setting',
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,
const getIcon = icon => {
  if (typeof icon === 'string' && icon.indexOf('http') === 0) {
    return <img src={icon} alt="icon" className=" sider-menu-item-img" />;
  }
  if (typeof icon === 'string' && icon.indexOf('icon') !== -1) {
    return (
      <i
        className={`iconfont ${icon} sider-menu-item-img
    `}
        style={{ marginRight: 5 }}
      />
    );
  }
  if (typeof icon === 'string') {
    return <Icon style={{ fontSize: 22 }} type={icon} />;
  }
  return icon;
};

export const getMeunMatcheys = (flatMenuKeys, path) => {
  return flatMenuKeys.filter(item => {
    return pathToRegexp(item).test(path);
  });
};

class SiderMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.menus = props.menuData;
    this.flatMenuKeys = this.getFlatMenuKeys(props.menuData);
    this.state = {
      openKeys: this.getDefaultCollapsedSubMenus(props),
      dispatchstate: false,
    };
  }

  componentWillMount() {
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
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      this.setState({
        openKeys: this.getDefaultCollapsedSubMenus(nextProps),
      });
    }
  }
  /**
   * Convert pathname to openKeys
   * /list/search/articles = > ['list','/list/search']
   * @param  props
   */

  getDefaultCollapsedSubMenus(props) {
    const {
      location: { pathname },
    } = props || this.props;
    return urlToList(pathname)
      .map(item => {
        return getMeunMatcheys(this.flatMenuKeys, item)[0];
      })
      .filter(item => item);
  }
  /**
   * Recursively flatten the data
   * [{path:string},{path:string}] => {path,path2}
   * @param  menus
   */
  getFlatMenuKeys(menus) {
    let keys = [];
    menus.forEach(item => {
      if (item.children) {
        keys = keys.concat(this.getFlatMenuKeys(item.children));
      }
      keys.push(item.path);
    });
    return keys;
  }
  /**
   * 判断是否是http链接.返回 Link 或 a
   * Judge whether it is http link.return a or Link
   * @memberof SiderMenu
   */
  getMenuItemPath = item => {
    const itemPath = this.conversionPath(item.path);
    const icon = getIcon(item.icon);
    const { target, name } = item;
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
          <span className={styles.iconforn1}> {icon}</span>
          <span className={styles.iconforn2}>{name}</span>
        </a>
      );
    }
    return (
      <Link
        to={itemPath}
        target={target}
        replace={itemPath === this.props.location.pathname}
        onClick={undefined}
      >
        {icon}
        {<span>{name}</span>}
      </Link>
    );
  };
  /**
   * get SubMenu or Item
   */
  getSubMenuOrItem = item => {
    const { collapsed } = this.props;
    if (item.children && item.children.some(child => child.name)) {
      const childrenItems = this.getNavMenuItems(item.children);
      // 当无子菜单时就不展示菜单
      if (childrenItems && childrenItems.length > 0) {
        return (
          <SubMenu
            // style={{ padding: 0 + '!important' }}
            // className={styles.box }
            // id={'inline-collapsed1'}
            title={
              item.icon ? (
                <span>
                  {getIcon(item.icon)}
                  <span>{item.name}</span>
                </span>
              ) : (
                item.name
              )
            }
            key={item.path}
          >
            {childrenItems}
          </SubMenu>
        );
      }
      return null;
    } else {
      const {
        global: { newMessageAgent = [], hasNewMsg = [] },
      } = this.props;
      const isNew = item.name === '坐席' && (newMessageAgent.length || hasNewMsg.length);
      return isNew ? (
        <Menu.Item key={item.path} className={item.className || ''}>
          <Badge dot>
            <span className="colorWhite margin-right-10">{this.getMenuItemPath(item)}</span>
          </Badge>
        </Menu.Item>
      ) : (
        <Menu.Item key={item.path} className={item.className || ''}>
          {this.getMenuItemPath(item)}
        </Menu.Item>
      );
    }
  };
  /**
   * 获得菜单子节点
   * @memberof SiderMenu
   */
  getNavMenuItems = menusData => {
    if (!menusData) {
      return [];
    }
    menusData.map((item, index) => {
      if (item.name === '机器人编辑') {
        menusData.splice(index, 1);
      }
    });
    menusData.map((item, index) => {
      if (item.name === '问题对比') {
        menusData.splice(index, 1);
      }
    });
    menusData.map((item, index) => {
      if (item.name === '知识库') {
        menusData.splice(index, 1);
      }
    });
    return menusData
      .filter(item => item.name && !item.hideInMenu && item.icon)
      .map(item => {
        // make dom
        const ItemDom = this.getSubMenuOrItem(item);
        return this.checkPermissionItem(item.authority, ItemDom);
      })
      .filter(item => item);
  };
  // Get the currently selected menu
  getSelectedMenuKeys = () => {
    const {
      location: { pathname },
    } = this.props;
    return urlToList(pathname).map(itemPath => getMeunMatcheys(this.flatMenuKeys, itemPath).pop());
  };
  // conversion Path
  // 转化路径
  conversionPath = path => {
    if (path && path.indexOf('http') === 0) {
      return path;
    } else {
      return `/${path || ''}`.replace(/\/+/g, '/');
    }
  };
  // permission to check
  checkPermissionItem = (authority, ItemDom) => {
    if (this.props.Authorized && this.props.Authorized.check) {
      const { check } = this.props.Authorized;
      return check(authority, ItemDom);
    }
    return ItemDom;
  };
  isMainMenu = key => {
    return this.menus.some(item => key && (item.key === key || item.path === key));
  };
  handleOpenChange = openKeys => {
    const lastOpenKey = openKeys[openKeys.length - 1];
    const moreThanOne = openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1;
    this.setState({
      openKeys: moreThanOne ? [lastOpenKey] : [...openKeys],
    });
  };
  // 导航切换的
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
  };

  getJson = arr => {
    const theRequest = {};
    for (let i = 0; i < arr.length; i += 1) {
      const kye = arr[i].split('=')[0];
      const value = arr[i].split('=')[1];
      theRequest[kye] = value;
    }
    return theRequest;
  };
  render() {
    const { logo, collapsed, isMobile, renderCurUser } = this.props;
    const { openKeys, dispatchstate } = this.state;
    // Don't show popup menu when it is been collapsed
    const menuProps = collapsed
      ? {}
      : {
          openKeys,
        };
    // if pathname can't match, use the nearest parent's key
    let selectedKeys = this.getSelectedMenuKeys();
    if (!selectedKeys.length) {
      selectedKeys = [openKeys[openKeys.length - 1]];
    }
    return (
      <Sider
        collapsedWidth={64}
        trigger={null}
        defaultCollapsed
        collapsible
        collapsed={isMobile ? true : collapsed}
        breakpoint="lg"
        style={dispatchstate ? { display: 'none' } : null}
        width={180}
        className={collapsed ? styles.sider1 : styles.sider}
      >
        <div className={styles.logo} style={{ paddingLeft: collapsed ? 16 : 24 }} key="logo">
          <div onClick={this.toggle} className="pointer">
            <img src={logo} alt="logo" />
            <h1>鲸智小蜜</h1>
          </div>
        </div>
        <Menu
          key="Menu"
          theme="dark"
          mode="inline"
          {...menuProps}
          onOpenChange={this.handleOpenChange}
          selectedKeys={selectedKeys}
          style={{ padding: '0', width: '100%' }}
        >
          {this.getNavMenuItems(this.menus)}
        </Menu>
        {!!renderCurUser && (
          <div className="fixedBottom" style={{ paddingLeft: collapsed ? 12 : 22 }}>
            {renderCurUser()}
          </div>
        )}
        <span
          onClick={this.toggle}
          className="fixedBottom height24 line-height24 textCenter pointer"
          style={{ bottom: '0', color: 'rgba(255, 255, 255, 0.65)' }}
        >
          {collapsed ? '>>>' : '<<<'}
        </span>
      </Sider>
    );
  }
}

export default connect(({ global }) => ({ global }))(SiderMenu);
