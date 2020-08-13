import React, { PureComponent } from 'react';
import { Form, Row, Col, Input, DatePicker, InputNumber } from 'antd';
import moment from 'moment';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from '../index.less';

@Form.create({})
class BasicInfo extends PureComponent {
  state = {
    starttime: null,
    endtime: null,
  };

  componentDidMount() {}

  disabledDate = current => {
    // Can not select days before today
    return current < moment().startOf('day');
  };

  disabledEndDate = current => {
    const { starttime } = this.state;
    return current < starttime;
  };

  onChange = value => {
    const { endtime } = this.state;
    const { form } = this.props;
    if (value > endtime) {
      this.setState({ endtime: null });
      form.setFieldsValue({ offerExpDate: null });
    }
    this.setState({ starttime: value });
  };

  onChangeEndDate = value => {
    this.setState({ endtime: value });
  };

  render() {
    const { form, values } = this.props;
    const { getFieldDecorator } = form;
    const { readOnly } = values;
    return (
      <Form
        className={styles.infoFormStyle}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        onSubmit={this.handleSubmit}
      >
        <Row>
          <Col span={12}>
            <Form.Item label={formatMessage({ id: 'commodityManage.name.offerName' })}>
              {getFieldDecorator('offerName', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'commodityManage.tip.inputOfferName' }),
                  },
                ],
              })(
                <Input
                  placeholder={formatMessage({ id: 'common.form.input' })}
                  size="small"
                  readOnly={readOnly}
                  maxLength={100}
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={formatMessage({ id: 'commodityManage.name.offerType' })}>
              {getFieldDecorator('offerTypeName', {})(
                <Input
                  placeholder={formatMessage({ id: 'common.form.input' })}
                  size="small"
                  readOnly={readOnly}
                />,
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label={formatMessage({ id: 'commodityManage.name.offerCode' })}>
              {getFieldDecorator('zsmartOfferCode', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'commodityManage.tip.inputOfferCode' }),
                  },
                ],
              })(
                <Input
                  placeholder={formatMessage({ id: 'common.form.input' })}
                  size="small"
                  readOnly={readOnly}
                  maxLength={60}
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={formatMessage({ id: 'commodityManage.name.externalOfferCode' })}>
              {getFieldDecorator('externalOfferCode', {})(
                <Input
                  placeholder={formatMessage({ id: 'common.form.input' })}
                  size="small"
                  readOnly={readOnly}
                  maxLength={60}
                />,
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label={formatMessage({ id: 'commodityManage.date.startDate' })}>
              {getFieldDecorator('offerEffDate', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'commodityManage.tip.inputStartDate' }),
                  },
                ],
              })(
                <DatePicker
                  showTime
                  placeholder={formatMessage({ id: 'common.form.select' })}
                  style={{ width: '100%' }}
                  size="small"
                  disabled={readOnly}
                  disabledDate={this.disabledDate}
                  onChange={this.onChange}
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={formatMessage({ id: 'commodityManage.date.endDate' })}>
              {getFieldDecorator('offerExpDate', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'commodityManage.tip.inputEndDate' }),
                  },
                ],
              })(
                <DatePicker
                  showTime
                  placeholder={formatMessage({ id: 'common.form.select' })}
                  style={{ width: '100%' }}
                  size="small"
                  disabled={readOnly}
                  disabledDate={this.disabledEndDate}
                  onChange={this.onChangeEndDate}
                />,
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label={formatMessage({ id: 'commodityManage.name.offerPrice' })}>
              {getFieldDecorator('offerPrice', {})(
                <InputNumber
                  placeholder={formatMessage({ id: 'commodityManage.tip.inputOfferPrice' })}
                  size="small"
                  readOnly={readOnly}
                  style={{ width: '100%' }}
                  maxLength={10}
                />,
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default BasicInfo;
