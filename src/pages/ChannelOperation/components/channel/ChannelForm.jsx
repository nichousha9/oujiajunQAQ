/* eslint-disable no-unused-vars */
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Col, Row, TimePicker, Select, Radio, Icon, Modal, Button } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import moment from 'moment';
import { getAttrValueByCode } from '../../utils';
import style from '../../index.less';

@connect(({ channelList, common }) => ({
  showForm: channelList.showForm,
  channelIcon: channelList.channelIcon,
  attrSpecCodeList: common.attrSpecCodeList,
  channelItemDetails: channelList.channelItemDetails,
  formType: channelList.formType,
  searchInputOfName: channelList.searchInputOfName,
  searchOfCode: channelList.searchOfCode,
  currentPage: channelList.currentPage,
  pageSize: channelList.pageSize,
}))
class ChannelForm extends Component {
  async componentDidMount() {
    const {
      form,
      channelItemDetails: { data },
      attrSpecCodeList: { CHANNEL_PROCESS_TYPE, NET_TYPE },
    } = this.props;
    const { setFieldsValue } = form;

    if (!CHANNEL_PROCESS_TYPE || !NET_TYPE) {
      // 获取数字字典
      getAttrValueByCode.call(this, [
        'CHANNEL_PROCESS_TYPE', // 渠道类型
        'NET_TYPE', // 接触类型
      ]);
    }

    if (data) {
      // 设置免打扰时间表单项 keys 值 (需优化)
      // let keys = data.disturbInfos.map((item, index) => {
      //   return `key${index}`;
      // });
      // keys = keys.length === 0 ? ['key0'] : keys;
      // const start = {};
      // const end = {};
      // data.disturbInfos.forEach((item, index) => {
      //   start[`start[${keys[index]}]`] = moment(item.startTime, 'HH:mm:ss');
      //   end[`end[${keys[index]}]`] = moment(item.endTime, 'HH:mm:ss');
      // });

      await setFieldsValue({
        // keys,
        name: data.channelName,
        code: data.channelCode,
        channelType: data.processType,
        contactType: data.netType,
        des: data.channelDesc || '',
        icon: data.icon,
        responseTemp: data.isResponseTemp,
        effectTime: data.isEffDate,
        accumulative: data.isAccumulation,
        feedback: data.isResponse,
        resend: data.isResend,
        orderCreateType: data.orderCreateType,
      });
      // 等待表单字段 keys 设置完成，渲染出时间选择器表单项后，再为时间选择器设置值
      // setFieldsValue({
      //   ...start,
      //   ...end,
      // });
    }
  }

  // 利用代理模式，拦截表单项，将表单控件设置为只读状态
  getFieldDecoratorProxy = formType => {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    if (formType === 'readonly') {
      return (...rest) => {
        return element => {
          const NewElement = React.cloneElement(element, {
            disabled: true, // 表单控件只读
            placeholder: '',
          });
          return getFieldDecorator(...rest)(NewElement);
        };
      };
    }

    return getFieldDecorator;
  };

  // 增加免打扰时间表单项
  addTimePicker = length => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(`key${length + 1}`);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  // 处理表头标题
  getFormTitle = formType => {
    if (formType === 'add') {
      return formatMessage(
        {
          id: 'channelOperation.channel.addChannel',
        },
        '新增渠道',
      );
    }
    if (formType === 'edit') {
      return formatMessage(
        {
          id: 'channelOperation.channel.editChannel',
        },
        '编辑渠道',
      );
    }
    if (formType === 'readonly') {
      return formatMessage(
        {
          id: 'channelOperation.channel.readChannel',
        },
        '查看渠道',
      );
    }
    return null;
  };

  // 处理表单是否显示
  handleFormShow = formType => {
    const { dispatch } = this.props;

    dispatch({
      type: 'channelList/handleFormShow',
      payload: formType,
    });
  };

  // 删除免打扰时间表单项
  removeTimePicker = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  // 获取时间选择器的禁止小时
  // startOrEnd 禁止的部分根据那个时间选择器
  getDisabledHours = (k, startOrEnd) => {
    const {
      form: { getFieldValue },
    } = this.props;
    const hours = startOrEnd === 'end' ? 23 : 0;
    const timePicker = getFieldValue(`${startOrEnd}[${k}]`);

    // 如果根据的时间选择器没有选择时间，返回 []，不禁用
    if (!timePicker) {
      return [];
    }
    return Array.from({ length: Math.abs(hours - timePicker.hour()) }, (_, i) => {
      return Math.abs(hours - i);
    });
  };

