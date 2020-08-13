// 规则选择弹窗
import React from 'react';
import { connect } from 'dva';
import { Modal, Table, Input, Card } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import commonStyles from '../../common.less';
import styles from './index.less';
const { Search } = Input;

@connect(({ activityFlowContact, loading }) => ({
  activityFlowContact,
  loading: loading.effects['activityFlowContact/qryOptRuleset'],
  ruleLoading: loading.effects['activityFlowContact/qryOptRuleOfRuleset'],
}))
class RuleChoose extends React.Component {
  columns = [
    {
      title: formatMessage({ id: 'activityConfigManage.contact.rulesetName' }), // '规则集名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: formatMessage({ id: 'activityConfigManage.contact.rulesetCode' }), // '规则集编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: formatMessage({ id: 'activityConfigManage.contact.isSynchronized' }), // '是否同步',
      dataIndex: 'is_sync',
      key: 'is_sync',
      render: text => (text === 'Y' ? formatMessage({ id: 'common.text.yes' }) : formatMessage({ id: 'common.text.no' })),
    },
    {
      title: formatMessage({ id: 'activityConfigManage.contact.resLatestRunTime' }), // '最后运行时间',
      dataIndex: 'latest_run_time',
      key: 'latest_run_time',
    },
  ];

  ruleColumns = [
    {
      title: formatMessage({ id: 'activityConfigManage.contact.ruleName' }), // '规则名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: formatMessage({ id: 'activityConfigManage.contact.ruleType' }), // '规则类型',
      dataIndex: 'ruletype_id',
      key: 'ruletype_id',
      render: text => {
        let type = '';
        switch (text) {
          case 5:
            type = formatMessage({ id: 'activityConfigManage.contact.maxOffersRuletype' }); // '单用户商品订购限量';
            break;
          case 6:
            type = formatMessage({ id: 'activityConfigManage.contact.neverOfferaWithOfferb' }); // '商品互斥';
            break;
          case 7:
            type = formatMessage({ id: 'activityConfigManage.contact.contactCapacityForEachCustomer' }); // '每个用户的接触容量';
            break;
          case 8:
            type = 'A/B Testing';
            break;
          default:
            type = '';
        }
        return type;
      },
    },
    {
      title: formatMessage({ id: 'activityConfigManage.contact.offerEmailAName' }), // 'OfferA/EmailA名称',
      dataIndex: 'offera_name',
      key: 'offera_name',
    },
    {
      title: formatMessage({ id: 'activityConfigManage.contact.offerEmailBName' }), // 'OfferB/EmailB名称',
      dataIndex: 'offerb_name',
      key: 'offerb_name',
    },
    {
      title: formatMessage({ id: 'activityConfigManage.contact.ruleDetail' }), // '规则详情',
      dataIndex: 'ruletype_id',
      key: 'ruleDetail',
      render: (text, rule) => {
        let ruleDetail = '';
        switch (text) {
          case 5:
            ruleDetail = (rule.max_time && `${rule.max_time} ${formatMessage({ id: 'activityConfigManage.contact.maxOffersRuletypeDetail' })}`) || '';
            ruleDetail = ruleDetail.replace(/xxx/, rule.period);
            break;
          case 6:
            // offer互斥关系
            ruleDetail = formatMessage({ id: 'activityConfigManage.contact.alternativeNow' }); // '互斥';
            if (rule.is_ref_fulfill_his == 'Y') {
              ruleDetail += formatMessage({ id: 'activityConfigManage.contact.andPastNDays' }); // 'xxx天内';
              ruleDetail = ruleDetail.replace(/xxx/, rule.period);
            }
            break;
          case 7:
            ruleDetail = `${rule.max_time}${formatMessage({ id: 'activityConfigManage.contact.maxOffersRuletypeDetail' })}`;
            ruleDetail = ruleDetail.replace(/xxx/, rule.period);
            break;
          case 8:
            if (rule.response_type === '4') {
              ruleDetail = formatMessage({ id: 'activityConfigManage.contact.resOptAbRuleOfferDescription' }); // '推荐高订购率的商品';
            } else {
              ruleDetail = formatMessage({ id: 'activityConfigManage.contact.resOptAbRuleEmailDescription' }); // '推送高点击率的邮件';
            }
            break;
          default:
            ruleDetail = '';
        }
        return ruleDetail;
      },
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      pageNum: 1,
      pageSize: 5,
      pageInfo: {}, // 后端的返回
      rulesetName: '',
      rulesetList: [],
      selectedRuleSet: {},
    };
  }

