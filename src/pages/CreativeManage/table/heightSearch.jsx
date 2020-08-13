import React, { Component } from 'react';
import { Row, Col, Input, Button, Form, Select, message } from 'antd';
import { connect } from 'dva';

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};

@connect(({ common }) => ({
  attrSpecCodeList: common.attrSpecCodeList,
}))
@Form.create()
class HeightSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channelList: [],
    };
  }

  componentDidMount() {
    this.getChannel();
    this.getTemplate();
  }

  // 获取渠道
  getChannel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'creativeIdeaManage/qryTargetChannel',
      payload: {
        pageInfo: { pageNum: '1', pageSize: '1000' },
      },
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        this.setState({
          channelList: res.svcCont.data,
        });
      } else {
        message.error('获取channel失败');
      }
    });
  };

  // 获取创意模板类型
  getTemplate = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/qryAttrValueByCode',
      payload: {
        attrSpecCode: 'TEMPLATE_INFO_TYPE',
      },
    });
  };

  onBlur = () => {
    const { form, heightParam } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        heightParam(values);
      }
    });
  };

  // 重置
  resetForm = () => {
    const { form } = this.props;
    form.resetFields();
  };

  render() {
    const { channelList } = this.state;
    const {
      form: { getFieldDecorator },
      attrSpecCodeList: { TEMPLATE_INFO_TYPE = [] },
    } = this.props;
    return (
      <Form {...formItemLayout}>
        <Row>
          <Col span={8}>
            <Form.Item label="创意模板类型">
              {getFieldDecorator('templateInfoType', {
                rules: [{ required: false, message: '请选择一个创意模板类型' }],
                initialValue: '',
              })(
                <Select
                  onBlur={this.onBlur}
                  style={{ width: '100%' }}
                  placeholder="请选择创意模板类型"
                >
                  {Array.isArray(TEMPLATE_INFO_TYPE)
                    ? TEMPLATE_INFO_TYPE.map(e => (
                        <Option key={e.attrValueCode}>{e.attrValueName}</Option>
                      ))
                    : ''}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="模板编码">
              {getFieldDecorator('creativeInfoCode', {
                rules: [{ required: false, message: '请输入模板编码' }],
                initialValue: '',
              })(<Input onBlur={this.onBlur} placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="渠道">
              {getFieldDecorator('channelId', {
                rules: [{ required: false, message: '请选择渠道类型' }],
                initialValue: '',
              })(
                <Select onBlur={this.onBlur} style={{ width: '100%' }} placeholder="请选择渠道类型">
                  {channelList.map(each => (
                    <Option key={each.channelId}>{each.channelName}</Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row type="flex" justify="end">
          <Col span={8}>
            <div style={{ marginTop: 6 }}>
              <Button style={{ float: 'right' }} onClick={this.resetForm}>
                重置
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default HeightSearch;
