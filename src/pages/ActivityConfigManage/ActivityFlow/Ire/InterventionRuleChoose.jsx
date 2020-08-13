// 干预规则选择弹窗
import React from 'react';
import { connect } from 'dva';
import { Modal, Table, Input, Card, message } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import commonStyles from '../common.less';
import styles from './index.less';
const { Search } = Input;

@connect(({ activityFlowIre, loading }) => ({
  activityFlowIre,
  loading: loading.effects['activityFlowIre/qryMccIdeInterveneConf'],
  ruleLoading: loading.effects['activityFlowIre/qryOptRuleOfRuleset'],
}))
class InterventionRuleChoose extends React.Component {
  status = {
    toBeEffective:"0",
    effective : "1",
    disabled : "2",
  }

  status2 = {
    "0": 'toBeEffective',
    "1": 'effective',
    "2": 'disabled',
  }

  columns = [
    {
      title: formatMessage({ id:'activityConfigManage.ire.interveneName' }), // '干预组名称',
      dataIndex: 'offerId',
      key: 'offerId',
    },
    {
      title: formatMessage({ id:'common.table.creator' }), // '创建人',
      dataIndex: 'staffName',
      key: 'staffName',
    },
    {
      title: formatMessage({ id:'common.table.createTime' }), // '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: formatMessage({ id:'common.table.updateTime' }), // '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
    },
    {
      title: formatMessage({ id:'common.table.status' }), // '状态',
      dataIndex: 'status',
      key: 'status',
      render: text => this.status2[text]
    },
  ];

  ruleColumns = [
    {
      title: formatMessage({ id:'activityConfigManage.ire.ruleName' }), // '规则名称',
      dataIndex: 'ruleName',
      key: 'ruleName',
    },
    {
      title: formatMessage({ id:'activityConfigManage.ire.condition' }), // '触发条件',
      dataIndex: 'condition',
      key: 'condition',
    },
    {
      title: formatMessage({ id:'activityConfigManage.ire.interveneAction' }), // '满足触发条件后执行操作',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: formatMessage({ id:'activityConfigManage.ire.interveneOrder' }), // '排序',
      dataIndex: 'ruleOrder',
      key: 'ruleOrder',
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      pageNum: 1,
      pageSize: 5,
      pageInfo: {}, // 后端的返回
      ruleListPageNum: 1,
      ruleListPageSize: 5,
      ruleListPageInfo: {},
      offerId: '',
      rulesetList: [],
      selectedRow: {},
    };
  }

  componentDidMount() {
    this.qryMccIdeInterveneConf();
  }

  /**
   *获取规则集列表
   *
   * @memberof InterventionRuleChoose
   */
  qryMccIdeInterveneConf = () => {
    const { dispatch } = this.props;
    const { pageNum, pageSize, offerId } = this.state;
    dispatch({
      type: 'activityFlowIre/qryMccIdeInterveneConf',
      payload: {
        pageInfo: { pageNum, pageSize },
        state: this.status.effective, // 干预规则集状态
        offerId, // 干预规则集名称
      },
      success: svcCont => {
        const { pageInfo = {}, data = [] } = svcCont;
        this.setState(
          {
            rulesetList: data,
            pageInfo: {
              pageNum: pageInfo.pageNum,
              pageSize: pageInfo.pageSize,
              total: pageInfo.total,
            },
            selectedRow: (data && data.length && data[0]) || {},
          },
          this.fetchRuleList,
        );
      },
    });
  };

