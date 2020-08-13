import React, { Component } from 'react';
import { Card, Col, DatePicker, Form, Input, Row } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
const { Item } = Form;

@connect(({ activityReview }) => ({
  formData: activityReview.formData,
}))
@Form.create()
class ReviewForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '', // 审核角色模板
    };
  }

  componentDidMount() {
    const { formData } = this.props;
    // 如果存在formData.taskOrderId数据，
    if (formData.taskOrderId) {
      this.fetchData();
    }
  }

  // 获取数据
  fetchData = () => {
    const { dispatch, formData } = this.props;
    dispatch({
      type: 'activityReview/qryFlowchartByRecordId',
      payload: {
        approvalRecordId: formData.id, // 审核单id
      },
      success: svcCont => {
        if (svcCont) {
          const { data } = svcCont;
          this.setState({
            name: data.name,
          });
        }
      },
    });
  };

  render() {
    const { form, formData } = this.props;
    const { name } = this.state;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
        xl: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        xl: { span: 18 },
      },
    };
    const rowColLayout = {
      xs: { span: 24 },
      sm: { span: 24 },
      md: { span: 12 },
    };
    return (
      <Card title="审核单编辑" bordered={false}>
        <Form {...formItemLayout}>
          <Row gutter={24}>
            <Col {...rowColLayout}>
              <Item label="活动名称" required>
                {getFieldDecorator('extName', { initialValue: formData.extName })(
                  <Input disabled />,
                )}
              </Item>
            </Col>
            <Col {...rowColLayout}>
              <Item label="编码" required>
                {getFieldDecorator('extCode', { initialValue: formData.extCode })(
                  <Input disabled />,
                )}
              </Item>
            </Col>
            <Col {...rowColLayout}>
              <Item label="创建时间">
                {getFieldDecorator('createDate', {
                  initialValue: formData.createDate
                    ? moment(formData.createDate, 'YYYY-MM-DD HH:mm:ss')
                    : null,
                })(<DatePicker format="YYYY-MM-DD HH:mm:ss" disabled showTime />)}
              </Item>
            </Col>
            <Col {...rowColLayout}>
              <Item label="审核角色模版">
                {getFieldDecorator('reviewTemplate', { initialValue: name })(<Input disabled />)}
              </Item>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }
}

export default ReviewForm;
