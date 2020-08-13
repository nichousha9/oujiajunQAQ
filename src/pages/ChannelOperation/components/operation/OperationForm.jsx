import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, Row, Col, Checkbox, Select, Button, InputNumber } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { getAttrValueByCode } from '../../utils';
import style from '../../index.less';

@connect(({ operationBitList, common, loading }) => ({
  showForm: operationBitList.showForm,
  channelItem: operationBitList.channelItem,
  attrSpecCodeList: common.attrSpecCodeList,
  operationItemDetail: operationBitList.operationItemDetail,
  formType: operationBitList.formType,
  currentPage: operationBitList.currentPage,
  pageSize: operationBitList.pageSize,
  isLoading: loading,
}))
class OperationBitForm extends Component {
  async componentDidMount() {
    const {
      form,
      attrSpecCodeList: {
        CONTACT_TYPE,
        TEMPLATE_INFO_TYPE,
        ADVICE_CHANNEL_TYPE,
        PUSH_TYPE,
        ANALOG_SENDING_MSG_SERV_TYPE,
        ORDER_CREATE_TYPE,
      },
      channelItem: { channelCode },
      operationItemDetail,
    } = this.props;
    const {
      adviceChannelName,
      adviceChannelCode,
      contactType,
      pushType,
      // inPage,
      adviceChannelType,
      shopNum,
      // personNum,
      optionalCreativeType,
      comments,
    } = operationItemDetail;
    const { setFieldsValue } = form;

    if (
      !CONTACT_TYPE ||
      !TEMPLATE_INFO_TYPE ||
      !ADVICE_CHANNEL_TYPE ||
      !PUSH_TYPE ||
      !ANALOG_SENDING_MSG_SERV_TYPE
    ) {
      // 获取数字字典
      getAttrValueByCode.call(this, [
        'CONTACT_TYPE', // 接触类型
        'TEMPLATE_INFO_TYPE', // 创意/模板 类型
        'ADVICE_CHANNEL_TYPE', // 运营位类型
        'PUSH_TYPE', // 营销推荐类型
        'ANALOG_SENDING_MSG_SERV_TYPE', // 调用方式
        'ORDER_CREATE_TYPE', // 工单生成规则静态数据编码
      ]);
    }

    // 初始化表单值
    setFieldsValue({
      channelCode,
    });
    if (adviceChannelName && adviceChannelCode) {
      console.log(pushType);
      // 初始化表单值
      setFieldsValue({
        operationName: adviceChannelName,
        operationCode: adviceChannelCode,
        touchType: contactType,
        // callMethod: invokingType || '', 由于该值对应的表单项是根据条件渲染出来的，在这里设置初始值太早了，因此在表单项对应的位置设置值
        // marketingType: '3',
        // inThePage: inPage,
        operationType: adviceChannelType,
        storeNum: shopNum && Number(shopNum),
        // personNum: personNum && Number(personNum),
        creativeType: optionalCreativeType && optionalCreativeType.split(','),
        des: comments,
      });
    }
  }

  // 设置表单头标题
  getFormTitle = formType => {
    if (formType === 'add') {
      return formatMessage(
        {
          id: 'channelOperation.operation.addOperation',
        },
        '新增运营位',
      );
    }
    if (formType === 'edit') {
      return formatMessage(
        {
          id: 'channelOperation.operation.editOperation',
        },
        '编辑运营位',
      );
    }
    if (formType === 'readonly') {
      return formatMessage(
        {
          id: 'channelOperation.operation.readOperation',
        },
        '查看运营位',
      );
    }

    return null;
  };