  /**
   *获取规则集中规则详情列表
   *
   * @memberof InterventionRuleChoose
   */
  fetchRuleList = () => {
    const { dispatch } = this.props;
    const { selectedRow, ruleListPageNum, ruleListPageSize } = this.state;
    if (selectedRow && selectedRow.id) {
      dispatch({
        type: 'activityFlowIre/qryMccInterveneRule',
        payload: {
          confId: selectedRow.confId,
          pageInfo: {
              pageNum: ruleListPageNum,
              pageSize: ruleListPageSize,
          },
        },
        success: svcCont => {
          const { pageInfo = {}, data = [] } = svcCont;
          this.setState({
            ruleList: data,
            ruleListPageInfo: {
              pageNum: pageInfo.pageNum,
              pageSize: pageInfo.pageSize,
              total: pageInfo.total,
            }
          });
        },
      });
    } else {
      this.setState({
        ruleList: [],
      });
    }
  };

  // 规则集列表搜索文字改变
  offerIdChange = e => {
    const { value } = e.target;
    this.setState({ offerId: value });
  };

  clickRow = record => {
    this.setState({ selectedRow: record }, this.fetchRuleList);
  };

  setClassName = record => {
    const { selectedRow } = this.state;
    // 判断索引相等时添加行的高亮样式
    return record.id === selectedRow.id ? commonStyles.tableRowSelect : '';
  };

  // 提交
  handleSubmit = () => {
    const { onOk } = this.props;
    const { selectedRow } = this.state;
    if(!selectedRow.id) {
      message.info(formatMessage({ id: 'activityConfigManage.flow.selectNotice' }));
      return
    }
    onOk(selectedRow);
  };

  // 列表条件切换
  onChange = pagination => {
    const { current: pageNum, pageSize } = pagination;
    this.setState(
      {
        pageNum,
        pageSize,
      },
      this.qryMccIdeInterveneConf,
    );
  };

  // 规则列表条件切换
  onRuleListChange = pagination => {
    const { current: pageNum, pageSize } = pagination;
    this.setState(
      {
        ruleListPageNum: pageNum,
        ruleListPageSize: pageSize,
      },
      this.fetchRuleList,
    );
  };

  render() {
    const { onCancel, loading, ruleLoading } = this.props;
    const { rulesetList, pageInfo, ruleList, ruleListPageInfo } = this.state;

    const pagination = {
      current: pageInfo.pageNum,
      pageSize: pageInfo.pageSize,
      total: pageInfo.total,
      showSizeChanger: true,
      showQuickJumper: true,
    };

    const ruleListPagination = {
      current: ruleListPageInfo.pageNum,
      pageSize: ruleListPageInfo.pageSize,
      total: ruleListPageInfo.total,
      showSizeChanger: true,
      showQuickJumper: true,
    };

    return (
      <Modal
        title={formatMessage({ id: 'activityConfigManage.ire.intervene' })}
        visible
        width={960}
        onOk={this.handleSubmit}
        onCancel={onCancel}
        okText={formatMessage({ id: 'common.btn.submit' })}
        cancelText={formatMessage({ id: 'common.btn.back' })}
        wrapClassName={commonStyles.flowModal}
      >
        <div className={styles.chooseWrapper}>
          <Card
            size="small"
            bordered={false}
            className={commonStyles.chooseWrapperCard}
            extra={
              <Search
                size="small"
                placeholder={formatMessage({ id: 'common.form.input' })}
                onChange={this.offerIdChange}
                onPressEnter={this.qryMccIdeInterveneConf}
                onSearch={this.qryMccIdeInterveneConf}
                className={commonStyles.chooseSearch}
              />
            }
          >
            <Table
              rowKey="id"
              dataSource={rulesetList}
              columns={this.columns}
              pagination={pagination}
              loading={loading}
              rowClassName={this.setClassName}
              onRow={record => ({ onClick: this.clickRow.bind(this, record) })}
              onChange={this.onChange}
            />
            <p className={commonStyles.title}>{formatMessage({ id: 'activityConfigManage.contact.optRulesetDetail' })}</p>
            <Table
              rowKey="id"
              dataSource={ruleList}
              columns={this.ruleColumns}
              pagination={ruleListPagination}
              loading={ruleLoading}
              onChange={this.onRuleListChange}
            />
          </Card>
        </div>
      </Modal>
    );
  }
}

export default InterventionRuleChoose;