  // 获取时间选择器的禁止分钟
  // startOrEnd 禁止的部分根据那个时间选择器
  getDisabledMinutes = (selectedH, k, startOrEnd) => {
    const {
      form: { getFieldValue },
    } = this.props;
    const minutes = startOrEnd === 'end' ? 59 : 0;
    const timePicker = getFieldValue(`${startOrEnd}[${k}]`);

    // 如果根据的时间选择器没有选择时间，返回 []，不禁用
    if (!timePicker) {
      return [];
    }
    // 禁止的分钟数组
    const disabledMinutes = Array.from(
      { length: Math.abs(minutes - timePicker.minute()) },
      (_, i) => {
        return Math.abs(minutes - i);
      },
    );

    if (startOrEnd === 'end') {
      return timePicker.hour() <= selectedH ? disabledMinutes : [];
    }
    return timePicker.hour() >= selectedH ? disabledMinutes : [];
  };

  // 获取时间选择器的禁止秒数
  // startOrEnd 禁止的部分根据那个时间选择器
  getDisabledSeconds = (selectedH, selectedM, k, startOrEnd) => {
    const {
      form: { getFieldValue },
    } = this.props;
    const seconds = startOrEnd === 'end' ? 59 : 0;
    const timePicker = getFieldValue(`${startOrEnd}[${k}]`);

    // 如果根据的时间选择器没有选择时间，返回 []，不禁用
    if (!timePicker) {
      return [];
    }

    // 禁止的秒数数组
    const disabledSeconds = Array.from(
      { length: Math.abs(seconds - timePicker.second()) + 1 },
      (_, i) => {
        return Math.abs(seconds - i);
      },
    );

    if (startOrEnd === 'end') {
      return timePicker.hour() <= selectedH && timePicker.minute() <= selectedM
        ? disabledSeconds
        : [];
    }
    return timePicker.hour() >= selectedH && timePicker.minute() >= selectedM
      ? disabledSeconds
      : [];
  };

  // 提交表单(新增、编辑)
  handleSubmitForm = async () => {
    const {
      formType,
      currentPage,
      pageSize,
      searchInputOfName,
      searchOfCode,
      dispatch,
      form,
      channelItemDetails: { data },
    } = this.props;
    const { validateFieldsAndScroll } = form;

    // 表单验证
    validateFieldsAndScroll(async (err, val) => {
      const {
        keys,
        start,
        end,
        name,
        code,
        channelType,
        contactType,
        accumulative,
        effectTime,
        icon,
        responseTemp,
        resend,
        feedback,
        des,
        orderCreateType,
      } = val;

      // 格式化免打扰时间
      const disturbInfos = [];
      keys.forEach(item => {
        if (start[item] && end[item]) {
          // 只有当开始时间和结束时间都有填的情况下，该免打扰项才有效
          disturbInfos.push({
            startTime: start[item].format ? start[item].format('HH:mm:ss') : '',
            endTime: end[item].format ? end[item].format('HH:mm:ss') : '',
          });
        }
      });
      if (!err) {
        const actionType =
          formType === 'add' ? 'channelList/addChannelEffect' : 'channelList/editChannelEffect';
        await dispatch({
          type: actionType,
          payload: {
            // baseInfo: {
            batchFulfillNotifyServ: '',
            singleFulfillNotifyServ: '',
            channelCode: code,
            channelName: name,
            channelDesc: des,
            channelId: formType === 'add' ? '' : data.channelId,
            contactResultServ: '',
            contactResultType: '',
            defMsgCode: '',
            disturbInfos,
            icon,
            is3rdParty: 'N',
            isAccumulation: accumulative,
            isEffDate: effectTime,
            isResend: resend,
            isResponse: feedback,
            isResponseTemp: responseTemp,
            langMsgCode: '',
            processType: channelType,
            netType: contactType,
            msgLengthLimit: '',
            sendParamUrl: '',
            orderCreateType,
          },
        });

        // 重新获取数据
        dispatch({
          type: 'channelList/getDataSourceEffect',
          payload: {
            channelId: '',
            channelName: searchInputOfName || '',
            channelCode: searchOfCode || '',
            state: '',
            pageInfo: {
              pageNum: currentPage,
              pageSize,
            },
          },
        });
      }
    });
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
      form,
      formType,
      channelIcon,
      isLoading,
      attrSpecCodeList: { CHANNEL_PROCESS_TYPE, NET_TYPE, ORDER_CREATE_TYPE },
    } = this.props;
    const { getFieldValue } = form;
    // 代理 表单form getFieldDecorator 方法
    const getFieldDecorator = this.getFieldDecoratorProxy(formType);

