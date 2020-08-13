import React, { Component } from 'react';
import {
  Card,
  Icon,
  List,
  Form,
  Pagination,
  Row,
  Col,
  Divider,
  Tooltip,
  Badge,
  Popconfirm,
} from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import Iconfont from '@/components/Iconfont';
import ChildRuleList from './ChildRuleList';
import NewRulesModal from './NewRuleModal';
import NewChildRuleModal from './NewChildRuleModal';
import TopRightHeader from './TopRightHeader';
import styles from './index.less';

@connect(({ rulesManage, loading }) => ({
  ruleListsSource: rulesManage.ruleListsSource,
  showRuleModal: rulesManage.showRuleModal,
  showChildRuleModal: rulesManage.showChildRuleModal,
  childRuleSource: rulesManage.childRuleSource,
  visitedListItem: rulesManage.visitedListItem,
  currentPage: rulesManage.currentPage,
  currentPageSize: rulesManage.currentPageSize,
  ruleListTotal: rulesManage.ruleListTotal,
  visitedListItemId: rulesManage.visitedListItemId,
  searchValue: rulesManage.searchValue,
  childRuleListCurPage: rulesManage.childRuleListCurPage,
  childRuleListCurPageSize: rulesManage.childRuleListCurPageSize,
  loading,
}))
@Form.create()
class RuleInfoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      advancedFilterShow: false, // 高级筛选
    };
  }

  componentDidMount() {
    const { currentPage, currentPageSize } = this.props;
    this.getRuleListSource(currentPage, currentPageSize);
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rulesManage/changeSearchValue',
      payload: '',
    });
    dispatch({
      type: 'rulesManage/changeVisitedListItemId',
      payload: null,
    });
  }

  // 规则列表获取数据
  getRuleListSource = (currentPage, currentPageSize, groupName = '', state = '') => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rulesManage/getRuleLists',
      payload: {
        groupName,
        state,
        pageInfo: {
          pageNum: currentPage,
          pageSize: currentPageSize,
        },
      },
    });
  };

  // 打开新增规则组弹窗并修改操作方式
  showNewRulesModal = opera => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rulesManage/showNewRulesModal',
      payload: opera,
    });
  };

  // 删除规则组
  deleteGroup = async val => {
    const { dispatch, currentPage, currentPageSize } = this.props;
    await dispatch({
      type: 'rulesManage/delMccRulesGroup',
      payload: {
        groupId: val,
      },
    });
    // 重新获取最新数据
    await this.getRuleListSource(currentPage, currentPageSize);
  };

  // 页码改变
  pageChange = async page => {
    const { dispatch, currentPageSize, searchValue } = this.props;
    // 修改页码
    await dispatch({
      type: 'rulesManage/changeCurrentPage',
      payload: page,
    });
    // 重新获取数据
    await this.getRuleListSource(page, currentPageSize, searchValue);
  };

  // 改变每页显示数据条数
  pageSizeChange = (_, size) => {
    const { dispatch, currentPage, searchValue } = this.props;
    // 修改每页显示页数
    dispatch({
      type: 'rulesManage/changeCurrentPageSize',
      payload: size,
    });
    // 重新获取数据
    this.getRuleListSource(currentPage, size, searchValue);
  };

  // 页码改变
  childPageChange = async page => {
    const { dispatch, childRuleListCurPageSize } = this.props;
    // 修改页码
    await dispatch({
      type: 'rulesManage/changeChildRuleListCurPage',
      payload: page,
    });
    // 重新获取数据
    await this.getChildRuleSource(page, childRuleListCurPageSize);
  };

  // 改变每页显示数据条数
  childPageSizeChange = (_, size) => {
    const { dispatch, childRuleListCurPage } = this.props;
    // 修改每页显示页数
    dispatch({
      type: 'rulesManage/changeChildRuleListCurPageSize',
      payload: size,
    });
    // 重新获取数据
    this.getChildRuleSource(childRuleListCurPage, size);
  };

  // 保存当前点击项
  saveCurrentItem = (item = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rulesManage/saveCurrentRuleList',
      payload: item,
    });
  };

  // 子规则列表展示
  ViewChildRule = async item => {
    await this.saveCurrentItem(item);
    const {
      dispatch,
      visitedListItemId,
      // childRuleListCurPage,
      childRuleListCurPageSize,
    } = this.props;
    // 如果当前点击项和保存的索引值相同则关闭,不同则显示
    let { groupId } = item;
    if (groupId === visitedListItemId) {
      groupId = null;
      // 把子列表数据清空，否则会有一个延迟画面
      dispatch({
        type: 'rulesManage/delCurrentChildList',
      });
    }
    await dispatch({
      type: 'rulesManage/changeVisitedListItemId',
      payload: groupId,
    });
    if (groupId !== null) {
      // 获取子规则列表数据
      this.getChildRuleSource(1, childRuleListCurPageSize);
    }
  };

  // 获取子规则列表数据
  getChildRuleSource = (page, pageSize) => {
    const { dispatch, visitedListItemId } = this.props;
    // 进行数据获取(还没缓存)
    dispatch({
      type: 'rulesManage/getChildRuleSource',
      payload: {
        groupId: visitedListItemId,
        pageInfo: {
          pageNum: page,
          pageSize,
        },
      },
    });
  };

  // 查看规则
  checkRuleGroup = item => {
    this.showNewRulesModal('check');
    this.saveCurrentItem(item);
  };

  // 编辑规则组列表
  editRuleGroup = item => {
    this.showNewRulesModal('edit');
    this.saveCurrentItem(item);
  };

  // 处理状态
  handleState = state => {
    if (state === '01') {
      return {
        icon: 'success',
        text: formatMessage({ id: 'rulesManage.rulesInfo.effective' }, '有效'),
      };
    }
    if (state === '02') {
      return {
        icon: 'Error',
        text: formatMessage({ id: 'rulesManage.rulesInfo.invalid' }, '无效'),
      };
    }
    return {
      icon: 'default',
      text: formatMessage({ id: 'rulesManage.rulesInfo.unknownState' }, '未知状态'),
    };
  };

  render() {
    const { advancedFilterShow } = this.state;

    const {
      ruleListsSource,
      showRuleModal,
      showChildRuleModal,
      ruleListTotal,
      visitedListItemId,
      childRuleSource,
      currentPage,
      loading,
    } = this.props;
    return (
      <div className={styles.ruleInfoList}>
        <Card
          title={formatMessage({ id: 'rulesManage.rulesInfo.rulesList' }, '规则组列表')}
          extra={
            <TopRightHeader
              type="rule"
              title={formatMessage({ id: 'rulesManage.rulesInfo.newRules' }, '新增规则组')}
              advancedFilterShow={advancedFilterShow}
              showNewRulesModal={this.showNewRulesModal}
              getRuleListSource={this.getRuleListSource}
            />
          }
        >
          <List
            itemLayout="horizontal"
            dataSource={ruleListsSource}
            loading={loading.effects['rulesManage/getRuleLists']}
            renderItem={(item, index) => (
              <List.Item>
                <Row className={styles.listRowStyle}>
                  <Col
                    className={styles.listColStyle}
                    span={24}
                    style={{
                      marginBottom: visitedListItemId === item.id ? 10 : 0,
                    }}
                  >
                    <Col span={10}>
                      <List.Item.Meta
                        className={styles.leftWrapper}
                        avatar={
                          <div className={styles.leftImg}>
                            <Iconfont type="iconhuodong" />
                          </div>
                        }
                        title={
                          <Tooltip placement="topLeft" title={item.groupName}>
                            <a
                              className={styles.rulesName}
                              onClick={() => {
                                this.checkRuleGroup(item);
                              }}
                            >
                              {item.groupName}
                            </a>
                          </Tooltip>
                        }
                        description={
                          <Tooltip placement="topLeft" title={item.groupDesc}>
                            <div className={styles.lightColor}>
                              {formatMessage(
                                {
                                  id: 'rulesManage.rulesInfo.desc',
                                },
                                '描述',
                              ).concat(item.groupDesc)}
                            </div>
                          </Tooltip>
                        }
                      />
                    </Col>
                    <Col span={3}>
                      <List.Item.Meta
                        title={formatMessage({ id: 'rulesManage.rulesInfo.modifier' }, '修改人')}
                        description={
                          <Tooltip placement="topLeft" title={item.updatePersonName}>
                            <div className={styles.deepColor}>{item.updatePersonName}</div>
                          </Tooltip>
                        }
                      />
                    </Col>
                    <Col span={4}>
                      <List.Item.Meta
                        title={formatMessage(
                          { id: 'rulesManage.rulesInfo.modifiTime' },
                          '修改时间',
                        )}
                        description={
                          <Tooltip placement="topLeft" title={item.updateTime}>
                            <div className={styles.deepColor}>{item.updateTime}</div>
                          </Tooltip>
                        }
                      />
                    </Col>
                    <Col span={3}>
                      <List.Item.Meta
                        title={formatMessage(
                          { id: 'rulesManage.rulesInfo.rulesState' },
                          '规则组状态',
                        )}
                        description={
                          <Badge
                            status={this.handleState(item.state).icon}
                            text={this.handleState(item.state).text}
                          />
                        }
                      />
                    </Col>
                    <Col span={4}>
                      <a
                        onClick={() => {
                          this.ViewChildRule(item, index);
                        }}
                        className={styles.cursorPointer}
                      >
                        {formatMessage({ id: 'rulesManage.rulesInfo.viewRule' }, '查看规则')}&nbsp;
                        <Icon type={item.id === visitedListItemId ? 'up' : 'down'} />
                      </a>
                      <Divider type="vertical" />
                      <a
                        onClick={() => {
                          this.editRuleGroup(item);
                        }}
                        className={styles.listItemAction}
                      >
                        {formatMessage(
                          {
                            id: 'rulesManage.rulesInfo.edit',
                          },
                          '编辑',
                        )}
                      </a>
                      <Divider type="vertical" />
                      <Popconfirm
                        title={formatMessage(
                          { id: 'rulesManage.rulesInfo.isConfirmDel' },
                          '是否确定删除?',
                        )}
                        okText={formatMessage({ id: 'rulesManage.rulesInfo.yes' }, '确定')}
                        cancelText={formatMessage({ id: 'rulesManage.rulesInfo.no' }, '取消')}
                        onConfirm={() => this.deleteGroup(item.groupId)}
                      >
                        <a className={styles.cursorPointer}>
                          {formatMessage(
                            {
                              id: 'rulesManage.rulesInfo.del',
                            },
                            '删除',
                          )}
                        </a>
                      </Popconfirm>
                    </Col>
                  </Col>
                  <Col span={24}>
                    {visitedListItemId === item.id ? (
                      <ChildRuleList
                        childRuleSource={childRuleSource}
                        getChildRuleSource={this.getChildRuleSource}
                        childPageChange={this.childPageChange}
                        childPageSizeChange={this.childPageSizeChange}
                      />
                    ) : (
                      ''
                    )}
                  </Col>
                </Row>
              </List.Item>
            )}
          />
          <Pagination
            showQuickJumper
            showSizeChanger
            defaultCurrent={1}
            defaultPageSize={10}
            current={currentPage}
            total={ruleListTotal}
            style={{ float: 'right' }}
            className={styles.ruleInfoPagination}
            onChange={this.pageChange}
            onShowSizeChange={this.pageSizeChange}
            pageSizeOptions={['5', '10', '20', '30', '40']}
          />
        </Card>
        {showRuleModal ? <NewRulesModal getRuleListSource={this.getRuleListSource} /> : null}
        {showChildRuleModal ? (
          <NewChildRuleModal getChildRuleSource={this.getChildRuleSource} />
        ) : null}
      </div>
    );
  }
}

export default RuleInfoList;
