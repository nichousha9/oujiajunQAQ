import React from 'react';
import { Form, Input, Select, Row, Col, Button } from 'antd';
import { connect } from 'dva';
import { formatMessage, getLocale } from 'umi-plugin-react/locale';
import CellModal from './CellModal';
import styles from '../index.less';
import { commonColLayout, commonFormItemLayout } from '../common';

const { Option } = Select;

@connect(({ responseMonitor }) => ({
  executeStatusList: responseMonitor.executeStatusList,
  cellNames: responseMonitor.cellNames,
  cellIds: responseMonitor.cellIds,
  cellVisible: responseMonitor.cellVisible,
  pageInfo: responseMonitor.pageInfo,
}))
@Form.create({ name: 'response-form'})
class AdvanceForm extends React.Component {

  componentDidMount() {
    this.getExecuteStatusList();
  }

  onCellSearch = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'responseMonitor/handleCellVisible',
      payload: true,
    });
  }

  onChange = e => {
    const { dispatch } = this.props;

    if(e.target.value === '') {
      // 被清空
      dispatch({
        type: 'responseMonitor/getSelectedCells',
        payload: []
      });
    }
  }

  afterClose = () => {
    this.setCellNamesField();
  }

  setCellNamesField = () => {
    const { form, cellNames } = this.props;
    form.setFieldsValue({
      cellNames
    });
  }

  getExecuteStatusList = () => {
    // TODO: 获取执行状态列表
    const { dispatch } = this.props;
    const language = getLocale();
    const attrSpecCode = 'FULFILL_STATE';
    const payload = {
      language,
      attrSpecCode,
    }

    dispatch({
      type: 'responseMonitor/getExecuteStatusListEffect',
      payload
    });
    
  }

  resetForm = () => {
    // TODO: 清空表单数据
    const { form } = this.props;
    form.resetForm();
  }

  handleSearch = async () => {
    const { form, getExecuteList, dispatch, pageInfo } = this.props;
    const fieldsValue = form.getFieldsValue();
    const { pageSize } = pageInfo;
    await dispatch({
      type: 'responseMonitor/getPageInfo',
      payload: { pageNum: 1, pageSize },
    });
    getExecuteList(fieldsValue);
  }

  render() {
    const { form, executeStatusList, cellVisible } = this.props;
    const { getFieldDecorator } = form;

    return (
      <>
        <Form {...commonFormItemLayout}>
          <Row className="row-bottom-line">
            <Col {...commonColLayout}>
              <Form.Item
                label={formatMessage(
                  {
                    id: 'responseMonitor.cell',
                  },
                  '单元',
                )}
              >
                {getFieldDecorator('cellNames')(
                  <Input.Search 
                    size="small" 
                    allowClear 
                    onSearch={this.onCellSearch} 
                    onChange={this.onChange}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...commonColLayout}>
              <Form.Item
                label={formatMessage(
                  {
                    id: 'responseMonitor.executeStatus',
                  },
                  '执行状态',
                )}
              >
                {getFieldDecorator('state')(
                  <Select
                    size="small"
                    allowClear
                    placeholder={formatMessage(
                      {
                        id: 'common.form.select',
                      },
                      '请选择',
                    )}
                  >
                    {executeStatusList.map(executeStatus => (
                      <Option key={executeStatus.attrValueCode}>{executeStatus.attrValueName}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...commonColLayout}>
              <Form.Item
                label={formatMessage(
                  {
                    id: 'responseMonitor.serviceNumber'
                  },
                  '服务号码'
                )}
              >
                {getFieldDecorator('mdnFrom')(
                  <Input
                    allowClear
                    size="small"
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
      
          <Row gutter={16} className="row-bottom-line">
              <Col className={styles.btnGroup}>
                <Button
                  className={styles.queryBtn}
                  size="small"
                  type="primary"
                  onClick={this.handleSearch}
                >
                  {formatMessage(
                    {
                      id: 'common.btn.search',
                    },
                    '搜索',
                  )}
                </Button>
                <Button size="small" onClick={this.resetForm}>
                  {formatMessage(
                    {
                      id: 'common.btn.reset',
                    },
                    '重置',
                  )}
                </Button>
              </Col>
          </Row>
        </Form>
       { cellVisible ? <CellModal afterClose={this.afterClose}/> : null}
      </>
    );
  }
}

export default AdvanceForm;