  // 处理保存（新增、修改）运营位
  handleSaveForm = () => {
    const { form } = this.props;
    const { validateFieldsAndScroll } = form;

    // 表单校验
    validateFieldsAndScroll(async (err, val) => {
      const {
        dispatch,
        channelItem: { channelId, channelCode },
        formType,
        pageSize,
        currentPage,
        operationItemDetail: { adviceChannel },
      } = this.props;
      const {
        creativeType,
        des,
        // inThePage,
        marketingType,
        operationCode,
        operationName,
        operationType,
        // personNum,
        storeNum,
        touchType,
        callMethod,
      } = val;

      if (!err) {
        await dispatch({
          type: 'operationBitList/saveChannelOperationEffect',
          payload: {
            data: {
              ...val,
              adviceChannel: adviceChannel || '',
              adviceChannelName: operationName,
              channelId: String(channelId),
              channelCode: String(channelCode),
              adviceChannelCode: operationCode,
              contactType: touchType || '',
              pushType: marketingType || '',
              // inPage: inThePage || '',
              adviceChannelType: operationType,
              invokingType: callMethod || '',
              shopNum: storeNum ? String(storeNum) : '',
              // personNum: personNum ? String(personNum) : '',
              originalityType: creativeType && creativeType.join(','),
              comments: des || '',
              infoType: '',
              showTime: '',
              chlWidth: '',
              chlHeight: '',
              imgWidth: '',
              imgHeight: '',
              imgSize: '',
            },
            method: formType,
          },
        });

        // 获取运营位列表数据
        dispatch({
          type: 'operationBitList/getListDataByChannelIdEffect',
          payload: {
            channelId: String(channelId),
            adviceChannelName: '',
            adviceChannelCode: '',
            state: '1',
            pageInfo: {
              pageNum: currentPage,
              pageSize,
            },
          },
        });
      }
    });
  };

