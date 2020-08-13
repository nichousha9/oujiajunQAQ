import React, { Component } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Modal, Table, Button, List, Input, message, Tooltip } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
const { Search } = Input;

@connect(({ recoRuleManage, loading }) => ({
  loading,
  showMemberModal: recoRuleManage.showMemberModal,
  memberListData: recoRuleManage.memberListData,
  recoRuleFavorList: recoRuleManage.recoRuleFavorList,
  selectedMemberItem: recoRuleManage.selectedMemberItem,
  memberListDataCurPage: recoRuleManage.memberListDataCurPage,
  memberListDataCurPageSize: recoRuleManage.memberListDataCurPageSize,
  memberListDataTotal: recoRuleManage.memberListDataTotal,
  newModalType: recoRuleManage.newModalType,
  selectedGoodItem: recoRuleManage.selectedGoodItem,
  memberModalSearchValue: recoRuleManage.memberModalSearchValue,
}))
class MemberModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ifCanSubmit: true, // 是否可以提交，依据是否有重复的会员项
      selectedRowKeys: [],
    };
  }

  componentDidMount() {
    const { memberListDataCurPage, memberListDataCurPageSize } = this.props;
    this.getMemberData(memberListDataCurPage, memberListDataCurPageSize);
    const { dispatch } = this.props;
    dispatch({
      type: 'recoRuleManage/saveCurrentSelectedMemberItem',
      payload: [],
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'recoRuleManage/changeChooseMemberCurPage',
      payload: 1,
    });
    dispatch({
      type: 'recoRuleManage/changeChooseGoodMemberPageSize',
      payload: 5,
    });
  }

  // 页码改变
  pageChange = async page => {
    const { dispatch, memberListDataCurPageSize, memberModalSearchValue } = this.props;
    // 修改页码
    dispatch({
      type: 'recoRuleManage/changeChooseMemberCurPage',
      payload: page,
    });
    // 重新获取数据
    this.getMemberData(page, memberListDataCurPageSize, memberModalSearchValue);
  };

  // 改变每页显示数据条数
  pageSizeChange = async (_, size) => {
    const { dispatch, memberListDataCurPage, memberModalSearchValue } = this.props;
    // 修改每页显示页数
    dispatch({
      type: 'recoRuleManage/changeChooseGoodMemberPageSize',
      payload: size,
    });
    // 重新获取数据
    this.getMemberData(memberListDataCurPage, size, memberModalSearchValue);
  };

  // 关闭会员选择弹窗
  hiddenMemberModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'recoRuleManage/hiddenMemberModal',
    });
  };

  // 检查当前会员是否已经选中
  checkCurMember = item => {
    const { recoRuleFavorList, formValue } = this.props;
    let result = false; // 当前项是否存在于会员列表
    const curMemberList = [];
    if (formValue.memberID) {
      for (let i = 0, len = recoRuleFavorList.length; i < len; i += 1) {
        // 把从列表中和当前商品选择项ID相同的所有会员ID放到数组中
        if (formValue.memberID == recoRuleFavorList[i].goodsObjectId) {
          curMemberList.push(Number(recoRuleFavorList[i].subsId));
        }
      }
      if (curMemberList.includes(Number(item.subsId))) {
        result = true;
      }
    }
    return result;
  };

  // 保存当前点击的会员项
  saveCurrentItem = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'recoRuleManage/saveCurrentSelectedMemberItem',
      payload: record,
    });
  };

  // 搜索框搜索
  searchValue = value => {
    const { memberListDataCurPageSize, dispatch } = this.props;
    dispatch({
      type: 'recoRuleManage/changeMemberModalSearchValue',
      payload: value,
    });
    this.getMemberData(1, memberListDataCurPageSize, value);
    dispatch({
      type: 'recoRuleManage/changeChooseMemberCurPage',
      payload: 1,
    });
  };

  // 获取会员列表信息
  getMemberData = (page, pageSize, accNbr = '') => {
    const { dispatch } = this.props;
    dispatch({
      type: 'recoRuleManage/getSubsBasicList',
      payload: {
        pageInfo: {
          pageNum: page,
          pageSize,
        },
        accNbr,
      },
    });
  };

  // 点击radio按钮触发事件
  onSelectedRowKeysChange = (selectedRowKeys, selectedRows) => {
    const showWarn = this.checkCurMember(selectedRows[0]);
    // 如果是已经存在了，那么就不能提交并且提示
    if (showWarn) {
      this.setState({
        ifCanSubmit: false,
      });
      message.warning('当前会员已存在，请重新选择');
    } else {
      this.setState({
        ifCanSubmit: true,
      });
    }
    this.saveCurrentItem(selectedRows[0]);
    this.setState({ selectedRowKeys });
  };

  render() {
    const columns = [
      {
        title: formatMessage({ id: 'rulesManage.recoRule.userID' }, '会员ID'),
        dataIndex: 'subsId',
        key: 'subsId',
        render: text => (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ),
      },
      {
        title: formatMessage({ id: 'rulesManage.recoRule.userName' }, '会员名称'),
        dataIndex: 'userName',
        key: 'userName',
        render: text => (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ),
      },
      {
        title: formatMessage({ id: 'rulesManage.recoRule.userNum' }, '会员号码'),
        dataIndex: 'accNbr',
        key: 'accNbr',
        render: text => (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ),
      },
    ];
    const {
      loading,
      showMemberModal,
      memberListData,
      submitMemberItem,
      memberListDataTotal,
      memberListDataCurPage
    } = this.props;
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      type: 'radio',
      selectedRowKeys,
      onChange: this.onSelectedRowKeysChange,
    };
    const { ifCanSubmit } = this.state;
    return (
      <Modal
        title={formatMessage({ id: 'rulesManage.recoRule.chooseMember' }, '会员选择')}
        onCancel={this.hiddenMemberModal}
        visible={showMemberModal}
        className={styles.memberModal}
        footer={[
          <Button
            size="small"
            disabled={!ifCanSubmit}
            key="submit"
            type="primary"
            onClick={submitMemberItem}
          >
            {formatMessage({ id: 'rulesManage.recoRule.submit' }, '提交')}
          </Button>,
          <Button size="small" key="back" onClick={this.hiddenMemberModal}>
            {formatMessage({ id: 'rulesManage.recoRule.back' }, '返回')}
          </Button>,
        ]}
      >
        <List
          header={
            <div className={styles.recoListHead}>
              <span className={styles.recoListHeadTitle}>
                {formatMessage({ id: 'rulesManage.recoRule.userList' }, '会员列表')}
              </span>
              <Search
                onSearch={this.searchValue}
                placeholder={formatMessage(
                  { id: 'rulesManage.recoRule.enterPhone' },
                  '请输入手机号码',
                )}
              />
            </div>
          }
        >
          <Table
            loading={loading.effects['recoRuleManage/getSubsBasicList']}
            bordered={false}
            rowKey={record => record.subsId}
            dataSource={memberListData}
            rowSelection={rowSelection}
            columns={columns}
            pagination={{
              current: memberListDataCurPage,
              size: 'small',
              onChange: this.pageChange,
              onShowSizeChange: this.pageSizeChange,
              total: memberListDataTotal,
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '20', '30', '40'],
              defaultCurrent: 1,
              defaultPageSize: 5,
            }}
          />
        </List>
      </Modal>
    );
  }
}

export default MemberModal;