    // 处理免打扰时间表单项
    getFieldDecorator('keys', { initialValue: ['key0'] })(<Fragment />);
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <Fragment key={k}>
        <Row>
          <Col span={6}>
            <Form.Item
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label={
                index === 0
                  ? formatMessage(
                      {
                        id: 'channelOperation.channel.time',
                      },
                      '时间',
                    )
                  : ' '
              }
              /* eslint-disable no-unneeded-ternary */
              colon={index === 0 ? true : false}
              required={false}
              key={`start[${k}]`}
            >
              {getFieldDecorator(`start[${k}]`, {
                validateTrigger: ['onChange', 'onBlur'],
              })(
                <TimePicker
                  disabledHours={() => this.getDisabledHours(k, 'end')}
                  disabledMinutes={selectedH => this.getDisabledMinutes(selectedH, k, 'end')}
                  disabledSeconds={(selectedH, selectedM) =>
                    this.getDisabledSeconds(selectedH, selectedM, k, 'end')
                  }
                  size="small"
                  placeholder={formatMessage(
                    {
                      id: 'channelOperation.channel.beginTime',
                    },
                    '开始时间',
                  )}
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="~"
              colon={false}
              labelCol={{ span: 2 }}
              required={false}
              key={`end[${k}]`}
            >
              {getFieldDecorator(`end[${k}]`, {
                validateTrigger: ['onChange', 'onBlur'],
              })(
                <TimePicker
                  disabledHours={() => this.getDisabledHours(k, 'start')}
                  disabledMinutes={selectedH => this.getDisabledMinutes(selectedH, k, 'start')}
                  disabledSeconds={(selectedH, selectedM) =>
                    this.getDisabledSeconds(selectedH, selectedM, k, 'start')
                  }
                  // disabledHours={() => Array.from({length: getFieldValue(`start[${k}]`).hour()}, (_, i) => {return i})}
                  // disabledMinutes={(selectedH) => getFieldValue(`start[${k}]`).hour()>=selectedH ? Array.from({length: getFieldValue(`start[${k}]`).minute()}, (_, i) => {return i}) : []}
                  // disabledSeconds={(selectedH, selectedM)=>getFieldValue(`start[${k}]`).hour()>=selectedH && getFieldValue(`start[${k}]`).minute()>=selectedM ? Array.from({length: getFieldValue(`start[${k}]`).second()+1}, (_, i) => {return i}) : []}
                  size="small"
                  placeholder={formatMessage(
                    {
                      id: 'channelOperation.channel.endTime',
                    },
                    '结束时间',
                  )}
                />,
              )}
              &nbsp;
              {index === 0 && formType !== 'readonly' ? (
                <Icon
                  type="plus-circle"
                  onClick={() => {
                    this.addTimePicker(keys.length);
                  }}
                />
              ) : null}
              {index >= 1 && formType !== 'readonly' ? (
                <Icon
                  className="dynamic-delete-button"
                  type="minus-circle-o"
                  onClick={() => this.removeTimePicker(k)}
                />
              ) : null}
            </Form.Item>
          </Col>
        </Row>
      </Fragment>
    ));
    // end 处理免打扰时间表单项 end

