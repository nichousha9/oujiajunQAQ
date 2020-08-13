import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Input, Select, Radio, Button } from 'antd';
import moment from 'moment';
import { getAttrValueByCode } from '../../untils';
import style from '../index.less';

const { Option } = Select;

const mapStateToProps = ({ srcConfigDetail, eventSrcComm, common, loading }) => ({
  isShowInputAttrForm: srcConfigDetail.isShowInputAttrForm,
  attrSpecCodeList: common.attrSpecCodeList,
  eventItme: eventSrcComm.itemDetail,
  currentInputAttrItem: srcConfigDetail.currentInputAttrItem,
  validateLoading: loading.effects['srcConfigDetail/validateInputAttrName'],
  submitLoading: loading.effects['srcConfigDetail/saveInputAttr'],
});

function InputAttrDetail(props) {
  const {
    form,
    isShowInputAttrForm,
    attrSpecCodeList,
    eventItme,
    validateLoading,
    submitLoading,
    currentInputAttrItem,
    dispatch,
  } = props;
  const { getFieldDecorator, getFieldValue, getFieldsValue, setFieldsValue, validateFields } = form;
  const { DATA_TYPE } = attrSpecCodeList;

  // 根据 isShowInputAttrForm 渲染表单
  const formConfig = {
    null: {
      formItemSpan: 0, // 表单项栅格数,
      readonly: true,
    },
    add: {
      formItemSpan: 12, // 表单项栅格数,
      readonly: false,
    },
    edit: {
      formItemSpan: 8,
      readonly: false,
    },
    readonly: {
      formItemSpan: 8,
      readonly: true,
    },
  };

  // 处理输入属性详情表单显示形式
  function handleShowInputAtrrForm(type) {
    dispatch({
      type: 'srcConfigDetail/handleShowInputAtrrForm',
      payload: type,
    });
  }

  // 校验名称是否已经存在
  async function asyncValidateName(_, val, callback) {
    const result = await dispatch({
      type: 'srcConfigDetail/validateInputAttrName',
      payload: {
        inputId: eventItme.id,
        name: val,
      },
    });
    if (result && result.topCont && result.topCont.resultCode == 0) {
      if (result.svcCont && result.svcCont.data && result.svcCont.data.length == 0) {
        callback();
      } else if (result.svcCont && result.svcCont.data && result.svcCont.data.length != 0) {
        callback('名称已存在');
      }
    } else {
      callback('未知错误');
    }
  }

  // 强制刷新输入属性列表数据
  function forceGetInputAttrList() {
    dispatch({
      type: 'srcConfigDetail/forceGetInputAttrList',
    });
  }

  // 提交表单
  // @params { Object } params 额外的参数
  function submitForm(method, params) {
    // 表单验证
    validateFields(async (err, val) => {
      if (!err) {
        await dispatch({
          type: 'srcConfigDetail/saveInputAttr',
          payload: {
            createTime: moment().format('YYYY-MM-DD hh:mm:ss'),
            inputId: eventItme.id,
            ...val,
            ...params,
          },
          method,
        });
        forceGetInputAttrList();
      }
    });
  }

  // 获取数字字典
  useEffect(() => {
    if (!DATA_TYPE) {
      getAttrValueByCode(dispatch, 'event', 'DATA_TYPE');
    }
  }, []);

  // 设置表单值
  useEffect(() => {
    const {
      name,
      code,
      lineSequence,
      dataType,
      isNull,
      length,
      lineValue,
      isArray,
      isKey,
      description,
    } = currentInputAttrItem;
    setFieldsValue(
      {
        name,
        code,
        lineSequence,
        dataType,
        isNull: isNull || 'Y',
        lineValue: lineValue || 'Y',
        isArray: isArray || 'N',
        isKey: isKey || 'N',
        description,
      },
      () => {
        const allFields = Object.keys(getFieldsValue());
        if (allFields.includes('length')) {
          // 判断是否有 length（长度） 字段
          setFieldsValue({
            length,
          });
        }
      },
    );
  }, []);

  return (
    <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} className={style.inputAttrDetail}>
      <Row gutter={24}>
        <Col span={formConfig[isShowInputAttrForm].formItemSpan}>
          <Form.Item hasFeedback={validateLoading} label="名称">
            {getFieldDecorator('name', {
              validateTrigger: ['onBlur'],
              validateFirst: true,
              rules: [
                { required: true, message: '请输入名称' },
                {
                  validator:
                    getFieldValue('name') != currentInputAttrItem.name ? asyncValidateName : null,
                },
              ],
            })(
              <Input
                size="small"
                placeholder="请输入名称"
                disabled={formConfig[isShowInputAttrForm].readonly}
              />,
            )}
          </Form.Item>
        </Col>
        <Col span={formConfig[isShowInputAttrForm].formItemSpan}>
          <Form.Item label="代码">
            {getFieldDecorator('code', {
              rules: [{ required: true, message: '请输入代码' }],
            })(
              <Input
                size="small"
                placeholder="请输入代码"
                disabled={formConfig[isShowInputAttrForm].readonly}
              />,
            )}
          </Form.Item>
        </Col>
        <Col span={formConfig[isShowInputAttrForm].formItemSpan}>
          <Form.Item label="列序号">
            {getFieldDecorator('lineSequence', {
              rules: [{ required: true, message: '请输入列序号' }],
            })(
              <Input
                size="small"
                placeholder="请输入列序号"
                disabled={formConfig[isShowInputAttrForm].readonly}
              />,
            )}
          </Form.Item>
        </Col>
        <Col span={formConfig[isShowInputAttrForm].formItemSpan}>
          <Form.Item label="是否为空">
            {getFieldDecorator('isNull', {
              rules: [{ required: true, message: '请选择是否为空' }],
              initialValue: 'Y',
            })(
              <Radio.Group>
                <Radio value="Y" disabled={formConfig[isShowInputAttrForm].readonly}>
                  是
                </Radio>
                <Radio value="N" disabled={formConfig[isShowInputAttrForm].readonly}>
                  否
                </Radio>
              </Radio.Group>,
            )}
          </Form.Item>
        </Col>
        <Col span={formConfig[isShowInputAttrForm].formItemSpan}>
          <Form.Item label="列值">
            {getFieldDecorator('lineValue', {
              rules: [{ required: true, message: '请选择列值' }],
              initialValue: 'Y',
            })(
              <Radio.Group>
                <Radio value="Y" disabled={formConfig[isShowInputAttrForm].readonly}>
                  单一列值
                </Radio>
              </Radio.Group>,
            )}
          </Form.Item>
        </Col>
        <Col span={formConfig[isShowInputAttrForm].formItemSpan}>
          <Form.Item label="数组">
            {getFieldDecorator('isArray', {
              rules: [{ required: true, message: '请选择数组' }],
              initialValue: 'N',
            })(
              <Radio.Group>
                <Radio value="Y" disabled={formConfig[isShowInputAttrForm].readonly}>
                  是
                </Radio>
                <Radio value="N" disabled={formConfig[isShowInputAttrForm].readonly}>
                  否
                </Radio>
              </Radio.Group>,
            )}
          </Form.Item>
        </Col>
        <Col span={formConfig[isShowInputAttrForm].formItemSpan}>
          <Form.Item label="数据类型">
            {getFieldDecorator('dataType', {
              rules: [{ required: true, message: '请选择数据类型' }],
            })(
              <Select
                size="small"
                placeholder="请选择数据类型"
                disabled={formConfig[isShowInputAttrForm].readonly}
              >
                {Array.isArray(DATA_TYPE) &&
                  DATA_TYPE.map(item => (
                    <Option key={item.attrValueCode} value={item.attrValueCode}>
                      {item.attrValueName}
                    </Option>
                  ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
        {(getFieldValue('dataType') == '2' || getFieldValue('dataType') == '3') && (
          <Col span={formConfig[isShowInputAttrForm].formItemSpan}>
            <Form.Item label="长度">
              {getFieldDecorator('length', {
                rules: [{ required: true, message: '请输入长度' }],
              })(
                <Input
                  size="small"
                  placeholder="请输入长度"
                  disabled={formConfig[isShowInputAttrForm].readonly}
                />,
              )}
            </Form.Item>
          </Col>
        )}
        <Col span={formConfig[isShowInputAttrForm].formItemSpan}>
          <Form.Item label="关键">
            {getFieldDecorator('isKey', {
              rules: [{ required: true, message: '请选择关键' }],
              initialValue: 'N',
            })(
              <Radio.Group>
                <Radio value="Y" disabled={formConfig[isShowInputAttrForm].readonly}>
                  是
                </Radio>
                <Radio value="N" disabled={formConfig[isShowInputAttrForm].readonly}>
                  否
                </Radio>
              </Radio.Group>,
            )}
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item labelCol={{ span: 2 }} wrapperCol={{ span: 14 }} label="描述">
            {getFieldDecorator('description', {
              rules: [{ max: 150, message: '内容请控制在150个字符以内' }],
            })(
              <Input.TextArea
                maxLength={151}
                autosize={{ minRows: 2, maxRows: 6 }}
                placeholder="请输入描述"
                disabled={formConfig[isShowInputAttrForm].readonly}
              />,
            )}
          </Form.Item>
        </Col>
        {isShowInputAttrForm !== 'readonly' && (
          <Col span={24}>
            <div className={style.formButtonContainer}>
              <Button
                loading={submitLoading}
                size="small"
                type="primary"
                onClick={() => submitForm(isShowInputAttrForm, { id: currentInputAttrItem.id })}
              >
                保存
              </Button>
              &nbsp;&nbsp;
              <Button
                onClick={() => {
                  handleShowInputAtrrForm(null);
                }}
                size="small"
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

export default Form.create()(connect(mapStateToProps)(InputAttrDetail));
