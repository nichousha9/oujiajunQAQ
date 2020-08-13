import React from 'react';
import { Form, Row, Col, Input } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { commonColLayout, commonFormItemLayout } from '../common';

@Form.create({ 
  name: 'response-detail',
  mapPropsToFields(props) {
    return props.replyDetail ? {
      campaignName: Form.createFormField({ value: props.replyDetail.campaignName }),
      offerName: Form.createFormField({ value: props.replyDetail.offerName }),
      contactNumber: Form.createFormField({ value: props.replyDetail.contactNumber }),
      cellName: Form.createFormField({ value: props.replyDetail.cellName }),
      stateName: Form.createFormField({ value: props.replyDetail.stateName }),
      stateDate: Form.createFormField({ value: props.replyDetail.stateDate }),
      requestDate: Form.createFormField({ value: props.replyDetail.requestDate }),
      treatmentCode: Form.createFormField({ value: props.replyDetail.treatmentCode }),
      transactionNo: Form.createFormField({ value: props.replyDetail.transactionNo }),
      processCode: Form.createFormField({ value: props.replyDetail.processCode }),
      comments: Form.createFormField({ value: props.replyDetail.comments }),
    } : {};
  },
})
class ReplyDetail extends React.Component {
  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    
    return (
      <Form {...commonFormItemLayout}>
        <Row>
          <Col {...commonColLayout}>
            <Form.Item label={formatMessage({ id: 'responseMonitor.campaignName' }, '活动名称')}>
              {getFieldDecorator('campaignName')(<Input size="small" readOnly />)}
            </Form.Item>
          </Col>
          <Col {...commonColLayout}>
            <Form.Item label={formatMessage({ id: 'responseMonitor.Offer' }, '商品名称')}>
              {getFieldDecorator('offerName')(<Input size="small" readOnly />)}
            </Form.Item>
          </Col>
          <Col {...commonColLayout}>
            <Form.Item label={formatMessage({ id: 'responseMonitor.number' }, '号码')}>
              {getFieldDecorator('contactNumber')(<Input size="small" readOnly />)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col {...commonColLayout}>
            <Form.Item label={formatMessage({ id: 'responseMonitor.cellName' }, '单元名称')}>
              {getFieldDecorator('cellName')(<Input size="small" readOnly />)}
            </Form.Item>
          </Col>
          <Col {...commonColLayout}>
            <Form.Item label={formatMessage({ id: 'responseMonitor.state' }, '状态')}>
              {getFieldDecorator('stateName')(<Input size="small" readOnly />)}
            </Form.Item>
          </Col>
          <Col {...commonColLayout}>
            <Form.Item label={formatMessage({ id: 'responseMonitor.statusDate' }, '状态日期')}>
              {getFieldDecorator('stateDate')(<Input size="small" readOnly />)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col {...commonColLayout}>
            <Form.Item label={formatMessage({ id: 'responseMonitor.requestDate' }, '需求日期')}>
              {getFieldDecorator('requestDate')(<Input size="small" readOnly />)}
            </Form.Item>
          </Col>
          <Col {...commonColLayout}>
            <Form.Item label={formatMessage({ id: 'responseMonitor.treatmentCode' }, '处理号码')}>
              {getFieldDecorator('treatmentCode')(<Input size="small" readOnly />)}
            </Form.Item>
          </Col>
          <Col {...commonColLayout}>
            <Form.Item label={formatMessage({ id: 'responseMonitor.transactionNo' }, '事务编码')}>
              {getFieldDecorator('transactionNo')(<Input size="small" readOnly />)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col {...commonColLayout}>
            <Form.Item label={formatMessage({ id: 'responseMonitor.processCode' }, '进程号码')}>
              {getFieldDecorator('processCode')(<Input size="small" readOnly />)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 21 }} sm={{ span: 24 }}>
            <Form.Item 
              label={formatMessage({ id: 'responseMonitor.comments' }, '备注')}
              labelCol={{ xs: { span: 24 }, sm: { span: 8 }, md: { span: 3 }}}
              wrapperCol={{ xs: { span: 24 }, sm: { span: 16 }, md: { span: 21 }}}
            >
              {getFieldDecorator('comments')(<Input readOnly />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default ReplyDetail;
