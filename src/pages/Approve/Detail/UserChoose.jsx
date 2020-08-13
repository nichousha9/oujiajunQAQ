// 审核人员选择弹窗
import React from 'react';
import { debounce } from 'lodash';
import { connect } from 'dva';
import { Modal, Table, Input, Form, TreeSelect, Select, Button, Pagination, Spin } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './index.less';
import CommonFilter from '@/components/CommonFilter';
import { uniqueArray } from '@/utils/formatData';

const { TreeNode } = TreeSelect;

@connect(({ approveDetail, loading }) => ({
  approveDetail,
  loading: loading.effects['approveDetail/qryZqythUser'],
  selectLoading: loading.effects['approveDetail/qryZqythRoles'],
}))
class RuleChoose extends React.Component {
  columns = [
    {
      title: formatMessage({ id: 'approve.detail.name' }), // '人员名字',
      dataIndex: 'staffName',
      key: 'staffName',
    },
    {
      title: formatMessage({ id: 'approve.detail.org' }), // '组织',
      dataIndex: 'orgName',
      key: 'orgName',
    },
    {
      title: formatMessage({ id: 'approve.detail.role' }), // '角色',
      dataIndex: 'sysRoleName',
      key: 'sysRoleName',
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      orgTree: [], // 区域树
      roles: [], // 角色列表
      list: [], // 人员列表
      selectedRows: props.selectedRows || [], // 确定选中的当前人员列表
      currentSelectedRow: [], // 当前人员列表中勾选的
      currentRemoveSelectedRow: [], // 确定选中的人员列表中勾选的（可移除）
      // 分页信息
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
      },
      total: 0, // 数据总量
      // 审核角色下拉框分页
      selectPageInfo: {
        pageNum: 1,
        pageSize: 10,
      },
      // 总数
      selectTotal: 0,
    };
  }

  componentDidMount() {
    this.qryZqythRoles();
    this.qryZqythUser();
    // this.qryRegions();
  }

  // 查询区域
  qryRegions = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'approveDetail/qryRegions',
      payload: {
        parRegionId: '',
      },
      success: svcCont => {
        const { data } = svcCont;
        this.setState({
          orgTree: data.map(v => ({ ...v, isLeaf: false })),
        });
      },
    });
  };

  // 获取角色
  qryZqythRoles = (sysRoleName = '') => {
    const { dispatch } = this.props;
    const { selectPageInfo } = this.state;
    dispatch({
      type: 'approveDetail/qryZqythRoles',
      payload: {
        sysRoleName,
        pageInfo: selectPageInfo,
      },
      success: svcCont => {
        const {
          data,
          pageInfo: { total, pageNum, pageSize },
        } = svcCont;
        this.setState({
          roles: data,
          selectTotal: total,
          selectPageInfo: {
            pageNum,
            pageSize,
          },
        });
      },
    });
  };

  // 获取账号
  qryZqythUser = () => {
    const { dispatch, form } = this.props;
    const { pageInfo } = this.state;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const { regionIds } = this.state;
      dispatch({
        type: 'approveDetail/qryZqythUser',
        payload: {
          ...values,
          regionIds,
          statusCd: '1000',
          pageInfo,
        },
        success: svcCont => {
          const {
            data,
            pageInfo: { total },
          } = svcCont;
          this.setState({
            list: data.map(item => ({
              mid: `${item.orgId}${item.sysRoleId}${item.sysUserId}`,
              ...item,
            })),
            total,
          });
        },
      });
    });
  };

  // 树选择内容
  loop = data => {
    return data.map(item => {
      if (item.children && item.children.length) {
        return (
          <TreeNode
            key={item.id}
            value={item.id}
            title={item.regionName}
            dataRef={item}
            isLeaf={item.isLeaf}
          >
            {this.loop(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          key={item.id}
          value={item.id}
          title={item.regionName}
          isLeaf={item.isLeaf}
          dataRef={item}
        />
      );
    });
  };

  // 异步加载树数据
  loadData = node =>
    new Promise(resolve => {
      const { dispatch } = this.props;
      const { orgTree } = this.state;
      const { props } = node;
      const { eventKey = '', dataRef } = props;
      dispatch({
        type: 'approveDetail/qryRegions',
        payload: {
          parRegionId: eventKey,
        },
        success: svcCont => {
          const { data } = svcCont;
          if (data && data.length) {
            dataRef.children = data.map(v => ({ ...v, isLeaf: false }));
          } else {
            dataRef.isLeaf = true;
          }
          this.setState({
            orgTree: [...orgTree],
          });
          resolve();
        },
      });
    });

  // 重置搜索条件
  resetForm = () => {
    const { form } = this.props;
    form.resetFields();
  };

  // 确认选择
  addSelected = () => {
    const { selectedRows, currentSelectedRow } = this.state;
    this.setState({
      selectedRows: uniqueArray([...currentSelectedRow, ...selectedRows], 'mid'),
    });
  };

  // 确认移除
  removeSelect = () => {
    const { selectedRows, currentRemoveSelectedRow } = this.state;
    this.setState({
      selectedRows: selectedRows.filter(item => currentRemoveSelectedRow.indexOf(item) === -1),
    });
  };

  /**
   * 更改分页信息
   * @param pageNum {number} 页面
   * @param pageSize {number} 一页条数
   */
  changePageInfo = (pageNum, pageSize) => {
    this.setState(
      {
        pageInfo: {
          pageNum,
          pageSize,
        },
      },
      this.qryZqythUser,
    );
  };

  // 更改下拉框分页
  selectChangePageInfo = (pageNum, pageSize) => {
    this.setState(
      {
        selectPageInfo: {
          pageNum,
          pageSize,
        },
      },
      this.qryZqythRoles,
    );
  };

  // 提交
  handleSubmit = () => {
    const { onOk } = this.props;
    const { selectedRows } = this.state;
    onOk(selectedRows);
  };

  render() {
    const { onCancel, loading, form, selectLoading } = this.props;
    const { getFieldDecorator } = form;
    const {
      orgTree,
      roles,
      list,
      selectedRows,
      pageInfo,
      total,
      selectPageInfo: { pageNum, pageSize },
      selectTotal,
    } = this.state;

    // 下拉框分页
    const pagination = {
      pageSize,
      simple: true,
      current: pageNum,
      total: selectTotal,
      onChange: this.selectChangePageInfo,
    };

    const rowSelection = {
      onChange: (selectedRowKeys, rselectedRows) => {
        this.setState({ currentSelectedRow: rselectedRows });
      },
    };

    const selectedRowSelection = {
      onChange: (selectedRowKeys, rselectedRows) => {
        this.setState({ currentRemoveSelectedRow: rselectedRows });
      },
    };

    return (
      <Modal
        title={formatMessage({ id: 'approve.detail.chooseApproveTitle' })}
        visible
        width={960}
        onOk={this.handleSubmit}
        onCancel={onCancel}
        okText={formatMessage({ id: 'common.btn.submit' })}
        cancelText={formatMessage({ id: 'common.btn.back' })}
        className={styles.userChooseWrapper}
      >
        <div className={styles.chooseWrapper}>
          <CommonFilter span={8} handleSubmit={this.qryZqythUser} handleReset={this.resetForm}>
            <Form.Item label={formatMessage({ id: 'approve.detail.approveOrg' })}>
              {getFieldDecorator('orgIds')(
                <TreeSelect
                  size="small"
                  multiple
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  allowClear
                  loadData={this.loadData}
                >
                  {this.loop(orgTree)}
                </TreeSelect>,
              )}
            </Form.Item>
            <Form.Item label={formatMessage({ id: 'approve.detail.approveRole' })}>
              {getFieldDecorator('sysRoleId', { initialValue: '' })(
                <Select
                  allowClear
                  loading={!!selectLoading}
                  size="small"
                  showSearch
                  onSearch={debounce(this.qryZqythRoles, 1500)}
                  dropdownRender={menu => (
                    <div
                      onMouseDown={e => {
                        // 防止点击了扩展菜单导致下拉框关闭
                        e.preventDefault();
                      }}
                    >
                      <Spin spinning={!!selectLoading}>{menu}</Spin>
                      <div style={{ padding: '5px 12px' }}>
                        <Pagination {...pagination} />
                      </div>
                    </div>
                  )}
                >
                  {roles.map(item => (
                    <Select.Option key={item.sysRoleId}>{item.sysRoleName}</Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
            <Form.Item label={formatMessage({ id: 'approve.detail.name' })}>
              {getFieldDecorator('name', { initialValue: '' })(
                <Input size="small" placeholder={formatMessage({ id: 'common.form.input' })} />,
              )}
            </Form.Item>
          </CommonFilter>
          <Table
            rowKey="mid"
            dataSource={list}
            columns={this.columns}
            loading={loading}
            rowSelection={rowSelection}
            pagination={{
              current: pageInfo.pageNum,
              pageSize: pageInfo.pageSize,
              total,
              showSizeChanger: true,
              onChange: this.changePageInfo,
              onShowSizeChange: this.changePageInfo,
              size: 'small',
              pageSizeOptions: ['5', '10', '20', '30', '40'],
              showTotal: () => (
                <Button size="small" type="primary" onClick={this.addSelected}>
                  确认
                </Button>
              ),
            }}
          />
          <p className={styles.title}>{formatMessage({ id: 'approve.detail.choosedApprove' })}</p>
          <Table
            rowKey="mid"
            dataSource={selectedRows}
            columns={this.columns}
            rowSelection={selectedRowSelection}
            pagination={{
              size: 'small',
              pageSizeOptions: ['5', '10', '20', '30', '40'],
              showTotal: () => (
                <Button size="small" type="primary" onClick={this.removeSelect}>
                  移除
                </Button>
              ),
            }}
          />
        </div>
      </Modal>
    );
  }
}

export default Form.create()(RuleChoose);
