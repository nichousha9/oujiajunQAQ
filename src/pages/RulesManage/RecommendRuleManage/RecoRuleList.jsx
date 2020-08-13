import React, { Component } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Card, List, Form, Pagination, Row, Col, Tooltip, Divider, Badge, Popconfirm } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import RecoTopRightHeader from './RecoTopRightHeader';
import Iconfont from '@/components/Iconfont';
import styles from './index.less';

@connect(({ recoRuleManage, loading }) => ({
  loading,
  recoRuleSource: recoRuleManage.recoRuleSource,
  currentPage: recoRuleManage.currentPage,
  currentPageSize: recoRuleManage.currentPageSize,
  ruleListTotal: recoRuleManage.ruleListTotal,
  recoListType: recoRuleManage.recoListType,
  goodListSearchValue: recoRuleManage.goodListSearchValue,
}))
@Form.create()
class RecoRuleList extends Component {
  componentDidMount() {
    const { currentPageSize } = this.props;
    this.getRecoList(1, currentPageSize);
  }

  // 获取推荐规则列表数据
  getRecoList = (currentPage, currentPageSize, rulesName = '', state = '00A', rulesType = '') => {
    const { dispatch } = this.props;
    dispatch({
      type: 'recoRuleManage/getRecommendRuleSource',
      payload: {
        state,
        rulesName,
        rulesType,
        pageInfo: {
          pageNum: currentPage,
          pageSize: currentPageSize,
        },
      },
    });
  };

  // 首页页码改变
  pageChange = async page => {
    const { dispatch, currentPageSize } = this.props;
    // 修改页码
    dispatch({
      type: 'recoRuleManage/changeCurrentPage',
      payload: page,
    });
    // 重新获取数据
    await this.getRecoList(page, currentPageSize);
  };

  // 首页改变每页显示数据条数
  pageSizeChange = (_, size) => {
    const { dispatch, currentPage } = this.props;
    // 修改每页显示页数
    dispatch({
      type: 'recoRuleManage/changeCurrentPageSize',
      payload: size,
    });
    // 重新获取数据
    this.getRecoList(currentPage, size);
  };

  // 首页-获取点击列表项的列表数据
  getItemData = item => {
    const { dispatch } = this.props;
    const obj = {
      rulesId: item.rulesId,
      pageInfo: { pageNum: '1', pageSize: '5' },
      typeCode: item.rulesType,
      goodsObjectName: '',
    };
    if (item.rulesType == 'MCC_RULES_IMPLEMENTS_FAVOR') {
      obj.subsName = '';
    }
    dispatch({
      type: 'recoRuleManage/getRuleClickList',
      payload: obj,
    });
  };

