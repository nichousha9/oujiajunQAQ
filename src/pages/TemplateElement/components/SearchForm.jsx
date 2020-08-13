import React from 'react';
import { Form, Row, Col, Input, Select, Button } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';

import styles from '../index.less';

const { Option } = Select;

@connect(({ templateElement }) => ({
  pageInfo: templateElement.pageInfo,
  fieldTypeList: templateElement.fieldTypeList,
  workOrderTypeList: templateElement.workOrderTypeList,
}))
@Form.create({ name: 'element-search-form' })
class SearchForm extends React.Component {

  getSearchConditionValue = () => {
    const { form } = this.props;
    return form.getFieldsValue();
  }

  handleSearch = () => {
    const { dispatch, pageInfo, qryTemplateElementList } = this.props;
    dispatch({
      type: 'templateElement/getPageInfo',
      payload: { ...pageInfo, pageNum: 1 },
    });
    qryTemplateElementList(this.getSearchConditionValue());
  };

  resetForm = () => {
    const { form } = this.props;
    form.resetFields();
  }

  render() {
    const {
      form,
      fieldTypeList,
      workOrderTypeList,
    } = this.props;

    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    const colLayout = {
      sm: {
        span: 24,
      },
      md: {
        span: 6,
      },
    };


    return (
     <div className="show-advanced-div">
      <Form {...formItemLayout}>
        <Row gutter={16}>
          <Col {...colLayout}>
            <Form.Item label={formatMessage({ id: 'templateElement.elementName' }, '要素名称')}>
              {getFieldDecorator('columnName')(
                <Input
                  size="small"
                  placeholder={formatMessage({ id: 'common.form.input' }, '请输入')}
                  allowClear
                />,
              )}
            </Form.Item>
          </Col>
          <Col {...colLayout}>
            <Form.Item label={formatMessage({ id: 'templateElement.fieldType' }, '字段类型')}>
              {getFieldDecorator('columnType')(
                <Select
                  size="small"
                  placeholder={formatMessage({ id: 'common.form.select' }, '请选择')}
                  allowClear
                >
                  {fieldTypeList.map(fieldTypeItem => (
                    <Option key={fieldTypeItem.attrValueCode} value={fieldTypeItem.attrValueCode}>
                      {fieldTypeItem.attrValueName}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col {...colLayout}>
            <Form.Item label={formatMessage({ id: 'templateElement.workOrderType' }, '工单类别')}>
              {getFieldDecorator('orderType')(
                <Select
                  size="small"
                  placeholder={formatMessage({ id: 'common.form.select' }, '请选择')}
                  allowClear
                >
                  {workOrderTypeList.map(workOrderTypeItem => (
                    <Option key={workOrderTypeItem.code} value={workOrderTypeItem.code}>
                      {workOrderTypeItem.name}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col className={styles.btnGroup}>
            <Button size="small" type="primary" onClick={this.handleSearch} className={styles.btn}>
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
     </div>
    );
  }
}

export default SearchForm;