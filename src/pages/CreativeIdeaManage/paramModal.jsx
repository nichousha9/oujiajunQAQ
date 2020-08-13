import React, { Component } from 'react';
import { Row, Col, Input, Table, message, Modal } from 'antd';
import { connect } from 'dva';
// import styles from './index.less';

const { Search } = Input;
@connect(({ loading }) => ({
  loading: loading.effects['creativeIdeaManage/getLabelInfoList'],
}))
class ParamModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labelList: [],
      labelName: '',
      paramCode: '',
      selectedRows: [],
      selectedRowKeys: [],
    };
  }

  componentDidMount() {
    this.getLabelInfoList();
  }

  handleModalSubmit = () => {
    const { paramCode, selectedRows } = this.state;
    const { setParamCode, changeVisible } = this.props;
    if (selectedRows.length > 0) {
      if (setParamCode) {
        let paramIndex = '';
        switch (selectedRows[0].tableCode) {
          case 'ZQYTH_WID_CUST_BASE_INFO_D':
            paramIndex = 'A';
            break;
          case 'ZQYTH_WID_CUST_MEMBER_INFO_D':
            paramIndex = 'B';
            break;
          case 'ZQYTH_WID_CUST_COMPACT_INFO_D':
            paramIndex = 'C';
            break;
          default:
            paramIndex = '';
        }
        setParamCode(`${paramIndex}.${paramCode}`);
      }
      changeVisible(false);
      this.setState({
        paramCode: '',
        selectedRows: [],
        selectedRowKeys: [],
      });
    } else {
      message.info('请选择一个标签！');
    }
  };

  handleModalCancel = () => {
    const { changeVisible } = this.props;
    if (changeVisible) changeVisible(false);
  };

  getLabelInfoList = () => {
    const { dispatch } = this.props;
    const { labelName } = this.state;
    dispatch({
      type: 'creativeIdeaManage/getLabelInfoList',
      payload: { labelName, statusCd: '02' },
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        // 设置 state
        this.setState({
          labelList: res.svcCont.data,
        });
      }
    });
  };

  setParam = record => {
    this.setState({
      paramCode: record.labelCode,
      selectedRows: [record],
      selectedRowKeys: [record.labelId],
    });
  };

  render() {
    const { labelList, selectedRowKeys } = this.state;
    const { loading, visible } = this.props;
    const columns = [
      {
        title: '标签编码',
        dataIndex: 'labelCode',
      },
      {
        title: '标签来源',
        dataIndex: 'grpName',
      },
      {
        title: '标签名字',
        dataIndex: 'labelName',
      },
    ];
    const paginationInfo = {
      pageSize: 10,
      //   onChange: this.getLabelInfoList,
      showQuickJumper: true,
      defaultCurrent: 1,
      style: { marginTop: '20px', float: 'right' },
    };
    const rowSelection = {
      type: 'radio',
      onChange: (changeSelectedRowKeys, selectedRows) => {
        this.setState({
          paramCode: selectedRows[0].labelCode,
          selectedRows,
          selectedRowKeys: changeSelectedRowKeys,
        });
      },
      selectedRowKeys,
    };
    return (
      <Modal
        title="标签列表"
        visible={visible}
        width={730}
        onOk={this.handleModalSubmit}
        onCancel={this.handleModalCancel}
        okText="保存"
        destroyOnClose
        bodyStyle={{ padding: '0 24px' }}
      >
        <Row type="flex" justify="end" style={{ margin: '8px 0' }}>
          <Col span={6}>
            <Search
              size="small"
              placeholder="请输入标签名称"
              onSearch={this.getLabelInfoList}
              onChange={event => this.setState({ labelName: event.target.value })}
              // className={styles.filterInput}
            />
          </Col>
        </Row>
        <Table
          rowSelection={rowSelection}
          pagination={paginationInfo}
          size="middle"
          loading={loading}
          columns={columns}
          dataSource={labelList}
          onRow={record => ({
            onClick: () => this.setParam(record), // 点击行
          })}
          rowKey="labelId"
        />
      </Modal>
    );
  }
}

export default ParamModal;
