import React, { Component } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import { Modal, List, Table, Input, Pagination, Button, Tooltip } from 'antd';
import styles from './index.less';
const { Search } = Input;

@connect(({ rulesManage, recoRuleManage, loading }) => ({
  recoListItem: rulesManage.recoListItem, // 列表中选中的项
  showRecoList: rulesManage.showRecoList,
  recoListCurrentPage: rulesManage.recoListCurrentPage,
  recoListCurrentPageSize: rulesManage.recoListCurrentPageSize,
  recoRuleSource: recoRuleManage.recoRuleSource,
  ruleListTotal: recoRuleManage.ruleListTotal,
  recoListModalSearchValue: rulesManage.recoListModalSearchValue,
  loading,
}))
class RecoListModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
    };
  }

  componentDidMount() {
    const { recoListCurrentPage, recoListCurrentPageSize } = this.props;
    this.getRecoList(recoListCurrentPage, recoListCurrentPageSize);
  }

  componentWillUnmount() {
    // 清除当前选中页数
    const { dispatch } = this.props;
    dispatch({
      type: 'rulesManage/changeRecoListCurPage',
      payload: 1,
    });
    dispatch({
      type: 'rulesManage/changeRecoListCurPageSize',
      payload: 5,
    });
  }

  // 页码改变
  pageChange = async page => {
    const { dispatch, recoListCurrentPageSize,recoListModalSearchValue } = this.props;
    // 修改页码
    dispatch({
      type: 'rulesManage/changeRecoListCurPage',
      payload: page,
    });
    // 重新获取数据
    await this.getRecoList(page, recoListCurrentPageSize,recoListModalSearchValue);
  };

  // 改变每页显示数据条数
  pageSizeChange = async (_, size) => {
    const { dispatch, recoListCurrentPage,recoListModalSearchValue } = this.props;
    // 修改每页显示页数
    dispatch({
      type: 'rulesManage/changeRecoListCurPageSize',
      payload: size,
    });
    // 重新获取数据
    await this.getRecoList(recoListCurrentPage, size,recoListModalSearchValue);
  };

  // 保存当前点击项
  saveCurrentItem = item => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rulesManage/changeRecoListItem',
      payload: item,
    });
  };

  // 点击radio按钮触发事件
  onSelectedRowKeysChange = (selectedRowKeys, selectedRows) => {
    this.saveCurrentItem(selectedRows[0]);
    this.setState({ selectedRowKeys });
  };

  // 商品搜索
  searchValue = value => {
    const { recoListCurrentPageSize, dispatch } = this.props;
    dispatch({
      type: 'rulesManage/changeRecoListModalSearchValue',
      payload: value,
    });
    this.getRecoList(1, recoListCurrentPageSize, value);
    dispatch({
      type: 'rulesManage/changeRecoListCurPage',
      payload: 1,
    });
  };

  // 获取推荐规则列表数据
  getRecoList = (pageNum, pageSize, rulesName = '', state = '00A', rulesType = '') => {
    const { dispatch } = this.props;
    dispatch({
      type: 'recoRuleManage/getRecommendRuleSource',
      payload: {
        state,
        rulesName,
        rulesType,
        pageInfo: {
          pageNum,
          pageSize,
        },
      },
    });
  };

  render() {
    const {
      loading,
      showRecoList,
      recoRuleSource,
      chooseRecoItem,
      hiddenRecoList,
      ruleListTotal,
      recoListCurrentPage
    } = this.props;
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      type: 'radio',
      selectedRowKeys,
      onChange: this.onSelectedRowKeysChange,
    };
    const columns = [
      {
        title: formatMessage({ id: 'rulesManage.rulesInfo.ruleName' }, '规则名称'),
        dataIndex: 'rulesName',
        key: 'rulesName',
        render: text => (
          <Tooltip placement="topLeft" title={text}>
            <a>{text}</a>
          </Tooltip>
        ),
      },
      {
        title: formatMessage({ id: 'rulesManage.rulesInfo.ruleDesc' }, '规则简述'),
        dataIndex: 'rulesDesc',
        key: 'rulesDesc',
        render: text => (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ),
      },
      {
        title: formatMessage({ id: 'rulesManage.rulesInfo.ruleType' }, '规则类型'),
        dataIndex: 'rulesTypeName',
        key: 'rulesTypeName',
        render: text => (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ),
      },
    ];
    return (
      <Modal
        title={formatMessage({ id: 'rulesManage.rulesInfo.chooseGood' }, '选择商品')}
        centered
        visible={showRecoList}
        className={styles.recoRuleModal}
        onCancel={hiddenRecoList}
        footer={[
          <Button size="small" key="submit" type="primary" onClick={chooseRecoItem}>
            {formatMessage({ id: 'rulesManage.rulesInfo.choose' }, '选择')}
          </Button>,
          <Button size="small" key="back" onClick={hiddenRecoList}>
            {formatMessage({ id: 'rulesManage.rulesInfo.back' }, '返回')}
          </Button>,
        ]}
      >
        <List
          header={
            <div className={styles.recoListHead}>
              <span className={styles.recoListHeadTitle}>
                {formatMessage({ id: 'rulesManage.rulesInfo.goodLists' }, '产品列表')}
              </span>
              <Search
                onSearch={this.searchValue}
                placeholder={formatMessage(
                  { id: 'rulesManage.rulesInfo.pleEnterRuleName' },
                  '请输入规则名称',
                )}
              />
            </div>
          }
        >
          <Table
            loading={loading.effects['recoRuleManage/getRecommendRuleSource']}
            rowKey={record => record.id}
            pagination={false}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={recoRuleSource}
          />
          <Pagination
            size="small"
            showQuickJumper
            showSizeChanger
            defaultCurrent={1}
            defaultPageSize={5}
            current={recoListCurrentPage}
            total={ruleListTotal}
            className={styles.ruleInfoPagination}
            onChange={this.pageChange}
            onShowSizeChange={this.pageSizeChange}
            pageSizeOptions={['5', '10', '20', '30', '40']}
          />
        </List>
      </Modal>
    );
  }
}

export default RecoListModal;
