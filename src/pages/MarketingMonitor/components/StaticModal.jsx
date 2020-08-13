import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import { Modal, Button, Table, Row, Col } from 'antd';
import ReactEcharts from 'echarts-for-react';
import styles from '../index.less';

@connect(({ marketingMonitor }) => ({
  staticVisible: marketingMonitor.staticVisible,
  selectedBatch: marketingMonitor.selectedBatch,
}))
class StaticModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      staticList: [],
      // option: {},
    }
  }

  componentDidMount() {
    this.getStaticList();
    // this.getOption();
  }

  getPercentage = (num1, num2, fix) => {
    let num = 0;
    const operation1 = parseInt(num1, 10);
    const operation2 = parseInt(num2, 10);
    if (operation2) {
      num = operation1 / operation2;
    }
    return `${(num * 100).toFixed(fix)}%`;
  }

  getStaticList = () => {
    const { selectedBatch } = this.props;
    const { SUCCEED_NUM, FAILED_NUM, PENDING_NUM, TOTAL_NUM, PROCESS_TYPE } = selectedBatch;
    const staticList = [{
      resultName : formatMessage({ id: 'common.message.successfully' }, '成功'),
      count : SUCCEED_NUM,
      percentage: this.getPercentage(SUCCEED_NUM, TOTAL_NUM, 2),
      processType: PROCESS_TYPE
     }, {
      resultName : formatMessage({ id: 'common.message.failedTo' }, '失败'),
      count : FAILED_NUM,
      percentage: this.getPercentage(FAILED_NUM, TOTAL_NUM, 2),
      processType: PROCESS_TYPE
    }, {
      resultName : formatMessage({ id: 'marketingMonitor.pending' }, '在途'),
      count : PENDING_NUM,
      percentage: this.getPercentage(PENDING_NUM, TOTAL_NUM, 2),
      processType: PROCESS_TYPE
    }, {
      resultName : formatMessage({ id: 'marketingMonitor.total' }, '总数'),
      count : TOTAL_NUM,
      percentage: this.getPercentage(TOTAL_NUM,TOTAL_NUM, 2),
      processType: PROCESS_TYPE
    }];

    this.setState({
      staticList
    });
  }

  getOption = () => {
    const { selectedBatch } = this.props;
    const { SUCCEED_NUM, FAILED_NUM, PENDING_NUM } = selectedBatch;
    const data = [{
      value: SUCCEED_NUM,
      name: formatMessage({ id: 'common.message.successfully' }, '成功'),
    }, {
      value: FAILED_NUM,
      name: formatMessage({ id: 'common.message.failedTo' }, '失败'),
    }, {
      value: PENDING_NUM,
      name: formatMessage({ id: 'marketingMonitor.pending' }, '在途'),
    },]
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      series: [
        {
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          name: formatMessage({ id: 'marketingMonitor.statisticalInfo'}, '统计信息'),
          data,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };

    return option;
  }

  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'marketingMonitor/handleStaticVisible',
      payload: false,
    });
  };

  render() {
    const { staticVisible } = this.props;
    const { staticList } = this.state;

    const columns = [{
      title: '',
      dataIndex: 'resultName',
    }, {
      title: formatMessage({ id: 'marketingMonitor.count' }, '数量'),
      dataIndex: 'count',
    }, {
      title: formatMessage({ id: 'marketingMonitor.percentage' }, '百分比'),
      dataIndex: 'percentage',
      render: (text, record)=> record.processType === 'LISTENER' ? '--': text
    }];

    return (
      <Modal
        className={styles.marketingModal}
        title={formatMessage(
          {
            id: 'marketingMonitor.statisticalInfo',
          },
          '统计信息',
        )}
        width={960}
        destroyOnClose
        visible={staticVisible}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {formatMessage({ id: 'common.btn.cancel' }, '取消')}
          </Button>,
        ]}
        onCancel={this.handleCancel}
      >
        <Row>
          <Col span={12}>
            <section>
              <ReactEcharts
                option={this.getOption()}
              />
            </section>
          </Col>
          <Col span={12}>
            <Table
              rowKey={(record, index) => index}
              columns={columns}
              dataSource={staticList}
              pagination={false}
            />
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default StaticModal;