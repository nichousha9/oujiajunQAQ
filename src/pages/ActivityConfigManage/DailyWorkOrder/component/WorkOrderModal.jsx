import React from 'react';
import { Col, Form, Input, Modal, Row, Select, Spin, DatePicker } from 'antd';
import moment from 'moment';
import shandong from '../shandong';
const { Item } = Form;

@Form.create()
class WorkOrderModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spinning: true, // loading效果
      confirmLoading: false, // 按钮loading效果
      districtData: [], // 区县数据
    };
  }

  componentDidMount() {
    const { form, orderData } = this.props;
    setTimeout(() => {
      if (orderData.id) {
        const { createDate, id, startDate, endDate, ...values } = orderData;
        form.setFieldsValue({
          ...values,
          startDate: moment(startDate),
          endDate: moment(endDate),
        });
      }
      this.setState({
        spinning: false,
      });
    }, 1000);
  }

  setDistrictData = name => {
    const { children } = shandong;
    children.forEach(value => {
      if (value.name === name) {
        this.setState({
          districtData: value.children,
        });
      }
    });
  };

  // 处理提交
  handleSubmit = () => {
    const { form, setData, orderData, setVisible } = this.props;
    this.setState(
      {
        confirmLoading: true,
      },
      () => {
        form.validateFields((errors, values) => {
          if (errors) return;
          setData({
            ...orderData,
            ...values,
            startDate: values.startDate.format('YYYY-MM-DD HH:mm'),
            endDate: values.endDate.format('YYYY-MM-DD HH:mm'),
            ...(orderData.id ? {} : { createDate: moment().format('YYYY-MM-DD HH:mm') }),
          });
          setTimeout(() => {
            setVisible(false);
          }, 1000);
        });
      },
    );
  };

  render() {
    const { form, setVisible } = this.props;
    const { getFieldDecorator } = form;
    const { spinning, districtData, confirmLoading } = this.state;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return (
      <Modal
        visible
        width={768}
        confirmLoading={confirmLoading}
        onOk={this.handleSubmit}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <Spin spinning={spinning}>
          <Row>
            <Form {...formItemLayout}>
              <Col span={16} offset={8} pull={8}>
                <Item label="任务名称" labelCol={{ span: 4 }}>
                  {getFieldDecorator('taskName')(<Input size="small" />)}
                </Item>
              </Col>
              <Col span={8}>
                <Item label="城市">
                  {getFieldDecorator('cityName')(
                    <Select size="small" onChange={this.setDistrictData}>
                      {shandong.children.map(value => (
                        <Select.Option key={value.code} value={value.name}>
                          {value.name}
                        </Select.Option>
                      ))}
                    </Select>,
                  )}
                </Item>
              </Col>
              <Col span={8}>
                <Item label="区县">
                  {getFieldDecorator('districtName')(
                    <Select size="small">
                      {districtData.map(value => (
                        <Select.Option key={value.code} value={value.name}>
                          {value.name}
                        </Select.Option>
                      ))}
                    </Select>,
                  )}
                </Item>
              </Col>
              <Col span={8}>
                <Item label="执行人">
                  {getFieldDecorator('executive')(
                    <Select size="small">
                      <Select.Option key="000" value="李斯">
                        李斯
                      </Select.Option>
                      <Select.Option key="001" value="张山">
                        张山
                      </Select.Option>
                    </Select>,
                  )}
                </Item>
              </Col>
              <Col span={8}>
                <Item label="开始时间">
                  {getFieldDecorator('startDate')(<DatePicker size="small" />)}
                </Item>
              </Col>
              <Col span={8}>
                <Item label="结束时间">
                  {getFieldDecorator('endDate')(<DatePicker size="small" />)}
                </Item>
              </Col>
              <Col span={16} offset={8} pull={8}>
                <Item label="工作内容" labelCol={{ span: 4 }}>
                  {getFieldDecorator('workDetail', {
                    rules: [{ max: 150, message: '内容请控制在150个字符以内' }],
                  })(<Input.TextArea size="small" maxLength={151} />)}
                </Item>
              </Col>
            </Form>
          </Row>
        </Spin>
      </Modal>
    );
  }
}

export default WorkOrderModal;
