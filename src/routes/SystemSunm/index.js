/* eslint-disable no-console */
import React from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd';
import classnames from 'classnames';
import { Link } from 'dva/router';
// import CommonSubMenue from '../../components/CommonSubMenue';
import style from './index.less';
import getSubMenuData from '../../common/subMenu';

const { TabPane } = Tabs;

@connect(({ systemSum, roleAuth }) => ({ systemSum, roleAuth }))
export default class SystemSum extends React.Component {
  constructor(props) {
    super(props);
    const menuData = getSubMenuData('/system/summary');
    this.state = {
      menuData,
      tabs: [],
    };
  }

  componentWillMount() {
    this.loadTabs();
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'systemSum/fetchGetAllAuthList' });
    //  dispatch({type:'systemSum/fetchOrgClassList'});
    // dispatch({type:'systemSum/fetchOrganAuthList'});   组织权限和角色权限一样暂时用角色权限
  }

  loadTabs = () => {
    const tabs = [];
    this.state.menuData.forEach((item0) => {
      if (item0.children) {
        item0.children.forEach((item) => {
          const newData = {};
          newData.name = item.text;
          newData.id = item.id;
          newData.path = item.key;
          tabs.push(newData);
        });
      }
    });
    // const tabs =
    this.setState({
      tabs,
    });
  };

  tabsChange = (e) => {
    console.log(e);
  };

  render() {
    //  const { location:{ pathname}} = this.props;
    return (
      <div className={classnames('layoutContent', style.systemSum)}>
        {/* <div className={classnames(style.systemLeft,'border')}>
          <CommonSubMenue pathname={pathname} dataType='/system/summary' />
        </div> */}
        <div className={classnames(style.systemContent)}>
          <Tabs onChange={this.tabsChange} type="card" style={{ marginTop: 10, marginLeft: 10 }}>
            {this.state.tabs.map((item) => (
              <TabPane
                style={{ padding: '0', width: '100px', textAlign: 'center' }}
                tab={
                  <Link to={item.path}>
                    <div style={{ width: '100%', height: '100%' }}>{item.name}</div>
                  </Link>
                }
                key={item.id}
              />
            ))}
          </Tabs>
          {this.props.children}
        </div>
      </div>
    );
  }
}
