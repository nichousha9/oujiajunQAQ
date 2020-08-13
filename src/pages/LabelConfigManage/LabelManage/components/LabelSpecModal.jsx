import React, { Component } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Row, Col, Button, Modal, Form, Input, DatePicker, InputNumber, Radio } from 'antd';
import moment from 'moment';
import styles from '../index.less';

const formItemLayout = {
  labelCol: {
    span: 9,
  },
  wrapperCol: {
    span: 15,
  },
};

@Form.create()
class LabelSpecModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initValue: undefined, // 标签值的初始值
      curRules: [
        {
          required: true,
          message: formatMessage(
            {
              id: 'labelConfigManage.labelManage.inputOrSelect',
            },
            '请输入或选择',
          ),
        },
      ], // 标签值的默认校验规则
      inputType: <Input />, // 标签值的默认输入框样式
    };
  }

  componentWillReceiveProps(nextProps) {
    const { modalVisible, curLabelValue, curLabelDataType } = nextProps;
    if (modalVisible) {
      switch (curLabelDataType) {
        // '1000': 日期型
        case '1000': {
          this.setState({
            initValue: curLabelValue ? moment(curLabelValue.labelValue, 'YYYY-MM-DD') : undefined,
            inputType: (
              <DatePicker
                size="small"
                format="YYYY-MM-DD"
                placeholder={formatMessage(
                  {
                    id: 'common.form.select',
                  },
                  '请选择',
                )}
              />
            ),
            curRules: [
              {
                required: true,
                message: `${formatMessage(
                  {
                    id: 'common.form.select',
                  },
                  '请选择',
                )}${formatMessage(
                  {
                    id: 'labelConfigManage.labelManage.date',
                  },
                  '日期',
                )}`,
              },
            ],
          });
          break;
        }
        // '1100': 日期时间型
        case '1100': {
          this.setState({
            initValue: curLabelValue
              ? moment(curLabelValue.labelValue, 'YYYY-MM-DD hh:mm:ss')
              : undefined,
            inputType: (
              <DatePicker
                size="small"
                showTime
                format="YYYY-MM-DD hh:mm:ss"
                placeholder={formatMessage(
                  {
                    id: 'common.form.select',
                  },
                  '请选择',
                )}
              />
            ),
            curRules: [
              {
                required: true,
                message: `${formatMessage(
                  {
                    id: 'common.form.select',
                  },
                  '请选择',
                )}${formatMessage(
                  {
                    id: 'labelConfigManage.labelManage.dateTime',
                  },
                  '日期时间',
                )}`,
              },
            ],
          });
          break;
        }
        // '1200': 字符型
        case '1200': {
          this.setState({
            initValue: curLabelValue ? curLabelValue.labelValue : undefined,
            inputType: (
              <Input
                size="small"
                placeholder={formatMessage(
                  {
                    id: 'common.form.input',
                  },
                  '请输入',
                )}
                maxLength={30}
              />
            ),
            curRules: [
              {
                required: true,
                message: `${formatMessage(
                  {
                    id: 'common.form.input',
                  },
                  '请输入',
                )}${formatMessage(
                  {
                    id: 'labelConfigManage.labelManage.labelValue',
                  },
                  '标签值',
                )}`,
              },
            ],
          });
          break;
        }
        // '1300': 浮点型
        case '1300': {
          this.setState({
            initValue: curLabelValue ? Number(curLabelValue.labelValue) : undefined,
            inputType: (
              <InputNumber
                size="small"
                placeholder={formatMessage(
                  {
                    id: 'common.form.input',
                  },
                  '请输入',
                )}
                step={0.00001}
                max={99999}
              />
            ),
            curRules: [
              {
                required: true,
                message: `${formatMessage(
                  {
                    id: 'common.form.input',
                  },
                  '请输入',
                )}${formatMessage(
                  {
                    id: 'labelConfigManage.labelManage.labelValue',
                  },
                  '标签值',
                )}`,
              },
              {
                type: 'float',
                message: `${formatMessage(
                  {
                    id: 'common.form.input',
                  },
                  '请输入',
                )}${formatMessage(
                  {
                    id: 'labelConfigManage.labelManage.float',
                  },
                  '浮点型',
                )}`,
              },
            ],
          });
          break;
        }
        // '1400': 整数型
        case '1400': {
          this.setState({
            initValue: curLabelValue ? Number(curLabelValue.labelValue) : undefined,
            inputType: (
              <InputNumber
                size="small"
                placeholder={formatMessage(
                  {
                    id: 'common.form.input',
                  },
                  '请输入',
                )}
                max={99999}
                maxLength={5}
              />
            ),
            curRules: [
              {
                required: true,
                message: `${formatMessage(
                  {
                    id: 'common.form.input',
                  },
                  '请输入',
                )}${formatMessage(
                  {
                    id: 'labelConfigManage.labelManage.labelValue',
                  },
                  '标签值',
                )}`,
              },
              {
                type: 'integer',
                message: `${formatMessage(
                  {
                    id: 'common.form.input',
                  },
                  '请输入',
                )}${formatMessage(
                  {
                    id: 'labelConfigManage.labelManage.integer',
                  },
                  '整型',
                )}`,
              },
            ],
          });
          break;
        }
        // '1500': 布尔型
        case '1500': {
          this.setState({
            initValue: curLabelValue ? curLabelValue.labelValue : undefined,
            inputType: (
              <Radio.Group>
                <Radio value="true">true</Radio>
                <Radio value="false">false</Radio>
              </Radio.Group>
            ),
            curRules: [
              {
                required: true,
                message: `${formatMessage(
                  {
                    id: 'common.form.select',
                  },
                  '请选择',
                )}${formatMessage(
                  {
                    id: 'labelConfigManage.labelManage.labelValue',
                  },
                  '标签值',
                )}`,
              },
            ],
          });
          break;
        }
        // '1400': 计算型
        case '1600': {
          this.setState({
            initValue: curLabelValue ? curLabelValue.labelValue : undefined,
            inputType: (
              <Input
                size="small"
                placeholder={formatMessage(
                  {
                    id: 'common.form.input',
                  },
                  '请输入',
                )}
                maxLength={30}
              />
            ),
            curRules: [
              {
                required: true,
                message: `${formatMessage(
                  {
                    id: 'common.form.input',
                  },
                  '请输入',
                )}${formatMessage(
                  {
                    id: 'labelConfigManage.labelManage.labelValue',
                  },
                  '标签值',
                )}`,
              },
            ],
          });
          break;
        }
        default: {
          break;
        }
      }
    }
  }

  componentWillUnmount() {}

  // 点击确认按钮
  handleOk = () => {
    const { form, okCallback, curLabelValue, curLabelDataType } = this.props;
    form.validateFields((error, values) => {
      if (!error) {
        // 处理部分日期数据和数字数据，统一返回字符串
        const { labelValue, valueName, valueDesc } = values;
        switch (curLabelDataType) {
          // 日期型
          case '1000': {
            okCallback({
              ...curLabelValue,
              labelValue: labelValue.format('YYYY-MM-DD'),
              valueName,
              valueDesc,
            });
            break;
          }
          // 日期时间型
          case '1100': {
            okCallback({
              ...curLabelValue,
              labelValue: labelValue.format('YYYY-MM-DD hh:mm:ss'),
              valueName,
              valueDesc,
            });
            break;
          }
          // 浮点型
          case '1300': {
            okCallback({
              ...curLabelValue,
              labelValue: String(labelValue),
              valueName,
              valueDesc,
            });
            break;
          }
          // 整数型
          case '1400': {
            okCallback({
              ...curLabelValue,
              labelValue: String(labelValue),
              valueName,
              valueDesc,
            });
            break;
          }
          // 其他都返回默认的字符串
          default: {
            okCallback({ ...curLabelValue, ...values });
            break;
          }
        }
      }
    });
  };

  render() {
    const {
      modalVisible,
      hideModal,
      form,
      modalTitle,
      curLabelValue, //  编辑时会传进来的标签值
    } = this.props;

    const {
      initValue, // 标签值的初始值
      curRules, // 标签值的校验规则
      inputType, // 标签值的输入框样式
    } = this.state;

    return (
      <Modal
        title={modalTitle}
        visible={modalVisible}
        onCancel={hideModal}
        centered
        destroyOnClose
        /* eslint-disable  react/jsx-wrap-multilines  */
        footer={
          <div className={styles.modalFooter}>
            <Button type="primary" key="submit" size="small" onClick={this.handleOk}>
              {formatMessage(
                {
                  id: 'common.btn.confirm',
                },
                '确定',
              )}
            </Button>
            <Button key="back" size="small" onClick={hideModal}>
              {formatMessage(
                {
                  id: 'common.btn.back',
                },
                '返回',
              )}
            </Button>
          </div>
        }
      >
        <Form {...formItemLayout}>
          <Row>
            <Col span={20}>
              <Form.Item
                label={formatMessage(
                  {
                    id: 'labelConfigManage.labelManage.labelValue',
                  },
                  '标签值',
                )}
              >
                {form.getFieldDecorator('labelValue', {
                  rules: curRules,
                  initialValue: initValue,
                })(inputType)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={20}>
              <Form.Item
                label={formatMessage(
                  {
                    id: 'labelConfigManage.labelManage.labelValueName',
                  },
                  '标签值名称',
                )}
              >
                {form.getFieldDecorator('valueName', {
                  rules: [
                    {
                      required: true,
                      message: `${formatMessage(
                        {
                          id: 'common.form.input',
                        },
                        '请输入',
                      )}${formatMessage(
                        {
                          id: 'labelConfigManage.labelManage.labelValueName',
                        },
                        '标签值名称',
                      )}`,
                    },
                    { max: 20, message: '内容请控制在20个字符以内' },
                  ],
                  validateFirst: true,
                  initialValue: curLabelValue ? curLabelValue.valueName : '',
                })(
                  <Input
                    size="small"
                    maxLength={21}
                    placeholder={formatMessage(
                      {
                        id: 'common.form.input',
                      },
                      '请输入',
                    )}
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={20}>
              <Form.Item
                label={formatMessage(
                  {
                    id: 'labelConfigManage.labelManage.labelValueDescription',
                  },
                  '标签值描述',
                )}
              >
                {form.getFieldDecorator('valueDesc', {
                  rules: [{ max: 150, message: '内容请控制在150个字符以内' }],
                  initialValue: curLabelValue ? curLabelValue.valueDesc : '',
                })(<Input.TextArea size="small" maxLength={151} />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default LabelSpecModal;
