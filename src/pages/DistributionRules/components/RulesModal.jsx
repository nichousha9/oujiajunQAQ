import React, { Component } from 'react';
import { Form, Input, Modal, Select, Spin } from 'antd';
import { connect } from 'dva';
const { Item } = Form;

@Form.create()
@connect(({ loading, distributionRules }) => ({
  confirmLoading:
    loading.effects['distributionRules/modDispatchRules'] ||
    loading.effects['distributionRules/addDispatchRules'],
  spinning: loading.effects['distributionRules/qryDispatchRules'],
  ORDER_CREATE_TYPE: distributionRules.ORDER_CREATE_TYPE,
}))
class RulesModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ruleData: {}, // 规则详情数据
    };
  }

  componentDidMount() {
    const { id } = this.props;
    if (id) {
      // 存在id，则为编辑，请求数据
      this.fetchData(id);
    }
  }

  fetchData = id => {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'distributionRules/qryDispatchRules',
      payload: {
        id,
      },
      success: svcCont => {
        if (svcCont && svcCont.data) {
          const { ruleName, code, dispatchRules } = svcCont.data;
          form.setFieldsValue({ ruleName, code, dispatchRules });
          this.setState({
            ruleData: svcCont.data,
          });
        }
      },
    });
  };

  // 处理提交
  handleOk = () => {
    const { dispatch, form, setVisible, id, fetchData } = this.props;
    const { ruleData } = this.state;
    const type = `distributionRules/${id ? 'modDispatchRules' : 'addDispatchRules'}`;
    form.validateFields((errors, values) => {
      if (errors) return;
      dispatch({
        type,
        payload: {
          ...ruleData,
          ...values,
        },
        success: () => {
          setVisible(false);
          fetchData();
        },
      });
    });
  };

  render() {
    const { form, setVisible, id, confirmLoading, spinning, ORDER_CREATE_TYPE } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };
    return (
      <Modal
        visible
        title={id ? '规则编辑' : '新增规则'}
        onOk={this.handleOk}
        onCancel={() => {
          setVisible(false);
        }}
        confirmLoading={!!confirmLoading}
      >
        <Spin spinning={!!spinning}>
          <Form {...formItemLayout}>
            <Item label="规则名称">
              {getFieldDecorator('ruleName', {
                rules: [{ required: true, message: '请输入规则名称' }],
              })(<Input />)}
            </Item>
            <Item label="规则编码">
              {getFieldDecorator('code', {
                rules: [
                  { required: true, message: '请输入规则编码' },
                  { pattern: /^\w*$/, message: '只允许数字、字母、下划线' },
                ],
              })(<Input />)}
            </Item>
            <Item label="派发规则">
              {getFieldDecorator('dispatchRules', {
                initialValue: Object.keys(ORDER_CREATE_TYPE)[0],
                rules: [{ required: true, message: '请选择派发规则' }],
              })(
                <Select>
                  {Object.keys(ORDER_CREATE_TYPE).map(value => (
                    <Select.Option value={value} key={value}>
                      {ORDER_CREATE_TYPE[value]}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </Item>
          </Form>
        </Spin>
      </Modal>
    );
  }
}

export default RulesModal;
