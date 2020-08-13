import React, { Component } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import moment from 'moment';
import { Modal, Button, Table, Row, Col, Input, Empty } from 'antd';
import styles from '../index.less';

const { Search } = Input;

@connect(({ labelConfig }) => ({
  labelListData: labelConfig.labelListData,
}))
class LabelListModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
    };
  }

  componentWillMount() {}

  componentDidMount() {}

  getColums = () => {
    return [
      {
        title: formatMessage(
          {
            id: 'labelConfigManage.labelManage.labelName',
          },
          '标签名称',
        ),
        dataIndex: 'labelName',
        sorter: (a, b) => {
          if (a.labelName < b.labelName) {
            return -1;
          }
          if (a.labelName > b.labelName) {
            return 1;
          }
          return 0;
        },
      },
      {
        title: formatMessage(
          {
            id: 'labelConfigManage.labelManage.labelCatalog',
          },
          '标签目录',
        ),
        dataIndex: 'GRP_NAME',
        sorter: (a, b) => {
          if (a.GRP_NAME < b.GRP_NAME) {
            return -1;
          }
          if (a.GRP_NAME > b.GRP_NAME) {
            return 1;
          }
          return 0;
        },
      },
      {
        title: formatMessage(
          {
            id: 'common.table.createTime',
          },
          '创建时间',
        ),
        dataIndex: 'CREATE_DATE',
        sorter: (a, b) => {
          if (moment(a.CREATE_DATE).isBefore(b.CREATE_DATE)) {
            return -1;
          }
          if (moment(a.CREATE_DATE).isAfter(b.CREATE_DATE)) {
            return 1;
          }
          return 0;
        },
      },
    ];
  };

  afterModalClose = () => {
    // 情况之前保存的列表数据
    const { dispatch } = this.props;
    dispatch({
      type: 'labelConfig/resetLabelListData',
    });

    this.setState({
      selectedRowKeys: [],
      selectedRows: [],
    });
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRowKeys,
      selectedRows,
    });
  };

  render() {
    const { modalVisible, modalTitle, hideModal, labelListData, handleOK, modalType } = this.props;
    const { selectedRowKeys, selectedRows } = this.state;

    const rowSelection = {
      selectedRowKeys,
      type: 'radio',
      onChange: this.onSelectChange,
    };

    return (
      <Modal
        visible={modalVisible}
        title={modalTitle}
        onCancel={hideModal}
        width="774px"
        className={styles.modal}
        afterClose={this.afterModalClose}
        footer={
          <div className={styles.modalFooter}>
            <Button
              size="small"
              type="primary"
              key="submit"
              onClick={() => {
                handleOK(selectedRows, modalType);
              }}
            >
              确认
            </Button>
            <Button size="small" key="back" onClick={hideModal}>
              返回
            </Button>
          </div>
        }
      >
        <Row type="flex" justify="end">
          <Col span={8} pull={1}>
            <Search size="small" className={styles.listSearch} placeholder="请输入标签名称" />
          </Col>
        </Row>
        <Table
          columns={this.getColums()}
          pagination={{ showSizeChanger: true, showQuickJumper: true }}
          dataSource={labelListData && labelListData.data ? labelListData.data : []}
          rowKey="labelId"
          rowSelection={rowSelection}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={formatMessage(
                  {
                    id: 'component.noticeIcon.empty',
                  },
                  '暂无数据',
                )}
              />
            ),
          }}
        />
      </Modal>
    );
  }
}

export default LabelListModal;
