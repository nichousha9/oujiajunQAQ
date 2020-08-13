/* eslint-disable no-unused-vars */
import React from 'react';
import { Table, Input, Button, Card, Icon, Tooltip } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import AdvanceForm from './components/AdvanceForm';
import StaticModal from './components/StaticModal';
import CampaignInfoModal from './components/CampaignInfoModal';
import MemberInfoModal from './components/MemberInfoModal';

import styles from './index.less';

@connect(({ marketingMonitor, loading }) => ({
  campaignNames: marketingMonitor.campaignNames,
  campaignVisible: marketingMonitor.campaignVisible,
  batchList: marketingMonitor.batchList,
  batchListLoading: loading.effects['marketingMonitor/getBatchListEffect'],
  batchDetailLoading: loading.effects['marketingMonitor/getBatchCellDetailInfoEffect'],
  pageInfo: marketingMonitor.pageInfo,
  staticVisible: marketingMonitor.staticVisible,
  campaignInfoVisible: marketingMonitor.campaignInfoVisible,
  memberInfoVisible: marketingMonitor.memberInfoVisible,
  campaignIds: marketingMonitor.campaignIds,
}))
class MarketingMonitor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      advancedFilterVisible: false,
      BATCH_NAME: '',
    };
  }

  componentDidMount() {
    this.qryBatchList();
  }

  advancedForm = form => {
    this.formRef = form;
  };

  toggleAdvancedFilter = () => {
    this.setState(preState => ({ advancedFilterVisible: !preState.advancedFilterVisible }));
  };

  onInputChange = e => {
    const BATCH_NAME = e.target.value;
    this.setState({
      BATCH_NAME,
    });
  };

  handleSearch = async () => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'marketingMonitor/getPageInfo',
      payload: { pageNum: 1, pageSize: 10, total: 0 },
    });

    this.qryBatchList();
  };

  handleTableChange = async (pageNum, pageSize) => {
    const { dispatch } = this.props;

    await dispatch({
      type: 'marketingMonitor/getPageInfo',
      payload: { pageNum, pageSize },
    });

    this.qryBatchList();
  };

  // onExpandedRowsChange = expandedRows => {

  // }

  onExpand = (expanded, record) => {
    if (expanded) {
      const { dispatch } = this.props;
      // 获取子节点数据
      dispatch({
        type: 'marketingMonitor/getBatchCellDetailInfoEffect',
        payload: { BATCH_ID: record.ID },
      });
    }
  };

  customExpandIcon = props => {
    return (
      <Icon
        onClick={e => props.onExpand(props.record, e)}
        type={props.expanded ? 'caret-down' : 'caret-right'}
      />
    );
  };

  qryBatchList = () => {
    const { BATCH_NAME } = this.state;
    const { campaignIds } = this.props;
    const CAMPAIGN_IDS = [...campaignIds];
    let fieldValue = {};

    if (this.formRef) {
      fieldValue = this.formRef.getFieldValues();
    }

    const payload = {
      ...fieldValue,
      BATCH_NAME,
      CAMPAIGN_IDS,
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
      },
    };
    this.getBatchList(payload);
  };

  getBatchList = (payload = {}) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'marketingMonitor/getBatchListEffect',
      payload,
    });
  };

  padLeft = (str, totalWidth, paddingChar) => {
    let retStr = '';
    for (let i = 0; i < totalWidth - str.length; i += 1) {
      retStr += paddingChar;
    }

    retStr += str;
    return retStr;
  };

  showStatics = record => {
    const { dispatch } = this.props;
    if (record.flag) {
      return;
    }
    dispatch({
      type: 'marketingMonitor/getSelectedBatch',
      payload: record,
    });
    dispatch({
      type: 'marketingMonitor/handleStaticVisible',
      payload: true,
    });
  };

  showCampaign = (record, type) => {
    const { dispatch } = this.props;
    if (record.flag) {
      return;
    }
    const payload = { ...record, CONTACT_STATE: type };
    const { PROCESS_TYPE } = record;
    const campaignProcessType = ['SMS_CONTACT', 'EMAIL_CONTACT', 'IVR'];
    const userProcessType = 'APP';
    dispatch({
      type: 'marketingMonitor/getSelectedBatch',
      payload,
    });
    // 做区分
    if (campaignProcessType.indexOf(PROCESS_TYPE) !== -1) {
      dispatch({
        type: 'marketingMonitor/handleCampaignInfoVisible',
        payload: true,
      });
    } else if (userProcessType == PROCESS_TYPE) {
      dispatch({
        type: 'marketingMonitor/handleMemberInfoVisible',
        payload: true,
      });
    }
  };

  render() {
    const { advancedFilterVisible, BATCH_NAME } = this.state;
    const {
      batchList,
      batchListLoading,
      pageInfo,
      batchDetailLoading,
      staticVisible,
      campaignInfoVisible,
      memberInfoVisible,
    } = this.props;

    const columns = [
      // {
      //   title: formatMessage({ id: 'marketingMonitor.batchName' }, '批次名称'),
      //   dataIndex: 'BATCH_NAME',
      //   render: text =>
      //     text ? (
      //       <div className="tableCol">
      //         <Tooltip placement="topLeft" title={text}>{`${text.slice(0, 10)}...`}</Tooltip>
      //       </div>
      //     ) : (
      //       '--'
      //     ),
      //   align: 'center',
      // },
      {
        title: '编码',
        dataIndex: 'batchId',
        // render: (text, record) =>
        //   record.ID ? `B${this.padLeft(record.ID.toString(), 9, '0')}` : '-',
      },
      {
        title: formatMessage({ id: 'marketingMonitor.campaignName' }, '营销活动名称'),
        dataIndex: 'extName',
      },
      {
        title: formatMessage({ id: 'marketingMonitor.contactChannel' }, '接触渠道'),
        dataIndex: 'processType',
      },
      // {
      //   title: formatMessage({ id: 'marketingMonitor.adviceChannelName' }, '运营位'),
      //   dataIndex: 'ADVICE_CHANNEL_NAME',
      //
      // },
      {
        title: formatMessage({ id: 'marketingMonitor.startDate' }, '开始时间'),
        dataIndex: 'startTime',
      },
      {
        title: formatMessage({ id: 'marketingMonitor.endDate' }, '结束时间'),
        dataIndex: 'endTime',
      },
      {
        title: formatMessage({ id: 'marketingMonitor.total' }, '总数'),
        dataIndex: 'count',

        // render: (text, record) => {
        //   let totalNum = 0;
        //   totalNum = record.count || totalNum;
        //   return (
        //     <Button size="small" type="link" onClick={() => this.showCampaign(record, 'ALL')}>
        //       {record.PROCESS_TYPE === 'LISTENER' ? '--' : totalNum}
        //     </Button>
        //   );
        // },
      },
      {
        title: formatMessage({ id: 'common.message.successfully' }, '成功'),
        dataIndex: 'scount',

        // render: (text, record) => (
        //   <Button size="small" type="link" onClick={() => this.showCampaign(record, 'SUCCEED')}>
        //     {text || 0}
        //   </Button>
        // ),
      },
      {
        title: formatMessage({ id: 'common.message.failedTo' }, '失败'),
        dataIndex: 'fcount',

        // render: (text, record) => (
        //   <Button size="small" type="link" onClick={() => this.showCampaign(record, 'FAILED')}>
        //     {text || 0}
        //   </Button>
        // ),
      },
      // {
      //   title: formatMessage({ id: 'marketingMonitor.pending' }, '在途'),
      //   dataIndex: 'PENDING_NUM',
      //
      //   render: (text, record) => {
      //     // let pendingNum = record.TOTAL_NUM - record.SUCCEED_NUM - record.FAILED_NUM;
      //     // pendingNum = pendingNum < 0 ? 0 : pendingNum;
      //     return (
      //       <Button size="small" type="link" onClick={() => this.showCampaign(record, 'PENDING')}>
      //         {record.PROCESS_TYPE === 'LISTENER' ? '--' : record.PENDING_NUM}
      //       </Button>
      //     );
      //   },
      // },
      // {
      //   title: formatMessage({ id: 'common.table.action' }, '操作'),
      //   dataIndex: 'THIRD_ACTION',
      //
      //   render: (_, record) => (
      //     <Button size="small" type="link" onClick={() => this.showStatics(record)}>
      //       {formatMessage({ id: 'marketingMonitor.statisticalInfo' }, '统计信息')}
      //     </Button>
      //   ),
      // },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: pageInfo.pageNum,
      pageSize: pageInfo.pageSize,
      total: pageInfo.total,
      onChange: (page, size) => this.handleTableChange(page, size),
      onShowSizeChange: (current, size) => this.handleTableChange(current, size),
    };

    return (
      <div className="marketing-page">
        <Card
          size="small"
          title="活动执行监控"
          extra={
            <div className={styles.cardExtra}>
              <Input.Search
                maxLength={21}
                size="small"
                allowClear
                onChange={this.onInputChange}
                onSearch={this.handleSearch}
                placeholder="活动名称"
              />
              {/* <Button size="small" type="link" onClick={this.toggleAdvancedFilter}>
                {formatMessage(
                  {
                    id: 'common.btn.AdvancedFilter',
                  },
                  '高级筛选',
                )}
                <Icon type={advancedFilterVisible ? 'up' : 'down'} />
              </Button> */}
            </div>
          }
        >
          <div className="advance-form-section">
            {advancedFilterVisible ? (
              <AdvanceForm
                wrappedComponentRef={this.advancedForm}
                BATCH_NAME={BATCH_NAME}
                getBatchList={this.getBatchList}
              />
            ) : null}
          </div>
          <Table
            className={styles.campaignTable}
            // rowKey={record => record.ID}
            columns={columns}
            loading={batchListLoading || batchDetailLoading}
            pagination={paginationProps}
            // scroll={{ x: 1300 }}
            dataSource={batchList}
            // onExpandedRowsChange={this.onExpandedRowsChange}
            // expandIcon={this.customExpandIcon}
            // onExpand={this.onExpand}
          />
        </Card>
        {staticVisible ? <StaticModal /> : null}
        {campaignInfoVisible ? <CampaignInfoModal /> : null}
        {memberInfoVisible ? <MemberInfoModal /> : null}
      </div>
    );
  }
}

export default MarketingMonitor;
