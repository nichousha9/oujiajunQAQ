/**
 * app节点 商品信息 添加推荐规则弹框 组件
 * props: {
 *  visible 是否可见
 *  onCancel 关闭弹框函数
 *  addRuleGroup 添加推荐规则组
 * }
 */
import React from 'react';
import { connect } from 'dva';
import { Modal, Table, Badge } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import commonStyles from '../../common.less';

const RULE_GROUP_STATUS = {
  '01': { icon: 'success', text: formatMessage({ id: 'activityConfigManage.contact.groupStatusSuccess' }) },
  '02': { icon: 'Error', text: formatMessage({ id: 'activityConfigManage.contact.groupStatusError' }) },
  '03': { icon: 'default', text: formatMessage({ id: 'activityConfigManage.contact.groupStatusUnknow' }) },
};

const columns = [
  {
    title: formatMessage({ id: 'activityConfigManage.contact.groupName' }),
    dataIndex: 'groupName',
    key: 'groupName',
  },
  {
    title: formatMessage({ id: 'activityConfigManage.contact.groupUpdatePerson' }),
    dataIndex: 'updatePersonName',
    key: 'updatePersonName',
  },
  {
    title: formatMessage({ id: 'activityConfigManage.contact.groupUpdateTime' }),
    dataIndex: 'updateTime',
    key: 'updateTime',
  },
  {
    title: formatMessage({ id: 'activityConfigManage.contact.groupState' }),
    dataIndex: 'state',
    key: 'state',
    render: value => {
      return RULE_GROUP_STATUS[value] ? (
        <Badge status={RULE_GROUP_STATUS[value].icon} text={RULE_GROUP_STATUS[value].text} />
      ) : null;
    },
  },
];

@connect(({ loading }) => ({
  loading: loading.effects['activityFlowContact/qryMccRulesGroupList'],
}))
class ModalRule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groupInfo: {
        list: [],
      },
      selectedRowKeys: [],
    };
    this.pageInfo = {
      pageSize: 5,
      pageNum: 1,
    };
    this.selectRuleGroup = {};
    this.handleTableChange = this.handleTableChange.bind(this);
  }

  componentDidMount() {
    this.qryMccRulesGroupList();
  }

  // 获取规则组列表
  qryMccRulesGroupList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activityFlowContact/qryMccRulesGroupList',
      payload: {
        pageInfo: { ...this.pageInfo },
      },
      success: res => {
        const list = (res && res.data) || [];
        const value = (list && list[0]) || {};
        this.setState({
          groupInfo: {
            list,
            pageSize: res.pageInfo.pageSize,
            total: res.pageInfo.total,
            pageNum: res.pageInfo.pageNum,
          },
          selectedRowKeys: `${value.groupId}` || [],
        });
        this.selectRuleGroup = { ...value } || {};
      },
    });
  };

  // 表格交互
  handleTableChange = pagination => {
    this.pageInfo.pageNum = pagination.current;
    this.pageInfo.pageSize = pagination.pageSize;
    this.qryMccRulesGroupList();
  };

  // 提交
  handleSubmit = () => {
    const { onCancel, addRuleGroup } = this.props;
    // 更新选中的分组
    addRuleGroup(this.selectRuleGroup);
    onCancel();
  };

  render() {
    const { visible, onCancel, loading } = this.props;
    const { groupInfo, selectedRowKeys } = this.state;

    const pagination = {
      total: groupInfo.total,
      pageSize: groupInfo.pageSize,
      current: groupInfo.pageNum,
      showQuickJumper: true,
      showSizeChanger: true,
    };

    // 切换选择
    const rowSelection = {
      onChange: (key, arr) => {
        const value = (arr && arr[0]) || {};
        this.setState({ selectedRowKeys: key });
        this.selectRuleGroup = { ...value };
      },
      type: 'radio',
      selectedRowKeys,
    };

    return (
      <Modal
        title={formatMessage({ id: 'activityConfigManage.contact.recommendGroupModalTitle' })}
        visible={visible}
        width={840}
        onCancel={onCancel}
        onOk={this.handleSubmit}
        okText={formatMessage({ id: 'common.btn.submit' })}
        cancelText={formatMessage({ id: 'common.btn.back' })}
        okButtonProps={{ size: 'small' }}
        cancelButtonProps={{ size: 'small' }}
        wrapClassName={commonStyles.flowModal}
      >
        <Table
          columns={columns}
          dataSource={groupInfo.list}
          rowKey={item => `${item.groupId}`}
          loading={loading}
          rowSelection={rowSelection}
          pagination={pagination}
          onChange={this.handleTableChange}
        />
      </Modal>
    );
  }
}

export default ModalRule;
