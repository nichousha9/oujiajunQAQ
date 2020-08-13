import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Radio, Form, Row, Col, Button, Select, DatePicker, Input, Card } from 'antd';
import moment from 'moment';
import { getAttrValueByCode } from '../../untils';
import QueryBuilderRule from './QueryBuilderRule';
import style from '../index.less';

const { Option } = Select;

const mapStateToProps = ({ eventManageComm, configDetail, common }) => ({
  attrSpecCodeList: common.attrSpecCodeList,
  itemDetail: eventManageComm.itemDetail,
  inputSrcListData: configDetail.inputSrcListData,
  activePolicyDetail: configDetail.activePolicyDetail,
  evtPolicySetDetails: configDetail.evtPolicySetDetails,
  groupFields: configDetail.groupFields,
});

function OutputFormat(props) {
  const {
    form,
    attrSpecCodeList,
    itemDetail,
    inputSrcListData = [],
    activePolicyDetail = {},
    evtPolicySetDetails = [],
    groupFields = {},
    dispatch,
  } = props;
  const { getFieldDecorator, validateFields, setFieldsValue } = form;

  const { CON_TYPE_OUT, YES_OR_NO, WINDOW_TYPE, PERIOD } = attrSpecCodeList;

  // 表示单选框选中哪个，以渲染不同的组件
  const [selected, setSelected] = useState('timeConfig');

  // 表单是否可编辑
  const [formEditabled, setFormEditabled] = useState(false);

  // 改变 Tabs 选中项
  function changeSelected(e) {
    setSelected(e.target.value);
  }

  // 提交表单
  function submitForm() {
    validateFields((err, val) => {
      return err + val;
    });
  }

  // 获取数字字典
  useEffect(() => {
    if (!CON_TYPE_OUT || !YES_OR_NO || !WINDOW_TYPE) {
      getAttrValueByCode(dispatch, 'event', [
        'CON_TYPE_OUT', // 输出连接类型
        'YES_OR_NO',
        'WINDOW_TYPE', // 窗口类型
        'PERIOD', // 持续时间
        'OPT_RULE', // 下拉框 加减 等操作
        'OPERATOR_ID', // 下拉框 ">" ">=" 等操作
      ]);
    }
  }, []);

  // 获取输入源
  useEffect(() => {
    dispatch({
      type: 'configDetail/getInputSrcListEffect',
      payload: {
        eventId: itemDetail.id,
        pageInfo: {
          pageNum: 1,
          pageSize: 40,
        },
      },
    });
  }, []);

  // 获取活动策略详情数据
  useEffect(() => {
    dispatch({
      type: 'configDetail/getActivePolicyDetail',
      payload: {
        eventId: itemDetail.id,
      },
    });
  }, []);

  // 获取分组字段，下拉框字段数据
  useEffect(() => {
    evtPolicySetDetails.forEach(item => {
      dispatch({
        type: 'configDetail/getGroupFields',
        payload: {
          inputId: item && item[0] && item[0].inputId,
        },
      });
    });
  });

  // 设置表单项
  useEffect(() => {
    const detail = activePolicyDetail || {};
    const { evtTimeWindowDetail = {}, name, code } = detail;
    const { windowType, period, startTime, endTime, durationTime } = evtTimeWindowDetail;

    setFieldsValue({
      windowType,
      period,
      startTime: moment(startTime),
      endTime: moment(endTime),
      durationTime,
      name,
      code,
    });
  }, [activePolicyDetail]);

  return (
    <div className={style.activePolicy}>
      <Radio.Group defaultValue="timeConfig" onChange={changeSelected}>
        <Radio.Button value="timeConfig">时间窗口设置</Radio.Button>
        <Radio.Button value="computed">计算策略配置</Radio.Button>
      </Radio.Group>
      <Form labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
        <Row>
          <Col span={24} style={{ textAlign: 'right', zIndex: 9 }}>
            <Button
              size="small"
              type="primary"
              onClick={() => {
                setFormEditabled(true);
              }}
            >
              编辑
            </Button>
          </Col>
          <Row style={{ display: selected === 'timeConfig' ? 'block' : 'none' }}>
            <Col span={8}>
              <Form.Item label="窗口类型">
                {getFieldDecorator('windowType', {
                  rules: [{ required: true, message: '请选择窗口类型' }],
                })(
                  <Select
                    allowClear
                    size="small"
                    disabled={!formEditabled}
                    placeholder={formEditabled ? '请选择窗口类型' : ''}
                  >
                    {Array.isArray(WINDOW_TYPE) &&
                      WINDOW_TYPE.map(item => (
                        <Option key={item.attrValueCode} value={item.attrValueCode}>
                          {item.attrValueName}
                        </Option>
                      ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="开始时间">
                {getFieldDecorator('startTime', {
                  rules: [{ required: true, message: '请选择开始时间' }],
                })(<DatePicker size="small" disabled={!formEditabled} />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="结束时间">
                {getFieldDecorator('endTime', {
                  rules: [{ required: true, message: '请选择结束时间' }],
                })(<DatePicker size="small" disabled={!formEditabled} />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="持续时长">
                {getFieldDecorator('durationTime', {
                  rules: [{ required: true, message: '请选择持续时长' }],
                })(
                  <Input
                    size="small"
                    placeholder={formEditabled ? '请输入持续时长' : ''}
                    disabled={!formEditabled}
                  />,
                )}
                {getFieldDecorator('period', {
                  rules: [{ required: true, message: '请选择持续时长' }],
                })(
                  <Select
                    allowClear
                    size="small"
                    placeholder={formEditabled ? '请选择持续时长' : ''}
                    disabled={!formEditabled}
                  >
                    {Array.isArray(PERIOD) &&
                      PERIOD.map(item => (
                        <Option key={item.attrValueCode} value={item.attrValueCode}>
                          {item.attrValueName}
                        </Option>
                      ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>
        </Row>
      </Form>
      <Row style={{ display: selected === 'computed' ? 'block' : 'none' }}>
        <Card
          title={
            <Col span={6}>
              <Form.Item
                className={style.formItemNoMargin}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                label="策略集"
              >
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入策略集' }],
                })(
                  <Input
                    size="small"
                    placeholder={formEditabled ? '请输入策略集' : ''}
                    disabled={!formEditabled}
                  />,
                )}
              </Form.Item>
            </Col>
          }
          size="small"
          className={style.policies}
          extra={<a>增加输入源</a>}
        >
          {Array.isArray(evtPolicySetDetails)
            ? evtPolicySetDetails.map(comPolicy => (
                <Card
                  title={
                    <Col span={6}>
                      <Form.Item
                        className={style.formItemNoMargin}
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        label="输入源"
                      >
                        {getFieldDecorator('code', {
                          rules: [{ required: true, message: '请选择输入源' }],
                          initialValue: comPolicy && comPolicy[0] && comPolicy[0].inputId,
                        })(
                          <Select
                            allowClear
                            size="small"
                            placeholder={formEditabled ? '请选择输入源' : ''}
                            disabled={!formEditabled}
                          >
                            {Array.isArray(inputSrcListData) &&
                              inputSrcListData.map(item => (
                                <Option key={item.id} value={item.id}>
                                  {item.name}
                                </Option>
                              ))}
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>
                  }
                  size="small"
                  className={style.inputSrc}
                  extra={<a href="#">增加计算策略</a>}
                >
                  {comPolicy.map
                    ? comPolicy.map(policyDetails => (
                        <Card
                          title={
                            <Row>
                              <Col span={7}>
                                <Form.Item
                                  className={style.formItemNoMargin}
                                  labelCol={{ span: 6 }}
                                  wrapperCol={{ span: 18 }}
                                  label="计算策略"
                                >
                                  {getFieldDecorator('computedPolicy', {
                                    rules: [{ required: true, message: '请选择输入源' }],
                                    initialValue: policyDetails && policyDetails.name,
                                  })(<Input disabled={!formEditabled} size="small" />)}
                                </Form.Item>
                              </Col>
                              <Col span={7}>
                                <Form.Item
                                  className={style.formItemNoMargin}
                                  labelCol={{ span: 6 }}
                                  wrapperCol={{ span: 18 }}
                                  label="分组字段"
                                >
                                  {getFieldDecorator('fenduan', {
                                    rules: [{ required: true, message: '请选择输入源' }],
                                    initialValue: policyDetails && policyDetails.groupByStr,
                                  })(
                                    <Select
                                      allowClear
                                      size="small"
                                      placeholder={formEditabled ? '请选择输入源' : ''}
                                      disabled={!formEditabled}
                                    >
                                      {groupFields[
                                        comPolicy && comPolicy[0] && comPolicy[0].inputId
                                      ] &&
                                        Array.isArray(
                                          groupFields[
                                            comPolicy && comPolicy[0] && comPolicy[0].inputId
                                          ].data,
                                        ) &&
                                        groupFields[
                                          comPolicy && comPolicy[0] && comPolicy[0].inputId
                                        ].data.map(item => (
                                          <Option key={item.code} value={item.code}>
                                            {item.name}
                                          </Option>
                                        ))}
                                    </Select>,
                                  )}
                                </Form.Item>
                              </Col>
                              <Col span={7}>
                                <Form.Item
                                  className={style.formItemNoMargin}
                                  labelCol={{ span: 6 }}
                                  wrapperCol={{ span: 18 }}
                                  label="账期字段"
                                >
                                  {getFieldDecorator('zhangqi', {
                                    rules: [{ required: true, message: '请选择输入源' }],
                                    initialValue: policyDetails && policyDetails.accountId,
                                  })(
                                    <Select
                                      allowClear
                                      size="small"
                                      placeholder={formEditabled ? '请选择输入源' : ''}
                                      disabled={!formEditabled}
                                    >
                                      {groupFields[
                                        comPolicy && comPolicy[0] && comPolicy[0].inputId
                                      ] &&
                                        Array.isArray(
                                          groupFields[
                                            comPolicy && comPolicy[0] && comPolicy[0].inputId
                                          ].dateAttr,
                                        ) &&
                                        groupFields[
                                          comPolicy && comPolicy[0] && comPolicy[0].inputId
                                        ].dateAttr.map(item => (
                                          <Option key={item.id} value={item.id}>
                                            {item.name}
                                          </Option>
                                        ))}
                                    </Select>,
                                  )}
                                </Form.Item>
                              </Col>
                            </Row>
                          }
                          size="small"
                          className={style.calcPolicy}
                          extra={<a href="#">删除</a>}
                        >
                          <QueryBuilderRule
                            form={form}
                            rules={{ conditions: policyDetails.evtPolicyRuleDetails }}
                            groupFieldList={
                              groupFields[comPolicy && comPolicy[0] && comPolicy[0].inputId]
                            }
                          />
                        </Card>
                      ))
                    : null}
                </Card>
              ))
            : null}
        </Card>
      </Row>
      {formEditabled && (
        <Col span={24} style={{ textAlign: 'center' }}>
          <Button size="small" type="primary" onClick={submitForm}>
            保存
          </Button>
          &nbsp;&nbsp;
          <Button
            size="small"
            onClick={() => {
              setFormEditabled(false);
            }}
          >
            取消
          </Button>
        </Col>
      )}
    </div>
  );
}

export default Form.create()(connect(mapStateToProps)(OutputFormat));
