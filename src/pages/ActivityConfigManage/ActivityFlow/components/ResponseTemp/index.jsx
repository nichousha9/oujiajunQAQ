/* 回复模板
参数：
form,
processId,
channelId */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Switch, InputNumber, Select, Radio, DatePicker, TimePicker, Card, Table, Button, message } from 'antd';
import moment from 'moment';
import { formatMessage } from 'umi-plugin-react/locale';
import ResponseChoose from './ResponseChoose';
import commonStyles from '../../common.less';
import styles from './index.less';

@connect(({ activityFlowContact }) => ({
  activityFlowContact
}))
class ResponseTemp extends React.Component {
  formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  columns = [
    {
      title: formatMessage({ id: 'activityConfigManage.contact.flowchartSourceNbr' }), // 'Source号码',
      dataIndex: 'srcNbr',
      key: 'srcNbr',
    },
    {
      title: formatMessage({ id: 'activityConfigManage.contact.flowchartReplayCommand' }), // '回复命令',
      dataIndex: 'responseCode',
      key: 'responseCode',
    },
    {
      title: formatMessage({ id: 'activityConfigManage.contact.flowchartResponseType' }), // '回复类型',
      dataIndex: 'responseTypeName',
      key: 'responseTypeName',
    },
    {
      title: formatMessage({ id: 'activityConfigManage.contact.flowchartOffer' }), // '商品',
      dataIndex: 'offerName',
      key: 'offerName',
    },
    {
      title: formatMessage({ id: 'common.table.antion' }), // '操作',
      dataIndex: 'operator',
      key: 'operator',
      render: (text, record) => [
        <a key='edit' onClick={this.editResponse.bind(this, record)} className={styles.operate}>编辑</a>,
        <a key='del' onClick={this.delResponse.bind(this, record)} className={styles.operate}>删除</a>
      ]
    },
  ];

  constructor(props) {
    super(props);
    this.addId = 0;
    this.state = {
      responseChooseVisible: false,
      // responseTempList: [],// 回复模板列表
      responseChooseEditType: '', // 新增或编辑回复模板类型ADD新增, MOD编辑
      responseTempForm: {}, // 初始数据
      currentItem: {}
    };
  }
    
  componentDidMount() {
    this.qryResponseTemps();
  }
  
  // 如果有processId则去请求之前保存数据
  qryResponseTemps = () => {
    const { dispatch, processId } = this.props;
    if(!processId){
      return
    }
    dispatch({
      type: 'activityFlowContact/qryResponseTemps',
      payload: { processId },
      success: (svcCont) => {
        const { data = {} } = svcCont;
        const { mccContactTemp, processResponseTempRels: responseTempList } = data;
        let responseTempForm = { ...mccContactTemp };
        if(responseTempList && responseTempList.length > 0) {
          responseTempForm = {
            ...responseTempForm,
            validityType: responseTempList[0].validityType,
            startTime: responseTempList[0].startTime,
            endTime: responseTempList[0].endTime,
            offset: responseTempList[0].offset,
            offsetUnit: responseTempList[0].offsetUnit,
            timewinStart: responseTempList[0].timewinStart,
            timewinEnd: responseTempList[0].timewinEnd,
          }
        }
        this.setState({ responseTempForm });
      }
    })
  }