  // 隐藏表单
  handleCancelForm = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'operationBitList/handleFormHidden',
    });
  };

  // 利用代理模式，拦截表单项，将表单控件设置为禁用状态
  getFieldDecoratorProxy = formType => {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    if (formType === 'readonly') {
      return (...rest) => {
        return element => {
          const NewElement = React.cloneElement(element, {
            disabled: true, // 禁用表单控件
            placeholder: '',
          });
          return getFieldDecorator(...rest)(NewElement);
        };
      };
    }

    return getFieldDecorator;
  };

  render() {
    // start 自定义表单校验规则
    const banChinese = (_, value, callback) => {
      if (value) {
        if (/[\u4E00-\u9FA5]/g.test(value)) {
          callback(new Error('编码不允许汉字'));
        }
      }
      callback();
    };
    // end 自定义表单校验规则

    const {
      formType,
      operationItemDetail: { invokingType },
      showForm,
      form,
      isLoading,
      attrSpecCodeList: {
        // 数字字典值
        CONTACT_TYPE = [],
        TEMPLATE_INFO_TYPE = [],
        ADVICE_CHANNEL_TYPE = [],
        PUSH_TYPE = [],
        ANALOG_SENDING_MSG_SERV_TYPE = [],
        ORDER_CREATE_TYPE = [],
      },
      operationItemDetail,
    } = this.props;
    const { getFieldValue } = form;

    // antd Form.Item 样式
    const formItemDoubleRowLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const formItemSingleRowLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    };

    // 代理 getFieldDecorator 函数，可以将表单所有控件设置为禁用
    const getFieldDecorator = this.getFieldDecoratorProxy(formType);

    return (
      <Modal
        // title={formType==='add'?'新增运营位':formType==='edit'?'编辑运营位':'查看运营位'}
        title={this.getFormTitle(formType)}
        visible={showForm}
        onCancel={this.handleCancelForm}
        destroyOnClose
        /* eslint-disable  react/jsx-wrap-multilines  */
        footer={
          <Fragment>
            {formType === 'readonly' ? null : (
              <Button
                size="small"
                loading={isLoading.effects['operationBitList/saveChannelOperationEffect']}
                type="primary"
                onClick={this.handleSaveForm}
              >
                {formatMessage(
                  {
                    id: 'channelOperation.operation.save',
                  },
                  '保存',
                )}
              </Button>
            )}
            <Button size="small" type="default" onClick={this.handleCancelForm}>
              {formatMessage(
                {
                  id: 'channelOperation.operation.cancel',
                },
                '取消',
              )}
            </Button>
          </Fragment>
        }
        className={style.operationBitForm}
        width="844px"
      >
        <div className={style.headerTitle}>
          <span className={style.headerContent}>
            {formatMessage(
              {
                id: 'channelOperation.operation.basicInfo',
              },
              '基础信息',
            )}
          </span>
        </div>
        <Form>
          <Row>
            <Col span={12}>
              <Form.Item
                {...formItemDoubleRowLayout}
                label={formatMessage(
                  {
                    id: 'channelOperation.operation.operationName',
                  },
                  '运营位名称',
                )}
              >
                {getFieldDecorator('operationName', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage(
                        {
                          id: 'channelOperation.operation.pleaseInput',
                        },
                        '请输入',
                      ),
                    },
                    {
                      max: 60,
                      message: '最大长度为60',
                    },
                  ],
                })(
                  <Input
                    size="small"
                    placeholder={formatMessage(
                      {
                        id: 'channelOperation.operation.pleaseInput',
                      },
                      '请输入',
                    )}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                {...formItemDoubleRowLayout}
                label={formatMessage(
                  {
                    id: 'channelOperation.operation.channelCode',
                  },
                  '渠道编码',
                )}
              >
                {getFieldDecorator('channelCode')(<Input size="small" disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item
                {...formItemDoubleRowLayout}
                label={formatMessage(
                  {
                    id: 'channelOperation.operation.operationCode',
                  },
                  '运营位编码',
                )}
              >
                {getFieldDecorator('operationCode', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage(
                        {
                          id: 'channelOperation.operation.pleaseInput',
                        },
                        '请输入',
                      ),
                    },
                    {
                      validator: banChinese,
                    },
                    {
                      max: 64,
                      message: '最大长度为64',
                    },
                  ],
                })(
                  <Input
                    size="small"
                    placeholder={formatMessage(
                      {
                        id: 'channelOperation.operation.pleaseInput',
                      },
                      '请输入',
                    )}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                {...formItemDoubleRowLayout}
                label={formatMessage(
                  {
                    id: 'channelOperation.operation.concatType',
                  },
                  '接触类型',
                )}
              >
                {getFieldDecorator('touchType', {
                  initialValue: '2',
                })(
                  <Select
                    allowClear
                    size="small"
                    placeholder={formatMessage(
                      {
                        id: 'channelOperation.operation.pleaseSelect',
                      },
                      '请选择',
                    )}
                  >
                    {Array.isArray(CONTACT_TYPE)
                      ? CONTACT_TYPE.map(item => (
                          /* eslint-disable-next-line  react/jsx-indent  */
                          <Select.Option key={item.attrValueCode} value={item.attrValueCode}>
                            {item.attrValueName}
                          </Select.Option>
                        ))
                      : null}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            {/* 如果接触类型值为 1 （主动），则渲染此项 */}
            {getFieldValue('touchType') === '1'
              ? [
                  <Col span={12} key="1">
                    <Form.Item
                      {...formItemDoubleRowLayout}
                      label={formatMessage(
                        {
                          id: 'channelOperation.operation.callMethod',
                        },
                        '调用方法',
                      )}
                    >
                      {getFieldDecorator('callMethod', {
                        rules: [
                          {
                            required: true,
                            message: formatMessage(
                              {
                                id: 'channelOperation.operation.pleaseSelect',
                              },
                              '请选择',
                            ),
                          },
                        ],
                        initialValue: invokingType,
                      })(
                        <Select
                          size="small"
                          placeholder={formatMessage(
                            {
                              id: 'channelOperation.operation.pleaseSelect',
                            },
                            '请选择',
                          )}
                          onChange={this.handleFormItemOfCallMethod}
                        >
                          {Array.isArray(ANALOG_SENDING_MSG_SERV_TYPE)
                            ? ANALOG_SENDING_MSG_SERV_TYPE.map(item => (
                                /* eslint-disable-next-line  react/jsx-indent  */
                                <Select.Option key={item.attrValueCode} value={item.attrValueCode}>
                                  {item.attrValueName}
                                </Select.Option>
                              ))
                            : null}
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>,
                  <Col span={12} key="2">
                    <Form.Item
                      {...formItemDoubleRowLayout}
                      label={formatMessage(
                        {
                          id: 'channelOperation.operation.marketingType',
                        },
                        '营销推荐获取方法',
                      )}
                    >
                      {getFieldDecorator('marketingType', {
                        initialValue: operationItemDetail.pushType,
                      })(
                        <Select
                          allowClear
                          size="small"
                          placeholder={formatMessage(
                            {
                              id: 'channelOperation.operation.pleaseSelect',
                            },
                            '请选择',
                          )}
                        >
                          {Array.isArray(PUSH_TYPE)
                            ? PUSH_TYPE.map(item => (
                                /* eslint-disable-next-line  react/jsx-indent  */
                                <Select.Option key={item.attrValueCode} value={item.attrValueCode}>
                                  {item.attrValueName}
                                </Select.Option>
                              ))
                            : null}
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>,
                ]
              : null}
          </Row>
          {/* 营销推荐获取方法为FTP */}
          {getFieldValue('marketingType') === '3' ? (
            <Row>
              <Col span={12}>
                <Form.Item
                  {...formItemDoubleRowLayout}
                  label={formatMessage(
                    {
                      id: 'channelOperation.operation.account',
                    },
                    '账号',
                  )}
                >
                  {getFieldDecorator('ftpUser', {
                    rules: [
                      {
                        required: true,
                        message: formatMessage(
                          {
                            id: 'channelOperation.operation.pleaseInput',
                          },
                          '请输入',
                        ),
                      },
                    ],
                    initialValue: operationItemDetail.ftpUser,
                  })(
                    <Input
                      size="small"
                      placeholder={formatMessage(
                        {
                          id: 'channelOperation.operation.pleaseInput',
                        },
                        '请输入',
                      )}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formItemDoubleRowLayout}
                  label={formatMessage(
                    {
                      id: 'channelOperation.operation.password',
                    },
                    '密码',
                  )}
                >
                  {getFieldDecorator('ftpPassword', {
                    rules: [
                      {
                        required: true,
                        message: formatMessage(
                          {
                            id: 'channelOperation.operation.pleaseInput',
                          },
                          '请输入',
                        ),
                      },
                    ],
                    initialValue: operationItemDetail.ftpPassword,
                  })(
                    <Input
                      size="small"
                      placeholder={formatMessage(
                        {
                          id: 'channelOperation.operation.pleaseInput',
                        },
                        '请输入',
                      )}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formItemDoubleRowLayout}
                  label={formatMessage(
                    {
                      id: 'channelOperation.operation.port',
                    },
                    '端口',
                  )}
                >
                  {getFieldDecorator('ftpPort', {
                    rules: [
                      {
                        required: true,
                        message: formatMessage(
                          {
                            id: 'channelOperation.operation.pleaseInput',
                          },
                          '请输入',
                        ),
                      },
                    ],
                    initialValue: operationItemDetail.ftpPort,
                  })(
                    <Input
                      size="small"
                      placeholder={formatMessage(
                        {
                          id: 'channelOperation.operation.pleaseInput',
                        },
                        '请输入',
                      )}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formItemDoubleRowLayout}
                  label={formatMessage(
                    {
                      id: 'channelOperation.operation.storagePath',
                    },
                    '存储路径',
                  )}
                >
                  {getFieldDecorator('ftpSaveUrl', {
                    rules: [
                      {
                        required: true,
                        message: formatMessage(
                          {
                            id: 'channelOperation.operation.pleaseInput',
                          },
                          '请输入',
                        ),
                      },
                    ],
                    initialValue: operationItemDetail.ftpSaveUrl,
                  })(
                    <Input
                      size="small"
                      placeholder={formatMessage(
                        {
                          id: 'channelOperation.operation.pleaseInput',
                        },
                        '请输入',
                      )}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
          ) : null}
          {/* 营销推荐获取方法为HTTP */}
          {getFieldValue('marketingType') === '1' ? (
            <Row>
              <Col span={12}>
                <Form.Item
                  {...formItemDoubleRowLayout}
                  label={formatMessage(
                    {
                      id: 'channelOperation.operation.HttpPath',
                    },
                    'HTTP路径',
                  )}
                >
                  {getFieldDecorator('httpReqUrl', {
                    rules: [
                      {
                        required: true,
                        message: formatMessage(
                          {
                            id: 'channelOperation.operation.pleaseInput',
                          },
                          '请输入',
                        ),
                      },
                    ],
                    initialValue: operationItemDetail.httpReqUrl,
                  })(
                    <Input
                      size="small"
                      placeholder={formatMessage(
                        {
                          id: 'channelOperation.operation.pleaseInput',
                        },
                        '请输入',
                      )}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
          ) : null}
          <Row>
            <Col span={12}>
              <Form.Item
                {...formItemDoubleRowLayout}
                label={formatMessage(
                  {
                    id: 'channelOperation.operation.operationType',
                  },
                  '运营位类型',
                )}
              >
                {getFieldDecorator('operationType', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage(
                        {
                          id: 'channelOperation.operation.pleaseSelect',
                        },
                        '请选择',
                      ),
                    },
                  ],
                })(
                  <Select
                    allowClear
                    size="small"
                    placeholder={formatMessage(
                      {
                        id: 'channelOperation.operation.pleaseSelect',
                      },
                      '请选择',
                    )}
                  >
                    {Array.isArray(ADVICE_CHANNEL_TYPE)
                      ? ADVICE_CHANNEL_TYPE.map(item => (
                          /* eslint-disable-next-line  react/jsx-indent  */
                          <Select.Option key={item.attrValueCode} value={item.attrValueCode}>
                            {item.attrValueName}
                          </Select.Option>
                        ))
                      : null}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                {...formItemDoubleRowLayout}
                label={formatMessage(
                  {
                    id: 'channelOperation.operation.orderRule',
                  },
                  '工单生成规则',
                )}
              >
                {getFieldDecorator('createRule', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage(
                        {
                          id: 'channelOperation.operation.pleaseSelect',
                        },
                        '请选择',
                      ),
                    },
                  ],
                  initialValue: operationItemDetail.createRule,
                })(
                  <Select
                    allowClear
                    size="small"
                    placeholder={formatMessage(
                      {
                        id: 'channelOperation.operation.pleaseSelect',
                      },
                      '请选择',
                    )}
                  >
                    {Array.isArray(ORDER_CREATE_TYPE)
                      ? ORDER_CREATE_TYPE.map(item => (
                          <Select.Option key={item.attrValueCode} value={item.attrValueCode}>
                            {item.attrValueName}
                          </Select.Option>
                        ))
                      : null}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            {/* <Col span={12}>
              <Form.Item
                {...formItemDoubleRowLayout}
                label={formatMessage(
                  {
                    id: 'channelOperation.operation.recommendAmount',
                  },
                  '推荐数量',
                )}
              >
                {getFieldDecorator('personNum', {
                  rules: [
                    {
                      type: 'number',
                      message: formatMessage(
                        {
                          id: 'channelOperation.operation.pleaseInput',
                        },
                        '请输入',
                      ).concat(
                        formatMessage(
                          {
                            id: 'channelOperation.operation.number',
                          },
                          '数字',
                        ),
                      ),
                    },
                  ],
                })(
                  <InputNumber
                    size="small"
                    className={style.inputNumber}
                    min={0}
                    placeholder={formatMessage(
                      {
                        id: 'channelOperation.operation.pleaseInput',
                      },
                      '请输入',
                    )}
                  />,
                )}
              </Form.Item>
            </Col> */}
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item
                style={{ display: 'none' }}
                {...formItemDoubleRowLayout}
                label={formatMessage(
                  {
                    id: 'channelOperation.operation.storeNum',
                  },
                  '厅店数量',
                )}
              >
                {getFieldDecorator('storeNum', {
                  rules: [
                    {
                      type: 'number',
                      message: formatMessage(
                        {
                          id: 'channelOperation.operation.pleaseInput',
                        },
                        '请输入',
                      ),
                    },
                  ],
                })(
                  <InputNumber
                    size="small"
                    className={style.inputNumber}
                    min={0}
                    placeholder={formatMessage(
                      {
                        id: 'channelOperation.operation.pleaseInput',
                      },
                      '请输入',
                    )}
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                {...formItemSingleRowLayout}
                label={formatMessage(
                  {
                    id: 'channelOperation.operation.creativeType',
                  },
                  '创意类型',
                )}
              >
                {getFieldDecorator('creativeType', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage(
                        {
                          id: 'channelOperation.operation.pleaseSelect',
                        },
                        '请选择',
                      ),
                    },
                  ],
                  initialValue: [TEMPLATE_INFO_TYPE[0] && TEMPLATE_INFO_TYPE[0].attrValueCode],
                })(
                  <Checkbox.Group
                    size="small"
                    options={
                      Array.isArray(TEMPLATE_INFO_TYPE)
                        ? TEMPLATE_INFO_TYPE.map(item => ({
                            value: item.attrValueCode,
                            label: item.attrValueName,
                          }))
                        : []
                    }
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                {...formItemSingleRowLayout}
                label={formatMessage(
                  {
                    id: 'channelOperation.operation.operationDesc',
                  },
                  '运营位描述',
                )}
              >
                {getFieldDecorator('des', {
                  rules: [{ max: 150, message: '内容请控制在150个字符以内' }],
                })(
                  <Input.TextArea
                    maxLength={151}
                    autosize={{ minRows: 2, maxRows: 8 }}
                    placeholder={formatMessage(
                      {
                        id: 'channelOperation.operation.pleaseInput',
                      },
                      '请输入',
                    )}
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: 'operation_form' })(OperationBitForm);
