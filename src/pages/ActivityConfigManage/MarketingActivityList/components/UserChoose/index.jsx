/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
// 审核人员选择弹窗
import React from 'react';
import { debounce } from 'lodash';
import { connect } from 'dva';
import {
  Modal,
  Table,
  Input,
  Form,
  TreeSelect,
  Select,
  Button,
  Pagination,
  Spin,
  List,
  Row,
  Col,
  Radio,
} from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './index.less';
import CommonFilter from '@/components/CommonFilter';
import { uniqueArray } from '@/utils/formatData';

const { TreeNode } = TreeSelect;

@connect(({ approveDetail, loading, user }) => ({
  user: user.orgInfo && user.orgInfo.orgInfo,
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
        pageSize: 10,
      },
      total: 0, // 数据总量
      // 审核角色下拉框分页
      selectPageInfo: {
        pageNum: 1,
        pageSize: 10,
      },
      // 总数
      selectTotal: 0,
      personnelId: '',
    };
  }

  componentDidMount() {
    this.qryZqythUser();
    // this.qryRegions();
  }

  // 查询区域
  qryRegions = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'MarketingActivityListApproveDetail/qryRegions',
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

  // 选择人员
  onChange = e => {
    this.setState({
      personnelId: e.target.value,
    });
  };

  // 获取账号
  qryZqythUser = () => {
    const {
      dispatch,
      form,
      user: { regionId },
    } = this.props;
    const { pageInfo } = this.state;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      const { commonRegionIds, staffName } = values;
      console.log(values);
      dispatch({
        type: 'MarketingActivityListApproveDetail/qryHandoverUserList',
        payload: {
          staffName,
          commonRegionIds: commonRegionIds === undefined ? [String(regionId)] : commonRegionIds,
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
        type: 'MarketingActivityListApproveDetail/qryRegions',
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
    const { personnelId } = this.state;
    onOk(personnelId);
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
        title="选择交接人员"
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
            <Form.Item label="交接区域">
              {getFieldDecorator('commonRegionIds')(
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

            <Form.Item label={formatMessage({ id: 'approve.detail.name' })}>
              {getFieldDecorator('staffName', { initialValue: '' })(
                <Input size="small" placeholder={formatMessage({ id: 'common.form.input' })} />,
              )}
            </Form.Item>
          </CommonFilter>

          {/* <Table
            rowKey="mid"
            dataSource={list}
            columns={this.columns}
            loading={loading}
            rowSelection={rowSelection}
            pagination={false}
          /> */}
          <Radio.Group onChange={this.onChange}>
            <List
              style={{ width: 900, marginBottom: 10 }}
              size="small"
              header={
                <Row gutter={24}>
                  <Col span={12}>名字</Col>
                  <Col span={12}>组织</Col>
                </Row>
              }
              bordered
              dataSource={list}
              renderItem={item => (
                <List.Item>
                  <Row gutter={24} style={{ width: '100%' }}>
                    <Col span={2}>
                      <Radio value={item} onChange={this.onChange} />
                    </Col>
                    <Col span={11}>{item.staffName}</Col>
                    <Col span={11}>{item.regionName}</Col>
                  </Row>
                </List.Item>
              )}
            />
          </Radio.Group>
          <Pagination
            current={pageInfo.pageNum}
            pageSize={pageInfo.pageSize}
            size="small"
            showSizeChanger
            pageSizeOptions={['5', '10', '20', '30', '40']}
            total={total}
            onChange={this.changePageInfo}
            onShowSizeChange={this.changePageInfo}
          />
          {/* <p className={styles.title}>{formatMessage({ id: 'approve.detail.choosedApprove' })}</p>
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
          /> */}
        </div>
      </Modal>
    );
  }
}

export default Form.create()(RuleChoose);
