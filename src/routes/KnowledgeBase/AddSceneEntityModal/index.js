import React from 'react';
import { Modal, Button, Input, Row, Select, message, Spin, Form } from 'antd';
import CommonSelect from '../../../components/CommonSelect';

const { TextArea } = Input;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 15,
  },
};
@Form.create()
export default class AddSceneEntityModal extends React.Component {
  state = {
    id: '',
    code: this.props.alterEntity.code || '', //
    type: this.props.alterEntity.type || '001',
    subtype: 'dict',
    caseSensitive: '1',
    info: this.props.alterEntity.info || '', // 标准词Id
    dictionary: this.props.alterEntity.phrases
      ? this.props.alterEntity.phrases.replace(/ /g, '\n')
      : '',
  };

  onchange(key, value) {
    const {
      form: { setFieldsValue },
    } = this.props;
    if (this.state[key] !== value) {
      this.setState({ [key]: value });
      // 如果改变了type，清空编码，描述
      if (key === 'type' || (key === 'code' && !value)) {
        // 重置
        setFieldsValue({ code: '' });
        setFieldsValue({ info: '' });
        setFieldsValue({ dictionary: '' });
        this.setState({ id: '' });
        return;
      }
      const { type } = this.state;
      if (key === 'code' && type === '001') {
        const { sysEntityList } = this.props;
        const selectSysEntity = sysEntityList.filter((o) => o.code === value)[0];
        setFieldsValue({ info: selectSysEntity.info });
        this.setState({ id: selectSysEntity.id });
        setFieldsValue({ dictionary: selectSysEntity.dictionary });
      }
    }
  }
  handleFilterSelectSysEntity = () => {
    const { sysEntityList = [] } = this.props;
    return sysEntityList.map((item) => {
      return {
        ...item,
        name: `${item.name}(${item.code})`,
      };
    });
  };
  // 提交
  handleOk = () => {
    const {
      form: { validateFieldsAndScroll },
    } = this.props;
    validateFieldsAndScroll((errors, values) => {
      if (errors) return;
      const { subtype, caseSensitive } = this.state;
      const { code, type, info, dictionary } = values;
      // 根据type设置是否内建属性
      const isBuiltin = type === '001' ? '1' : '0';
      const { onOk, sceneId: sceneid = '' } = this.props;
      let {
        alterEntity: { id = '' },
      } = this.props;
      if (this.state.type === '001') {
        const { id: id1 } = this.state;
        id = id1;
      }
      const phrases = dictionary ? dictionary.replace(/\n/g, ' ') : '';
      const obj = { id, sceneid, code, type, subtype, caseSensitive, isBuiltin, info, phrases };
      if (onOk)
        onOk(obj, () => {
          message.success(id && type !== '001' ? '修改成功' : '添加成功');
        });
    });
  };

  render() {
    const {
      visible,
      closeModal,
      loading,
      form: { getFieldDecorator },
    } = this.props;
    const {
      alterEntity: { code, type, info, phrases },
    } = this.props;
    const { type: stateType } = this.state;
    const dictionary = phrases ? phrases.replace(/ /g, '\n') : '';

    return (
      <Modal
        className="commonModal"
        maskClosable={false}
        visible={visible}
        title="添加实体"
        onOk={this.handleOk}
        onCancel={closeModal}
        bodyStyle={{ padding: 0 }}
        footer={[
          <Button key="back" onClick={closeModal}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
            提交
          </Button>,
        ]}
      >
        <Spin spinning={loading}>
          <Form style={{ margin: '8px 0' }}>
            <Row>
              <FormItem {...formItemLayout} label="实体类型">
                {getFieldDecorator('type', {
                  rules: [
                    {
                      required: true,
                      message: '请选择实体类型',
                    },
                  ],
                  initialValue: type || '001',
                })(
                  <Select
                    style={{ width: 325 }}
                    onChange={(value) => {
                      this.onchange('type', value);
                    }}
                  >
                    <Select.Option key="001" value="001">
                      系统内建
                    </Select.Option>
                    <Select.Option key="002" value="002">
                      用户定义
                    </Select.Option>
                    <Select.Option key="003" value="003">
                      知识图谱
                    </Select.Option>
                    <Select.Option key="004" value="004">
                      外部知识
                    </Select.Option>
                  </Select>
                )}
              </FormItem>
            </Row>
            <Row>
              {this.state.type !== '001' && (
                <FormItem {...formItemLayout} label="实体编码">
                  {getFieldDecorator('code', {
                    rules: [
                      {
                        required: true,
                        message: '请输入实体编码',
                      },
                    ],
                    initialValue: code || '',
                  })(<Input placeholder="请输入实体编码" />)}
                </FormItem>
              )}
              {this.state.type === '001' && (
                <FormItem {...formItemLayout} label="实体编码">
                  {getFieldDecorator('code', {
                    rules: [
                      {
                        required: true,
                        message: '请选择实体编码',
                      },
                    ],
                    initialValue: code || '',
                  })(
                    <CommonSelect
                      onChange={(value) => {
                        this.onchange('code', value);
                      }}
                      addUnknown
                      unknownText="请选择实体编码"
                      optionData={{ datas: this.handleFilterSelectSysEntity(), optionId: 'code' }}
                    />
                  )}
                </FormItem>
              )}
            </Row>
            <Row>
              <FormItem {...formItemLayout} label="描述">
                {getFieldDecorator('info', {
                  rules: [
                    {
                      required: true,
                      message: '请输入实体编码',
                    },
                  ],
                  initialValue: info || '',
                })(<TextArea rows={3} placeholder="请输入描述" />)}
              </FormItem>
            </Row>
            {stateType !== '001' && (
              <Row className="margin-top-10">
                <FormItem {...formItemLayout} label="字典">
                  {getFieldDecorator('dictionary', {
                    rules: [
                      {
                        required: true,
                        message: '请输入字典',
                      },
                    ],
                    initialValue: dictionary || '',
                  })(<TextArea rows={3} placeholder="请输入字典" />)}
                </FormItem>
              </Row>
            )}
          </Form>
        </Spin>
      </Modal>
    );
  }
}