    return (
      <Modal
        width="844px"
        title={this.getFormTitle(formType)}
        destroyOnClose
        visible={Boolean(formType)}
        onCancel={() => {
          this.handleFormShow(false);
        }}
        /* eslint-disable  react/jsx-wrap-multilines  */
        footer={
          <Fragment>
            {formType === 'readonly' ? null : (
              <Button
                loading={
                  isLoading.effects['channelList/addChannelEffect'] ||
                  isLoading.effects['channelList/editChannelEffect']
                }
                size="small"
                type="primary"
                onClick={this.handleSubmitForm}
              >
                {formatMessage(
                  {
                    id: 'channelOperation.channel.save',
                  },
                  '保存',
                )}
              </Button>
            )}
            <Button
              size="small"
              type="default"
              onClick={() => {
                this.handleFormShow(false);
              }}
            >
              {formatMessage(
                {
                  id: 'channelOperation.channel.cancel',
                },
                '取消',
              )}
            </Button>
          </Fragment>
        }
        className={style.channelForm}
      >
        <Form labelCol={{ span: 6 }} wrapperCol={{ span: 15 }}>
          <div className={style.formBlockTitle}>
            <span>
              {formatMessage(
                {
                  id: 'channelOperation.channel.basicInfo',
                },
                '基础信息',
              )}
            </span>
          </div>
          <Row>
            <Col span={12}>
              <Form.Item
                label={formatMessage(
                  {
                    id: 'channelOperation.channel.channelName',
                  },
                  '渠道名称',
                )}
                key="name"
              >
                {getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage(
                        {
                          id: 'channelOperation.channel.pleaseInput',
                        },
                        '请输入',
                      ),
                    },
                    { max: 20, message: '内容请控制在20个字符以内' },
                  ],
                })(<Input size="small" maxLength={21} />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={formatMessage(
                  {
                    id: 'channelOperation.channel.channelCode',
                  },
                  '渠道编码',
                )}
                key="code"
              >
                {getFieldDecorator('code', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage(
                        {
                          id: 'channelOperation.channel.pleaseInput',
                        },
                        '请输入',
                      ),
                    },
                    {
                      validator: banChinese,
                    },
                    { max: 20, message: '内容请控制在20个字符以内' },
                  ],
                })(<Input size="small" maxLength={21} />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={formatMessage(
                  {
                    id: 'channelOperation.channel.channelType',
                  },
                  '渠道类型',
                )}
                key="channelType"
              >
                {/* eslint-disable  react/jsx-indent */}
                {getFieldDecorator('channelType', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage(
                        {
                          id: 'channelOperation.channel.pleaseInput',
                        },
                        '请输入',
                      ),
                    },
                    { max: 20, message: '内容请控制在20个字符以内' },
                  ],
                })(
                  <Select
                    allowClear
                    size="small"
                    maxLength={21}
                    placeholder={formatMessage(
                      {
                        id: 'channelOperation.channel.pleaseSelect',
                      },
                      '请选择',
                    )}
                  >
                    {CHANNEL_PROCESS_TYPE
                      ? CHANNEL_PROCESS_TYPE.map(item => (
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
                label={formatMessage(
                  {
                    id: 'channelOperation.channel.contactType',
                  },
                  '接触类型',
                )}
                key="contactType"
              >
                {getFieldDecorator('contactType', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage(
                        {
                          id: 'channelOperation.channel.pleaseInput',
                        },
                        '请输入',
                      ),
                    },
                  ],
                })(
                  <Select
                    allowClear
                    size="small"
                    placeholder={formatMessage(
                      {
                        id: 'channelOperation.channel.pleaseSelect',
                      },
                      '请选择',
                    )}
                  >
                    {NET_TYPE
                      ? NET_TYPE.map(item => (
                          <Select.Option key={item.attrValueCode} value={item.attrValueCode}>
                            {item.attrValueName}
                          </Select.Option>
                        ))
                      : null}
                  </Select>,
                )}
              </Form.Item>
            </Col> */}
            <Col span={12}>
              <Form.Item
                // {...formItemDoubleRowLayout}
                label={formatMessage(
                  {
                    id: 'channelOperation.operation.orderRule',
                  },
                  '工单生成规则',
                )}
              >
                {getFieldDecorator('orderCreateType', {
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
                    { max: 20, message: '内容请控制在20个字符以内' },
                  ],
                  // initialValue: operationItemDetail.orderCreateType
                })(
                  <Select
                    allowClear
                    size="small"
                    maxLength={21}
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
            <Col span={12}>
              <Form.Item
                label={formatMessage(
                  {
                    id: 'channelOperation.channel.channelIcon',
                  },
                  '渠道图标',
                )}
              >
                {getFieldDecorator('icon', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage(
                        {
                          id: 'channelOperation.channel.pleaseSelect',
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
                        id: 'channelOperation.channel.pleaseSelect',
                      },
                      '请选择',
                    )}
                  >
                    {channelIcon
                      ? channelIcon.map(item => (
                          <Select.Option key={item} value={item}>
                            {item}
                          </Select.Option>
                        ))
                      : null}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 19 }}
                label={formatMessage(
                  {
                    id: 'channelOperation.channel.channelDesc',
                  },
                  '渠道描述',
                )}
                key="des"
              >
                {getFieldDecorator('des', {
                  rules: [{ max: 150, message: '内容请控制在150个字符以内' }],
                })(
                  <Input.TextArea
                    maxLength={151}
                    autosize={{ minRows: 2, maxRows: 8 }}
                    placeholder={formatMessage(
                      {
                        id: 'channelOperation.channel.pleaseInput',
                      },
                      '请输入',
                    )}
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
          {/* <div className={style.formBlockTitle} style={{ display: 'none' }}>
            <span>
              {formatMessage(
                {
                  id: 'channelOperation.channel.quietHours',
                },
                '免打扰时间',
              )}
            </span>
          </div>
          <Row style={{ display: 'none' }}>
            <Col span={24}>{formItems}</Col>
          </Row>
          <div className={style.formBlockTitle}>
            <span>
              {formatMessage(
                {
                  id: 'channelOperation.channel.displayContent',
                },
                '展示内容',
              )}
            </span>
          </div> */}
          <Row>
            <Col span={24}>
              <Form.Item
                style={{ display: 'none' }}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                label={formatMessage(
                  {
                    id: 'channelOperation.channel.responseTemp',
                  },
                  '显示回复模板',
                )}
              >
                {getFieldDecorator('responseTemp', {
                  initialValue: '0',
                })(
                  <Radio.Group size="small">
                    <Radio disabled value="1">
                      {formatMessage(
                        {
                          id: 'channelOperation.channel.yes',
                        },
                        '是',
                      )}
                    </Radio>
                    <Radio disabled value="0">
                      {formatMessage(
                        {
                          id: 'channelOperation.channel.no',
                        },
                        '否',
                      )}
                    </Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                style={{ display: 'none' }}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                label={formatMessage(
                  {
                    id: 'channelOperation.channel.effectTime',
                  },
                  '显示有效期',
                )}
              >
                {getFieldDecorator('effectTime', {
                  initialValue: '0',
                })(
                  <Radio.Group size="small">
                    <Radio disabled value="1">
                      {formatMessage(
                        {
                          id: 'channelOperation.channel.yes',
                        },
                        '是',
                      )}
                    </Radio>
                    <Radio disabled value="0">
                      {formatMessage(
                        {
                          id: 'channelOperation.channel.no',
                        },
                        '否',
                      )}
                    </Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                style={{ display: 'none' }}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                label={formatMessage(
                  {
                    id: 'channelOperation.channel.accumulative',
                  },
                  '显示累计',
                )}
              >
                {getFieldDecorator('accumulative', {
                  initialValue: '1',
                })(
                  <Radio.Group size="small">
                    <Radio disabled value="1">
                      {formatMessage(
                        {
                          id: 'channelOperation.channel.yes',
                        },
                        '是',
                      )}
                    </Radio>
                    <Radio disabled value="0">
                      {formatMessage(
                        {
                          id: 'channelOperation.channel.no',
                        },
                        '否',
                      )}
                    </Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                style={{ display: 'none' }}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                label={formatMessage(
                  {
                    id: 'channelOperation.channel.feedback',
                  },
                  '显示反馈',
                )}
              >
                {getFieldDecorator('feedback', {
                  initialValue: '0',
                })(
                  <Radio.Group size="small">
                    <Radio disabled value="1">
                      {formatMessage(
                        {
                          id: 'channelOperation.channel.yes',
                        },
                        '是',
                      )}
                    </Radio>
                    <Radio disabled value="0">
                      {formatMessage(
                        {
                          id: 'channelOperation.channel.no',
                        },
                        '否',
                      )}
                    </Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                style={{ display: 'none' }}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                label={formatMessage(
                  {
                    id: 'channelOperation.channel.resend',
                  },
                  '显示重发',
                )}
              >
                {getFieldDecorator('resend', {
                  initialValue: '0',
                })(
                  <Radio.Group size="small">
                    <Radio disabled value="1">
                      {formatMessage(
                        {
                          id: 'channelOperation.channel.yes',
                        },
                        '是',
                      )}
                    </Radio>
                    <Radio disabled value="0">
                      {formatMessage(
                        {
                          id: 'channelOperation.channel.no',
                        },
                        '否',
                      )}
                    </Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: 'channel_form' })(ChannelForm);
