import React, { Component } from 'react';
import { Table, message, Modal } from 'antd';
import { connect } from 'dva';
// import styles from './index.less';

// const { Search } = Input;
@connect(({ loading }) => ({
  loading: loading.effects['creativeIdeaManage/getLabelInfoList'],
}))
class TagModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labelList: [],
      //   labelName: '',
      selectedRows: [],
      selectedRowKeys: [],
    };
  }

  componentDidMount() {
    this.getLabelInfoList();
  }

  handleModalSubmit = () => {
    const { selectedRows } = this.state;
    const { setTagData, changeVisible } = this.props;
    if (selectedRows.length > 0) {
      if (setTagData) setTagData(selectedRows[0]);
      changeVisible(false);
      this.setState({
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
    // const { labelName } = this.state;
    dispatch({
      type: 'creativeIdeaManage/getLabelInfoList',
      payload: { statusCd: '02' },
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        // 设置 state
        this.setState({
          labelList: res.svcCont.data,
        });
      }
    });
  };

  setTag = record => {
    this.setState({
      selectedRows: [record],
      selectedRowKeys: [record.labelId],
    });
  };

  render() {
    const { labelList, selectedRowKeys } = this.state;
    const { loading, visible } = this.props;
    const columns = [
      {
        title: '标签名称',
        dataIndex: 'labelName',
      },
      {
        title: '标签目录',
        dataIndex: 'GRP_NAME',
      },
      {
        title: '创建时间',
        dataIndex: 'CREATE_DATE',
      },
      {
        title: '修改时间',
        dataIndex: 'UPDATE_DATE',
        render: text => text || '暂未修改',
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
        {/* <Row type="flex" justify="end" style={{ margin: '8px 0' }}>
          <Col span={6}>
            <Search
              size="small"
              placeholder="请输入标签名称"
              onSearch={this.getLabelInfoList}
              onChange={event => this.setState({ labelName: event.target.value })}
              // className={styles.filterInput}
            />
          </Col>
        </Row> */}
        <Table
          rowSelection={rowSelection}
          pagination={paginationInfo}
          size="middle"
          loading={loading}
          columns={columns}
          dataSource={labelList}
          onRow={record => ({
            onClick: () => this.setTag(record), // 点击行
          })}
          rowKey="labelId"
        />
      </Modal>
    );
  }
}

export default TagModal;
