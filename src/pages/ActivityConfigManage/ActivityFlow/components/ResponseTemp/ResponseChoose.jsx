// 回复模板选择弹窗
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Modal, Tabs, Form, Select, Input, Switch, Radio, InputNumber, Row, Col, message } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import CommondityChoose from '../Commodity/CommodityChoose';
import CreativityChoose from '../Creativity/CreativityChoose';
import { objToLowerCase } from '@/utils/common';
import commonStyles from '../../common.less';

const { TabPane } = Tabs;

@connect(({ user, activityFlowContact }) => ({
  userInfo: user.userInfo,
  activityFlowContact
}))
@Form.create()

class ResponseChoose extends React.Component {
  formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  formItemLayout2 = {
    labelCol: { span: 3 },
    wrapperCol: { span: 12 },
  };

  constructor(props) {
    super(props);
    const { currentItem = {} } = props;
    this.state = {
      sourceList: [], // source号码可选择项
      responseList: [], // 回复模板可选项
      responseType: currentItem.responseType, // 回复类型
      canSelectOffer: true, // 是否可以选择商品
      offerVisible: false, // 选择商品弹窗
      offerItem: {}, // 选中的商品
      creativityChooseVisible: false, // 选择创意弹窗
      creativityItem: {}, // 选中的创意
    };
  }

  componentDidMount() {
    this.initSourceNumSelect();
    this.qryResponseType();
  }

  componentDidUpdate(prevProps, prevState) {
    const { responseType } = this.state;
    if(responseType != prevState.responseType) {
      this.responseTypeChange(responseType);
    }
  }
  
  // 回复类型变化相对应的变化
  responseTypeChange = (responseType) => {
    const { form } = this.props;
    let smsupset = '';
    let canSelectOffer = true;
    if(responseType === 4) {
      smsupset = 'smsControleYes';
    }
    else {
      smsupset = 'smsControleNO';
      canSelectOffer = false;
    }
    form.setFieldsValue({ smsupset })
    // 商品选择和通知成功选择都重置为空
    this.setState({ offerItem: {}, creativityItem: {}, canSelectOffer });
  }

  // 获取Source号码下拉框数据
  initSourceNumSelect = () => {
    const { dispatch, userInfo } = this.props;
    dispatch({
      type: 'activityFlowContact/getBfmParamValue',
      payload: {
        mask:'SMS_RESP_DEFAULT_SRC_NBR',
        staffId: userInfo.staffInfo.staffId, // 当前用户id
        staffName: userInfo.staffInfo.staffName // 用户姓名
      },
      success: (svcCont) => {
        const { data } = svcCont;
        const sourceList = data.split("|");
        this.setState({ sourceList: sourceList || [] });
      }
    })
  }

  // 获取回复类型下拉框数据
  qryResponseType = () => {
    const { dispatch, userInfo } = this.props;
    dispatch({
      type: 'activityFlowContact/qryResponseType',
      payload: {
        staffId: userInfo.staffInfo.staffId, // 当前用户id
        staffName: userInfo.staffInfo.staffName // 用户姓名
      },
      success: (svcCont) => {
        const { data } = svcCont;
        const responseList = objToLowerCase(data);
        let responseType = '';
        if(responseList && responseList.length){
          responseType = responseList[0] && responseList[0].responseType;
        }
        this.setState({ responseList, responseType });
      }
    })
  }

  responseTypeOnChange = (value) => {
    this.setState({ responseType: value });
  }

  /**
   *
   * 去选择商品
   * @memberof ResponseChoose
   */
  addCommondity = () => {
    const { canSelectOffer } = this.state;
    if(canSelectOffer) {
      this.setState({ offerVisible: true });
    }
  };
  
  /**
   *选中商品返回
   *
   * @memberof ResponseChoose
   */
  offerOnOk = values => {
    const { form } = this.props;
    if(values.length) {
      const offerItem = values[0];
      this.setState({ offerItem, offerVisible: false });
      form.setFieldsValue({ offerName: offerItem.offerName })
    }
  };

