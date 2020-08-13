import React from 'react';
import { Modal, Table, Row, Input, Col, Button } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import classnames from 'classnames';
import styles from '../index.less';

@connect(({ loading })=>({
  schemaListEffectLoading: loading.effects['algorithmModel/qrySchemaListEffect'],
}))
class FeatureModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      schemaList: [],
      pageNum: 1,
      total: 0,
      pageSize: 5,
      schemaName: '',
      schemaCode: '',
      // 选择行
      selectedRows: [],
      selectedRowKeys: [],
    }
  }

  componentDidMount() {
    this.qrySchemaList();
  }

  qrySchemaList = () => {
    const { schemaName, schemaCode, pageNum, pageSize } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'algorithmModel/qrySchemaListEffect',
      payload: {
        schemaName,
        schemaCode,
        pageInfo: {
          pageNum,
          pageSize,
        }
      },
      callback: svcCont => {
        const { data, pageInfo } = svcCont;
        this.setState({
          schemaList: data,
          pageNum: pageInfo.pageNum || 1,
          pageSize: pageInfo.pageSize || pageSize,
          total: pageInfo.total,
        });
      }
    });
  }

  // 监听输入
  onSchemaNameChange = e => {
    this.setState({
      schemaName: e.target.value,
    });
  }

  onSchemaCodeChange = e => {
    this.setState({
      schemaCode: e.target.value,
    });
  }

  handleSearch = () => {
    this.setState({
      pageNum: 1, // 重置页数
    }, () => {
      this.qrySchemaList();
    });
  }

  handleTableChange = (pageNum, pageSize) => {
    this.setState({
      pageNum,
      pageSize,
    }, () => {
      this.qrySchemaList();
    });
  }

  handleOk = () => {
    const { onFeatureOk } = this.props;
    const { selectedRows } = this.state;
    onFeatureOk(selectedRows);
  }

  render() {
    const { isFeatureVisible, handleFeatureCancel, schemaListEffectLoading } = this.props;
    const { schemaList, pageNum, total, pageSize, selectedRowKeys } = this.state;
    const columns = [{
      title: formatMessage({ id: 'algorithmModel.schema.schemaName' }),
      dataIndex: 'schemaName',
    }, {
      title: formatMessage({ id: 'algorithmModel.schema.schemaCode' }),
      dataIndex: 'schemaCode',
    }, {
      title: formatMessage({ id: 'algorithmModel.schema.status' }),
      dataIndex: 'status',
    }];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: pageNum,
      total,
      pageSize,
      pageSizeOptions: ['10', '20', '30', '40'],
      onChange: (page, size) => this.handleTableChange(page, size),
      onShowSizeChange: (current, size) => this.handleTableChange(current, size),
    };

    const rowSelection = {
      selectedRowKeys,
      type: 'radio',
      onChange: (keys, rows) => {
        this.setState({
          selectedRowKeys: keys,
          selectedRows: rows,
        });
      },
    };

    return (
      <Modal
        title={formatMessage({ id: 'algorithmModel.chooseFeature' })}
        width={718}
        destroyOnClose
        visible={isFeatureVisible}
        onOk={this.handleOk}
        onCancel={handleFeatureCancel}
      >
        <Row className={classnames(['show-advanced-div', styles.featureSearch])}>
          <Col xs={24} sm={8} className={styles.featureFooterBtn}>
            <span>
              {formatMessage({ id: 'algorithmModel.schema.schemaName' })}:
            </span>
            <Input className={styles.featureControl} size="small" allowClear onChange={this.onSchemaNameChange}/>
          </Col>
          <Col xs={24} sm={8} className={styles.featureFooterBtn}>
            <span>
              {formatMessage({ id: 'algorithmModel.schema.schemaCode' })}:
            </span>
            <Input className={styles.featureControl} size="small" allowClear onChange={this.onSchemaCodeChange}/>
          </Col>
          <Col xs={24} sm={7}>
            <Button size="small" type="primary" onClick={this.handleSearch}>
              {formatMessage({ id: 'common.btn.search' })}
            </Button>
          </Col>
        </Row>
        <Row>
          <Table
            rowKey={record => record.schemaId}
            dataSource={schemaList}
            columns={columns}
            pagination={paginationProps}
            rowSelection={rowSelection}
            loading={schemaListEffectLoading}
          />
        </Row>
      </Modal>
    );
  }
}

export default FeatureModal;