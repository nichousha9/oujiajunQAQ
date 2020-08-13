import React from 'react';
import { Link } from 'dva/router';
import { Menu, Icon,Button } from 'antd';
import getSubMenuData from '../../common/subMenu';
import './index.less';

const SubMenu = Menu.SubMenu;

export default class CommonSubMenue extends React.Component{
  constructor(props){
    super(props);
    const { dataType,pathname } = props;
    const menuData = getSubMenuData(dataType);
    this.rootSubmenuKeys = menuData.map((menu) => { return menu.key;});
    const selectedKeys = pathname !== dataType ? pathname : menuData[0].children.length ? menuData[0].children[0].key : menuData[0].key;
    this.state = {
      collapsed: false,
      openKeys:[ menuData[0].key],
      selectedKeys:[selectedKeys],
      menuData,
    }
  }
  onOpenChange = (openKeys) => {
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
   if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  }
  onSelect = (selectKey) => {
    this.setState({selectedKeys: [selectKey.key]});
  }
  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  rootSubmenuKeys = []
  renderMenu = (menuData) => {
    return menuData.map((menu) => {
      if(menu.children && menu.children.length >0 ){
        return (
          <SubMenu key={menu.key} title={menu.text}>
            { this.renderMenu(menu.children)}
          </SubMenu>
        )
      }
      return  <Menu.Item key={menu.key}><Link to={menu.key}>{menu.text}</Link></Menu.Item>
    });
  }
  render(){
    const { selectedKeys,openKeys,menuData } = this.state;
    return (
      <div  className="commonSubMenue" style={{ overflowY:'auto'}}>
        <div className="title border-bottom">系统设置</div>
        {/* <Button type="primary" onClick={this.toggleCollapsed} style={{ marginBottom: 16 }}>
          <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
        </Button> */}
        <Menu
          mode="inline"
          inlineCollapsed={this.state.collapsed}
          openKeys={openKeys}
          onOpenChange={this.onOpenChange}
          selectedKeys={selectedKeys}
          onSelect={this.onSelect}
        >
          {this.renderMenu(menuData)}
        </Menu>
      </div>
    )
  }
}
