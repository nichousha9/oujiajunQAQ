/* eslint-disable no-unused-vars */
import React from 'react';
import { Card, Table, Row, Descriptions, Button, Empty } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import classnames from 'classnames';
import { formatMessage } from 'umi-plugin-react/locale';
// import _ from 'lodash';
// _.toLower
import styles from './index.less';

@connect(({ loading, workOrder }) => ({
  workOrder,
  qryContactDetailLoading: loading.effects['workOrder/qryContactDetail'],
}))
class Detail extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      baseInfo: [],
      columns: [],
      listList: [],
    };
  }

  // componentDidMount() {
  //   const {
  //     dispatch,
  //     location: { query },
  //   } = this.props;

  //   dispatch({
  //     type: 'workOrder/qryContactDetail',
  //     payload: {
  //       orderId: query.orderId,
  //     },
  //   });
  // }

  componentDidMount() {
    const { location, dispatch } = this.props;
    const {
      query: { orderId },
    } = location;
    dispatch({
      type: 'workOrder/qryContactDetail',
      payload: {
        orderId,
      },
      success: svcCont => {
        const { baseColumns, baseList, listColumns, listList } = svcCont.data;
        if (baseColumns) {
          this.getBaseInfo(baseColumns, baseList);
        }

        if (listColumns) {
          this.getColumns(listColumns);
        }

        this.setState({
          listList,
        });
      },
    });
  }

  getBaseInfo = (baseColumns, baseList) => {
    const baseInfo = baseColumns.map(baseColumnItem => {
      const [targetBaseList] = baseList;
      const columnValue = targetBaseList[`${baseColumnItem.columnCode}`];
      return {
        ...baseColumnItem,
        columnValue,
      };
    });
    this.setState({
      baseInfo,
    });
  };

  getColumns = listColumns => {
    const columns = listColumns.map(listColumnItem => {
      return {
        title: listColumnItem.columnName,
        dataIndex: listColumnItem.columnCode,
      };
    });
    this.setState({
      columns,
    });
  };

  goBack = () => {
    const { location } = this.props;
    const {
      query: { type },
    } = location;
    // type : [workOrder, activityWork], 指明从哪一个页面模块
    router.push({
      pathname: type === 'workOrder' ? '/workOrder' : '/activityWork',
    });
  };

  render() {
    const { baseInfo, columns, listList, qryContactDetailLoading } = this.state;
    const {
      location: {
        query: { record, camTypes },
      },
    } = this.props;
    // const camType = camTypes.filter(item => item.busiCode === record.camType) || [];
    return (
      <div className={styles.workOrderDetailPage}>
        <Card
          title={formatMessage({ id: 'workOrder.workOrderDetail', defaultMessage: '工单详情' })}
          extra={
            <Button
              onClick={() => {
                this.goBack();
              }}
              icon="rollback"
              size="small"
            >
              {formatMessage({ id: 'workOrder.backToList' })}
            </Button>
          }
          loading={qryContactDetailLoading}
        >
          <Row className={classnames(styles.arrearageBlock, styles.basicInfo, 'row-bottom-line')}>
            <div className={styles.tableTitle}>{formatMessage({ id: 'workOrder.baseInfo' })}</div>
            {baseInfo && baseInfo.length > 0 ? (
              <Descriptions column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
                {baseInfo.map(baseItem => (
                  <Descriptions.Item label={baseItem.columnName} key={baseItem.columnCode}>
                    {baseItem.columnValue}
                  </Descriptions.Item>
                ))}
              </Descriptions>
            ) : (
              <Empty />
            )}

            {/* <Descriptions.Item label="工单处理状态">
                {record.executeState || ''}
              </Descriptions.Item>
              <Descriptions.Item label="工单ID">{record.orderId || ''}</Descriptions.Item>
              {record.custType === '集团' ? null : (
                <Descriptions.Item label="成员ID">{record.memName || ''}</Descriptions.Item>
              )}
              <Descriptions.Item label="活动状态">{record.campaignState || ''}</Descriptions.Item>
              <Descriptions.Item label="活动ID">{record.campaignId || ''}</Descriptions.Item>
              <Descriptions.Item label="工单状态">{record.statusCd || ''}</Descriptions.Item>
              <Descriptions.Item label="客户名称">{record.custName || ''}</Descriptions.Item>
              <Descriptions.Item label="所属客户经理姓名">
                {record.managerName || ''}
              </Descriptions.Item>
              <Descriptions.Item label="方案名称">{record.extName || ''}</Descriptions.Item>
              <Descriptions.Item label={record.custType === '集团' ? '集团ID' : '成员ID'}>
                {record.subsId || ''}
              </Descriptions.Item>

              <Descriptions.Item label="处理类型">{record.custType || ''}</Descriptions.Item>
              <Descriptions.Item label="处理人姓名">{record.staffName || ''}</Descriptions.Item>
              <Descriptions.Item label="派发时间">{record.createDate || ''}</Descriptions.Item>
              <Descriptions.Item label="活动类型">{camType[0].busiName || ''}</Descriptions.Item>
              <Descriptions.Item label="到期时间">{record.planEndDate || ''}</Descriptions.Item>
            </Descriptions> */}
          </Row>

          {listList && listList.length > 0 ? (
            <Row className={classnames(styles.arrearageBlock, 'row-bottom-line')}>
              <div className={styles.tableTitle}>{formatMessage({ id: 'workOrder.listInfo' })}</div>
              <Table
                rowKey={(_, index) => index}
                columns={columns}
                dataSource={listList}
                scroll={{ x: 1300 }}
                pagination={false}
              />
            </Row>
          ) : null}
        </Card>
      </div>
    );
  }
}

export default Detail;