  /**
   *
   * 去选择创意（通知成功）
   * @memberof ResponseChoose
   */
  addCreativity = () => {
    this.setState({ creativityChooseVisible : true });
  };
  
  /**
   *选中创意（通知成功）返回
   *
   * @memberof ResponseChoose
   */
  creativityOnOk = values => {
    const { form } = this.props;
    if(values.length > 0){
      this.setState({ creativityItem: values[0], creativityChooseVisible: false });
      form.setFieldsValue({ selectNotifyOnSucceed: values[0].creativeInfoName })
    }
  };

  // 保存提交
  handleSubmit = () => {
    const { form, onOk, currentItem } = this.props;
    const { validateFieldsAndScroll } = form;
    const { responseList, creativityItem, offerItem } = this.state;
    validateFieldsAndScroll((err, values) => {
      const { respCodeIgnoreCase, responseType } = values;
      let submitValues = {};
      if (err) {
        message.info(formatMessage({ id: 'activityConfigManage.contact.pleaseFillInTheRequireItems' }));
        return
      }
      const responseTempArr = responseList.filter((item) => item.responseType === responseType );
      submitValues = {
        ...values,
        id: currentItem.id,
        // contactTempId,
        respCodeIgnoreCase: respCodeIgnoreCase ? 'Y' : 'N',// 忽略大小写
        // 回复类型
        responseType, 
        responseTypeName: responseTempArr && responseTempArr.length && responseTempArr[0].name,
        responseStatement: null,
        offerId: offerItem.offerId,
        offerName: offerItem.offerName,
        offerType: offerItem.offerType,
        succeedAdviceType: creativityItem.adviceType,
        mccOfferPromot: null,
        promotDesc: null
      }
      // 控制频率(下有周期和次数)
      if (values.smsupset == 'smsControleNO') {
        submitValues.frequencyControl = '';
        submitValues.frequencyDuration = '';
        submitValues.times = '';
      };
      onOk(submitValues);
    });
  }

