import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import { Modal, Button, Table, message } from 'antd';
// import OfferList from './OfferList';
import styles from '../index.less';
import { getFormatContactState } from '../common';

// const { TabPane } = Tabs;

@connect(({ marketingMonitor, loading }) => ({
  campaignInfoVisible: marketingMonitor.campaignInfoVisible,
  selectedBatch: marketingMonitor.selectedBatch,
  campaignInfoList: marketingMonitor.campaignInfoList,
  campaignInfoPageInfo: marketingMonitor.campaignInfoPageInfo,
  contactInfoListLoading: loading.effects['marketingMonitor/getContactInfoListEffect'],
  messageInfo: marketingMonitor.messageInfo,
  subExtendList: marketingMonitor.subExtendList,
  subExtendPageInfo: marketingMonitor.subExtendPageInfo,
  subExtendListLoading: loading.effects['marketingMonitor/getSubExtendListEffect'],
}))
class CampaignInfoModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentCampaignInfo: {},
      // offerList: [],
    };
  }

  componentDidMount() {
    this.getCampaignInfoList();
    this.getOfferList();
  }

  getCampaignInfoList = async () => {
    await this.getContactInfoList();
    const { campaignInfoList } = this.props;
    if (campaignInfoList && campaignInfoList.length) {
      this.setState(
        {
          currentCampaignInfo: campaignInfoList[0],
        },
        () => {
          this.getMessageInfo();
          this.getSubExtendList(1, 10);
        },
      );
    }
  };

  getContactInfoList = async () => {
    const { dispatch, selectedBatch } = this.props;
    const { ID, PROCESS_TYPE } = selectedBatch;
    const CONTACT_STATE = getFormatContactState(selectedBatch.CONTACT_STATE);
    await dispatch({
      type: 'marketingMonitor/getContactInfoListEffect',
      payload: {
        BATCH_ID: ID,
        PROCESS_TYPE,
        CONTACT_STATE,
      },
    });
  };

  getMessageInfo = () => {
    const { dispatch, selectedBatch } = this.props;
    const { currentCampaignInfo } = this.state;
    const { ID } = currentCampaignInfo;
    const { PROCESS_TYPE } = selectedBatch;
    dispatch({
      type: 'marketingMonitor/getMessageInfoEffect',
      payload: { PROCESS_TYPE, CONTACT_ID: ID },
    });
  };

  getOfferList = () => {
    const { dispatch, selectedBatch } = this.props;
    const { PROCESS_ID } = selectedBatch;
    dispatch({
      type: 'marketingMonitor/getOffersAndCreativeEffect',
      payload: { processId: PROCESS_ID },
    }).then(result => {
      if (result && result.topCont) {
        if (result.topCont.resultCode === 0) {
          // this.setState({
          //   offerList: result.svcCont.data.offers || [],
          // });
        }
        if (result.topCont.resultCode === -1) {
          message.error(result.topCont.remark);
        }
      }
    });
  };

  qrySubExtendList = () => {
    const { dispatch } = this.props;
    const { currentCampaignInfo } = this.state;
    const { CONTACT_NUMBER } = currentCampaignInfo;
    dispatch({
      type: 'marketingMonitor/getSubExtendListEffect',
      payload: { accNbr: CONTACT_NUMBER },
    });
  };

  getSubExtendList = async (pageNum, pageSize) => {
    const { dispatch } = this.props;

    await dispatch({
      type: 'marketingMonitor/getSubExtendPageInfo',
      payload: { pageNum, pageSize },
    });
    // 屏蔽接口
    // this.qrySubExtendList();
  };

  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'marketingMonitor/handleCampaignInfoVisible',
      payload: false,
    });
  };

  handleTableChange = async (pageNum, pageSize) => {
    const { dispatch } = this.props;

    await dispatch({
      type: 'marketingMonitor/getCampaignInfoPageInfo',
      payload: { pageNum, pageSize },
    });

    this.getCampaignInfoList();
  };

  handleSubTableChange = async (pageNum, pageSize) => {
    this.getSubExtendList(pageNum, pageSize);
  };

  onRow = record => {
    return {
      onClick: () => {
        this.onRowClick(record);
      },
    };
  };

  onRowClick = record => {
    this.setState(
      {
        currentCampaignInfo: { ...record },
      },
      () => {
        this.getMessageInfo();
        this.getSubExtendList(1, 10);
      },
    );
  };

  render() {
    const {
      campaignInfoVisible,
      campaignInfoList,
      campaignInfoPageInfo,
      contactInfoListLoading,
      // messageInfo,
      // subExtendList,
      // subExtendPageInfo,
      // subExtendListLoading,
    } = this.props;
    // const { offerList } = this.state;

    const campaignStateList = [
      formatMessage({ id: 'marketingMonitor.campaignInit' }, '待营销'),
      formatMessage({ id: 'marketingMonitor.campaignSucceed' }, '营销成功'),
      formatMessage({ id: 'marketingMonitor.campaignFail' }, '营销失败'),
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: campaignInfoPageInfo.pageNum,
      pageSize: campaignInfoPageInfo.pageSize,
      total: campaignInfoPageInfo.total,
      onChange: (page, size) => this.handleTableChange(page, size),
      onShowSizeChange: (current, size) => this.handleTableChange(current, size),
    };

    const columns = [
      {
        title: formatMessage({ id: 'marketingMonitor.campaign' }, '营销活动'),
        dataIndex: 'CAMPAIGN_NAME',
      },
      {
        title: formatMessage({ id: 'marketingMonitor.cellName' }, '分组名称'),
        dataIndex: 'CELL_NAME',
      },
      {
        title: formatMessage({ id: 'marketingMonitor.number' }, '号码'),
        dataIndex: 'CONTACT_NUMBER',
      },
      {
        title: formatMessage({ id: 'marketingMonitor.stateDate' }, '状态日期'),
        dataIndex: 'STATE_DATE',
      },
      {
        title: formatMessage({ id: 'marketingMonitor.contactState' }, '联系状态'),
        dataIndex: 'CONTACT_STATE',
      },
      {
        title: formatMessage({ id: 'marketingMonitor.campaignState' }, '活动状态'),
        dataIndex: 'CAMPAIGN_STATE',
        render: text => {
          if (text) {
            const cellVal = parseInt(text, 10);
            if (cellVal >= campaignStateList.length) {
              return campaignStateList[0];
            }
            return campaignStateList[cellVal];
          }
          return '--';
        },
      },
    ];

    // const subPaginationProps = {
    //   showSizeChanger: true,
    //   showQuickJumper: true,
    //   current: subExtendPageInfo.pageNum,
    //   pageSize: subExtendPageInfo.pageSize,
    //   total: subExtendPageInfo.total,
    //   onChange: (page, size) => this.handleSubTableChange(page, size),
    //   onShowSizeChange: (current, size) => this.handleSubTableChange(current, size),
    // };

    // const subColumns = [
    //   {
    //     title: formatMessage({ id: 'marketingMonitor.plzInputAccountID' }, '请输入用户ID'),
    //     dataIndex: 'SUBS_ID',
    //     render: text => text || '--',
    //   },
    //   {
    //     title: formatMessage({ id: 'marketingMonitor.accountNumber' }, '用户号码'),
    //     dataIndex: 'ACC_NBR',
    //     render: text => text || '--',
    //   },
    //   // {
    //   //   title: formatMessage({ id:  'marketingMonitor.brandPreference' }, '品牌偏好'),
    //   //   dataIndex: 'BRAND_PREFERENCE',
    //   //   render: text => text || '--',
    //   // },
    //   // {
    //   //   title: formatMessage({ id:  'marketingMonitor.consumedValue' }, '消费值'),
    //   //   dataIndex: 'ARPU_VALUE',
    //   //   render: text => text || '--',
    //   // },
    //   // {
    //   //   title: formatMessage({ id:  'marketingMonitor.gender' }, '性别'),
    //   //   dataIndex: 'SEX',
    //   //   render: text => text || '--',
    //   // },
    //   {
    //     title: formatMessage({ id: 'marketingMonitor.age' }, '年龄'),
    //     dataIndex: 'AGE',
    //     render: text => text || '--',
    //   },
    // ];

    return (
      <Modal
        className={styles.marketingModal}
        title={formatMessage(
          {
            id: 'marketingMonitor.campaignInfo',
          },
          '活动信息',
        )}
        width={960}
        destroyOnClose
        visible={campaignInfoVisible}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {formatMessage({ id: 'common.btn.cancel' }, '取消')}
          </Button>,
        ]}
        onCancel={this.handleCancel}
      >
        <section className="campaign-record-table">
          <Table
            rowKey={record => record.ID}
            columns={columns}
            dataSource={campaignInfoList}
            loading={contactInfoListLoading}
            pagination={paginationProps}
            onRow={this.onRow}
          />
        </section>
        {/* <section className="detail-section">
          <Tabs 
            type="card"
          >
            <TabPane
              key="message"
              tab={formatMessage({ id: 'marketingMonitor.message' }, '消息')}
            >
              <p> { 
                (messageInfo && messageInfo.message && messageInfo.message.MSG) 
                ? messageInfo.message.MSG 
                : '' }
              </p>
            </TabPane>
            <TabPane key="offer" tab={formatMessage({ id: 'marketingMonitor.offer' }, '商品')}>
              <OfferList offerList={offerList}/>
            </TabPane>
            <TabPane
              key="MGR"
              tab={formatMessage({ id: 'marketingMonitor.MGR' }, '用户画像标签')}
            >
              <Table
                rowKey={(record,index) => index}
                columns={subColumns}
                dataSource={subExtendList}
                pagination={subPaginationProps}
                loading={subExtendListLoading}
              />
            </TabPane>
          </Tabs>
              </section> */}
      </Modal>
    );
  }
}

export default CampaignInfoModal;
