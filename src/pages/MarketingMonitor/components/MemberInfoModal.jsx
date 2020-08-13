import React from 'react';
import { formatMessage, getLocale } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import { Link } from 'umi';
import { Modal, Button, Table, Tabs, message } from 'antd';
import OfferList from './OfferList';
import styles from '../index.less';
import { getFormatContactState } from '../common';

const { TabPane } = Tabs;

@connect(({ marketingMonitor, loading }) => ({
  selectedBatch: marketingMonitor.selectedBatch,
  memberInfoVisible: marketingMonitor.memberInfoVisible,
  memberInfoList: marketingMonitor.memberInfoList,
  memberInfoPageInfo: marketingMonitor.memberInfoPageInfo,
  memberInfoListLoading: loading.effects['marketingMonitor/getMemberInfoListEffect'],
}))
class MemberInfoModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // currentMemberInfo: {},
      offerList: [],
      creativeList: [],
      channelList: [],
      creativeTypeList: [],
    };
  }

  componentDidMount() {
    this.getChannelList();
    this.getCreativeTypeList();
    this.getMemberList();
    this.getCreativeAndOffer();
  }

  getMemberList = () => {
    const { dispatch, selectedBatch } = this.props;
    const { ID, MEMBER_TABLE, IS_TEST } = selectedBatch;
    const CONTACT_STATE = getFormatContactState(selectedBatch.CONTACT_STATE);
    dispatch({
      type: 'marketingMonitor/getMemberInfoListEffect',
      payload: {
        batchId: ID,
        CONTACT_STATE,
        tableCode: MEMBER_TABLE,
        isTest: IS_TEST,
      }
    });
  }

  getCreativeAndOffer = () => {
    const { dispatch, selectedBatch } = this.props;
    const { PROCESS_ID } = selectedBatch;
    dispatch({
      type: 'marketingMonitor/getOffersAndCreativeEffect',
      payload: { processId: PROCESS_ID }
    }).then(result => {
      if(result && result.topCont) {
        if(result.topCont.resultCode === 0) {
          this.setState({
            offerList: result.svcCont.data.offers || [],
            creativeList: result.svcCont.data.creativeInfos || [],
          });
        }
        if(result.topCont.resultCode === -1) {
          message.error(result.topCont.remark)
        }
      }
    });
  }

  getChannelList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'marketingMonitor/getChannelListEffect',
    }).then(result => {
      if(result && result.topCont) {
        if(result.topCont.resultCode === 0) {
          this.setState({
            channelList: result.svcCont.data || [],
          });
        }
        if(result.topCont.resultCode === -1) {
          message.error(result.topCont.remark)
        }
      }
    });
  }

  getCreativeTypeList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'marketingMonitor/getCreativeTypeListEffect',
      payload: {
        attrSpecCode: 'TEMPLATE_INFO_TYPE',
        language: getLocale(),
      }
    }).then(result => {
      if(result && result.topCont) {
        if(result.topCont.resultCode === 0) {
          this.setState({
            creativeTypeList: result.svcCont.data || [],
          });
        }
        if(result.topCont.resultCode === -1) {
          message.error(result.topCont.remark)
        }
      }
    });
  }

  // onRow = record => {
  //   return {
  //     onClick: () => {
  //       this.onRowClick(record);
  //     },
  //   };
  // };

  // onRowClick = record => {
  //   this.setState({
  //     currentMemberInfo: { ...record },
  //   }, () => {
  //     // this.getMessageInfo();
  //     // this.getSubExtendList(1, 10);
  //   });
  // };


  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'marketingMonitor/handleMemberInfoVisible',
      payload: false,
    });
  };

  handleTableChange = async (pageNum, pageSize) => {
    const { dispatch } = this.props;

    await dispatch({
      type: 'marketingMonitor/getMemberInfoPageInfo',
      payload: { pageNum, pageSize },
    });

    this.getMemberList();
  };

  // handleCreativeTableChange = async (pageNum, pageSize) => {
  //   const { dispatch } = this.props;

  //   await dispatch({
  //     type: 'marketingMonitor/getCreativePageInfo',
  //     payload: { pageNum, pageSize },
  //   });
    
  //   // this.getCampaignInfoList();
  // };

  getChannel = channelId => {
    const { channelList } = this.state;
    let channelText = channelId;
    if(channelList.length) {
      const channelItem = channelList.find(channel => {
        return channel.channelId === channelId;
      });
      channelText = channelItem ? channelItem.channelName : channelText;
    }
    return channelText;
  }

  getTypeValue = templateInfoType => {
    const { creativeTypeList } = this.state;
    let typeValue = templateInfoType;
    if(creativeTypeList.length) {
      const typeItem = creativeTypeList.find(creativeType => {
        return creativeType.attrValueCode === templateInfoType;
      });
      typeValue = typeItem ? typeItem.attrValueName : typeValue;
    }
    return typeValue;
  }

  render(){
    const {
      memberInfoVisible,
      memberInfoList,
      memberInfoPageInfo,
      memberInfoListLoading,
    } = this.props;

    const { creativeList, offerList } = this.state;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: memberInfoPageInfo.pageNum,
      pageSize: memberInfoPageInfo.pageSize,
      total: memberInfoPageInfo.total,
      onChange: (page, size) => this.handleTableChange(page, size),
      onShowSizeChange: (current, size) => this.handleTableChange(current, size),
    };

    const columns = [{
      title: 'ID',
      dataIndex: 'subs_id',
    }, {
      title: formatMessage({ id: 'marketingMonitor.number' }, '号码'),
      dataIndex: 'acc_nbr',
      render: text => text || '--',
    }, {
      title: formatMessage({ id: 'marketingMonitor.email' }, '邮箱'),
      dataIndex: 'email',
      render: text => text || '--',
    },];

    const creativeColumns = [{
      title: formatMessage({ id: 'marketingMonitor.creativeName' }, '创意名称'),
      dataIndex: 'creativeInfoName',
      render: text => (
        <Link to="#">
          { text }
        </Link>
      )
    }, {
      title: formatMessage({ id: 'marketingMonitor.code' }, '编码'),
      dataIndex: 'creativeInfoCode',
    }, {
      title: formatMessage({ id: 'marketingMonitor.channel' }, '渠道'),
      dataIndex: 'channelId',
      render: text => this.getChannel(parseInt(text, 10)),
    }, {
      title: formatMessage({ id: 'marketingMonitor.createDate' }, '创建时间'),
      dataIndex: 'createDate',
    }, {
      title: formatMessage({ id: 'marketingMonitor.creativeType' }, '创意类型'),
      dataIndex: 'templateInfoType',
      render: text => this.getTypeValue(text),
    }, {
      title: formatMessage({ id: 'marketingMonitor.isEngine' }, '创意模板'),
      dataIndex: 'isEngine',
      render: text => (
        parseInt(text, 10) ? 
        formatMessage({ id: 'marketingMonitor.yes' }, '是') : 
        formatMessage({ id: 'marketingMonitor.no' }, '否')
      ),
    },];

    return(
      <Modal
        className={styles.marketingModal}
        title={formatMessage(
          {
            id: 'marketingMonitor.selectUser',
          },
          '选择用户',
        )}
        width={960}
        destroyOnClose
        visible={memberInfoVisible}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {formatMessage({ id: 'common.btn.cancel' }, '取消')}
          </Button>,
        ]}
        onCancel={this.handleCancel}
      >
        <section className="member-record-table">
          <Table
            rowKey={record => record.subs_id}
            columns={columns}
            dataSource={memberInfoList}
            loading={memberInfoListLoading}
            pagination={paginationProps}
            // onRow={this.onRow}
          />
        </section>
        <section className="detail-section">
          <Tabs 
            type="card"
          >
            <TabPane key="creative" tab={formatMessage({ id: 'marketingMonitor.creativeInfo' }, '创意信息')}>
              <section className="member-record-table">
                <Table
                  rowKey={(record, index) => index}
                  columns={creativeColumns}
                  dataSource={creativeList}
                  pagination={false}
                />
              </section>
            </TabPane>
            <TabPane key="offer" tab={formatMessage({ id: 'marketingMonitor.offer' }, '商品')}>
              <OfferList offerList={offerList}/>
            </TabPane>
          </Tabs>
        </section>
      </Modal>
    )
  }
}

export default MemberInfoModal;