  render() {
    const { form, onCancel, activityFlowContact, channelId, currentItem } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { sourceList, responseList, responseType, offerVisible, creativityChooseVisible, canSelectOffer } = this.state;
    const { creativeInfoRels } = activityFlowContact;

    // 是否控制评率（控制周期和次数是否可用）
    const smsDisabled = getFieldValue('smsupset') === 'smsControleNO';

    // 商品数量限制（商品限制和数量有效时间是否可用）
    const offerLimitDisabled = getFieldValue('offerLimitIndex') === 'N';

    const creativeInfoIds = [];
    creativeInfoRels.map((item) => creativeInfoIds.push(item.creativeInfoId));
    const commodityChooseProps = {
      creativeInfoIds,
      visible: offerVisible,
      onCancel: () => {
        this.setState({ offerVisible: false });
      },
      onOk: this.offerOnOk,
    };

    const creativityChooseProps = {
      visible: creativityChooseVisible,
      options: {
        channelId,
        // 1 图文模板2 文字模板3 HTML模板
        // templateInfoType: '2',
        templateInfoTypes: ["2"]
      },
      chooseMultiple: false,
      onCancel: () => {
        this.setState({ creativityChooseVisible: false });
      },
      onOk: this.creativityOnOk,
    };

    return (
      <Fragment>
        {offerVisible && <CommondityChoose {...commodityChooseProps} />}
        {creativityChooseVisible && <CreativityChoose {...creativityChooseProps} />}
        {/* 增加短信回复 */}
        <Modal
          title={formatMessage({ id: 'activityConfigManage.contact.flowchartAddSmsResponse' })}
          visible
          width={960}
          onOk={this.handleSubmit}
          onCancel={onCancel}
          wrapClassName={commonStyles.flowModal}
        >
          <Form {...this.formItemLayout}>
            <Tabs type="card" size='small'>
              {/* 概要 */}
              <TabPane tab={formatMessage({ id: 'activityConfigManage.contact.flowchartGeneral' })} key="1">
                <Row gutter={24}>
                  <Col xs={24} sm={12}>
                    {/* Source号码 */}
                    <Form.Item label={formatMessage({ id: 'activityConfigManage.contact.flowchartSourceNbr' })}>
                      {getFieldDecorator('srcNbr', {
                        rules: [{ required: true, message: formatMessage({ id: 'common.form.required' }) }],
                        initialValue: currentItem.srcNbr
                      })(
                        <Select>
                          {
                            sourceList.map((item) => <Select.Option key={item} value={item}>{item}</Select.Option> )
                          }  
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    {/* 回复命令 */}
                    <Form.Item className={commonStyles.doubleFormItem} label={formatMessage({ id: 'activityConfigManage.contact.flowchartReplayCommand' })}>
                      <Form.Item className={commonStyles.inlineFormItem} style={{ width: 'calc(100% - 130px)'}}>
                        {getFieldDecorator('responseCode', {
                          rules: [{ required: true, message: formatMessage({ id: 'common.form.required' }) }],
                          initialValue: currentItem.responseCode
                        })(
                          <Input />  
                        )}
                      </Form.Item>
                      <Form.Item className={commonStyles.inlineFormItem}>
                        {getFieldDecorator('respCodeIgnoreCase', {
                          valuePropName: 'checked',
                          initialValue: currentItem.respCodeIgnoreCase ? currentItem.respCodeIgnoreCase === 'Y' : true
                        })(
                          <Switch />  
                        )}
                      </Form.Item>
                      {/* 忽略大小写 */}
                      <span>{formatMessage({ id: 'activityConfigManage.contact.caseSensitive' })}</span>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    {/* 回复类型 */}
                    <Form.Item label={formatMessage({ id: 'activityConfigManage.contact.flowchartResponseType' })}>
                      {getFieldDecorator('responseType', {
                        rules: [{ required: true, message: formatMessage({ id: 'common.form.required' }) }],
                        initialValue: responseType,
                        onChange: this.responseTypeOnChange
                      })(
                        <Select>
                          {
                            responseList.map((item) => <Select.Option key={item.responseType} value={item.responseType}>{item.name}</Select.Option> )
                          }
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    {/* 商品 */}
                    <Form.Item label={formatMessage({ id: 'activityConfigManage.contact.flowchartOffer' })}>
                      {getFieldDecorator('offerName', {
                        rules: [{ required: canSelectOffer, message: formatMessage({ id: 'common.form.required' }) }],
                        initialValue: currentItem.offerName
                      })(
                        <Input.Search readOnly onSearch={this.addCommondity}/>
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    {/* 通知成功 */}
                    <Form.Item label={formatMessage({ id: 'activityConfigManage.contact.flowchartNotifyOnSucceed' })}>
                      {getFieldDecorator('selectNotifyOnSucceed', {
                        initialValue: currentItem.selectNotifyOnSucceed || currentItem.adviceTypeName
                      })(
                        <Input.Search readOnly onSearch={this.addCreativity} />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </TabPane>
              {/* 频率 */}
              <TabPane tab={formatMessage({ id: 'activityConfigManage.contact.campaignFrequency' })} key="2">
                <Form.Item label={formatMessage({ id: 'activityConfigManage.contact.dmFrequencyControl'})} {...this.formItemLayout2}>
                  {getFieldDecorator('smsupset', {
                    initialValue: currentItem.responseType && !currentItem.frequencyControl ? 'smsControleNO' : 'smsControleYes'
                  })(
                    <Radio.Group disabled={!responseType === 4}>
                      <Radio value="smsControleYes">{formatMessage({ id: 'common.text.yes'})}</Radio>
                      <Radio value="smsControleNO">{formatMessage({ id: 'common.text.no'})}</Radio>
                    </Radio.Group>,
                  )}
                </Form.Item>
                {/* 周期 */}
                <Form.Item label={formatMessage({ id: 'activityConfigManage.contact.flowchartCycle' })} {...this.formItemLayout2} className={commonStyles.doubleFormItem}>
                  {getFieldDecorator('frequencyControl', {
                    rules: [{ required: !smsDisabled, message: formatMessage({ id: 'common.form.required' }) }],
                    initialValue: currentItem.frequencyControl || 'PERDAY'
                  })(
                    <Radio.Group disabled={smsDisabled}>
                      <Radio value="PERDAY">{formatMessage({ id:'activityConfigManage.contact.every' })}</Radio>
                      <Form.Item className={commonStyles.inlineFormItem}>
                        {getFieldDecorator('frequencyDuration', {
                          rules: [{ required: !smsDisabled, message: formatMessage({ id: 'common.form.required' }) }],
                          initialValue: currentItem.frequencyDuration
                        })(
                          <InputNumber min={0} disabled={smsDisabled} />
                        )}
                      </Form.Item>
                      {/* 营销时间有效期 */}
                      <Radio value="REPVALID">{formatMessage({ id: 'activityConfigManage.contact.marketingValidity' })}</Radio>
                    </Radio.Group>,
                  )}
                </Form.Item>
                <Form.Item label={formatMessage({ id: 'activityConfigManage.contact.campaignTimes' })} {...this.formItemLayout2}>
                  {getFieldDecorator('times', {
                    rules: [{ required: !smsDisabled, message: formatMessage({ id: 'common.form.required' }) }],
                    initialValue: currentItem.times
                  })(
                    <InputNumber min={0} disabled={smsDisabled} />,
                  )}
                </Form.Item>
              </TabPane>
              {/* 数量有效时间 */}
              {
                responseType === 4 ? (
                  <TabPane tab={formatMessage({ id:'activityConfigManage.contact.campaignOfferQuantityLimit'})} key="3">
                    {/* 商品数量限制 */}
                    <Form.Item label={formatMessage({ id:'activityConfigManage.contact.campaignOfferQuantityLimit' })} {...this.formItemLayout2}>
                      {getFieldDecorator('offerLimitIndex', {
                        initialValue: !currentItem.quantityLimit ? 'N' : 'Y'
                      })(
                        <Radio.Group>
                          <Radio value="Y">{formatMessage({ id: 'common.text.yes'})}</Radio>
                          <Radio value="N">{formatMessage({ id: 'common.text.no'})}</Radio>
                        </Radio.Group>,
                      )}
                    </Form.Item>
                    {/* 商品限制 */}
                    <Form.Item label={formatMessage({ id: 'activityConfigManage.contact.offerLimit' })} {...this.formItemLayout2}>
                      {getFieldDecorator('quantityLimit', {
                        rules: [{ required: !offerLimitDisabled, message: formatMessage({ id: 'common.form.required' }) }],
                        initialValue: currentItem.quantityLimit
                      })(
                        <InputNumber min={1} disabled={offerLimitDisabled} />,
                      )}
                    </Form.Item>
                    {/* 数量有效时间 */}
                    <Form.Item label={formatMessage({ id: 'activityConfigManage.contact.campaignOfferQuantityLimit' })} {...this.formItemLayout2}>
                      {getFieldDecorator('qntlimitTimeFrame', {
                        initialValue: currentItem.qntlimitTimeFrame || 'PERDAY'
                      })(
                        <Radio.Group disabled={offerLimitDisabled}>
                          <Radio value="PERDAY">{formatMessage({ id: 'common.text.yes'})}</Radio>
                          <Radio value="RSPVALID">{formatMessage({ id: 'common.text.no'})}</Radio>
                        </Radio.Group>,
                      )}
                    </Form.Item>
                  </TabPane>
                ) : null
              }
            </Tabs>
          </Form>
        </Modal>
      </Fragment>
    );
  }
}

export default ResponseChoose;