  componentDidMount() {
    this.qryOptRuleset();
  }

  /**
   *获取规则集列表
   *
   * @memberof RuleChoose
   */
  qryOptRuleset = () => {
    const { dispatch, campaignId } = this.props;
    const { pageNum, pageSize, rulesetName } = this.state;
    dispatch({
      type: 'activityFlowContact/qryOptRuleset',
      payload: {
        pageInfo: { pageNum, pageSize },
        queryParam: {
          campaignId, // 活动id
          state: 'A', // 优化规则集状态
          rulesetName, // 优化规则集名称
        },
      },
      success: svcCont => {
        const { pageInfo = {} } = svcCont;
        const { list = [] } = pageInfo;
        this.setState(
          {
            rulesetList: list,
            pageInfo: {
              pageNum: pageInfo.pageNum,
              pageSize: pageInfo.pageSize,
              total: pageInfo.total,
            },
            selectedRuleSet: (list && list.length && list[0]) || {},
          },
          this.fetchRuleList,
        );
      },
    });
  };

  /**
   *获取规则集中规则详情列表
   *
   * @memberof RuleChoose
   */
  fetchRuleList = () => {
    const { dispatch } = this.props;
    const { selectedRuleSet } = this.state;
    if (selectedRuleSet && selectedRuleSet.ruleset_id) {
      dispatch({
        type: 'activityFlowContact/qryOptRuleOfRuleset',
        payload: {
          rulesetId: selectedRuleSet.ruleset_id,
        },
        success: svcCont => {
          const { data = [] } = svcCont;
          this.setState({
            ruleList: data,
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
  rulesetNameChange = e => {
    const { value } = e.target;
    this.setState({ rulesetName: value });
  };

  clickRow = record => {
    this.setState({ selectedRuleSet: record }, this.fetchRuleList);
  };

  setClassName = record => {
    const { selectedRuleSet } = this.state;
    // 判断索引相等时添加行的高亮样式
    return record.ruleset_id === selectedRuleSet.ruleset_id ? commonStyles.tableRowSelect : '';
  };

  // 提交
  handleSubmit = () => {
    const { onOk } = this.props;
    const { selectedRuleSet } = this.state;
    onOk(selectedRuleSet);
  };

  // 列表条件切换
  onChange = pagination => {
    const { current: pageNum, pageSize } = pagination;
    this.setState(
      {
        pageNum,
        pageSize,
      },
      this.qryOptRuleset,
    );
  };

  render() {
    const { visible, onCancel, loading, ruleLoading } = this.props;
    const { rulesetList, pageInfo, ruleList } = this.state;

    const pagination = {
      current: pageInfo.pageNum,
      pageSize: pageInfo.pageSize,
      total: pageInfo.total,
      showSizeChanger: true,
      showQuickJumper: true,
    };

    return (
      <Modal
        title={formatMessage({ id: 'activityConfigManage.contact.ruleChooseTitle' })}
        visible={visible}
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
                onChange={this.rulesetNameChange}
                onPressEnter={this.qryOptRuleset}
                onSearch={this.qryOptRuleset}
                className={commonStyles.chooseSearch}
              />
            }
          >
            <Table
              rowKey="ruleset_id"
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
              rowKey="rule_id"
              dataSource={ruleList}
              columns={this.ruleColumns}
              pagination={false}
              loading={ruleLoading}
            />
          </Card>
        </div>
      </Modal>
    );
  }
}

export default RuleChoose;
