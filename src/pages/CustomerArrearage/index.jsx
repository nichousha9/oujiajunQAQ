import React from 'react';
import { Card, Table, Row } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import classnames from 'classnames';
import { formatCurrency } from '@/utils/formatData';
import InfoBox from './components/InfoBox';
import CustomerArrearageFeatureInfo from './components/customerArrearageFeatureInfo';

import styles from './index.less';

@connect(({ customerArrearage, loading})=>({
  oweInfo: customerArrearage.oweInfo,
  pageInfo: customerArrearage.pageInfo,
  groupArrearsList: customerArrearage.groupArrearsList,
  groupArrearageListEffectLoading: loading.effects['customerArrearage/fetchGroupArrearsListEffect'],
}))
class CustomerArrearage extends React.Component {
  componentDidMount() {
    this.getOweInfo();
    this.getGroupArrearsList();
  }

  handleTableChange = (pageNum, pageSize) => {
    const { dispatch, pageInfo } = this.props;
    dispatch({
      type: 'customerArrearage/getPageInfo',
      payload: { ...pageInfo, pageNum, pageSize },
    });

    this.getGroupArrearsList();
  }

  getGroupArrearsList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerArrearage/fetchGroupArrearsListEffect',
      payload: { custCode: ''},
    });
  }

  getOweInfo = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerArrearage/fetchOweInfoEffect',
      payload: { custCode: '' },
    });
  }

  render() {
    const { 
      oweInfo = {},
      groupArrearsList,
      pageInfo,
      groupArrearageListEffectLoading,
    } = this.props;

    const { halfYearOweTime, oweReasonDesc } = oweInfo || {};
    const featureInfo = {
      halfYearOweTime,
      oweReasonDesc,
    };
    const { total, pageNum, pageSize } = pageInfo;

    const columns = [{
      title: formatMessage({ id: 'arrearageInfo.goodName' }, '产品名称'),
      dataIndex: 'prodName',
    }, {
      title: formatMessage({ id: 'customerArrearage.billingNumber' }, '计费号码'),
      dataIndex: 'accNbr',
    }, {
      title: formatMessage({ id: 'customerArrearage.goodStatus' }, '产品状态'),
      dataIndex: 'prodState',
    }, {
      title: formatMessage({ id: 'arrearageInfo.arrearsAccountPeriod' }, '欠费账期'),
      dataIndex: 'monthId',
    }, {
      title: formatMessage({ id: 'customerArrearage.arrearsAmount' }, '欠费金额（元）'),
      dataIndex: 'oweAmount',
      render: text => text ? formatCurrency(text) : '--',
    }, {
      title: formatMessage({ id: 'customerArrearage.forfeit' }, '滞纳金（元）'),
      dataIndex: 'lateFee',
      render: text => text ? formatCurrency(text) : '--',
    }];

    const paginationProps = {
      showSizeChanger: true, 
      showQuickJumper: true, 
      current: pageNum,
      total,
      pageSize,
      pageSizeOptions: ['5', '10', '20', '30', '40'],
      onChange: (page, size) => this.handleTableChange(page, size),
      onShowSizeChange: (current, size) => this.handleTableChange(current, size),
    }

     return (
       <div className={styles.customerArrearagePage}>
         <Card title={formatMessage({ id: 'menu.customerArrearage' }, '客户欠费视图')}>
           <Row className={classnames(styles.arrearageBlock, 'row-bottom-line')}>
             <InfoBox
               title={formatMessage(
                 { id: 'customerArrearage.currentAllArrears' },
                 '当前总欠费（元）',
               )}
               backgroundColor="#1890FF"
               icon="iconpiechart"
               description={oweInfo.oweAmount ? formatCurrency(oweInfo.oweAmount) : '--'}
             />
             <InfoBox
               title={formatMessage(
                 { id: 'arrearageInfo.whetherAllUsersAreInArrears' },
                 '是否所有用户欠费',
               )}
               backgroundColor="#7ED321"
               icon="iconYUAN"
               description={oweInfo.ifAllMemOwe}
             />
             <InfoBox
               title={formatMessage({ id: 'customerArrearage.accountManager' }, '客户经理')}
               backgroundColor="#F5A623"
               icon="iconuser"
               description={oweInfo.managerName}
             />
           </Row>

           <Row className={classnames(styles.arrearageBlock, 'row-bottom-line')}>
             <div className={styles.tableTitle}>
               {formatMessage(
                 { id: 'customerArrearage.groupArrearageList' },
                 '集团产品欠费信息列表',
               )}
             </div>
             <Table
               columns={columns}
               pagination={paginationProps}
               dataSource={groupArrearsList}
               loading={groupArrearageListEffectLoading}
             />
           </Row>
           
           <div className={styles.featureInfo}>
             <CustomerArrearageFeatureInfo featureInfo={featureInfo} />
           </div>
         </Card>
       </div>
     );
  }
}

export default CustomerArrearage;
