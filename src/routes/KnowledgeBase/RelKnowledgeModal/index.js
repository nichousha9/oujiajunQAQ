/* eslint-disable import/first */
import React from 'react';
import { Modal, Button, Badge, message } from 'antd';
import StandardTable from '../../../components/StandardTable';
import CommonShowEditor from '../../../components/CommonShowEditor';
import moment from 'moment';

const statusValue = {
  '1': 'success',
  '0': 'default',
};
const statusText = {
  '1': '已启用',
  '0': '已停用',
};
const columns = [
  {
    title: '标题',
    dataIndex: 'title',
  },
  {
    title: '答案',
    dataIndex: 'content',
    render: (data) => {
      return <CommonShowEditor data={data} />;
    },
  },
  {
    title: '修改时间',
    dataIndex: 'updatetime',
    width: 170,
    render: (val) => {
      return !val ? '' : <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>;
    },
  },
  {
    title: '状态',
    dataIndex: 'isenable',
    width: 100,
    render(val) {
      return <Badge status={statusValue[val]} text={statusText[val]} />;
    },
  },
];
export default class RelKnowledgeModal extends React.Component {
  state = {
    knowledgeList: {
      list: [],
      pagination: {
        pageSize: 10,
        total: 0,
      },
    },
  };
  componentDidMount() {
    const { onloadList } = this.props;
    if (onloadList) onloadList();
  }
  componentWillReceiveProps(nextProps) {
    const { knowledgeList } = nextProps;
    if (JSON.stringify(knowledgeList) !== JSON.stringify(this.state.knowledgeList)) {
      this.setState({ knowledgeList });
    }
  }
  handleOk = () => {
    const { selectedRowKeys, selectedRows } = this.tableRef.state;
    const { handleModalOk } = this.props;
    if (!selectedRowKeys.length) {
      message.error('请选择要关联的知识点');
      return;
    }
    if (handleModalOk) handleModalOk(selectedRows);
  };
  tableChangePage = (pageInfo) => {
    const { onloadList } = this.props;
    const { pagination = {} } = this.tableRef || {};
    if (onloadList) onloadList(pageInfo.current, pagination);
  };
  tableRef; // 存放表的数据
  render() {
    const { visible, closeModal } = this.props;
    const { knowledgeList } = this.state;
    const tabProps = {
      onChange: this.tableChangePage,
      rowKey: (record) => record.id,
      selectedRows: [],
      columns,
      data: knowledgeList,
    };
    return (
      <Modal
        width={700}
        title="添加关联知识点"
        visible={visible}
        onCancel={closeModal}
        bodyStyle={{ padding: 0 }}
        footer={[
          <Button key="back" onClick={closeModal}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={this.handleOk}>
            提交
          </Button>,
        ]}
      >
        <div style={{ padding: 30 }}>
          <StandardTable
            ref={(ele) => {
              this.tableRef = ele;
            }}
            {...tabProps}
          />
        </div>
      </Modal>
    );
  }
}
