import React from 'react';
import { connect } from 'dva';
import { Tabs, Table, Form, Input, Row } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './index.less';
const { TabPane } = Tabs;

@connect(({ logManage, loading }) => ({
  loginLogList: logManage.loginLogList,
  loginPageInfo: logManage.loginPageInfo,
  loginLoading: loading.effects['logManage/qrySystemUserLoginLogList'],
  menuLogList: logManage.menuLogList,
  menuPageInfo: logManage.menuPageInfo,
  menuLoading: loading.effects['logManage/qrySystemUserHistoryMenuLogList'],
}))
@Form.create()
class LogManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: '1',
    };
  }

  componentDidMount() {
    const { activeKey } = this.state;
    this.qryLoginOrMenuLogList(activeKey);
  }

  onTabsChange = async activeKey => {
    this.setState({
      activeKey,
    });
    this.qryLoginOrMenuLogList(activeKey);
  };

  handleSearch = () => {
    const { activeKey } = this.state;
    this.qryLoginOrMenuLogList(activeKey);
  };

  initLoginPageInfo = async () => {
    const { dispatch, loginPageInfo } = this.props;

    await dispatch({
      type: 'logManage/getLoginPageInfo',
      payload: { ...loginPageInfo, pageNum: 1 },
    });
  };

  initMenuPageInfo = async () => {
    const { dispatch, menuPageInfo } = this.props;

    await dispatch({
      type: 'logManage/getMenuPageInfo',
      payload: { ...menuPageInfo, pageNum: 1 },
    });
  };

  handleLoginTableChange = async (pageNum, pageSize) => {
    const { dispatch, loginPageInfo } = this.props;

    await dispatch({
      type: 'logManage/getLoginPageInfo',
      payload: { ...loginPageInfo, pageNum, pageSize },
    });

    this.qryLoginLogList();
  };

  handleMenuTableChange = async (pageNum, pageSize) => {
    const { dispatch, menuPageInfo } = this.props;

    await dispatch({
      type: 'logManage/getMenuPageInfo',
      payload: { ...menuPageInfo, pageNum, pageSize },
    });

    this.qryMenuLogList();
  };

  qryLoginLogList = async () => {
    const { dispatch, form } = this.props;
    const fieldsValue = form.getFieldsValue();

    await dispatch({
      type: 'logManage/qrySystemUserLoginLogList',
      payload: fieldsValue,
    });
  };

  qryMenuLogList = async () => {
    const { dispatch, form } = this.props;
    const fieldsValue = form.getFieldsValue();

    await dispatch({
      type: 'logManage/qrySystemUserHistoryMenuLogList',
      payload: fieldsValue,
    });
  };

  qryLoginOrMenuLogList = async activeKey => {
    if (activeKey === '1') {
      await this.initLoginPageInfo();
      this.qryLoginLogList();
    } else {
      await this.initMenuPageInfo();
      this.qryMenuLogList();
    }
  };

  render() {
    const {
      form,
      loginLogList,
      loginPageInfo,
      loginLoading,
      menuLogList,
      menuPageInfo,
      menuLoading,
    } = this.props;
    const { getFieldDecorator } = form;
    const searchForm = (
      <Form className={styles.logManageSearchForm}>
        <Row>
          <Form.Item className={styles.codeInput}>
            {getFieldDecorator('staffName')(
              <Input.Search
                size="small"
                allowClear
                placeholder={formatMessage(
                  { id: 'logManage.staffNamePlaceHolder' },
                  '请输入员工名称查询',
                )}
                onSearch={this.handleSearch}
              />,
            )}
          </Form.Item>
        </Row>
      </Form>
    );

    const loginColumns = [
      {
        title: formatMessage({ id: 'logManage.staffName' }, '员工名称'),
        dataIndex: 'staffName',
        render: text => text || '--',
      },
      {
        title: formatMessage({ id: 'logManage.login.time' }, '登陆时间'),
        dataIndex: 'loginTime',
        render: text => text || '--',
      },
      {
        title: formatMessage({ id: 'logManage.ip' }, '登陆IP'),
        dataIndex: 'loginIp',
        render: text => text || '--',
      },
      {
        title: formatMessage({ id: 'logManage.login.result' }, '登陆结果'),
        dataIndex: 'loginResult',
        render: text => text || '--',
      },
      {
        title: formatMessage({ id: 'logManage.login.description' }, '说明'),
        dataIndex: 'remark',
        render: text => text || '--',
      },
    ];

    const { pageNum, pageSize, total } = loginPageInfo;
    const loginPaginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: pageNum,
      total,
      pageSize,
      pageSizeOptions: ['5', '10', '20', '30', '40'],
      onChange: (page, size) => this.handleLoginTableChange(page, size),
      onShowSizeChange: (current, size) => this.handleLoginTableChange(current, size),
    };

    const menuColumns = [
      {
        title: formatMessage({ id: 'logManage.staffName' }, '员工名称'),
        dataIndex: 'staffName',
        render: text => text || '--',
      },
      {
        title: formatMessage({ id: 'logManage.menu.account' }, '用户账号'),
        dataIndex: 'sysUserCode',
        render: text => text || '--',
      },
      {
        title: formatMessage({ id: 'logManage.menu.job' }, '岗位名称'),
        dataIndex: 'sysPostName',
        render: text => text || '--',
      },
      {
        title: formatMessage({ id: 'logManage.menu.menu' }, '菜单名称'),
        dataIndex: 'menuName',
        render: text => text || '--',
      },
      {
        title: formatMessage({ id: 'logManage.ip' }, '登陆IP'),
        dataIndex: 'loginIp',
        render: text => text || '--',
      },
      {
        title: formatMessage({ id: 'logManage.menu.time' }, '访问时间'),
        dataIndex: 'createDate',
        render: text => text || '--',
      },
    ];

    const { pageNum: menuPageNum, pageSize: menuPageSize, total: menuTotal } = menuPageInfo;
    const menuPaginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: menuPageNum,
      total: menuTotal,
      pageSize: menuPageSize,
      pageSizeOptions: ['5', '10', '20', '30', '40'],
      onChange: (page, size) => this.handleMenuTableChange(page, size),
      onShowSizeChange: (current, size) => this.handleMenuTableChange(current, size),
    };

    return (
      <Tabs className={styles.logTabs} tabBarExtraContent={searchForm} onChange={this.onTabsChange}>
        <TabPane tab={formatMessage({ id: 'logManage.login.Log' }, '登陆日志')} key="1">
          <Table
            className={styles.logTable}
            rowKey={record => record.logid}
            columns={loginColumns}
            pagination={loginPaginationProps}
            dataSource={loginLogList}
            loading={loginLoading}
          />
        </TabPane>
        <TabPane tab={formatMessage({ id: 'logManage.menu.Log' }, '历史访问菜单日志')} key="2">
          <Table
            className={styles.logTable}
            rowKey={record => record.logid}
            columns={menuColumns}
            pagination={menuPaginationProps}
            dataSource={menuLogList}
            loading={menuLoading}
          />
        </TabPane>
      </Tabs>
    );
  }
}

export default LogManage;
