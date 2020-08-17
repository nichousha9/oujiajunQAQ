/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import { getMenuData } from '@ant-design/pro-layout';
import React from 'react';
import { Layout } from 'antd';
import { connect } from 'dva';
import Authorized from '@/utils/Authorized';
import Header from '@/components/Header';
import SiderMenu from '@/components/SiderMenu';
import logo from '../assets/images/logo.png';
import styles from './layout.less';

const { Header: AntHeader, Content } = Layout;

class BasicLayout extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'user/getLoginInfo',
      });
    }
  }

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
        <AntHeader className="header">
          <Header {...headerProps} />
        </AntHeader>
        <Layout>
          <SiderMenu
            theme={theme}
            Authorized={Authorized}
            onCollapse={this.handleMenuCollapse}
            menuData={menuData}
            isMobile={false}
            {...this.props}
          />

          <Layout className={styles.layout}>
            <Content
              style={{
                background: '#EDEFF0',
                padding: 16,
                margin: 0,
                minHeight: 'calc(100vh - 78px)',
              }}
            >
              {children}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

export default connect(({ global }) => ({
  collapsed: global.collapsed,
  theme: global.theme,
}))(BasicLayout);