  // 保存当前点击项
  saveClickItem = (item, type) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'recoRuleManage/clickRecoListItem',
      payload: item,
    });
    this.changeType(type);
    this.changeDataSourceMethod(item);
  };

  // 新增规则
  showNewRulesModal = () => {
    const type = 'addRule';
    router.push({
      pathname: '/rulesManage/addRule',
      state: {
        type: 'cancel',
      },
    });
    this.saveClickItem({}, type);
    this.changeAddSelectType();
    this.changeEditBackBtnType();
  };

  // 查看规则
  viewRule = item => {
    const type = 'viewRule';
    this.getAlgorithm(item.rulesType)
    router.push({
      pathname: '/rulesManage/viewRule',
      state: {
        type: 'cancel',
      },
    });
    this.saveClickItem(item, type);
    // 获取当前项的商品列表
    this.getItemData(item);
    this.changeEditBackBtnType();
  };

  // 编辑规则
  editRule = item => {
    const type = 'editRule';
    this.getAlgorithm(item.rulesType)
    router.push({
      pathname: '/rulesManage/editRule',
      state: {
        type: 'cancel',
      },
    });
    this.saveClickItem(item, type);
    this.getItemData(item);
    this.changeEditBackBtnType();
  };

  // 删除规则
  deleteRule = item => {
    const { dispatch, currentPage, currentPageSize } = this.props;
    dispatch({
      type: 'recoRuleManage/delRcmdRule',
      payload: {
        rulesId: item.rulesId,
        typeCode: item.rulesType,
      },
    }).then(() => {
      // 重新获取数据
      this.getRecoList(currentPage, currentPageSize);
    });
  };

  // 算法获取
  getAlgorithm = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'recoRuleManage/qryAlgorithm',
      payload: {
        typeCode: value,
      },
    });
  };

  // 修改下拉框状态
  changeAddSelectType = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'recoRuleManage/changeAddSelectType',
      payload: false,
    });
  };

  // 修改返回按钮状态
  changeEditBackBtnType = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'recoRuleManage/changeEditBackBtnType',
      payload: false,
    });
  };

  // 修改操作方式
  changeType = type => {
    const { dispatch } = this.props;
    dispatch({
      type: 'recoRuleManage/changeRecoListType',
      payload: type,
    });
  };

  // 还原新增状态下的新增按钮和批量导入按钮状态
  restoreAddBtnState = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'recoRuleManage/changeAddBtnType',
      payload: false,
    });
    dispatch({
      type: 'recoRuleManage/changeAddMoreType',
      payload: false,
    });
  };

  // 修改数据来源方式
  changeDataSourceMethod(item) {
    const { dispatch } = this.props;
    dispatch({
      type: 'recoRuleManage/changeDataSourceMethod',
      payload: item.sourceType,
    });
  }

  render() {
    const { visitedListItemId, recoRuleSource, ruleListTotal, loading } = this.props;
    return (
      <div className={styles.recommendRuleList}>
        <Card
          title={formatMessage({ id: 'rulesManage.recoRule.recoRuleManage' }, '推荐规则管理')}
          extra={
            <RecoTopRightHeader
              title={formatMessage({ id: 'rulesManage.recoRule.newRule' }, '新增规则')}
              showNewRulesModal={this.showNewRulesModal}
              getRecoList={this.getRecoList}
            />
          }
        >
          <List
            loading={loading.effects['recoRuleManage/getRecommendRuleSource']}
            itemLayout="horizontal"
            dataSource={recoRuleSource}
            renderItem={item => (
              <List.Item>
                <Row className={styles.listRowStyle}>
                  <Col
                    span={24}
                    className={styles.listColStyle}
                    style={{ marginBottom: visitedListItemId === item.id ? 10 : 0 }}
                  >
                    <Col span={7}>
                      <List.Item.Meta
                        className={styles.leftWrapper}
                        avatar={
                          <div className={styles.leftImg}>
                            <Iconfont type="iconhuodong" />
                          </div>
                        }
                        title={
                          <Tooltip placement="topLeft" title={item.rulesName}>
                            <a
                              className={styles.rulesName}
                              onClick={() => {
                                this.viewRule(item);
                              }}
                            >
                              {item.rulesName}
                            </a>
                          </Tooltip>
                        }
                        description={
                          <Tooltip placement="topLeft" title={item.rulesDesc}>
                            <div className={styles.lightColor}>
                              {formatMessage(
                                {
                                  id: 'rulesManage.recoRule.desc',
                                },
                                '描述',
                              ).concat(item.rulesDesc)}
                            </div>
                          </Tooltip>
                        }
                      />
                    </Col>
                    <Col span={3}>
                      <div className={styles.lightColor}>
                        {formatMessage({ id: 'rulesManage.recoRule.ruleType' }, '规则类型')}
                      </div>
                      <Tooltip placement="topLeft" title={item.rulesTypeName}>
                        <div className={styles.deepColor}>{item.rulesTypeName}</div>
                      </Tooltip>
                    </Col>
                    <Col span={3}>
                      <div className={styles.lightColor}>
                        {formatMessage({ id: 'rulesManage.recoRule.ruleSource' }, '数据来源方式')}
                      </div>
                      <Tooltip placement="topLeft" title={item.sourceType == 1 ? '算法' : '自定义'}>
                        <div className={styles.deepColor}>
                          {item.sourceType == 1 ? '算法' : '自定义'}
                        </div>
                      </Tooltip>
                    </Col>
                    <Col span={3}>
                      <div className={styles.lightColor}>
                        {formatMessage({ id: 'rulesManage.recoRule.updater' }, '修改人')}
                      </div>
                      <Tooltip placement="topLeft" title={item.updatePersonName}>
                        <div className={styles.deepColor}>{item.updatePersonName}</div>
                      </Tooltip>
                    </Col>
                    <Col span={3}>
                      <div className={styles.lightColor}>
                        {formatMessage({ id: 'rulesManage.recoRule.updateTime' }, '修改时间')}
                      </div>
                      <Tooltip placement="topLeft" title={item.updateTime}>
                        <div className={styles.deepColor}>{item.updateTime}</div>
                      </Tooltip>
                    </Col>
                    <Col span={2}>
                      <div className={styles.lightColor}>
                        <div className={styles.lightColor}>
                          {formatMessage({ id: 'rulesManage.recoRule.ruleState' }, '规则组状态')}
                        </div>
                        {
                          <Badge
                            status="success"
                            className={styles.deepColor}
                            text={item.state == '00A' ? '有效' : '无效'}
                          />
                        }
                      </div>
                    </Col>
                    <Col span={3}>
                      <a
                        onClick={() => {
                          this.viewRule(item);
                        }}
                        className={styles.cursorPointer}
                      >
                        {formatMessage({ id: 'rulesManage.recoRule.view' }, '查看')}
                      </a>
                      <Divider type="vertical" />
                      <a
                        onClick={() => {
                          this.editRule(item);
                        }}
                        className={styles.listItemAction}
                      >
                        {formatMessage({ id: 'rulesManage.recoRule.edit' }, '编辑')}
                      </a>
                      <Divider type="vertical" />
                      <Popconfirm
                        title={formatMessage(
                          { id: 'rulesManage.recoRule.isConfirmDel' },
                          '是否确定删除',
                        )}
                        okText={formatMessage({ id: 'rulesManage.recoRule.confirm' }, '确认')}
                        cancelText={formatMessage({ id: 'rulesManage.recoRule.cancel' }, '取消')}
                        onConfirm={() => this.deleteRule(item)}
                      >
                        <a className={styles.cursorPointer}>
                          {formatMessage({ id: 'rulesManage.recoRule.del' }, '删除')}
                        </a>
                      </Popconfirm>
                    </Col>
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
            total={ruleListTotal}
            style={{ float: 'right' }}
            className={styles.ruleInfoPagination}
            onChange={this.pageChange}
            onShowSizeChange={this.pageSizeChange}
            pageSizeOptions={['5', '10', '20', '30', '40']}
          />
        </Card>
      </div>
    );
  }
}

export default RecoRuleList;
