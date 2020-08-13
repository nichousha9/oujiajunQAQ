import React from 'react';
import { Card, Table, Tabs, Input, Button, Icon, message, Modal, Tooltip } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import AdvanceFrom from './components/AdvanceForm';
import ReplyDetail from './components/ReplyDetail';
// import CampaignModal from './components/CampaignModal';
import CampaignModal from '@/pages/CampaignModal/index';
import { fieldToStr } from './common';

import styles from './index.less';

const { TabPane } = Tabs;

@connect(({ responseMonitor, loading }) => ({
  campaignNames: responseMonitor.campaignNames,
  campaignVisible: responseMonitor.campaignVisible,
  // campaignPageInfo: responseMonitor.campaignPageInfo
  executeList: responseMonitor.executeList,
  pageInfo: responseMonitor.pageInfo,
  executeListLoading: loading.effects['responseMonitor/getExecuteListEffect'],
  campaignIds: responseMonitor.campaignIds,
}))
class ResponseMonitor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      advancedFilterVisible: false,
      replyDetail: {},
      selectedCampaignList: [],
    };
  }

  componentDidMount() {
    this.getExecuteList();
  }

  toggleAdvancedFilter = () => {
    this.setState(preState => ({ advancedFilterVisible: !preState.advancedFilterVisible }));
  };

  onRow = record => {
    return {
      onClick: () => {
        this.onRowClick(record);
      },
    };
  };

  onRowClick = record => {
    this.setState({
      replyDetail: { ...record },
    });
  };

  onInputChange = value => {
    const { dispatch } = this.props;
    if (value === '') {
      dispatch({
        type: 'responseMonitor/getCampaignNames',
        payload: '',
      });

      dispatch({
        type: 'responseMonitor/getCampaignIds',
        payload: [],
      });

      this.setState({
        selectedCampaignList: [],
      });
    }
  };

  onReOrderClick = () => {
    const { replyDetail } = this.state;
    const { dispatch, campaignIds } = this.props; 
    if(replyDetail && replyDetail.state && replyDetail.state === 'F') {
      dispatch({
        type: 'responseMonitor/qryMccReplyOfferReduControl',
        payload: { campaignIds }
      }).then(result => {
        if(result && result.topCont && result.topCont.resultCode === 0) {
          const replyOfferRedoControls = result.svcCont.data;
          if(replyOfferRedoControls && replyOfferRedoControls.length > 0) {
            Modal.info({
              title: formatMessage(
                { id: 'responseMonitor.dmCampaignChooseReplyOffer' },
                '你选择的营销活动正在回复商品，请稍后。',
              ),
              onOk() {},
            });
          } else {
              Modal.confirm({
                title: formatMessage({ id: 'responseMonitor.dmConfirmToRetryOrder' }),
                onOk() {
                  this.doOrderConfirm();
                },
                onCancel() {
                },
              });
          }
        } else {
          message.error('请求失败');
        }
      });
    }
  };

  doOrderConfirm = () => {
    const { campaignIds, dispatch } = this.props;
    const campaignIdsStr = campaignIds.join(',');
    dispatch({
      type: 'responseMonitor/retryFailFulfill',
      payload: { CAMPAIGN_IDS: campaignIdsStr }
    }).then(result => {
      if(result && result.topCont && result.topCont.resultCode === 0) { 
        const { data } = result.svcCont;
        const title = `${formatMessage({ id: 'responseMonitor.succeedRecords' },  '成功订购记录')} ${data.SUCCEED_NUM}
                      , ${formatMessage({ id: 'responseMonitor.failRecords' }, '失败订购记录')} ${data.FAILED_NUM}`;
        Modal.info({
          title
        });
        this.getExecuteList();

      } else {
        message.error('请求失败');
      }
    });
  }

  handleCampaignVisible = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'responseMonitor/handleCampaignVisible',
      payload: true,
    });
  };

  handleOk = selectedCampaignList => {
    const campaignNames = fieldToStr(selectedCampaignList, 'extName', ',');
    const campaignIds = [];
    selectedCampaignList.map(campaign => {
      campaignIds.push(campaign.id);
      return campaign;
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'responseMonitor/getCampaignNames',
      payload: campaignNames,
    });

    dispatch({
      type: 'responseMonitor/getCampaignIds',
      payload: campaignIds,
    });

    this.setState({
      selectedCampaignList,
    });

    this.closeModal();
  };

  handleCancel = () => {
    this.closeModal();
  };

  closeModal = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'responseMonitor/handleCampaignVisible',
      payload: false,
    });
  };

  // getNodeInfo = (key, pathCode) => {
  //   this.setState({
  //     key,
  //     pathCode,
  //   });
  // };

  handleSearch = () => {};

  handleTableChange = (pageNum, pageSize) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'responseMonitor/getPageInfo',
      payload: { pageNum, pageSize },
    });
    this.getExecuteList();
  };

  getExecuteList = async (payload = {}) => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'responseMonitor/getExecuteListEffect',
      payload,
    });
    const { executeList } = this.props;
    if(executeList && executeList.length) {
      this.setState({
        replyDetail: { ...executeList[0] }
      });
    }
  };

  render() {
    const { advancedFilterVisible, replyDetail, selectedCampaignList } = this.state;
    const { campaignNames, campaignVisible, pageInfo, executeList, executeListLoading } = this.props;
    const columns = [{
        title: formatMessage({ id: 'responseMonitor.number' }, '号码'),
        dataIndex: 'contactNumber',
      }, {
        title: formatMessage({ id: 'responseMonitor.statusDate' }, '状态日期'),
        dataIndex: 'stateDate',
        width: 159
      }, {
        title: formatMessage({ id: 'responseMonitor.batchName' }, '批次名称'),
        dataIndex: 'batchName',
        render: text => (
          <div className="tableCol">
            <Tooltip placement="topLeft" title={text}>{`${ text.slice(0,10) }...`}</Tooltip>
          </div>
        )
      }, {
        title: formatMessage({ id: 'responseMonitor.campaignName' }, '活动名称'),
        dataIndex: 'campaignName',
      }, {
        title: formatMessage({ id: 'responseMonitor.cellName' }, '单元名称'),
        dataIndex: 'cellName',
      }, {
        title: formatMessage({ id: 'responseMonitor.state' }, '状态'),
        dataIndex: 'stateName',
        width: 60
      }, {
        title: formatMessage({ id: 'responseMonitor.Offer' }, '商品名称'),
        dataIndex: 'offerName',
      }, {
        title: formatMessage({ id: 'responseMonitor.comments' }, '备注'),
        dataIndex: 'comments',
      },
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
      <div className="response-page">
        <Card
          size="small"
          title={formatMessage(
            {
              id: 'responseMonitor.title',
            },
            '执行列表',
          )}
          extra={
            <div className={styles.cardExtra}>
              <Input.Search
                size="small"
                // readOnly
                allowClear
                onChange={this.onInputChange}
                placeholder={formatMessage(
                  {
                    id: 'responseMonitor.placeHolder',
                  },
                  '请输入活动名称',
                )}
                onSearch={this.handleCampaignVisible}
                value={campaignNames}
              />
              <Button size="small" type="link" onClick={this.toggleAdvancedFilter}>
                {formatMessage(
                  {
                    id: 'common.btn.AdvancedFilter',
                  },
                  '高级筛选',
                )}
                <Icon type={advancedFilterVisible ? 'up' : 'down'} />
              </Button>
            </div>
          }
        >
          <div className="advance-form-section">
            {advancedFilterVisible ? <AdvanceFrom getExecuteList={this.getExecuteList} /> : null}
          </div>
          <Table
            loading={executeListLoading}
            rowKey={record => record.id}
            onRow={this.onRow}
            columns={columns}
            dataSource={executeList}
            pagination={paginationProps}
            scroll={{ x: 1000 }}
            // rowClassName={styles.tableRow}
          />
          {/* <section className={styles.reOrderSection}>
            <Button size="small" type="primary" onClick={this.onReOrderClick}>
              {formatMessage(
                {
                  id: 'responseMonitor.reOrder',
                },
                '重新订购',
              )}
            </Button>
          </section> */}
          <Tabs type="card">
            <TabPane key="detail" tab={formatMessage({ id: 'responseMonitor.detail' }, '详情')}>
              <ReplyDetail replyDetail={replyDetail} />
            </TabPane>
          </Tabs>
        </Card>
        {campaignVisible ? (
          <CampaignModal
            campaignVisible
            // pageInfo={campaignPageInfo}
            handleOk={this.handleOk}
            handleCancel={this.handleCancel}
            // treeData={treeData}
            initSelectedCampaignList={selectedCampaignList}
          />
        ) : null}
      </div>
    );
  }
}

export default ResponseMonitor;