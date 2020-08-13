import React, { Component } from 'react';
import { Table, message, Button } from 'antd';
import { connect } from 'dva';

@connect(({ loading }) => ({
  loading: loading.effects['creativeIdeaManage/getLabelInfoList'],
}))
class RelList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      selectedRows: [],
      selectedRowKeys: [],
    };
    this.columns = [
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
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'creativeIdeaManage/getLabelInfoList',
      payload: { statusCd: '02' },
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        this.setState({
          dataSource: res.svcCont.data,
        });
      } else {
        message.error('获取列表失败');
      }
    });
  };

  setTag = record => {
    this.setState({
      selectedRows: [record],
      selectedRowKeys: [record.labelId],
    });
  };

  okAdd = () => {
    const { selectedRows } = this.state;
    const { selectRel, handleCancel, curTagRelId } = this.props;
    if (!selectedRows[0]) {
      message.error('未选择标签');
      return;
    }
    selectRel(selectedRows[0], curTagRelId);
    handleCancel();
  };

  // 关闭弹窗
  handleCancel = () => {
    const { handleCancel } = this.props;
    handleCancel();
  };

  render() {
    const { dataSource, selectedRowKeys } = this.state;
    const { loading } = this.props;

    const rowSelection = {
      type: 'radio',
      onChange: (selectedRowKeys1, selectedRows) => {
        this.setState({
          selectedRows,
          selectedRowKeys: selectedRowKeys1,
        });
      },
      selectedRowKeys,
    };
    return (
      <div>
        <Table
          rowSelection={rowSelection}
          dataSource={dataSource}
          columns={this.columns}
          pagination={false}
          loading={loading}
          onRow={record => ({
            onClick: () => this.setTag(record), // 点击行
          })}
          rowKey="labelId"
        />
        <div style={{ textAlign: 'center' }}>
          <Button type="primary" onClick={this.okAdd}>
            确认
          </Button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Button onClick={this.handleCancel}>取消</Button>
        </div>
      </div>
    );
  }
}

export default RelList;
