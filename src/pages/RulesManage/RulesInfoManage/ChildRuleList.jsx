import React, { Component } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Table, Icon, Divider, Popconfirm, Tooltip, Pagination } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
const { Column } = Table;

@connect(({ rulesManage, loading }) => ({
  loading,
  visitedChildListItem: rulesManage.visitedChildListItem,
  childRuleListCurPage: rulesManage.childRuleListCurPage,
  childRuleListCurPageSize: rulesManage.childRuleListCurPageSize,
  childRuleListTotal: rulesManage.childRuleListTotal,
}))
class ChildRuleList extends Component {
  componentWillUnmount() {
    // 把当前页数还原
    const { dispatch } = this.props;
    dispatch({
      type: 'rulesManage/changeChildRuleListCurPage',
      payload: 1,
    });
    dispatch({
      type: 'rulesManage/changeChildRuleListCurPageSize',
      payload: 5,
    });
  }

  // 显示子规则弹窗
  showChildRuleModal = opera => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rulesManage/showChildRuleModal',
      payload: opera,
    });
  };

  // 新增子规则
  newChildRule = () => {
    this.showChildRuleModal('add');
  };

  // 编辑子规则
  editChildRule = async item => {
    await this.saveCurrentChildItem(item);
    this.showChildRuleModal('edit');
  };

  // 删除子规则
  deleteChildRule = async item => {
    await this.saveCurrentChildItem(item);
    const {
      dispatch,
      getChildRuleSource,
      visitedChildListItem,
      childRuleListCurPage,
      childRuleListCurPageSize,
    } = this.props;
    await dispatch({
      type: 'rulesManage/delMccRulesGroupRel',
      payload: {
        relId: visitedChildListItem.relId,
      },
    });
    await getChildRuleSource(childRuleListCurPage, childRuleListCurPageSize);
  };

  // 查看子规则详情
  getChildRuleInfo = async item => {
    await this.saveCurrentChildItem(item);
    this.showChildRuleModal('check');
  };

  // 保存当前点击项
  saveCurrentChildItem = (item = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rulesManage/saveCurrentChildRuleList',
      payload: item,
    });
  };

  // 处理返回数据
  handleRuleState = item => {
    if (item.isDefault == '01') {
      return '是';
    }
    return '否';
  };

  render() {
    const {
      childRuleSource,
      loading,
      childRuleListTotal,
      childRuleListCurPage,
      childPageChange,
      childPageSizeChange,
    } = this.props;
    return (
      <Table
        loading={loading.effects['rulesManage/getChildRuleSource']}
        rowKey={record => record.relId}
        className={styles.childRuleList}
        dataSource={childRuleSource}
        pagination={false}
        footer={() => (
          <div className={styles.childFooter}>
            <a
              onClick={() => {
                this.newChildRule();
              }}
              style={{ outline: 'none', cursor: 'pointer' }}
            >
              <Icon type="plus" style={{ marginRight: 8 }} />
              {formatMessage({ id: 'rulesManage.rulesInfo.new' }, '新增')}
            </a>
            <Pagination
              showQuickJumper
              showSizeChanger
              defaultCurrent={1}
              defaultPageSize={5}
              size="small"
              current={childRuleListCurPage}
              total={childRuleListTotal}
              style={{ float: 'right' }}
              className={styles.ruleInfoPagination}
              onChange={childPageChange}
              onShowSizeChange={childPageSizeChange}
              pageSizeOptions={['5', '10', '20', '30', '40']}
            />
          </div>
        )}
      >
        <Column
          title={formatMessage({ id: 'rulesManage.rulesInfo.recoRuleName' }, '推荐规则组名称')}
          dataIndex="rulesName"
          key="rulesName"
          render={(text, record) => (
            <Tooltip placement="topLeft" title={text}>
              <a onClick={() => this.getChildRuleInfo(record)}>{text}</a>
            </Tooltip>
          )}
        />
        <Column
          title={formatMessage({ id: 'rulesManage.rulesInfo.recoCount' }, '推荐个数')}
          dataIndex="rcmdNum"
          key="rcmdNum"
          render={text => (
            <Tooltip placement="topLeft" title={text}>
              {text}
            </Tooltip>
          )}
        />
        <Column
          title={formatMessage({ id: 'rulesManage.rulesInfo.ifDefault' }, '是否默认')}
          dataIndex="isDefault"
          key="isDefault"
          render={(_, record) => (
            <Tooltip placement="topLeft" title={this.handleRuleState(record)}>
              {this.handleRuleState(record)}
            </Tooltip>
          )}
        />
        <Column
          title={formatMessage({ id: 'rulesManage.rulesInfo.operation' }, '操作')}
          render={(text, record) => (
            <span>
              <a
                onClick={() => {
                  this.editChildRule(record);
                }}
              >
                {formatMessage({ id: 'rulesManage.rulesInfo.edit' }, '编辑')}
              </a>
              <Divider type="vertical" />
              <Popconfirm
                title={formatMessage({ id: 'rulesManage.rulesInfo.isConfirmDel' }, '是否确定删除?')}
                okText={formatMessage({ id: 'rulesManage.rulesInfo.yes' }, '确定?')}
                cancelText={formatMessage({ id: 'rulesManage.rulesInfo.no' }, '取消')}
                onConfirm={() => {
                  this.deleteChildRule(record);
                }}
              >
                <a>{formatMessage({ id: 'rulesManage.rulesInfo.del' }, '删除')}</a>
              </Popconfirm>
            </span>
          )}
        />
      </Table>
    );
  }
}

export default ChildRuleList;
