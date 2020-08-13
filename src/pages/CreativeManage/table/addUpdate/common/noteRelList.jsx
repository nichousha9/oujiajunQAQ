import React, { Component } from 'react';
import { Tabs, Form, Button, Input, Select, Row, Col, Modal, message } from 'antd';
import { connect } from 'dva';
import NoteConfig from './noteConfig';

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

@connect(({ loading }) => ({
  loading: loading.effects['creativeIdeaManage/getLabelInfoList'],
}))
@Form.create()
class NoteRelList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      macroArr: [],
      visible: false,
    };
  }

  componentDidMount() {
    const { form, template = {} } = this.props;
    form.setFieldsValue({
      msgDefine: template.msgDefine,
    });
    this.qryMacroList();
  }

  qryMacroList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'creativeIdeaManage/qryMacroList',
      payload: {},
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        this.setState({
          macroArr: res.svcCont.data,
        });
      } else {
        message.error('获取宏列表失败');
      }
    });
  };

  // 选择标签
  selectRel = rel => {
    const { form } = this.props;
    form.validateFields((err, values) => {
      let value = values.msgDefine;
      value += `$\{${rel.LABEL_CODE}}`;
      form.setFieldsValue({
        msgDefine: value,
      });
    });
  };

  // 选择宏列表
  pasteCode = txt => {
    const { form } = this.props;
    form.validateFields((err, values) => {
      let value = values.msgDefine;
      value += `$\{${txt}}`;
      form.setFieldsValue({
        msgDefine: value,
      });
    });
  };

  okAdd = () => {
    const { form, handleCancel } = this.props;
    form.validateFields((err, values) => {
      handleCancel(values.msgDefine);
    });
  };

  // 选择标签弹窗
  openParamModal = () => {
    this.setState({
      visible: true,
    });
  };

  configHandleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = () => {
    const { handleCancel } = this.props;
    handleCancel();
  };

  render() {
    const { macroArr, visible } = this.state;
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div>
        <Tabs defaultActiveKey="1">
          <TabPane tab="规则" key="1">
            <Form>
              <Form.Item label="宏列表" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                <Row gutter={8}>
                  <Col span={12}>
                    <Select
                      style={{ width: '100%' }}
                      placeholder="请选择宏列表"
                      onChange={this.pasteCode}
                    >
                      {macroArr.map(each => (
                        <Option key={each.macroCode}>{each.macroName}</Option>
                      ))}
                    </Select>
                  </Col>
                  <Col span={12}>
                    参数列表：
                    <a onClick={this.openParamModal}>添加</a>
                  </Col>
                </Row>
              </Form.Item>
              <Form.Item label="模板定义" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                {getFieldDecorator('msgDefine', {
                  rules: [{ required: true, message: '请输入模板代码' }, { max: 250, message: '内容请控制在250个字符以内' }],
                  initialValue: '',
                })(<TextArea placeholder="请输入" autosize={{ minRows: 6 }} maxLength={251} />)}
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="示例" key="2">
            <p>
              benefit = Param.get(&#x27;BALANCE&#x27;) #Parameter definition, optional strMsg
              =&#x27;Thank you for reloading your number. You just get &#x27;+str(int(benefit) *
              0.01) + &#x27;K&#x27;+&#x27; valid for
              &#x27;+str(Param.get(&#x27;OFFER_END_DATE&#x27;))+&#x27;, Use your number more!&#x27;
              #Begin with &#x27;StrMsg=&#x27;, and connect by &#x27;+&#x27;. All the message
              contents should appear inside quotation marks.
            </p>
          </TabPane>
        </Tabs>
        <Modal title="标签列表" width="60%" visible={visible} footer={false}>
          <NoteConfig selectRel={this.selectRel} handleCancel={this.configHandleCancel} />
        </Modal>
        <div style={{ textAlign: 'center' }}>
          <Button type="primary" onClick={this.okAdd}>
            确认
          </Button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Button onClick={this.handleCancel}>取消</Button>
        </div>
      </div>
    );
  }
}

export default NoteRelList;
