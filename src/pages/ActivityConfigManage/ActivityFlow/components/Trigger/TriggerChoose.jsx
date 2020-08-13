// 触发器选择弹窗
import React from 'react';
import { connect } from 'dva';
import { Modal, Table, Card } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import commonStyles from '../../common.less';

@connect(({ activityFlowListener, loading }) => ({
  activityFlowListener,
  loading: loading.effects['activityFlowListener/qryEventInputs'],
  detailLoading: loading.effects['activityFlowListener/qryEvtEventInfos'],
}))
class TriggerChoose extends React.Component {
  columns = [
    {
      title: formatMessage({ id: 'activityConfigManage.listener.name' }), // '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: formatMessage({ id: 'activityConfigManage.listener.code' }), // '编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: formatMessage({ id: 'activityConfigManage.listener.remark' }), // '备注',
      dataIndex: 'description',
      key: 'description',
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      pageNum: 1,
      pageSize: 5,
      pageInfo: {}, // 后端的返回
      eventSetList: [],
      selectedRow: {},
      detailList: [],
      detailSelectedRow: {}
    };
  }

  componentDidMount() {
    this.qryEventInputs();
  }

  /**
   *获取营销事件列表
   *
   * @memberof TriggerChoose
   */
  qryEventInputs = () => {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    dispatch({
      type: 'activityFlowListener/qryEventInputs',
      payload: {
        pageInfo: { pageNum, pageSize },
      },
      success: svcCont => {
        const { data: list = [], pageInfo = {} } = svcCont;
        this.setState(
          {
            eventSetList: list,
            pageInfo: {
              pageNum: pageInfo.pageNum,
              pageSize: pageInfo.pageSize,
              total: pageInfo.total,
            },
            selectedRow: (list && list.length && list[0]) || {},
          },
          this.fetchDetailList,
        );
      },
    });
  };

  /**
   *获取详情列表
   *
   * @memberof TriggerChoose
   */
  fetchDetailList = () => {
    const { dispatch } = this.props;
    const { selectedRow } = this.state;
    if (selectedRow && selectedRow.id) {
      dispatch({
        type: 'activityFlowListener/qryEvtEventInfos',
        payload: {
          inputId: selectedRow.id,
        },
        success: svcCont => {
          const { data = [] } = svcCont;
          this.setState({
            detailList: data,
            detailSelectedRow: (data && data.length && data[0]) || {},
          });
        },
      });
    } else {
      this.setState({
        detailList: [],
      });
    }
  };

  clickRow = (record, type) => {
    if(type === 'event') {
      this.setState({ selectedRow: record }, this.fetchDetailList);
    }
    else {
      this.setState({ detailSelectedRow: record });
    }
  };

  setClassName = record => {
    const { selectedRow } = this.state;
    // 判断索引相等时添加行的高亮样式
    return record.id === selectedRow.id ? commonStyles.tableRowSelect : '';
  };

  setDetailClassName = record => {
    const { detailSelectedRow } = this.state;
    // 判断索引相等时添加行的高亮样式
    return record.id === detailSelectedRow.id ? commonStyles.tableRowSelect : '';
  };

  // 提交
  handleSubmit = () => {
    const { onOk } = this.props;
    const { selectedRow, detailSelectedRow } = this.state;
    onOk({...detailSelectedRow, eventInputName: selectedRow.name});
  };

  // 列表条件切换
  onChange = pagination => {
    const { current: pageNum, pageSize } = pagination;
    this.setState(
      {
        pageNum,
        pageSize,
      },
      this.qryEventInputs,
    );
  };

  render() {
    const { visible, onCancel, loading, detailLoading } = this.props;
    const { eventSetList, pageInfo, detailList } = this.state;

    const pagination = {
      current: pageInfo.pageNum,
      pageSize: pageInfo.pageSize,
      total: pageInfo.total,
      showSizeChanger: true,
      showQuickJumper: true,
    };

    return (
      <Modal
        title={formatMessage({ id: 'activityConfigManage.listener.marketingEvent' })}
        visible={visible}
        width={960}
        onOk={this.handleSubmit}
        onCancel={onCancel}
        okText={formatMessage({ id: 'common.btn.submit' })}
        cancelText={formatMessage({ id: 'common.btn.back' })}
        wrapClassName={commonStyles.flowModal}
      >
        <div>
          <Card
            size="small"
            bordered={false}
            className={commonStyles.chooseWrapperCard}
          >
            <Table
              rowKey="id"
              dataSource={eventSetList}
              columns={this.columns}
              pagination={pagination}
              loading={loading}
              rowClassName={this.setClassName}
              onRow={record => ({ onClick: this.clickRow.bind(this, record, 'event') })}
              onChange={this.onChange}
              childrenColumnName='suibian'
            />
            <Table
              rowKey="id"
              dataSource={detailList}
              columns={this.columns}
              pagination={false}
              loading={detailLoading}
              rowClassName={this.setDetailClassName}
              onRow={record => ({ onClick: this.clickRow.bind(this, record, 'detail') })}
            />
          </Card>
        </div>
      </Modal>
    );
  }
}

export default TriggerChoose;
