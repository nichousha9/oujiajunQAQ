import React, { useState } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Card, Input, Table, Icon, Select, Button, Divider, Form, Col, Row } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
const { Search } = Input;
const { Option } = Select;
const FormItem = Form.Item;
const stateToProps = ({ loading }) => ({
  loading,
});
function ApprovalManage(props) {
  const {
    form: { getFieldDecorator },
  } = props;
  // const { loading } = props;
  const [advancedFilterShow, setAdvancedFilterShow] = useState('none'); // 高级筛选展示与否

  const columns = [
    {
      title: '角色ID',
      dataIndex: 'userID',
      key: 'userID',
      render: text => <a>{text}</a>,
    },
    {
      title: '角色名称',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '默认步骤',
      dataIndex: 'defaultStep',
      key: 'defaultStep',
    },
    {
      title: '默认审批人',
      dataIndex: 'defaultApprover',
      key: 'defaultApprover',
    },
    {
      title: '审批人可否编辑',
      dataIndex: 'ifApproverCanEdit',
      key: 'ifApproverCanEdit',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a>Invite {record.name}</a>
          <Divider type="vertical" />
          <a>Delete</a>
        </span>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
  ];

  // 高级筛选展示与否
  function showAdvancedFilter() {
    if (advancedFilterShow === 'none') {
      setAdvancedFilterShow('block');
    } else {
      setAdvancedFilterShow('none');
    }
  }

  // 视图类型改变下拉框
  function handleChange() {}

  // 高级搜索
  const AdvancedSearch = (
    <Form layout="inline" className={styles.advancedWrapper}>
      <Row className={styles.rowWrapper}>
        <Col span={2}>
          <span>
            {formatMessage(
              {
                id: 'campaignMonitor.otherChoose',
              },
              '其他选项',
            ).concat(' : ')}
          </span>
        </Col>
        <Col span={22}>
          <FormItem
            label={formatMessage(
              { id: 'activityApproval.approvalTemplate.viewType' },
              '视图类型',
            )}
          >
            {getFieldDecorator('groupType')(
              <Select size="small" style={{ width: 100 }} onChange={handleChange}>
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="Yiminghe">yiminghe</Option>
              </Select>,
            )}
          </FormItem>
          <FormItem
            label={formatMessage(
              { id: 'activityApproval.approvalTemplate.objType' },
              '对象类型：',
            )}
          >
            {getFieldDecorator('groupType')(
              <Select size="small" style={{ width: 100 }} onChange={handleChange}>
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="Yiminghe">yiminghe</Option>
              </Select>,
            )}
          </FormItem>
          <FormItem
            label={formatMessage(
              { id: 'activityApproval.approvalTemplate.creater' },
              '创建人',
            )}
          >
            {getFieldDecorator('groupType')(
              <Select size="small" style={{ width: 100 }} onChange={handleChange}>
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="Yiminghe">yiminghe</Option>
              </Select>,
            )}
          </FormItem>

          <Button size="small" type="primary" className={styles.search}>
            搜索
          </Button>
          <Button size="small">重置</Button>
        </Col>
      </Row>
    </Form>
  );

  // 导航右侧菜单
  const topRightDiv = (
    <div>
      <Search
        className="filter-input"
        placeholder={formatMessage(
          { id: 'activityApproval.approvalTemplate.searchKeyWord' },
          '搜索关键词',
        )}
        size="small"
        // onSearch={value => saveSearchValue(value)}
      />
      <a className="dropdown-style" onClick={showAdvancedFilter}>
        {formatMessage({
          id: 'activityConfigManage.marketingActivityList.advancedFilter',
        })}
        {advancedFilterShow === 'none' ? <Icon type="down" /> : <Icon type="up" />}
      </a>
    </div>
  );

  return (
    <div className={styles.ApprovalManage}>
      <Card title="审核模板查询" extra={topRightDiv}>
        {advancedFilterShow === 'block' ? AdvancedSearch : null}
        <Table
          columns={columns}
          dataSource={data}
          rowKey={record => record.segmentid}
          pagination={false}
        />
      </Card>
    </div>
  );
}

export default Form.create()(connect(stateToProps)(ApprovalManage));
