// 名单选择弹窗
import React from 'react';
import { connect } from 'dva';
import { Modal, Table, Input, Card } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import commonStyles from '../../common.less';
import styles from './index.less';
const { Search } = Input;

@connect(({ activityFlowContact, loading }) => ({
  activityFlowContact,
  loading: loading.effects['activityFlowContact/qryMccSegmentInfo'],
}))
class SegmentChoose extends React.Component {
  columns = [
    {
      title: formatMessage({ id: 'activityConfigManage.contact.segmentName' }), // '群组名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: formatMessage({ id: 'activityConfigManage.contact.segmentCount' }), // '群组数量',
      dataIndex: 'segmentcount',
      key: 'segmentcount',
    },
    {
      title: formatMessage({ id: 'activityConfigManage.contact.description' }), // '描述',
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
      segmentName: '',
      segmentList: [],
      selectedSegmentSet: {},
    };
  }

  componentDidMount() {
    this.qryMccSegmentInfo();
  }

  /**
   *获取分群列表
   *
   * @memberof SegmentChoose
   */
  qryMccSegmentInfo = () => {
    const { dispatch, segmentType } = this.props;
    const { pageNum, pageSize, segmentName } = this.state;
    dispatch({
      type: 'activityFlowContact/qryMccSegmentInfo',
      payload: {
        pageInfo: { pageNum, pageSize },
        segmentName, // 分群名称
        segmentType, // 102 白名单,  103 红名单,  104 黑名单
      },
      success: svcCont => {
        const { data, pageInfo = {} } = svcCont;
        this.setState({
          segmentList: data,
          pageInfo: {
            pageNum: pageInfo.pageNum,
            pageSize: pageInfo.pageSize,
            total: pageInfo.total,
          },
        });
      },
    });
  };

  // 规则集列表搜索文字改变
  segmentNameChange = e => {
    const { value } = e.target;
    this.setState({ segmentName: value });
  };

  clickRow = record => {
    this.setState({ selectedSegmentSet: record });
  };

  setClassName = record => {
    const { selectedSegmentSet } = this.state;
    // 判断索引相等时添加行的高亮样式
    return record.segmentid === selectedSegmentSet.segmentid ? commonStyles.tableRowSelect : '';
  };

  // 提交
  handleSubmit = () => {
    const { onOk } = this.props;
    const { selectedSegmentSet } = this.state;
    onOk(selectedSegmentSet);
  };

  // 列表条件切换
  onChange = pagination => {
    const { current: pageNum, pageSize } = pagination;
    this.setState(
      {
        pageNum,
        pageSize,
      },
      this.qryMccSegmentInfo,
    );
  };

  render() {
    const { visible, onCancel, loading } = this.props;
    const { segmentList, pageInfo } = this.state;

    const pagination = {
      current: pageInfo.pageNum,
      pageSize: pageInfo.pageSize,
      total: pageInfo.total,
      showSizeChanger: true,
      showQuickJumper: true,
    };

    return (
      <Modal
        title={formatMessage({ id: 'activityConfigManage.contact.selectSegment' })}
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
                onChange={this.segmentNameChange}
                onPressEnter={this.qryMccSegmentInfo}
                onSearch={this.qryMccSegmentInfo}
                className={commonStyles.chooseSearch}
              />
            }
          >
            <Table
              rowKey="segmentid"
              dataSource={segmentList}
              columns={this.columns}
              pagination={pagination}
              loading={loading}
              rowClassName={this.setClassName}
              onRow={record => ({ onClick: this.clickRow.bind(this, record) })}
              onChange={this.onChange}
            />
          </Card>
        </div>
      </Modal>
    );
  }
}

export default SegmentChoose;
