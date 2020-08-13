import React from 'react';
import { Modal, Row, Col, Input, Table } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';

import commonStyles from '../../common.less';

const { Search } = Input;

@connect(({ activityFlowContact, loading }) => ({
  activityFlowContact,
  templateListLoading: loading.effects['/activityFlowContact/qryTemplateList'],
}))
class TemplateModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
      selectedRowKeys: [],
      templateName: '',
      templateList: [],
      pageInfo: {
        total: 0,
        pageNum: 1,
        pageSize: 5,
      }
    };
  }

  componentDidMount() {
    this.qryTemplateList();
  }

  handleSubmit = () => {
    const { onOk } = this.props;
    const { selectedRows } = this.state;
    onOk(selectedRows);
  };

  changeTemplateName = element => {
    this.setState({
      templateName: element.target.value,
    });
  }

  handleTableChange = (pageNum, pageSize) => {
    const { pageInfo } = this.state;
    this.setState({
      pageInfo: { ...pageInfo, pageNum, pageSize },
    }, () => {
      this.qryTemplateList();
    });
  };

  qryTemplateList = () => {
    const { dispatch } = this.props;
    const { templateName, pageInfo: prevPageInfo } = this.state;
    const { pageNum, pageSize } = prevPageInfo;

    dispatch({
      type: 'activityFlowContact/qryTemplateList',
      payload: {
        name: templateName,
        statusCd: '1100', // 启动状态
        pageInfo: {
          pageNum,
          pageSize,
        },
      },
      success: svcCont => {
        if(svcCont && svcCont.data) {
          const { data = [], pageInfo = {} } = svcCont;
          this.setState({
            templateList: data,
            pageInfo: {
              pageNum: pageInfo.pageNum || 1,
              pageSize: pageInfo.pageSize || pageSize,
              total: pageInfo.total,
            },
          });
        }
      }
    });
  }

  render() {
    const { visible, onCancel, templateListLoading, chooseMultiple } = this.props;
    const { pageInfo, templateList, selectedRowKeys } = this.state;

    const { total, pageNum, pageSize } = pageInfo;
    const paginationProps = {
      pageSizeOptions: ['5', '10', '20', '30', '40'],
      onChange: (page, size) => this.handleTableChange(page, size),
      onShowSizeChange: (current, size) => this.handleTableChange(current, size),
      showSizeChanger: true,
      showQuickJumper: true,
      current: pageNum,
      pageSize,
      total,
    }

    const columns = [{
      title: formatMessage({ id: 'activityConfigManage.contact.template.templateName' }),
      dataIndex: 'modelName',
    }, {
      title: formatMessage({ id: 'activityConfigManage.contact.template.camType' }),
      dataIndex: 'camType',
    }];

    const rowSelection = {
      hideDefaultSelections: !chooseMultiple,
      type: chooseMultiple ? 'checkbox' : 'radio',
      selectedRowKeys,
      onChange: (selectedKeys, selectedRows) => {
        this.setState({
          selectedRowKeys: selectedKeys,
          selectedRows,
        });
      },
    };

    return (
      <Modal
        title={formatMessage({ id: 'activityConfigManage.contact.addTemplate' })}
        visible={visible}
        width={718}
        onOk={this.handleSubmit}
        onCancel={onCancel}
        okText={formatMessage({ id: 'common.btn.submit' })}
        cancelText={formatMessage({ id: 'common.btn.back' })}
        wrapClassName={commonStyles.flowModal}
      >
        <Row style={{ marginBottom: '0.5em' }}>
          <Col>
            <span style={{ marginRight: '0.5em' }}>{formatMessage({ id: 'activityConfigManage.contact.template.templateName' })}:</span>
            <Search
              size="small"
              placeholder={formatMessage({ id: 'common.form.input' })}
              onChange={this.changeTemplateName}
              onPressEnter={this.qryTemplateList}
              onSearch={this.qryTemplateList}
              className={commonStyles.chooseSearch}
            />
          </Col>
        </Row>

        <Table
          loading={templateListLoading}
          rowKey={record => record.modelId}
          columns={columns}
          dataSource={templateList}
          pagination={paginationProps}
          rowSelection={rowSelection}
        />
      </Modal>
    );
  }
}

export default TemplateModal;