  /**
   *
   * 不可选择日期
   * @memberof ResponseTemp
   */
  disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().startOf('day');
  }

  // 新增回复模板
  addResponse = () => {
    const { activityFlowContact } = this.props;
    const { creativeInfoRels } = activityFlowContact;
    if(creativeInfoRels && creativeInfoRels.length){
      this.setState({ currentItem: {}, responseChooseVisible: true, responseChooseEditType: 'ADD' });
    }
    else {
      message.info(formatMessage({ id: 'activityConfigManage.contact.selectCreativeError' }));
    }
  }

  // 选中模板回调
  chooseResponse = (values) => {
    const { responseChooseEditType } = this.state;
    const { dispatch, activityFlowContact } = this.props;
    const { responseTempList } = activityFlowContact;
    if(responseChooseEditType === 'ADD') {
      responseTempList.push({...values, id:`add${this.addId+=1}`});
    }
    else {
      responseTempList.forEach((item, index) => {
        if(item.id === values.id){
          responseTempList[index] = values;
        }
      });
    }
    this.setState({ responseChooseVisible: false });
    dispatch({
      type: 'activityFlowContact/save',
      payload: { responseTempList }
    })
  }

  //  编辑回复模板
  editResponse = (values) => {
    this.setState({ currentItem: values, responseChooseVisible: true });
  }

  // 删除回复模板某一条
  delResponse = (record) => {
    const { dispatch, activityFlowContact } = this.props;
    const { responseTempList } = activityFlowContact;
    dispatch({
      type: 'activityFlowContact/save',
      payload: { responseTempList: responseTempList.filter(item => item.id != record.id) }
    })
  }

  render() {
    const { form, channelId } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { responseChooseVisible, responseChooseEditType, responseTempForm, currentItem } = this.state;
    const { activityFlowContact } = this.props;
    const { responseTempList } = activityFlowContact;

    const responseChooseProps = {
      channelId,
      operType: responseChooseEditType,
      currentItem,
      onOk: this.chooseResponse,
      onCancel: () => {
        this.setState({ responseChooseVisible: false });
      }
    }

    return (
      <Fragment>
        {responseChooseVisible ? <ResponseChoose {...responseChooseProps} /> : null}
        <div className={commonStyles.block} id='response'>
          {/* 回复模板 */}
          <p className={commonStyles.title}>{formatMessage({ id: 'activityConfigManage.contact.responseTemp' })}</p>
          {/* 是否反馈 */}
          <Form.Item label={formatMessage({ id: 'activityConfigManage.contact.isResponse' })}>
            {getFieldDecorator('isResponsable', {
              valuePropName: 'checked',
              initialValue: responseTempForm.isResponsable ? responseTempForm.isResponsable === 'Y' : true
            })(
              <Switch />,
            )}
          </Form.Item>
          {
            getFieldValue('isResponsable') ? (
              <Fragment>
                {/* 失效类型 */}
                <Form.Item label={formatMessage({ id: 'activityConfigManage.contact.campaignExpiredType' })}>
                  {getFieldDecorator('validityType', {
                    initialValue: responseTempForm.validityType || 'R'
                  })(
                    <Radio.Group>
                      {/* 绝对时间 */}
                      <Radio value="A">{formatMessage({ id: 'activityConfigManage.contact.flowchartAbsoluteTime' })}</Radio>
                      {/* 相对时间 */}
                      <Radio value="R">{formatMessage({ id: 'activityConfigManage.contact.flowchartRelativeTime' })}</Radio>
                    </Radio.Group>,
                  )}
                </Form.Item>
                <div className={styles.greyBlock}>
                  {
                    getFieldValue('validityType') === 'A' ? (
                      <Row gutter={24}>
                        <Col span={12}>
                          {/* 生效时间 */}
                          <Form.Item label={formatMessage({ id: 'activityConfigManage.flow.effTime' })} {...this.formItemLayout}>
                            {getFieldDecorator('startTime', {
                              rules: [{ type: 'object', required: true, message: formatMessage({ id: 'common.form.required' }) }],
                              initialValue: responseTempForm.startTime && moment(responseTempForm.startTime)
                            })(
                              <DatePicker size='small' disabledDate={this.disabledDate} getCalendarContainer={() => document.getElementById('response')} />,
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          {/* 失效时间 */}
                          <Form.Item label={formatMessage({ id: 'activityConfigManage.flow.expTime'})} {...this.formItemLayout}>
                            {getFieldDecorator('endTime', {
                              rules: [{ type: 'object', required: true, message: formatMessage({ id: 'common.form.required' }) }],
                              initialValue: responseTempForm.endTime && moment(responseTempForm.endTime)
                            })(
                              <DatePicker size='small' disabledDate={this.disabledDate} getCalendarContainer={() => document.getElementById('response')} />,
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                    ) : (
                      <Form.Item label={formatMessage({ id: 'activityConfigManage.contact.at' })} className={commonStyles.doubleFormItem}>
                          <Form.Item className={commonStyles.inlineFormItem}>
                            {getFieldDecorator('offset',{
                              rules: [{ required: true, message: formatMessage({ id: 'common.form.required' }) }],
                              initialValue: responseTempForm.offset
                            })(
                              <InputNumber size='small' min={1} max={500} precision={0} />,
                            )}
                          </Form.Item>
                          <Form.Item className={commonStyles.inlineFormItem}>
                            {getFieldDecorator('offsetUnit',{
                              initialValue: responseTempForm.offsetUnit || 'H'
                            })(
                              <Select size='small' getPopupContainer={() => document.getElementById('response')}>
                                <Select.Option value='H'>{formatMessage({ id: 'activityConfigManage.contact.hour' })}</Select.Option>
                                <Select.Option value='D'>{formatMessage({ id: 'activityConfigManage.contact.day' })}</Select.Option>
                                <Select.Option value='W'>{formatMessage({ id: 'activityConfigManage.contact.week' })}</Select.Option>
                                <Select.Option value='M'>{formatMessage({ id: 'activityConfigManage.contact.month' })}</Select.Option>
                              </Select>
                            )}
                          </Form.Item>
                          <span>{formatMessage({ id: 'activityConfigManage.contact.afterCustomerContact' })}</span>
                      </Form.Item>
                    )
                  }
                  <Row gutter={24}>
                    <Col span={12}>
                      {/* 时间从 */}
                      <Form.Item label={formatMessage({ id: 'activityConfigManage.contact.patternTimeFrom' })} {...this.formItemLayout}>
                        {getFieldDecorator('timewinStart', {
                          initialValue: responseTempForm.timewinStart && moment(responseTempForm.timewinStart)
                        })(
                          <TimePicker size='small' getPopupContainer={() => document.getElementById('response')} />,
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label={formatMessage({ id: 'activityConfigManage.contact.patternTo' })} {...this.formItemLayout}>
                        {getFieldDecorator('timewinEnd', {
                          initialValue: responseTempForm.timewinEnd && moment(responseTempForm.timewinEnd)
                        })(
                          <TimePicker size='small' getPopupContainer={() => document.getElementById('response')} />,
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
                {/* 回复模板 */}
                <Card 
                  size="small" 
                  bordered={false}
                  title={formatMessage({ id: 'activityConfigManage.contact.responseTemp' })}
                  extra={<Button type="primary" size='small' onClick={this.addResponse}>{formatMessage({ id: 'activityConfigManage.flow.newAdd'})}</Button>} 
                >
                <Table 
                  rowKey='id'
                  dataSource={responseTempList} 
                  columns={this.columns} 
                />
                </Card>
              </Fragment>
            ) : null
          }
        </div>
      </Fragment>
    );
  }
}

export default ResponseTemp;
