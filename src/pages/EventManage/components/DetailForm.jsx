import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Input, Col, Row, Select, Button } from 'antd';
import Catalogue from './Catalogue';
import style from './index.less';
import { getAttrValueByCode } from '../untils';

const { Option } = Select;

const mapStateToProps = ({ eventManageComm, common, loading }) => ({
  isShowDetailForm: eventManageComm.isShowDetailForm,
  attrSpecCodeList: common.attrSpecCodeList,
  fieldsDetail: eventManageComm.itemDetail,
  submitLoading: loading.effects['eventManageComm/saveEventDetailsEffect'],
  validateNameLoading: loading.effects['eventManageComm/validateNameEffect'],
});

function DetailForm(props) {
  const {
    isShowDetailForm,
    attrSpecCodeList = {},
    form,
    fieldsDetail = {},
    submitLoading,
    validateNameLoading,
    dispatch,
  } = props;
  const { EVENT_TYPE, COMPUTE_TYPE, PERIOD_TYPE, YES_OR_NO, TRIGGER_TYPE } = attrSpecCodeList;
  const { getFieldDecorator, getFieldValue, getFieldsValue, validateFields, setFieldsValue } = form;
  const { eventType } = fieldsDetail;

  // 根据 isShowDetailForm 渲染表单
  const formConfig = {
    add: {
      formItemSpan: 12, // 表单项栅格数
      readonly: false, // 表单项是否禁用
    },
    edit: {
      formItemSpan: 12,
      readonly: false,
    },
    readonly: {
      formItemSpan: 8,
      readonly: true,
    },
  };

  // 当前选中的目录树名
  const [selectedCatague, setSelectedCatague] = useState();
  // 目录树下拉框 DOM
  const [catagueSelectDOM, setCatagueSelectDOM] = useState();

  // 处理详情表单的显示类型(新建add / 编辑edit / 查看readonly )
  function showDetailForm(type = 'readonly', item = {}) {
    dispatch({
      type: 'eventManageComm/showDetailForm',
      payload: {
        type,
        item,
      },
    });
  }

  // 保存表单接口（新增、编辑）
  function saveEventDetailsEffect(params) {
    const defaultParams = {
      statusCd: '1200', // 状态, 新增时默认待生效
      createTime: moment().format('YYYY-MM-DD hh:mm:ss'),
    };

    return dispatch({
      type: 'eventManageComm/saveEventDetailsEffect',
      payload: { ...defaultParams, ...params },
      method: isShowDetailForm,
    });
  }

  // 强制重新获取列表数据
  function forceGetEventsList() {
    dispatch({
      type: 'eventManage/forceGetEventsList',
    });
  }

  // 处理表单提交
  function handleSumbit() {
    // 表单校验
    validateFields(async (err, val) => {
      if (!err) {
        const newVal = val;
        if (isShowDetailForm === 'add') {
          delete newVal.code;
        }
        await saveEventDetailsEffect(newVal);
        forceGetEventsList();
      }
    });
  }

  // 使目录树选择器失去焦点
  function blurSelectCatague() {
    catagueSelectDOM.blur();
  }

  // 保存目录字段目录树选中值
  function saveSelectedCatague(catalogueInfo) {
    // 将选择框的值改变为 selectedCatague.name
    setSelectedCatague(catalogueInfo.name);

    // 设置表单值
    setFieldsValue({
      catalogId: catalogueInfo.id,
    });

    // 使目录树选择器失去焦点
    blurSelectCatague();
  }

  // 校验名称是否已经存在
  // async function asyncValidateName(_, val, callback) {
  //   const result = await dispatch({
  //     type: 'eventManageComm/validateNameEffect',
  //     payload: {
  //       name: val,
  //     },
  //   });
  //   if (result && result.topCont && result.topCont.resultCode == 0) {
  //     if (result.svcCont && result.svcCont.data == 0) {
  //       callback();
  //     } else if (result.svcCont && result.svcCont.data == 1) {
  //       callback('名称已存在');
  //     }
  //   } else {
  //     callback('未知错误');
  //   }
  // }

  // 获取数字字典
  useEffect(() => {
    if (!EVENT_TYPE || !COMPUTE_TYPE || !PERIOD_TYPE || !YES_OR_NO || !TRIGGER_TYPE) {
      getAttrValueByCode(dispatch, 'event', [
        'EVENT_TYPE', // 事件规则类型
        'COMPUTE_TYPE', // 计算类型
        'PERIOD_TYPE', // 延迟发送单位
        'YES_OR_NO', // 是或者否
        'TRIGGER_TYPE', // 触发类型
      ]);
    }
  }, []);

  // 设置表单数据
  useEffect(() => {
    if (eventType) {
      setFieldsValue(
        {
          eventType, // 先设置事件规则类型，让其渲染出对应的其他字段
        },
        () => {
          const fiedlsVal = {}; // 用来保存所有字段键值
          const allFields = Object.keys(getFieldsValue()); // 获取所有字段键
          allFields.forEach(item => {
            fiedlsVal[item] = fieldsDetail[item];
          });
          setFieldsValue(fiedlsVal);
        },
      );
    }
  }, []);

  return (
    <Form labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} className={style.detailForm}>
      <Row gutter={24}>
        <Col span={formConfig[isShowDetailForm].formItemSpan}>
          <Form.Item hasFeedback={validateNameLoading} label="事件名称">
            {getFieldDecorator('name', {
              validateTrigger: ['onBlur'],
              validateFirst: true,
              rules: [
                { required: true, whitespace: true, message: '请输入事件名称' },
                {
                  // validator: getFieldValue('name') != fieldsDetail.name ? asyncValidateName : null,
                },
              ],
            })(
              <Input
                disabled={formConfig[isShowDetailForm].readonly}
                size="small"
                placeholder={!formConfig[isShowDetailForm].readonly && '请输入事件名称'}
              />,
            )}
          </Form.Item>
        </Col>
        <Col span={formConfig[isShowDetailForm].formItemSpan}>
          <Form.Item label="代码">
            {getFieldDecorator('code')(<Input size="small" disabled placeholder="后台自动生成" />)}
          </Form.Item>
        </Col>
        <Col span={formConfig[isShowDetailForm].formItemSpan}>
          <Form.Item label="全局用户">
            {getFieldDecorator('isAllCust', {
              rules: [{ required: true, whitespace: true, message: '请选择全局用户' }],
            })(
              <Select
                disabled={formConfig[isShowDetailForm].readonly}
                size="small"
                placeholder={!formConfig[isShowDetailForm].readonly && '请选择全局用户'}
              >
                {Array.isArray(YES_OR_NO) &&
                  YES_OR_NO.map(item => (
                    <Option key={item.attrValueCode} value={item.attrValueCode}>
                      {item.attrValueName}
                    </Option>
                  ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={formConfig[isShowDetailForm].formItemSpan}>
          <Form.Item label="目录">
            {getFieldDecorator('catalogId', {
              rules: [{ required: true, message: '请选择目录' }],
            })(
              <div
                onMouseDown={e => {
                  e.preventDefault();
                  return false;
                }} // 阻止点击下拉框默认关闭下拉框事件
              >
                <Select
                  disabled={formConfig[isShowDetailForm].readonly}
                  ref={e => setCatagueSelectDOM(e)}
                  value={selectedCatague}
                  size="small"
                  placeholder={!formConfig[isShowDetailForm].readonly && '请选择目录'}
                  dropdownRender={() => (
                    <Fragment>
                      <Catalogue saveSelectedCatague={saveSelectedCatague} />
                    </Fragment>
                  )}
                />
              </div>,
            )}
          </Form.Item>
        </Col>
        <Col span={formConfig[isShowDetailForm].formItemSpan}>
          <Form.Item label="计算类型">
            {getFieldDecorator('computeType', {
              rules: [{ required: true, whitespace: true, message: '请选择计算类型' }],
            })(
              <Select
                disabled={formConfig[isShowDetailForm].readonly}
                size="small"
                placeholder={!formConfig[isShowDetailForm].readonly && '请选择计算类型'}
              >
                {Array.isArray(COMPUTE_TYPE) &&
                  COMPUTE_TYPE.map(item => (
                    <Option key={item.attrValueCode} value={item.attrValueCode}>
                      {item.attrValueName}
                    </Option>
                  ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={formConfig[isShowDetailForm].formItemSpan}>
          <Form.Item label="事件规则类型">
            {getFieldDecorator('eventType', {
              rules: [{ required: true, whitespace: true, message: '请选择事件规则类型' }],
            })(
              <Select
                disabled={formConfig[isShowDetailForm].readonly}
                size="small"
                placeholder={!formConfig[isShowDetailForm].readonly && '请选择事件规则类型'}
              >
                {Array.isArray(EVENT_TYPE) &&
                  EVENT_TYPE.map(item => (
                    <Option key={item.attrValueCode} value={item.attrValueCode}>
                      {item.attrValueName}
                    </Option>
                  ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
        {getFieldValue('eventType') != '1' && ( // 如果不是 “实时”，渲染下面控件
          <Fragment>
            <Col span={formConfig[isShowDetailForm].formItemSpan}>
              <Form.Item label="触发类型">
                {getFieldDecorator('triggerType', {
                  rules: [{ required: true, whitespace: true, message: '请选择触发类型' }],
                })(
                  <Select
                    disabled={formConfig[isShowDetailForm].readonly}
                    size="small"
                    placeholder={!formConfig[isShowDetailForm].readonly && '请选择触发类型'}
                  >
                    {Array.isArray(TRIGGER_TYPE) &&
                      TRIGGER_TYPE.map(item => (
                        <Option key={item.attrValueCode} value={item.attrValueCode}>
                          {item.attrValueName}
                        </Option>
                      ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={formConfig[isShowDetailForm].formItemSpan}>
              <Form.Item label="延时发送">
                <Row gutter={8}>
                  <Col span={17}>
                    {getFieldDecorator('periodCount', {
                      rules: [{ required: true, whitespace: true, message: '请输入延时发送' }],
                    })(
                      <Input
                        disabled={formConfig[isShowDetailForm].readonly}
                        size="small"
                        placeholder={!formConfig[isShowDetailForm].readonly && '请输入延时发送'}
                      />,
                    )}
                  </Col>
                  <Col span={7}>
                    {getFieldDecorator('periodType', {
                      rules: [{ required: true, whitespace: true, message: '请选择周期' }],
                    })(
                      <Select
                        disabled={formConfig[isShowDetailForm].readonly}
                        size="small"
                        placeholder={!formConfig[isShowDetailForm].readonly && '周期'}
                      >
                        {Array.isArray(PERIOD_TYPE) &&
                          PERIOD_TYPE.map(item => (
                            <Option key={item.attrValueCode} value={item.attrValueCode}>
                              {item.attrValueName}
                            </Option>
                          ))}
                      </Select>,
                    )}
                  </Col>
                </Row>
              </Form.Item>
            </Col>
          </Fragment>
        )}
        <Col span={24}>
          <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} label="描述">
            {getFieldDecorator('description', {
              rules: [{ max: 150, message: '内容请控制在150个字符以内' }],
            })(
              <Input.TextArea
                maxLength={151}
                disabled={formConfig[isShowDetailForm].readonly}
                autosize={{ minRows: 2, maxRows: 6 }}
                size="small"
                placeholder={!formConfig[isShowDetailForm].readonly && '请输入描述'}
              />,
            )}
          </Form.Item>
        </Col>
        {isShowDetailForm !== 'readonly' && (
          <Col span={24}>
            <div className={style.formButtonContainer}>
              <Button loading={submitLoading} size="small" type="primary" onClick={handleSumbit}>
                保存
              </Button>
              &nbsp;&nbsp;
              <Button
                size="small"
                onClick={() => {
                  showDetailForm('readonly');
                }}
              >
                取消
              </Button>
            </div>
          </Col>
        )}
      </Row>
    </Form>
  );
}

export default Form.create()(connect(mapStateToProps)(DetailForm));
